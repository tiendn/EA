import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Content, ViewController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Helper } from '../../common/helper';
import { GlobalVars } from '../../common/global-vars';


import {AccountPage} from './profile/account/account';
import {AccountInfoPage} from './profile/account/accountinfo/accountinfo';
import {SettingWatchlistPage} from './profile/watchlist/watchlist';
//import {EmailAlertPage} from './profile/emailalert/emailalert';
import {IndicesPage} from './profile/indices/indices';

/*General Tab*/
import {MenuImagePage} from './general/menuimage/menuimage';
import {QuickMenuPage} from './general/quickmenu/quickmenu';
import {CurrencyPage} from './general/currency/currency';
import {DecimalSeparatorPage} from './general/decimalseparator/decimalseparator';
import {LanguagePage} from './general/language/language';
import {NotificationsPage} from './general/notifications/notifications';
import {StreamPage} from './general/stream/stream';
//import {DownloadPage} from './general/download/download';

/*Common*/
import {SettingHelpPage} from './general/help/help';
import {SettingAboutPage} from './general/about/about';

import {AuthService} from '../../providers/auth-service';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {

    @ViewChild(Content) content: Content;

    moduleName = "Settings";
    isGeneral: boolean = true;
    isRemovePrevPage: boolean;
    isOnline: boolean;
    hasLoggedin: boolean;
    accText: string;
    headerTitle: string;
    general: string;
    profile: string;
    createAnAccount: string;
    watchlist: string;
    indices: string;
    emailAlert: string;
    //added by duc.truongminh
    settingGeneralNote: string;
    currencyText: string;
    decimalText: string;
    languageText: string;
    quickMenuText: string;
    pushNotifText: string;
    streamText: string;
    menuImageText: string;
    helpText: string;
    aboutText: string;
    investorRelationsText: string;
    eurolandInvestorsText: any;
    copyrightText: string;
    myIRAppText: string;
    currencyValue: string;
    decimalValue: string;
    languageValue: string;
    quickMenuValue: string;
    loggedInAs: string;

    constructor(public nav: NavController, navParams: NavParams, public modalController: ModalController,
        public helper: Helper, public domSanitizer: DomSanitizer, public viewController: ViewController,
        public authService: AuthService, public globalVars: GlobalVars) {
        this.loadPhrases();
        this.isRemovePrevPage = navParams.get("removePrevPage") != null;
        this.isOnline = globalVars.isOnline;
    }

    ionViewWillEnter() {
        if (this.globalVars.changedLanguage && this.globalVars.changedLanguage == true)
            this.loadPhrases();
        this.setSelectedValue();
        this.hasLoggedin = this.authService.hasLoggedIn();
        if (this.hasLoggedin) {
            this.accText = this.authService.getUserName();
        }
        else {
            this.accText = this.helper.getPhrase("Account", this.moduleName);
        }
    }

    ionViewDidEnter() {
        //Check & Remove signin page in nav stack, when use nav.pop() => back to home page
        if (this.isRemovePrevPage) {
            let viewIndex = this.viewController["index"] - 1;
            this.nav.remove(viewIndex);
        }

        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }

    ionViewWillLeave() {
        this.isRemovePrevPage = false;
    }

    gotoAccount() {
        if (this.hasLoggedin)
            this.nav.push(AccountInfoPage);
        else
            this.nav.push(AccountPage);
    }

    gotoWatchlist() {
        this.nav.push(SettingWatchlistPage, null);
    }

    gotoIndices() {
        this.nav.push(IndicesPage, null);
    }

    gotoEmailAlert() {
        //this.nav.push(EmailAlertPage, null);
    }

    /*Added by duc.truongminh - 22/09/2016*/
    changeTab(tabId) {
        if (tabId == "general") {
            this.isGeneral = true;
            this.globalVars.currentModule = "general";
        }
        else {
            this.isGeneral = false;
            this.globalVars.currentModule = "profile";
        }
        this.content.scrollToTop(0);
    }

    goToSubSettings(name) {
        switch (name) {
            case "quickmenu":
                this.nav.push(QuickMenuPage);
                break;
            case "menuimage":
                this.nav.push(MenuImagePage);
                break;
            case "help":
                this.nav.push(SettingHelpPage);
                break;
            case "about":
                this.nav.push(SettingAboutPage);
                break;
            case "currency":
                this.nav.push(CurrencyPage);
                break;
            case "decimal":
                this.nav.push(DecimalSeparatorPage);
                break;
            case "language":
                this.nav.push(LanguagePage);
                break;
            case "notifications":
                this.nav.push(NotificationsPage);
                break;
            case "stream":
                this.nav.push(StreamPage);
                break;
            //case "download":
            //    this.nav.push(DownloadPage);
            //    break;
            default:
                console.log(name);
        }
    }

    loadPhrases() {
        this.headerTitle = this.helper.getPhrase("Settings");
        this.general = this.helper.getPhrase("General", this.moduleName);
        this.profile = this.helper.getPhrase("Profile", this.moduleName);
        this.createAnAccount = this.helper.getPhrase("CreateAnAccount", this.moduleName);
        this.watchlist = this.helper.getPhrase("Watchlist");
        this.indices = this.helper.getPhrase("Indices");
        this.emailAlert = this.helper.getPhrase("EmailAlerts");
        //added by duc.truongminh
        this.viewController.setBackButtonText(this.helper.getPhrase("Back"));
        this.settingGeneralNote = this.helper.getPhrase("SettingDesc", this.moduleName);
        this.currencyText = this.helper.getPhrase("Currency", this.moduleName);
        this.decimalText = this.helper.getPhrase("DecimalSeparator", this.moduleName);
        this.languageText = this.helper.getPhrase("Language", this.moduleName);
        this.quickMenuText = this.helper.getPhrase("QuickMenu", this.moduleName);
        this.pushNotifText = this.helper.getPhrase("PushNotifications", this.moduleName);
        this.streamText = this.helper.getPhrase("Stream", this.moduleName);
        this.menuImageText = this.helper.getPhrase("MenuImage", this.moduleName);
        this.helpText = this.helper.getPhrase("Help", this.moduleName);
        this.aboutText = this.helper.getPhrase("About", this.moduleName);
        this.investorRelationsText = this.helper.getPhrase("InvestorRelationsApp", this.moduleName);
        this.eurolandInvestorsText = this.domSanitizer.bypassSecurityTrustHtml(this.helper.getPhrase("FooterText", this.moduleName));
        this.copyrightText = this.helper.getPhrase("Copyright", this.moduleName);
        this.myIRAppText = this.helper.getPhrase("MyIRApp", this.moduleName);
        //this.setSelectedValue();
    }

    setSelectedValue() {
        //Get Selected Value
        let defaultText = this.helper.getPhrase("Default", this.moduleName);
        this.currencyValue = this.globalVars.generalSettings.currency.isDefault ? defaultText : this.globalVars.generalSettings.currency.value;
        if (this.globalVars.generalSettings.separator.isDefault) {
            this.decimalValue = defaultText;
        }
        else {
            if (this.globalVars.generalSettings.separator.decimal == ",")
                this.decimalValue = this.helper.getPhrase("Comma", this.moduleName);
            else
                this.decimalValue = this.helper.getPhrase("Dot", this.moduleName);
        }
        this.languageValue = this.globalVars.generalSettings.language.isDefault ? defaultText : this.globalVars.generalSettings.language.name;
        this.quickMenuValue = this.globalVars.generalSettings.quickMenu.isDefault ? defaultText : this.helper.getPhrase("Custom", this.moduleName);
        this.loggedInAs = this.helper.getPhrase("LoggedIn", this.moduleName);
    }
    /*---------END--------------*/

}
