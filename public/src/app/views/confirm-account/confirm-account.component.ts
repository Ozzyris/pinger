import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//services
import { players_service } from '../../services/players/players.service';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss'],
  providers: [ players_service ]
})

export class ConfirmAccountComponent implements OnInit {

	constructor( private route: ActivatedRoute, private players_service: players_service ){}
	ngOnInit(){
		this.route.params.subscribe( params => {
			console.log(params.id);
      		this.confirm_account( params.id );
    	})
	}

	confirm_account( id ){
		console.log( id );
		this.players_service.confirm_account( id )
			.subscribe( is_account_confirm => {
				console.log( is_account_confirm );
			})
	}

}
