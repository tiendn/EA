import { Component } from '@angular/core';
import {ViewController} from 'ionic-angular';
@Component({
  template: `
    <ion-list>
      <ion-item> dsfdsfds </ion-item>
      <ion-list-header>Ionic</ion-list-header>
      <button ion-item (click)="close()">Learn Ionic</button>
      <button ion-item (click)="close()">Documentation</button>
      <button ion-item (click)="close()">Showcase</button>
      <button ion-item (click)="close()">GitHub Repo</button>
    </ion-list>
  `
})
class PopoverPage {
  static get parameters(){
    return [[ViewController]]
  }
  constructor(ViewController) {  this.viewCtrl = ViewController}
  close() {
    this.viewCtrl.dismiss();
  }
}
