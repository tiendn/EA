import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, Slides } from 'ionic-angular';
import { GlobalVars } from '../../../../../common/global-vars';

@Component({
    selector: 'indices-introduction-page',
    templateUrl: 'introduction.html'
})

export class IndicesIntroduction {
  @ViewChild('introSlider') slider: Slides;

  menuClass:string= "sidemenu-image";
  constructor(public nav: NavController, public view: ViewController, public globalVars: GlobalVars) {
      
  }
  
  ionViewWillEnter(){
    this.menuClass = "sidemenu-"+ this.globalVars.generalSettings.menuImage;
  }

  closeIntroduction() {
    this.view.dismiss({moduleName: 'close'});
  }

  gotoSignUp() {
    this.view.dismiss({moduleName: 'signup'});
  }

  gotoSignIn() {
    this.view.dismiss({moduleName: 'signin'});
  }

  nextSlide() {
    let currentIndex = this.slider.getActiveIndex();
    this.slider.slideTo(++currentIndex, 500);
  }
}
