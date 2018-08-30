import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subscription } from 'rxjs';

//services
import { players_service } from '../../services/players/players.service';

@Component({
	selector: 'app-discovery',
	templateUrl: './discovery.component.html',
	styleUrls: ['./discovery.component.scss'],
	providers: [ players_service ]
})

export class DiscoveryComponent implements OnInit {
	players: any = [];
	active_card: any = 0;
	total_card: any;
	moveOutWidth: any = document.body.clientWidth * 1.5;
	SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
	is_match_found: Boolean = false;
	server_url = environment.api_url;
	oppponent_name: string;
	oppponent_avatar: string;
	owner_avatar: string;
	is_no_more_swipe: boolean = false;
	display_countdown: any;
	subscription: Subscription;

	constructor( private players_service: players_service ){
		this.subscription = this.players_service.send_match()
			.subscribe( match => {
				this.is_match_found = true;
				this.oppponent_name = match.match.adversary_name;
				this.oppponent_avatar = match.match.adversary_avatar;
				this.owner_avatar = match.match.yourself_avatar;
			});
	}
	ngOnInit(){
		this.build_players_card();
		// this.get_match_api_socket().subscribe();
	}

	get_owner_index_from_storage(): Promise<any>{
    	return new Promise((resolve, reject)=>{
      		resolve( localStorage.getItem('owner_index') );
    	})
  	}
	build_players_card(){
		this.get_owner_index_from_storage()
			.then( owner_index => {
				this.players_service.get_all_players_minus_you( owner_index )
					.then( all_players => {
						this.players = all_players;
						this.total_card = this.players.length - 1;
						for (var i = 0; i <= (this.players.length - 1); i++) {
							this.players[i].style = 'scale(' + (50-i)/50 + ') translateY('+4*i+ 'px)'
						}
					})
			})
	}

	// get_match_api_socket(){
	// 	let observable = new Observable(observer => {
	// 		this.socket = io.connect( environment.api_url );
	// 		this.socket.on('match_api', (data) => {
	// 			observer.next(data);

	// 			if( data == 'Socket.io Connected' ){
	// 				console.log( data );
	// 			}else if( data != null ){
	// 				console.log( data );
	// 				this.get_match_details( data );
	// 			}
	// 		});
	// 		return () => {
	// 			this.socket.disconnect();
	// 		}; 
	// 	})
	// 	return observable;
	// }

	get_match_details( id ){
		// this.players_service.get_adversary_detail_from_id( id )
		// 	.subscribe( adversery_details => {
		// 		console.log( adversery_details )
		// 		this.is_match_found = true;

		// 		this.oppponent_name = adversery_details.match_details.name;
		// 		this.oppponent_avatar = adversery_details.match_details.avatar;
		// 		this.owner_avatar = adversery_details.owner_details.avatar;
		// 	})
	}

	swipe(currentIndex: number, action = this.SWIPE_ACTION.RIGHT) {
		if (action === this.SWIPE_ACTION.RIGHT){
			console.log('do not push notification');
			this.update_styles();
		}
		if (action === this.SWIPE_ACTION.LEFT) {
			this.send_notification( this.players[ this.active_card ] );
			this.update_styles();
		}
	}

	pan_start( event, index ){
		this.players[index].class = 'moving';
	}
	pan( event, index ){
		if (event.deltaX === 0) return;
    	if (event.center.x === 0 && event.center.y === 0) return;
    	var xMulti = event.deltaX * 0.03;
    	var yMulti = event.deltaY / 80;
    	var rotate = xMulti * yMulti;
    	this.players[index].style = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';

	}

	pan_end(event, index){
		this.players[index].class = '';

		let keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;
		let moveOutWidth = document.body.clientWidth;

		if (keep) {
      		this.players[ index ].style = '';
    	} else {
    		let endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
      		let toX = event.deltaX > 0 ? endX : -endX;
      		let endY = Math.abs(event.velocityY) * moveOutWidth;
      		let toY = event.deltaY > 0 ? endY : -endY;
      		let xMulti = event.deltaX * 0.03;
      		let yMulti = event.deltaY / 80;
      		let rotate = xMulti * yMulti;
      		this.players[ index ].style = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';

    	}
	}

	click_left(){
		if( this.active_card <= this.total_card ){
			this.players[ this.active_card ].style = 'translate(-' + this.moveOutWidth + 'px, -100px) rotate(-30deg)';
			this.send_notification( this.players[ this.active_card ] );
			this.update_styles();
			
		}
		
	}
	click_right(){
		if( this.active_card <= this.total_card ){
			this.players[ this.active_card ].style = 'translate(' + this.moveOutWidth + 'px, -100px) rotate(-30deg)';
			this.update_styles();
		}
	}

	update_styles(){
		this.active_card ++;
		for (var i = this.active_card; i <= (this.players.length - 1); i++) {
			this.players[i].style = 'scale(' + (50-i)/50 + ') translateY('+4*i+ 'px)'
		}
	}
	get_game_id_from_storage(): Promise<any>{
    	return new Promise((resolve, reject)=>{
      		resolve( localStorage.getItem('game_id') );
    	})
  	}


	send_notification( match ){
		this.players_service.marching_player( match )
			.then( is_match_send => {
			})
	}

}
