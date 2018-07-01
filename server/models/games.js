var mongoose = require("./mongoose"),
    moment = require('moment'),
    Promise = require('bluebird');

var games = new mongoose.Schema({
	creation_date: {type: Date, default: moment()},
    players: {
    	player1: {type: String},
    	player2: {type: String},
    	player3: {type: String},
    	player4: {type: String}
    }
}, {collection: 'games'});

games.statics.add_player = function( game_id, match_id ){
    return new Promise((resolve, reject) => {
        games.update({ '_id' : game_id }, {
            'players.player2': match_id
        }).exec()
        .then(player2 =>{
            resolve(true);
        })
    })
};

var games = mongoose.DB.model('games', games);

module.exports.games = games