import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Helper } from '../../../../../../common/helper';
import { AuthService } from '../../../../../../providers/auth-service';
import { SignInPage } from '../../signin/signin';
import { ValidationService } from '../../../../../../validators/customvalidators';


@Component({
    selector: 'create-account',
    templateUrl: 'createaccount-component.html',
    providers: [ValidationService]
})
export class CreateAccountComponent {

    moduleName = "Settings";
    form: any;
    firstName: string;
    lastName: string;
    email: string;
    fgrPassword: any;
    password: any;
    confPassword: any;
    createAccountText: string;
    firstNameText: string;
    lastNameText: string;
    emailText: string;
    passwordText: string;
    confirmPasswordText: string;
    acceptTermsText: string;
    showValidateMess: boolean = false;
    firstNameMess: string;
    lastNameMess: string;
    emailRequiredMess: string;
    emailPatternMess: string;
    passwordRequiredMess: string;
    passwordPatternMess: string;
    acceptTermsMess: string;
    confirmPasswordDoesNotMatchMess: string;
    emailErrorMess: string;
    formInvalid: Object;
    showLoading: boolean = false;
    isAccept: number;
    emailRegistered: boolean;

    constructor(public nav: NavController, public helper: Helper, public formBuilder: FormBuilder, public authService: AuthService, public validationService: ValidationService) {
        this.form = formBuilder.group({
            FirstName: ['', Validators.compose([Validators.required, Validators.maxLength(64)])],
            LastName: ['', Validators.compose([Validators.required, Validators.maxLength(64)])],
            Email: ['', Validators.compose([Validators.required, validationService.emailValidator])],
            Passwords: formBuilder.group({
                Password: ['', Validators.compose([Validators.required, Validators.minLength(6), validationService.passwordValidator])],
                ConfirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
            }, { validator: validationService.confirmPassValidator }),
            AcceptTerms: false
        });
        this.firstName = this.form.controls["FirstName"];
        this.lastName = this.form.controls["LastName"];
        this.email = this.form.controls["Email"];
        this.fgrPassword = this.form.controls["Passwords"];
        this.password = this.form.controls["Passwords"].controls["Password"];
        this.confPassword = this.form.controls["Passwords"].controls["ConfirmPassword"];
        this.createAccountText = helper.getPhrase("CreateAccount", this.moduleName);
        this.firstNameText = helper.getPhrase("FirstName", this.moduleName);
        this.lastNameText = helper.getPhrase("LastName", this.moduleName);
        this.emailText = helper.getPhrase("Email", this.moduleName);
        this.passwordText = helper.getPhrase("Password", this.moduleName);
        this.confirmPasswordText = helper.getPhrase("ConfirmPassword", this.moduleName);
        this.acceptTermsText = helper.getPhrase("AcceptTerms", this.moduleName);
        this.firstNameMess = this.helper.getPhrase("EnterFirstName", this.moduleName);
        this.lastNameMess = this.helper.getPhrase("EnterLastName", this.moduleName);
        this.emailRequiredMess = this.helper.getPhrase("EnterEmail", this.moduleName);
        this.emailPatternMess = this.helper.getPhrase("InvalidEmail", this.moduleName);
        this.passwordRequiredMess = this.helper.getPhrase("EnterPassword", this.moduleName);
        this.passwordPatternMess = this.helper.getPhrase("InvalidPassword", this.moduleName);
        this.acceptTermsMess = this.helper.getPhrase("NotAcceptTerms", this.moduleName);
        this.confirmPasswordDoesNotMatchMess = this.helper.getPhrase("PasswordNotMatch", this.moduleName);
        //this.emailErrorMess = this.helper.getPhrase("EmailRegistered", this.moduleName);
        this.formInvalid = {};
    }

    onCreateAccount(data) {
        if (this.form.valid) {
            if (!data.AcceptTerms) {
                this.isAccept = 0; //false
            }
            else {
                //this.helper.showLoading(this);
                this.showLoading = true;
                this.isAccept = 1; //true
                let userData = {
                    firstName: data.FirstName,
                    lastName: data.LastName,
                    email: data.Email,
                    password: data.Passwords.Password
                }
                this.authService.createAccount(userData).then(retData => {
                    this.showLoading = false;
                    if (retData["Message"]) {//error
                        this.emailErrorMess = this.helper.getAuthMessage(retData["Message"]);
                        this.emailRegistered = true;
                    }
                    else {//success
                        this.showAlert();
                    }
                });
            }
        }
        else { //Validate manual
            if (!this.firstName["valid"])
                this.formInvalid["FirstName"] = true;
            else if (!this.lastName["valid"])
                this.formInvalid["LastName"] = true;
            else if (!this.email["valid"])
                this.formInvalid["Email"] = true;
            else if (!this.password["valid"])
                this.formInvalid["Password"] = true;
            else if (!this.fgrPassword["valid"])
                this.formInvalid["ConfirmPassword"] = true;
        }
    }

    showAlert() {
        this.helper.createAlert(this, this.helper.getPhrase("AccountCreated", this.moduleName), this.helper.getPhrase("PleaseLoginAcc", this.moduleName));
    }

    closeAlert() {
        setTimeout(() => {
            this.nav.push(SignInPage, { module: "createaccount" });
        }, 1000);
    }

    onCheck(data) {
        if (data.checked && this.isAccept == 0)
            this.isAccept = 1;
    }

    onFocus(event, elId) {
        if (this.formInvalid[elId])
            this.formInvalid[elId] = false;
        if (elId == "Email" && this.emailRegistered)
            this.emailRegistered = false;
    }
}
