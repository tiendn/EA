import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Helper } from '../../../../../../common/helper';
import { AuthService } from '../../../../../../providers/auth-service';

@Component({
    selector: 'account-info',
    templateUrl: 'accountinfo-component.html'
})
export class AccountInfoComponent {

    moduleName = "Settings";
    firstName: string;
    lastName: string;
    email: string;
    signOutText: string;

    constructor(public nav: NavController, public helper: Helper, public authService: AuthService) {
        let userInfo = authService.getUserInfo();
        this.firstName = userInfo.firstName;
        this.lastName = userInfo.lastName;
        this.email = userInfo.userName;
        this.signOutText = helper.getPhrase("SignOut", this.moduleName);
    }

    onSignOut() {
        this.authService.logout();
        this.nav.pop();
    }
}
