// import {Component} from '@angular/core';
import {Http} from "@angular/http";
import {Injectable} from '@angular/core';

@Injectable()
export class DataService {
  static get parameters() {
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
      this.http.get('./prdata.json').map(res => res.json()).subscribe(
        data => {
          this.stories = data;
          resolve(this.stories);
        },
          err => {
          console.log("Oops!");
        }
      );
    });

  }

}
