var Promise = require('bluebird'),
	requestify = require('requestify');

function rocket_login() {
	return new Promise((resolve, reject)=>{
		var payload = {
			'username': 'alexandre.nicol',
			'password': 'rvb92w8yYuwTqSyX'
		};

		requestify.post('https://chat.tools.flnltd.com/api/v1/login', {'username': 'alexandre.nicol', 'password': 'rvb92w8yYuwTqSyX'} )
    		.then(function(response) {
    			resolve(response.getBody().data);
    		});

	});

}

// function get_room_id( rocket_user ) {
// 	return new Promise((resolve, reject)=>{
// 		let query = 'roomName=alexandre.nicol';
// 		query = encodeURI(query);
// 		console.log(query);
// 		requestify.request('https://chat.tools.flnltd.com//api/v1/channels.info?' + query , {
//     			method: 'GET',
// 	    		headers: {
// 	    			'X-Auth-Token': rocket_user.authToken,
//       				'X-User-Id': rocket_user.userId
// 	    		}
//     		} )
//     		.then(function(response) {
//     			console.log(response.getBody())
//     			resolve(response.getBody());
//     		})
//     		.catch(error => {
//     			console.log(error);
//     		});
// 	});
// }

function send_match( rocket_user, link, owner_details, match_details ){
    return new Promise((resolve, reject)=>{
    	let payload = {
			'channel': match_details.rocketName,
			'text': owner_details.name + ' want to challenge you at :ping_pong:, click the ' + link + ' to accept',
			// 'alias': message.getFrom(),
			// 'emoji': ':envelope:',
			// 'attachments': attachments
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
			'text': match_details.name + ' accepted your challenge at :ping_pong:',
			// 'alias': message.getFrom(),
			// 'emoji': ':envelope:',
			// 'attachments': attachments
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
}