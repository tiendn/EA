import { Component } from '@angular/core';

/*
  Generated class for the ScrollHorizontalPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/scroll-horizontal/scroll-horizontal.html',
})
export class ScrollHorizontalPage {
  constructor() {
    this.currentId = 1;
  }
  active(id){
    this.currentId = id;
  }
}
