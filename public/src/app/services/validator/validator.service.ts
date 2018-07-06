import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class validator_service {
  constructor(){}
  password_test( password ){
		let greatRegex = new RegExp( "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})" ),
		goodRegex = new RegExp( "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})" ),
		averageRegex = new RegExp( "(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})" ),
		poorRegex = new RegExp( "(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})" );

		if (greatRegex.test( password )) {
			return "Great";
		} else if (goodRegex.test( password )) {
			return "Good";
		} else if (averageRegex.test( password )) {
			return "Average";
		} else if (poorRegex.test( password )) {
			return "Poor";
		} else {
			return "Weak";
		}
	}

	email_test( email ){
		var emailRegex = new RegExp('^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$', 'i');
		if( emailRegex.test(email) ) {
			return true;
		} else {
			return false;
		}
	}
}
