import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

interface login_interface {
  _id: string;
}

@Injectable({
 providedIn: 'root'
})

export class players_service {
	base_url = environment.api_url + 'public/';
	httpOptions: any;

	constructor( private http: HttpClient ){
        this.httpOptions = {
        	headers: new HttpHeaders({
        		'Content-Type':  'application/json'
			})
        };
	}

	get_all_players(): Observable<any>{
		let url = this.base_url + 'get-all-players';
		return this.http.get(url, this.httpOptions);
	}

	get_all_players_minus_you( id ): Observable<any>{
		let url = this.base_url + 'get-all-players-minus-you/' + id;
		return this.http.get(url, this.httpOptions);
	}

	create_game( payload ): Observable<any>{
		let url = this.base_url + 'create-game';
		return this.http.post(url, payload, this.httpOptions);
	}

	marching_player( payload ): Observable<any>{
		let url = this.base_url + 'marching-player';
		return this.http.post(url, payload, this.httpOptions);
	}

	accept_request( id ): Observable<any>{
		let url = this.base_url + '/accept-request/' + id;
		return this.http.get(url, this.httpOptions);
	}

	get_adversary_detail_from_id( id ): Observable<any>{
		let url = this.base_url + 'get-adversary-details-from_id',
			payload = { id: id };
			
		return this.http.post(url, payload, this.httpOptions);
	}

	signup_with_credentials( credential ): Observable<any>{
		let url = this.base_url + 'create-player';
		return this.http.post(url, credential, this.httpOptions);
	}

}
