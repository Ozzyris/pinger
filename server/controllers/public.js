const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser'),
	  players = require('../models/players').players,
	  moment = require('moment'),
	  requests = require('../models/requests').requests,
	  games = require('../models/games').games;

// HELPERS
const rocketchat = require('../helpers/rocketchat'),
	  littlebirds = require('../helpers/littlebirds');

// MIDDLEWARE
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

	router.post('/send-rocket-message', function (req, res) {
		rocketchat.rocket_login()
			.then( rocket_login => {
				console.log( rocket_login );
				return rocketchat.send_rocket_message( rocket_login, req.body.receiver, req.body.message );
			})
			.then( is_message_sent => {
				res.status(200).json( {message: 'Request send'} );
			})
	});

	router.get('/get-all-players', function (req, res) {
		players.get_all_players()
			.then( all_players => {
				res.status(200).json( all_players );
			})
			.catch( error => {
				console.log( error );
				res.status(401).json( error );
			})
	});

	function shuffle(a) {
	    for (let i = a.length - 1; i > 0; i--) {
	        const j = Math.floor(Math.random() * (i + 1));
	        [a[i], a[j]] = [a[j], a[i]];
	    }
	    return a;
	}

	router.get('/get-all-players-minus-you/:id', function (req, res) {
		console.log(req.params.id);

		players.get_all_players()
			.then( all_players => {
				let owner_index = '';

				for (var i = 0; i <= (all_players.length - 1); i++) {
					if( all_players[i]._id == req.params.id){
						owner_index = i
					}
				}

				console.log( all_players[ owner_index ].name );
				all_players.splice(owner_index, 1);

				shuffle(all_players)


				res.status(200).json( all_players );
			})
			.catch( error => {
				console.log( error );
				res.status(401).json( error );
			})
	});

	router.post('/create-player', function (req, res) {
		console.log(req.body);
		let player_detail = {
			name: req.body.name,
			email: req.body.email,
			rocketName: req.body.rocket_name,
			avatar: 'uploads/' + req.body.avatar,
		}

		new players(player_detail).save()
			.then( article_id => {
				return rocketchat.rocket_login()
			})
			.then( rocket_login => {
				let message = 'A new player was created: ' + player_detail.rocketName;
				return rocketchat.send_rocket_message( rocket_login, '@alexandre.nicol', message );
			})
			.then( is_message_sent => {
				res.status(200).json( {message: 'Player created'} );
			})
			.catch( error => {
				console.log(error);
				res.status(401).json(error);
			});
	});

	router.post('/create-game', function (req, res) {
		new games( {'players.player1': req.body.id} ).save()
				.then( game => {
					res.status(200).json( game );
				})
				.catch( error => {
					console.log(error);
					res.status(401).json(error);
				});
	})

	router.post('/get-adversary-details-from_id', function (req, res) {
		let owner_details = {},
			match_details = {};

		requests.get_players_id_from_request( req.body.id )
			.then( players_id => {
				owner_details._id = players_id[0];
				match_details._id = players_id[1];
				return players.get_details_from_id( owner_details._id );
			})
			.then( owner_detail => {
				owner_details = owner_detail;
				return players.get_details_from_id( match_details._id )
			})
			.then( match_detail => {
				match_details = match_detail;
				res.status(200).json( {owner_details: owner_details, match_details: match_details} );
			})
			.catch( error => {
				console.log(error);
			})
	})

	router.post('/marching-player', function (req, res) {
		let owner_details = {
				id: req.body.owner_id,
			},
			match_details = {
				id: req.body.match_id,
			},
			game_id = req.body.game_id,
			request;

		players.get_details_from_id( owner_details.id )
			.then( owner_detail => {
				owner_details = owner_detail;
				return players.get_details_from_id( match_details.id )
			})
			.then( match_detail => {
				match_details = match_detail;
				let payload = {
					game_id: game_id,
					ower_id: owner_details._id,
					match_id: match_details._id
				}
				return new requests( payload ).save();
			})
			.then( request_id => {
				request = request_id;
				return rocketchat.rocket_login();
			})
			.then( rocket_login => {
				let link = 'http://10.117.151.71:4200/match/' + request._id;
				return rocketchat.send_match( rocket_login, link, owner_details, match_details );
			})
			.then( is_rocket_sent => {
				res.status(200).json( {message: 'Request send'} );
			})
			.catch( error => {
				console.log(error);
			})
	})

	router.get('/accept-request/:id', function (req, res) {
		let request_details = {},
			owner_details = {},
			match_details = {};

		requests.get_details_from_id( req.params.id )
			.then( request_detail => {
				request_details = request_detail;
				if( request_details.is_expired == true ){
					throw {'message': 'Already accecpted Invitation'}
				}else{
					return games.add_player( request_detail.game_id, request_detail.match_id );					
				}
			})
			.then( is_game_updated => {
				return players.get_details_from_id( request_details.ower_id );
			})
			.then( owner_detail => {
				owner_details = owner_detail;
				return players.get_details_from_id( request_details.match_id )
			})
			.then( match_detail => {
				match_details = match_detail;
				return rocketchat.rocket_login();
			})
			.then( rocket_login => {
				return rocketchat.send_result_match( rocket_login, owner_details, match_details );
			})
			.then( is_message_sent => {
				return requests.update_status_of_the_request( req.params.id );
			})
			.then( is_status_updated => {
				res.status(200).json( {message: 'Request accepted'} );
				littlebirds.discovery_emmiter( request_details._id );
			})
			.catch( error => {
				console.log(error);
				res.status(401).json( error );
			})
	});

module.exports = {
	"public" : router
};