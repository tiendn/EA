import { Component } from '@angular/core';
import {StartedPipe} from '../PipeService/myPipe';
/*
  Generated class for the TestPipePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  // Pipe
  // If use pipes, don't load templateUrl
  template: `
  <ion-header>

    <ion-navbar>
      <ion-title>Test Pipe</ion-title>
    </ion-navbar>

  </ion-header>
  <ion-content padding class="getting-started">
    <ion-list>
    <ion-item text-wrap *ngFor="let story of stories ">
      <h2> {{story | myPipe}}</h2>
    </ion-item>
    </ion-list>
  </ion-content>
  `,
  pipes:[StartedPipe]
})
export class TestPipePage {
  constructor() {
    var stories =  Array.of(0,true, undefined, null);
    this.stories = stories;
  }
}
