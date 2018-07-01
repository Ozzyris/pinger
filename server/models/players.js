var mongoose = require("./mongoose"),
    moment = require('moment'),
    Promise = require('bluebird');

var players = new mongoose.Schema({
    name: {type: String},
    email: {type: String},
    rocketName: {type: String},
    creation_date: {type: Date, default: moment()},
    avatar: {type: String},
    score: {type: Number}
}, {collection: 'players'});

players.statics.get_all_players = function(){
    return new Promise((resolve, reject) => {
        this.find({}, {}).exec()
            .then(players => {
                if( players ){
                    resolve( players );
                }else{
                    reject({ message: 'An error happend', code: 'error_happend'});
                }
            })
    })
};

players.statics.get_details_from_id = function( id ){
    return new Promise((resolve, reject) => {
        this.findOne({ _id : id }).exec()
            .then(players => {
                if( players ){
                    resolve( players );
                }else{
                    reject({ message: 'An error happend', code: 'error_happend'});
                }
            })
    })
};

var players = mongoose.DB.model('players', players);

module.exports.players = players