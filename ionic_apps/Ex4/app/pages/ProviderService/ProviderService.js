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
  }
  getData(){
    return new Promise(resolve => {
      this.http.get('./prdata.json').map(res => res.json())
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
