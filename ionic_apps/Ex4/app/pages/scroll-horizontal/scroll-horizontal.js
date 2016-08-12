import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the ScrollHorizontalPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/scroll-horizontal/scroll-horizontal.html',
})
export class ScrollHorizontalPage {
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    // this.listID = [1,2,3,4,5];
    this.nav = nav;
  }
  active(id){
    console.log(id);
    var input = document.getElementById(id);
    console.log(input);
  }
}
