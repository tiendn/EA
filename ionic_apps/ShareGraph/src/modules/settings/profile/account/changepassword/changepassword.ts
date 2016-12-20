import { Component } from '@angular/core';
import { Helper } from '../../../../../common/helper';
import { GlobalVars } from '../../../../../common/global-vars';

@Component({
    selector: 'page-setting-changepassword',
    templateUrl: 'changepassword.html'
})
export class ChangePasswordPage {
    headerTitle: string;
    constructor(public helper: Helper, public globalVars: GlobalVars) {
        this.headerTitle = helper.getPhrase("ResetPassword", "Settings");
    }

    ionViewDidEnter() {
        this.globalVars.currentModule = "profile";
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }

}
