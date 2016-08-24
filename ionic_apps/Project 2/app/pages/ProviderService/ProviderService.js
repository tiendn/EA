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
  };
  getWatchListData(){
    return new Promise(resolve => {
      this.http.get('../watchlist.json')
      .map(res => res.json())
      .subscribe(
        data => {
          this.stories = data;
          resolve(this.stories);
        },
        err => {
          alert("Oops! St bad happened.");
        }
      );
    });
  }
  getIndicesData(){
    return new Promise(resolve => {
      this.http.get('../indices.json')
      .map(res => res.json())
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
