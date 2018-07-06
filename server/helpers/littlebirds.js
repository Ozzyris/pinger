// VARIABLE
var client;

function discovery_connector( io ){
	io.on('connection', function(get_client) {  
		console.log('Client connected...');
		client = get_client;
		discovery_emmiter( 'Socket.io Connected' );
	});
}

function discovery_emmiter( value ){
	if(client){
		client.emit('match_api', value);
	}
}

module.exports={
    discovery_connector: discovery_connector,
    discovery_emmiter: discovery_emmiter
};