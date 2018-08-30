import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

//services
import { players_service } from '../../services/players/players.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	providers: [ players_service ]
})
export class LoginComponent implements OnInit {
	players: any;
	server_url = environment.api_url;

	constructor( private players_service: players_service, private router:Router ){}
	ngOnInit(){
		console.log(this.server_url);
		this.get_all_users();
	}

	get_all_users(){
		this.players = this.players_service.get_all_players();
	}

	create_game( index ){
		localStorage.setItem("owner_index", index);
		this.router.navigate(['discovery']);
	}

}
