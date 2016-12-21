import { Component } from '@angular/core';
import { Helper } from '../../../../../common/helper';
import { GlobalVars } from '../../../../../common/global-vars';

@Component({
    selector: 'page-setting-forgotpassword',
    templateUrl: 'forgotpassword.html'
})
export class ForgotPasswordPage {
    headerTitle: string;

    constructor(public helper: Helper, public globalVars: GlobalVars) {
        this.headerTitle = helper.getPhrase("ForgotPassword", "Settings");
    }

    ionViewDidEnter() {
        this.globalVars.currentModule = "profile";
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }

}
