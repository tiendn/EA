import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Helper } from '../../../../../../common/helper';
import { AuthService } from '../../../../../../providers/auth-service';
import { SignInPage } from '../../signin/signin';
import { ValidationService } from '../../../../../../validators/customvalidators';


@Component({
    selector: 'change-password',
    templateUrl: 'changepassword-component.html',
    providers: [ValidationService]
})
export class ChangePasswordComponent {

    moduleName = "Settings";
    form: any;
    fgrPassword: any;
    password: any;
    confPassword: any;
    changePassText: string;
    passwordText: string;
    confirmPasswordText: string;
    passwordRequiredMess: string;
    passwordPatternMess: string;
    confirmPasswordDoesNotMatchMess: string;
    email: string;
    resetCode: string;
    formInvalid: Object

    constructor(public nav: NavController, public navParams: NavParams, public helper: Helper,
        public formBuilder: FormBuilder, public authService: AuthService, public validationService: ValidationService) {
        this.form = formBuilder.group({
            Passwords: formBuilder.group({
                Password: ['', Validators.compose([Validators.required, Validators.minLength(6), validationService.passwordValidator])],
                ConfirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
            }, { validator: validationService.confirmPassValidator })
        });
        this.fgrPassword = this.form.controls["Passwords"];
        this.password = this.form.controls["Passwords"].controls["Password"];
        this.confPassword = this.form.controls["Passwords"].controls["ConfirmPassword"];
        this.changePassText = helper.getPhrase("ResetPassword", this.moduleName);
        this.passwordText = helper.getPhrase("NewPassword", this.moduleName);
        this.confirmPasswordText = helper.getPhrase("ConfirmNewPassword", this.moduleName);
        this.passwordRequiredMess = helper.getPhrase("EnterPassword", this.moduleName);
        this.passwordPatternMess = helper.getPhrase("InvalidPassword", this.moduleName);
        this.confirmPasswordDoesNotMatchMess = helper.getPhrase("PasswordNotMatch", this.moduleName);
        let params = navParams.get("resetPassData");
        if (params != null) {
            this.email = params.email;
            this.resetCode = params.resetCode;
        }
        this.formInvalid = {};
    }

    onChangePassword(data) {
        if (this.form.valid) {
            this.helper.showLoading(this);
            let params = {
                password: data.Passwords.Password
            }
            if (this.email && this.resetCode) {
                params["email"] = this.email;
                params["resetCode"] = this.resetCode;
            }
            this.authService.changePassword(params).then(retData => {
                this.helper.hideLoading(this);
                if (retData) {
                    setTimeout(() => {
                        this.showAlert();
                    }, 500);
                }
            });
        }
        else {
            if (!this.password.valid)
                this.formInvalid["Password"] = true;
            else if (!this.fgrPassword.valid)
                this.formInvalid["ConfirmPassword"] = true;
        }
    }

    showAlert() {
        this.helper.createAlert(this, this.helper.getPhrase("ResetPassword", this.moduleName), this.helper.getPhrase("PleaseLoginAcc", this.moduleName));
    }

    closeAlert() {
        setTimeout(() => {
            this.nav.push(SignInPage, { module: "createaccount" });
            //this.nav.push(SignInPage);
        }, 500);
    }

    onFocus(event, elId) {
        if (this.formInvalid[elId])
            this.formInvalid[elId] = false;
    }
}
