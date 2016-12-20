import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ThemeableBrowser } from 'ionic-native';
import { Helper } from '../../../../../common/helper';
import { GlobalVars } from '../../../../../common/global-vars';
import { CreateAccountPage } from '../createaccount/createaccount';
import { SignInPage } from '../signin/signin';
import { AuthService } from '../../../../../providers/auth-service';

declare var cordova: any;

@Component({
    selector: 'account',
    templateUrl: 'account-component.html'
})
export class AccountComponent {

    moduleName = "Settings";
    createAccountText: string;
    signInText: string;
    accountNote: any;
    signInExternalAccountText: string;
    createFBAccountText: string;
    createGGAccountText: string;

    constructor(public nav: NavController, public domSanitizer: DomSanitizer,
        public helper: Helper, public globalVars: GlobalVars, public authService: AuthService) {
        this.createAccountText = helper.getPhrase("CreateAccount", this.moduleName);
        this.signInText = helper.getPhrase("SignIn", this.moduleName);
        this.accountNote = domSanitizer.bypassSecurityTrustHtml(helper.getPhrase("AccountNote", this.moduleName));
        this.signInExternalAccountText = helper.getPhrase("SignInExternalAccount", this.moduleName);
        this.createFBAccountText = helper.getPhrase("SignInFBAccount", this.moduleName);
        this.createGGAccountText = helper.getPhrase("SignInGGAccount", this.moduleName);
    }

    goToCreateAccPage() {
        this.nav.push(CreateAccountPage);
    }

    goToSignInPage() {
        this.nav.push(SignInPage);
    }

    externalLogin(provider) {
        let title = "";
        if (provider == "Google")
            title = this.createGGAccountText;
        else
            title = this.createFBAccountText;

        //let redirectUrl = cordova.file.applicationDirectory + "www/src/test.html";
        //let redirectUrl = "www/src/test.html";
        //let redirectUrl = "";

        let iconPath = "assets/img/";
        let backIcon = iconPath + (this.globalVars.isArabic ? "back-arabic.png" : "back.png");

        /*let options = {
            statusbar: {
                color: this.globalVars.configData.common.headercolor
            },
            toolbar: {
                height: 44,
                color: this.globalVars.configData.common.headercolor
            },
            title: {
                color: '#ffffff',
                showPageTitle: true,
                staticText: title
            },
            backButton: {
                wwwImage: backIcon,
                wwwImagePressed: backIcon,
                //wwwImageDestiny: 1,
                align: this.globalVars.isArabic ? 'right' : 'left',
                event: 'backPressed'
            },
            backButtonCanClose: true
        };

        let url = this.globalVars.externalServiceUrl + "Account/ExternalLogin?provider=" + provider + "&response_type=token&client_id=MyIRApp&redirect_uri=" + redirectUrl;
        
        let view = cordova.ThemeableBrowser.open(url, '_blank', options)
            .addEventListener('backPressed', function(e) {
                view.close();
            }).addEventListener(cordova.ThemeableBrowser.EVT_ERR, function(e) {
                console.error(e.message);
            }).addEventListener(cordova.ThemeableBrowser.EVT_WRN, function(e) {
                console.log(e.message);
            });

        view.addEventListener("loadstop", (event) => {
            view.executeScript(
                {code: "document.body.innerHTML"},
                (value) => {
                    let retVal = value[0];
                    if (retVal.indexOf("userName") >= 0) {
                        let data = JSON.parse(retVal.substring(retVal.indexOf("{"), retVal.indexOf("}") + 1));
                        this.globalVars.user = data;
                        view.close();
                    }
                    else if (retVal.indexOf("Message") >= 0) {
                        if (retVal.toLowerCase().indexOf("is already taken") > 0) {
                            this.helper.createAlert(this, this.helper.getPhrase("SignIn", this.moduleName), this.helper.getPhrase("EmailRegistered", this.moduleName));
                        }
                        view.close();
                    }
                }
            );
        });

        view.addEventListener("exit", () => {
            if (this.authService.hasLoggedIn()) {
               this.authService.setUserData();
               this.nav.pop();
           }
        });*/
        let options = {
            statusbar: {
                color: this.globalVars.configData.common.headercolor
            },
            toolbar: {
                height: 44,
                color: this.globalVars.configData.common.headercolor
            },
            title: {
                color: '#ffffff',
                showPageTitle: true,
                staticText: title
            },
            backButton: {
                wwwImage: backIcon,
                wwwImagePressed: backIcon,
                //wwwImageDestiny: 1,
                align: this.globalVars.isArabic ? 'right' : 'left',
                event: 'backPressed'
            },
            //clearcache: 'YES',
            backButtonCanClose: true
        };        

        //let url = this.globalVars.externalServiceUrl + "Account/ExternalLogin?provider=" + provider + "&response_type=token&client_id=MyIRApp&redirect_uri=" + redirectUrl;
        let url = this.globalVars.externalServiceUrl + "Account/ExternalLogin?provider=" + provider + "&response_type=token&client_id=MyIRApp";

        //window.open(url, '_blank');

        let view = new ThemeableBrowser(url, '_blank', options);

        view.on("backPressed").subscribe(data => {
            view.close();
        });

        view.on("loadstart").subscribe(data => {
            let url = data.url;
            alert(url);
            if(url.indexOf("localhost") > 0){
                if(url.indexOf("access_token") >0 && url.indexOf("userName") >0){
                    let user = {
                        access_token: this.getQueryStringValue(url, "access_token"),
                        token_type: this.getQueryStringValue(url, "token_type"),
                        expires_in: this.getQueryStringValue(url, "expires_in"),
                        '.expires': this.getQueryStringValue(url, ".expires"),
                        '.issued': this.getQueryStringValue(url, ".issued"),
                        userName: this.getQueryStringValue(url, "userName"),
                        firstName: this.getQueryStringValue(url, "firstName"),
                        lastName: this.getQueryStringValue(url, "lastName")
                    };
                    this.globalVars.user = user;
                }
                else{
                    alert("1212121");
                }
                view.close();
            }
        });

        /*view.on("loadstop").subscribe(data => {
            view.executeScript({ code: "document.body.innerHTML" }).then((value)=>{
                let retVal = value[0];
                if (retVal.indexOf("userName") >= 0) {
                    let data = JSON.parse(retVal.substring(retVal.indexOf("{"), retVal.indexOf("}") + 1));
                    this.globalVars.user = data;
                    view.close();
                }
                else if (retVal.indexOf("Message") >= 0) {
                    if (retVal.toLowerCase().indexOf("is already taken") > 0) {
                        this.helper.createAlert(this, this.helper.getPhrase("SignIn", this.moduleName), this.helper.getPhrase("EmailRegistered", this.moduleName));
                    }
                    view.close();
                }
            });
        });*/

        view.on("exit").subscribe(data => {
           if (this.authService.hasLoggedIn()) {
               this.authService.setUserData();
               this.nav.pop();
           }
        });
    }

    getQueryStringValue(url, key) {  
        return decodeURIComponent(url.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
    }  

    loginSuccess() {

    }

    closeAlert() {

    }

}
