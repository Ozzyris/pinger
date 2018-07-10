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

function send_rocket_message( rocket_user, reveiver, message ){
    return new Promise((resolve, reject)=>{
    	let payload = {
            'channel': reveiver,
			// 'channel': '@alexandre.nicol',
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
    'send_rocket_message': send_rocket_message,
}