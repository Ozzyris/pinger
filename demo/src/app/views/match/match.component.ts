import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

//services
import { players_service } from '../../services/players/players.service';

@Component({
	selector: 'app-match',
	templateUrl: './match.component.html',
	styleUrls: ['./match.component.scss'],
	providers: [ players_service ]
})
export class MatchComponent implements OnInit {
	oppponent_name: string = 'Alexandro'
	oppponent_avatar: string = ''
	owner_avatar: string = ''
	server_url = environment.api_url;


	constructor( private route: ActivatedRoute, private players_service: players_service ){}
	ngOnInit(){
		this.route.params.subscribe( params => {
			console.log(params.id);
      		this.get_adversary_detail_from_id( params.id );
      		this.accept_request( params.id );
    	})
	}

	get_adversary_detail_from_id( id ){
		// this.players_service.get_adversary_detail_from_id( id )
		// 	.subscribe( adversery_details => {
		// 		console.log( adversery_details )

		// 		this.oppponent_name = adversery_details.owner_details.name;
		// 		this.oppponent_avatar = adversery_details.owner_details.avatar;
		// 		this.owner_avatar = adversery_details.match_details.avatar;
		// 	})
	}

	accept_request( id ){
		// this.players_service.accept_request( id )
		// 	.subscribe( is_request_accepted => {
		// 		console.log( is_request_accepted );
		// 	})
	}

}
