import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Helper } from '../../../../common/helper';
import { GlobalVars } from '../../../../common/global-vars';

@Component({
    selector: 'page-setting-about',
    templateUrl: 'about.html'
})
export class SettingAboutPage {

    constructor(public nav: NavController, navParams: NavParams,
        public helper: Helper, public globalVars: GlobalVars) {
    }

}
