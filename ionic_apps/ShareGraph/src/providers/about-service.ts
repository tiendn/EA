import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AboutService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AboutService {
  data:any;

  constructor(public http: Http) {
    
  }

  loadAboutData(languageCode){
  	return new Promise(resolve => {
  	  this.http.get('assets/company/about/'+languageCode+'.html')
  	    .subscribe(data => {  	      
  	      this.data = data;
  	      resolve(this.data);
  	    });
  	});
  }
}
