import {Component} from "@angular/core";
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {Helper} from './pages/ProviderService/helper';
@Component({
  providers : [Helper],
  templateUrl: 'build/app.html'
})
export class MyIRApp {
  static get parameters() {
    return [
      [Platform]
    ]
  }
  constructor(platform) {
    // Call any initial plugins when ready
    platform.ready().then(() => {
      StatusBar.styleDefault();
    });
    this.root = HomePage ;
  }
}

ionicBootstrap(MyIRApp,[Helper])
