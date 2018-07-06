var mongoose = require("./mongoose"),
    moment = require('moment'),
    Promise = require('bluebird');

var requests = new mongoose.Schema({
    game_id: {type: String},
    ower_id: {type: String},
    match_id: {type: String},
    is_expired: {type: Boolean, default: false},
    expiration_date: {type: Date, default: moment().add(5, 'minutes')},

}, {collection: 'requests'});


requests.statics.get_details_from_id = function( id ){
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

requests.statics.get_players_id_from_request = function( request_id ){
    return new Promise((resolve, reject) => {
         this.findOne({ _id : request_id }).exec()
            .then(request_details => {
                let players = [ request_details.ower_id, request_details.match_id ];
                resolve( players );
            })
    })
}

requests.statics.update_status_of_the_request = function( request_id ){
    return new Promise((resolve, reject) => {
        requests.update({ '_id' : request_id }, {
            'is_expired': true
        }).exec()
        .then(request =>{
            resolve(true);
        })
    })
}

var requests = mongoose.DB.model('requests', requests);

module.exports.requests = requests