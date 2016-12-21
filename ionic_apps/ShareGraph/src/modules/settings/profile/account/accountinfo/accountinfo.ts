import { Component } from '@angular/core';
import { Helper } from '../../../../../common/helper';
import { GlobalVars } from '../../../../../common/global-vars';

@Component({
    selector: 'page-setting-accountinfo',
    templateUrl: 'accountinfo.html'
})
export class AccountInfoPage {
    moduleName = "Settings";
    headerTitle: string;

    constructor(public helper: Helper, public globalVars: GlobalVars) {
        this.headerTitle = helper.getPhrase("Account", this.moduleName);
    }

}
