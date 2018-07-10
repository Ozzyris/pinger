var mongoose = require("./mongoose"),
    moment = require('moment'),
    Promise = require('bluebird');

var players = new mongoose.Schema({
    name: {type: String},
    email: {type: String},
    rocketName: {type: String},
    creation_date: {type: Date, default: moment()},
    avatar: {type: String},
    score: {type: Number},
    status: {type: Boolean, default: false},
    swipe: {
        swipe_number: {type: Number, default: 0 },
        last_swipe: {type: Date}
    }
}, {collection: 'players'});

players.statics.test_rocket_name = function( rocketName ){
    return new Promise((resolve, reject) => {
        this.find({'rocketName': rocketName}, {}).exec()
            .then(players => {
                if( players.length == 0 ){
                    resolve( true );
                }else{
                    reject( {'message': 'This rocket-chat name is already in use'} );
                }
            })
    })
};

players.statics.get_all_players = function(){
    return new Promise((resolve, reject) => {
        this.find({status : true}, {}).exec()
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

players.statics.update_status_from_id = function( id ){
    return new Promise((resolve, reject) => {
        players.update({ '_id' : id }, {
                'status': true
            }).exec()
            .then(request =>{
                resolve(true);
            })
    })
};

players.statics.reset_swiped_to_one = function( id ){
    return new Promise((resolve, reject) => {
        players.update({ '_id' : id }, {
                'swipe.swipe_number': 1
            }).exec()
            .then(request =>{
                resolve(true);
            })
    })
};

players.statics.add_one_swiped = function( id ){
    return new Promise((resolve, reject) => {
        this.findOneAndUpdate({ '_id' : id}, { 
                $inc: { 'swipe.swipe_number': 1 },
                'swipe.last_swipe': moment().add(2, 'hours')
            })
            .then(request =>{
                resolve(true);
            })
    })
};

var players = mongoose.DB.model('players', players);

module.exports.players = players