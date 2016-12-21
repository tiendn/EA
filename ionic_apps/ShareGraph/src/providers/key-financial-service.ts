import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalVars } from '../common/global-vars';
import 'rxjs/add/operator/map';

/*
  Generated class for the KeyFinancialService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class KeyFinancialService {
	servicesUrl: any;
	httpRequestHeader: any;
	data: any;

	constructor(public http: Http, public globalVars: GlobalVars) {
		this.servicesUrl = globalVars.servicesUrl + "keyfinancials/";
		this.httpRequestHeader = globalVars.httpRequestHeader;
	}

    load(companyCode, language, isAnnual) {   

	    // don't have the data yet
	    return new Promise(resolve => {
	      // We're using Angular Http provider to request the data,
	      // then on the response it'll map the JSON data to a parsed JS object.
	      // Next we process the data and resolve the promise with the new data.
	      var time;
	      if(isAnnual === true) time = '0';
	      else time = '1';
	      this.http.get(this.servicesUrl+companyCode+'/'+language+'/'+time, this.httpRequestHeader)
	        .map(res => res.json())
	        .subscribe(data => {
	          // we've got back the raw data, now generate the core schedule data
	          // and save the data for later reference
	          this.data = data;
	          resolve(this.data);
	        });
	    });
	}

}
