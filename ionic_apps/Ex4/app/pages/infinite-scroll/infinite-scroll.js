import { Component } from '@angular/core';
import {MyProvider} from '../ProviderService/ProviderService';

@Component({
  providers : [MyProvider],
  templateUrl: 'build/pages/infinite-scroll/infinite-scroll.html',
})
export class InfiniteScrollPage {
  static get parameters() {
    return [
      [MyProvider]
    ];
  }
  constructor(providerService) {
    // Save all data from Json file
    this.stories = [];
    // Store data in a array, push more after scroll.
    this.items = [];
    let self = this;
    // Get index when scroll
    this.index = 0;
    // Get data
    providerService.getData().then(function(data){
      // Save all data into this.stories variable
      self.stories = data;
      for (self.index = 0 ; self.index < 3 ; self.index++ ){
        self.items.push(data[self.index]);
      }
    });
  }
  ionViewLoaded() {
  console.log("I'm alive!");
}
ionViewWillLeave() {
    console.log("Looks like I'm about to leave :(");
  }
  doInfinite(infiniteScroll){
    setTimeout(() => {
      let n = this.stories.length - this.index;
      if (n <= 30){
        for (let j = 0 ; j < n ; j ++ ){
          this.items.push(this.stories[this.index+j]);
        }
        infiniteScroll.complete();
        this.index += n;
      }
      else {
        for (let j = 0 ; j < 30 ; j ++ ){
          this.items.push(this.stories[this.index+j]);
        }
        infiniteScroll.complete();
        this.index += 30;
      }
    },800);
  }
}
