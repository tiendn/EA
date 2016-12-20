import { Component } from '@angular/core';
import { Helper } from '../../../../../common/helper';
import { GlobalVars } from '../../../../../common/global-vars';

@Component({
    selector: 'page-setting-signin',
    templateUrl: 'signin.html'
})
export class SignInPage {
    headerTitle: string;

    constructor(public helper: Helper, public globalVars: GlobalVars) {
        this.headerTitle = helper.getPhrase("SignIn", "Settings");
    }

    ionViewDidLoad() {
        this.helper.hideLoading(this);
    }

    ionViewDidEnter() {
        this.globalVars.currentModule = "profile";
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }

}
