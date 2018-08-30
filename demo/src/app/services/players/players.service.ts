import { Injectable } from '@angular/core';
import { PLAYERS } from '../../../assets/json/players';
import { Subject, Observable } from 'rxjs';

@Injectable({
 providedIn: 'root'
})

export class players_service {
	players: any = PLAYERS;
	adversary: any = {};
	is_someone_picked: boolean = false;
	private subject = new Subject<any>();
	yourself: any;

	constructor(){}

	get_all_players(){
		return this.players;
	}

	shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;
	
	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {
	
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	
	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }
	
	  return array;
	}
	get_all_players_minus_you( index ){
		return new Promise((resolve, reject)=>{
			this.adversary = this.players.slice(0);
			this.yourself = this.adversary[ index ];
			this.adversary.splice(index, 1);
			this.adversary = this.shuffle( this.adversary );
			resolve( this.adversary );
		})
	}

	pick_player( match ){
		if( this.is_someone_picked == false ){
			let rand = Math.random();
			console.log(rand);

			if (rand < 0.5){
				this.is_someone_picked = true;
				let timer = setTimeout(() => {  
						let match_details = {
							adversary_name:	match.name,
							adversary_avatar: match.avatar,
							yourself_avatar: this.yourself.avatar,
						}
						this.subject.next({ match: match_details });
						this.is_someone_picked = false;
						clearTimeout(timer);
					}, 3000);
				
			}
		}	
	}

	send_match(): Observable<any>{
		return this.subject.asObservable();
	}

	create_game( name ){}

	marching_player( match ){
		return new Promise((resolve, reject)=>{
			this.pick_player(match);
			resolve( true );
		})
	}

	accept_request( id ){
		// let url = this.base_url + '/accept-request/' + id;
		// return this.http.get(url, this.httpOptions);
	}

	confirm_account( id ){
		// let url = this.base_url + '/confirm-account/' + id;
		// return this.http.get(url, this.httpOptions);
	}

	get_adversary_detail_from_id( id ){
		// let url = this.base_url + 'get-adversary-details-from_id',
			// payload = { id: id };
			
		// return this.http.post(url, payload, this.httpOptions);
	}

	create_player( player_details ){
		return new Promise((resolve, reject)=>{
			this.players.push( player_details );
			resolve( true );
		})
	}

}
