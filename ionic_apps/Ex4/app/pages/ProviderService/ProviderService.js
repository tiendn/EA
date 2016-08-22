import {Http} from "@angular/http";
import {Injectable} from '@angular/core';

@Injectable()
export class MyProvider{
  static get parameters(){
    return [
      [Http]
    ];
  }
  constructor(http){
    var stories = [];
    this.http = http;
    this.linkURL = 'http://10.10.15.8/myirappapi2/api/v1/historicalprice/watchlist/52434/20150303/DKK';
    this.httpRequestHeader = {
            headers: {
                'Authorization': "Basic bm9ybWFsdXNlcjpwNmVqYVByRQ=="
            }
        };
  }
  getData(){
    return new Promise(resolve => {
      this.http.get(this.linkURL,this.httpRequestHeader).map(res => res.json())
      // this.http.get('./data.json').map(res => res.json())
      .subscribe(
        data => {
          this.stories = data;
          //  return value after then call
          resolve(this.stories);
        },
        err => {
          alert("Oops! St bad happened.");
        }
      );
    });
  }
}
