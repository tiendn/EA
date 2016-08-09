import {Component} from '@angular/core';
import {Http} from "@angular/http";
@Component({

})
export class GetData {
  static get parameters() {
      return [
        [Http]
      ];
  }
  constructor(http){
    this.http = Http;
    var stories = [];
    this.http.get('./prdata.json').map(res => res.json()).subscribe(
      data => {
        this.stories = data;
        console.log(this.stories);
      },
        err => {
        console.log("Oops!");
      }
    );
  }
  // retrieveData(){
  //   this.http.get('./prdata.json').subscribe(data => {
  //     this.data = data;
  //   });
  // }
  getData(){
    console.log(this.stories);
    return this.stories;
  }

}
