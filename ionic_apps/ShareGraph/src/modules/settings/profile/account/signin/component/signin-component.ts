import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Helper } from '../../../../../../common/helper';
import { GlobalVars } from '../../../../../../common/global-vars';
import { AuthService } from '../../../../../../providers/auth-service';
import { ValidationService } from '../../../../../../validators/customvalidators';
import { ForgotPasswordPage } from '../../forgotpassword/forgotpassword';
import { SettingsPage } from '../../../../settings';
import { ProfileService } from '../../../../../../providers/profile-service';


@Component({
    selector: 'signin',
    templateUrl: 'signin-component.html',
    providers: [ValidationService]
})
export class SignInComponent {

    moduleName = "Settings";
    form: any;
    email: any;
    password: any;
    emailText: string;
    passwordText: string;
    signInText: string;
    forgotPassText: string;
    emailRequiredMess: string;
    emailPatternMess: string;
    passwordRequiredMess: string;
    passwordPatternMess: string;
    formInvalid: Object;
    showLoading: boolean = false;

    constructor(public nav: NavController, public navParams: NavParams, public helper: Helper,
        public formBuilder: FormBuilder, public authService: AuthService, public validationService: ValidationService,
        public profileService: ProfileService, public globalVars: GlobalVars, public view: ViewController) {
        let defaultUserName = "";
        if (authService.hasLoggedIn()) {//Case token expired
            defaultUserName = globalVars.user.userName;
            authService.logout();
        }
        this.form = formBuilder.group({
            email: [defaultUserName, Validators.compose([Validators.required, validationService.emailValidator])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6), validationService.passwordValidator])]
        });
        this.email = this.form.controls["email"];
        this.password = this.form.controls["password"];
        this.emailText = helper.getPhrase("Email", this.moduleName);
        this.passwordText = helper.getPhrase("Password", this.moduleName);
        this.signInText = helper.getPhrase("SignIn", this.moduleName);
        this.forgotPassText = helper.getPhrase("ForgotPassword", this.moduleName);
        this.emailRequiredMess = helper.getPhrase("EnterEmail", this.moduleName);
        this.emailPatternMess = helper.getPhrase("InvalidEmail", this.moduleName);
        this.passwordRequiredMess = helper.getPhrase("EnterPassword", this.moduleName);
        this.passwordPatternMess = helper.getPhrase("InvalidPassword", this.moduleName);
        this.formInvalid = {};
    }

    forgotPassword() {
        this.nav.push(ForgotPasswordPage);
    }

    onSignIn(data) {
        if (this.form.valid) {
            this.showLoading = true;
            let userData = {
                userName: data.email,
                password: data.password
            };
            this.authService.login(userData).then(res => {
                this.showLoading = false;
                if (!res["error"]) {
                    if (res["Message"]) {//error
                        this.helper.createAlert(this, this.helper.getPhrase("SignIn", this.moduleName), this.helper.getAuthMessage(res["Message"]));
                    }
                    else if (res["access_token"]) {//success
                        this.globalVars.user = res;
                        this.authService.setUserData();
                        this.profileService.getProfileStatus();
                        this.profileService.getProfileData();
                        //this.showLoading = false;
                        if (this.navParams.get("module") != null) {
                            let param = this.navParams.get("module");
                            if (param == "home")//Go to sign in from home page
                                this.nav.push(SettingsPage, { removePrevPage: true });
                            else if (param == "introduction")
                                this.nav.pop();
                            else {//Go to sign in after account created
                                let createAccPageIndex = this.view["index"] - 1;
                                let accPageIndex = createAccPageIndex - 1;
                                this.nav.remove(createAccPageIndex);
                                this.nav.remove(accPageIndex);
                                this.nav.pop();
                            }
                        }
                        else { //Go to sign in from settings
                            let viewIndex = this.view["index"] - 1;
                            this.nav.remove(viewIndex);
                            this.nav.pop();
                        }
                    }
                }
            });
        }
        else {
            if (!this.email.valid)
                this.formInvalid["Email"] = true;
            else if (!this.password.valid)
                this.formInvalid["Password"] = true;
        }
    }

    closeAlert() {
    }

    onFocus(event, elId) {
        if (this.formInvalid[elId])
            this.formInvalid[elId] = false;
    }
}
