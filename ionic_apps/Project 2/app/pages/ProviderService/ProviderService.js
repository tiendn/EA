import {Http} from "@angular/http";
import { Injectable } from '@angular/core';

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
  
  getIndicesCompareData(){
    return new Promise(resolve => {
      this.http.get('./indices-compare.json')
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
  getIndicesPerformanceData(){
    return new Promise(resolve => {
      this.http.get('./indices-performance.json')
      .map(res => res.json())
      .subscribe(
        data => {
          this.stories = data;
          resolve(this.stories);
        },
        err => {
          alert("Oops! St bad happend.");
        }
      );
    });
  }
  getWatchListPerformanceData(){
    return new Promise(resolve => {
      this.http.get('./watchlist-performance.json')
      .map(res => res.json())
      .subscribe(
        data => {
          this.stories = data;
          resolve(this.stories);
        },
        err => {
          alert("Oops! St bad happend.");
        }
      );
    });
  }
  getWatchListCompareData(){
    return new Promise(resolve => {
      this.http.get('./watchlist-compare.json')
      .map(res => res.json())
      .subscribe(
        data => {
          this.stories = data; 
          resolve(this.stories);
        },
        err => {
          alert("Oops! St bad happend.");
        }
      );
    });
  }
}
