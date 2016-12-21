import { Component } from '@angular/core';
import { Helper } from '../../../../../common/helper';
import { GlobalVars } from '../../../../../common/global-vars';

@Component({
    selector: 'page-setting-createaccount',
    templateUrl: 'createaccount.html'
})
export class CreateAccountPage {
    moduleName = "Settings";
    headerTitle: string;

    constructor(public helper: Helper, public globalVars: GlobalVars) {
        this.headerTitle = helper.getPhrase("CreateAccount", this.moduleName);
    }

    ionViewDidEnter() {
        this.globalVars.currentModule = "profile";
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }

}
