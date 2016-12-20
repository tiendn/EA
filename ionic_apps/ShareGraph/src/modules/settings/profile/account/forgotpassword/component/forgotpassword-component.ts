import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Helper } from '../../../../../../common/helper';
import { AuthService } from '../../../../../../providers/auth-service';
import { ValidationService } from '../../../../../../validators/customvalidators';


@Component({
    selector: 'forgot-password',
    templateUrl: 'forgotpassword-component.html',
    providers: [ValidationService]
})
export class ForgotPasswordComponent {

    moduleName = "Settings";
    form: any;
    email: any;
    emailText: string;
    sendPasswordText: string;
    emailRequiredMess: string;
    emailPatternMess: string;
    isError: boolean = false;
    isSuccessful: boolean;

    constructor(public nav: NavController, public helper: Helper, public formBuilder: FormBuilder, public authService: AuthService, public validationService: ValidationService) {
        this.form = formBuilder.group({
            email: ['', Validators.compose([Validators.required, validationService.emailValidator])]
        });
        this.email = this.form.controls["email"];
        this.emailText = helper.getPhrase("Email", this.moduleName);
        this.sendPasswordText = helper.getPhrase("SendPassword", this.moduleName);
        this.emailRequiredMess = helper.getPhrase("EnterEmail", this.moduleName);
        this.emailPatternMess = helper.getPhrase("InvalidEmail", this.moduleName);
    }

    onResetPassword(data) {
        if (this.form.valid) {
            this.helper.showLoading(this);
            this.authService.forgotPassword(data.email).then(ret => {
                this.helper.hideLoading(this);
                this.isSuccessful = Boolean(ret);
                setTimeout(() => {
                    this.showAlert(data.email);
                }, 800);
            });
        }
        else {
            this.isError = !this.email.valid;
        }
    }

    showAlert(email) {
        let mess = "";
        if (this.isSuccessful)
            mess = this.helper.getPhrase("ResetPasswordMess", this.moduleName).replace("[email]", email);
        else
            mess = this.helper.getPhrase("EmailNotFound", this.moduleName);
        this.helper.createAlert(this, this.helper.getPhrase("ForgotPassword", this.moduleName), mess);
    }

    closeAlert() {
        if (this.isSuccessful)
            this.nav.pop();
    }

    onFocus(event) {
        if (this.isError)
            this.isError = false;
    }
}
