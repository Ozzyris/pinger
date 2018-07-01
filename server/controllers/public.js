const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser'),
	  players = require('../models/players').players,
	  moment = require('moment'),
	  requests = require('../models/requests').requests,
	  games = require('../models/games').games;

// HELPERS
const rocketchat = require('../helpers/rocketchat');

// MIDDLEWARE
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

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

	router.post('/create-player', function (req, res) {
		let player_detail = {
			name: req.body.name,
			email: req.body.email,
			rocketName: req.body.rocketName,
			avatar: req.protocol + '://' + req.get('host') + '/uploads/' + req.body.avatar,
		}

		return new players(player_detail).save()
			.then( article_id => {
				res.status(200).json( {message: 'Player created'} );
			})
			.catch( error => {
				console.log(error);
				res.status(401).json(error);
			});
	});

	router.post('/marching-player', function (req, res) {
		let owner_details = {
				id: req.body.owner_id,
			},
			match_details = {
				id: req.body.match_id,
			},
			game_id = req.body.game_id,
			request;

			console.log(game_id);

		if(game_id == undefined){
			new games( {'players.player1': owner_details.id} ).save()
				.then( game_id => {
					game_id = game_id;
				})
				.catch( error => {
					console.log(error);
					res.status(401).json(error);
				});
		}

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
				console.log('alex', request_id);
				return rocketchat.rocket_login();
			})
			.then( rocket_login => {
				console.log( 'alexou', request._id );
				let link = req.protocol + '://' + req.get('host') + '/public/accept-request/' + request._id;
				return rocketchat.send_match( rocket_login, link, owner_details, match_details );
			})
			.then( is_rocket_sent => {
				res.status(200).json( {message: 'Request send'} );
			})		
	})

	router.get('/accept-request/:id', function (req, res) {
		console.log(req.params.id);
		let request_details = {},
			owner_details = {},
			match_details = {};

		requests.get_details_from_id( req.params.id )
			.then( request_detail => {
				request_details = request_detail;
				console.log( request_detail );
				console.log( request_detail.game_id, request_detail.match_id );

				return games.add_player( request_detail.game_id, request_detail.match_id );
			})
			.then( is_game_updated => {
				console.log('is_game_updated',is_game_updated);
				return players.get_details_from_id( request_details.ower_id );
			})
			.then( owner_detail => {
				console.log('owner_detail', owner_detail);
				owner_details = owner_detail;
				return players.get_details_from_id( request_details.match_id )
			})
			.then( match_detail => {
				console.log('match_detail', match_detail);
				match_details = match_detail;
				return rocketchat.rocket_login();
			})
			.then( rocket_login => {
				console.log('rocket_login', rocket_login);
				return rocketchat.send_result_match( rocket_login, owner_details, match_details );
			})
			.then( is_message_sent => {
				res.status(200).json( {message: 'Request accepted'} );
			})
			.catch( error => {
				console.log(error);
				res.status(401).json( error );
			})

		// Get request details
		// Update game details
		// Send message to Owner

	});

module.exports = {
	"public" : router
};