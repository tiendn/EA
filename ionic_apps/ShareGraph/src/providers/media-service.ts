import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalVars } from '../common/global-vars';
import 'rxjs/add/operator/map';

/*
  Generated class for the MediaService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MediaService {
  data1:any[];
  data2:any[];
  httpRequestHeader: any;
  servicesUrl: any;

  constructor(public http: Http, public globalVars: GlobalVars) {
    this.httpRequestHeader = globalVars.httpRequestHeader;
    this.servicesUrl = globalVars.servicesUrl + "media/";
  }


  loadCategory(companyCode:string, languageCode:string){
  	return new Promise(resolve => {
  	  this.http.get(this.servicesUrl + 'cat/'+ companyCode + '/' + languageCode , this.httpRequestHeader)
  	    .map(res => res.json())
  	    .subscribe(data1 => {  	      
						this.data1 = data1;
						resolve(this.data1);
					},
					err => {
						resolve(this.data1);
					}
				);
  	});
  }

  loadItemByCategory(companyCode:string, languageCode:string, categoryCode:string){
  	return new Promise(resolve => {
  	  this.http.get(this.servicesUrl + companyCode + '/' +categoryCode+ '/' + languageCode , this.httpRequestHeader)
  	    .map(res => res.json())
  	    .subscribe(data2 => {  	      
						this.data2 = data2;
						resolve(this.data2);
					},
					err => {
						resolve(this.data2);
					}
				);
  	});
  }
}
