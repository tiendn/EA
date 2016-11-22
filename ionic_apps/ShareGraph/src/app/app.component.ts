import { Component, ViewChild, NgZone } from '@angular/core';
import { Push, Network } from 'ionic-native';
import { MenuController, Nav, Platform } from 'ionic-angular';
//import { Splashscreen, StatusBar } from 'ionic-native';

import { File } from 'ionic-native';

import { AuthService } from '../providers/auth-service';
import { Helper } from '../common/helper';
import { GlobalVars } from '../common/global-vars';

//App pages
import { HomePage } from '../pages/home/home';
import {AboutPage} from '../pages/about/about';
import {CalendarPage} from '../pages/calendar/calendar';
import {ContactPage} from '../pages/contact/contact';
import {HistoricalPricePage} from '../pages/historicalprice/historicalprice';
import {InvestmentCalculatorPage} from '../pages/investmentcalculator/investmentcalculator';
import {KeyFinancialsPage} from '../pages/keyfinancials/keyfinancials';
import {MediaPage} from '../pages/media/media';
import {PressReleasesPage} from '../pages/pressreleases/pressreleases';
import {ReportsPage} from '../pages/reports/reports';
import {SettingsPage} from '../pages/settings/settings';
import {ShareGraphPage} from '../pages/sharegraph/sharegraph';
import {ShareInformationPage} from '../pages/shareinformation/shareinformation';
//User pages
//import {SignInPage} from '../pages/settings/profile/account/signin/signin';
//import {AccountInfoPage} from '../pages/settings/profile/account/accountinfo/accountinfo';

export interface PageObj {
    name: string;
    component: any;
}

declare var cordova: any;

@Component({
    templateUrl: 'app.template.html'
})
export class MyIRApp {
    // the root nav is a child of the root app component
    // @ViewChild(Nav) gets a reference to the app's root nav
    @ViewChild(Nav) nav: Nav;

    // List of pages that can be navigated to from the left menu
    appPages: PageObj[] = [
        { name: "about", component: AboutPage },
        { name: "calendar", component: CalendarPage },
        { name: "contacts", component: ContactPage },
        { name: "historicalprice", component: HistoricalPricePage },
        { name: "investmentcalculator", component: InvestmentCalculatorPage },
        { name: "keyfinancials", component: KeyFinancialsPage },
        { name: "media", component: MediaPage },
        { name: "pressreleases", component: PressReleasesPage },
        { name: "reports", component: ReportsPage },
        { name: "settings", component: SettingsPage },
        { name: "sharegraph", component: ShareGraphPage },
        { name: "shareinformation", component: ShareInformationPage }
    ];
    rootPage: any = HomePage;
    isOnline: boolean = true;
    menuClass: string;
    menuSide: string = "left";
    leftMenuModules: any;
    settingsText: string;
    userText: string;
    modulesDisplayName: any;

    constructor(
        public menu: MenuController,
        platform: Platform,
        public zone: NgZone,
        public globalVars: GlobalVars,
        public helper: Helper,
        public authService: AuthService
    ) {
        // Call any initial plugins when ready
        platform.ready().then(() => {
            // StatusBar.styleDefault();
            // Splashscreen.hide();
            this.globalVars.root = this;
            this.isOnline = this.checkOnlineByNetworkState();
            this.globalVars.isOnline = this.isOnline;
            this.bindEventsNetworkConnetion();
            this.globalVars.isIOS = platform.is('ios');
            this.globalVars.isTablet = platform.platforms().indexOf("tablet") >= 0;
            this.globalVars.isNativeMode = platform.is("cordova");

            if (this.globalVars.isNativeMode) {
                if (this.globalVars.isIOS)
                    this.globalVars.appPath = cordova.file.dataDirectory;
                else
                    this.globalVars.appPath = cordova.file.externalApplicationStorageDirectory;

                //window.resolveLocalFileSystemURL(path, function (dir) {
                //    this.globalVars.rootEntry = dir;
                //    this.globalVars.appPath = path;
                //});

                //Check push notification is registered
                //Push.hasPermission(data => {
                //    if (data.isEnabled) {
                //        this.helper.registerPushNotifications();
                //    }
                //});
            }
        });

        this.menuClass = "sidemenu-" + this.globalVars.generalSettings.menuImage;
        this.menuSide = "left";
    }

    bindEventsNetworkConnetion() {
        let disconnectSubs = Network.onDisconnect().subscribe(() => {
            this.helper.createOffileMess();
            this.zone.run(() => {
                this.globalVars.isOnline = false;
                this.isOnline = false;
                if (this.globalVars.activePage)
                    this.globalVars.activePage.isOnline = false;
            });
        });
        let connectSubs = Network.onConnect().subscribe(() => {
            this.helper.removeOffileMess();
            this.zone.run(() => {
                this.globalVars.isOnline = true;
                this.isOnline = true;
                if (this.globalVars.activePage)
                    this.globalVars.activePage.isOnline = true;
            });
        });
    }

    checkOnlineByNetworkState() {
        //return false;
        if (Network["connection"] && Network["connection"] == "none") {
            return false;
        }
        else {
            return true;
        }
    }

    userAuthenticate() {
        //if (this.authService.hasLoggedIn()) {
        //    this.nav.push(AccountInfoPage, { module: "home" });
        //}
        //else {
        //    this.nav.push(SignInPage, { module: "home" });
        //}
    }
}