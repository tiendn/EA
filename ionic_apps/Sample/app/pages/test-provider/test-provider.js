import { Component } from '@angular/core';
import {DataService} from '../ProviderService/ProviderService';
/*
  Generated class for the TestProviderPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  providers: [DataService],
  templateUrl: 'build/pages/test-provider/test-provider.html',
})
export class TestProviderPage {
  static get parameters() {
    return [[DataService]];
  }

  constructor (dataService){
    var stories = [];
    let self = this;
    dataService.getData().then(function(data){
      self.stories = data;
    });
  }
}
