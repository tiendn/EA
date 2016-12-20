import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Helper } from '../../../../common/helper';
import { GlobalVars } from '../../../../common/global-vars';

@Component({
    selector: 'page-setting-stream',
    templateUrl: 'stream.html'
})
export class StreamPage {
    moduleName = "Settings";
    headerTitle: string;
    constructor(public nav: NavController, public helper: Helper, public globalVars: GlobalVars) {
        this.headerTitle = helper.getPhrase("Stream", this.moduleName);
    }

    ionViewDidEnter() {
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }
}

//const dynamicComponent = Component({
//    selector: 'page-setting-stream',
//    templateUrl: 'stream.html'
//})(StreamPage);
