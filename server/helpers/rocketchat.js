var Promise = require('bluebird'),
	requestify = require('requestify')
    config = require('../config');

function rocket_login() {
	return new Promise((resolve, reject)=>{
		requestify.post('https://chat.tools.flnltd.com/api/v1/login', {'username': config.rocket_username, 'password': config.rocket_password} )
    		.then(function(response) {
    			resolve(response.getBody().data);
    		});
	});

}

function send_match( rocket_user, link, owner_details, match_details ){
    return new Promise((resolve, reject)=>{
    	let payload = {
			// 'channel': '@alexandre.nicol',
			'channel': match_details.rocketName,
			'text': owner_details.name + ' want to challenge you at :ping_pong:, click the [here](' + link + ') to accept',
			'alias': 'Pinger',
			'emoji': ':table_tennis:'
		}

    	requestify.request('https://chat.tools.flnltd.com/api/v1/chat.postMessage', {
    			method: 'POST',
	    		body: payload,
	    		headers: {
	    			'X-Auth-Token': rocket_user.authToken,
      				'X-User-Id': rocket_user.userId
	    		}
    		} )
    		.then(function(response) {
    			resolve(response.getBody());
    		});
    })
}

function send_result_match( rocket_user, owner_details, match_details ){
    return new Promise((resolve, reject)=>{
    	let payload = {
			'channel': owner_details.rocketName,
			'text': match_details.name + ' accepted your challenge at :ping_pong:, go get it!',
			'alias': 'Pinger',
			'emoji': ':table_tennis:'
		}

    	requestify.request('https://chat.tools.flnltd.com/api/v1/chat.postMessage', {
    			method: 'POST',
	    		body: payload,
	    		headers: {
	    			'X-Auth-Token': rocket_user.authToken,
      				'X-User-Id': rocket_user.userId
	    		}
    		} )
    		.then(function(response) {
    			resolve(response.getBody());
    		});
    })
}

function send_rocket_message( rocket_user, reveiver, message ){
    return new Promise((resolve, reject)=>{
    	let payload = {
			'channel': reveiver,
			'text': message,
			'alias': 'Pinger',
			'emoji': ':table_tennis:',
		}

    	requestify.request('https://chat.tools.flnltd.com/api/v1/chat.postMessage', {
    			method: 'POST',
	    		body: payload,
	    		headers: {
	    			'X-Auth-Token': rocket_user.authToken,
      				'X-User-Id': rocket_user.userId
	    		}
    		} )
    		.then(function(response) {
    			resolve(response.getBody());
    		});
    })
}



module.exports={
    'rocket_login': rocket_login,
    'send_match': send_match,
    'send_result_match': send_result_match,
    'send_rocket_message': send_rocket_message,
}