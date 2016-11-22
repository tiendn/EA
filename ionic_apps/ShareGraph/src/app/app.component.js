"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ionic_native_1 = require('ionic-native');
var ionic_angular_1 = require('ionic-angular');
//App pages
var home_1 = require('../pages/home/home');
var about_1 = require('../pages/about/about');
var calendar_1 = require('../pages/calendar/calendar');
var contact_1 = require('../pages/contact/contact');
var historicalprice_1 = require('../pages/historicalprice/historicalprice');
var investmentcalculator_1 = require('../pages/investmentcalculator/investmentcalculator');
var keyfinancials_1 = require('../pages/keyfinancials/keyfinancials');
var media_1 = require('../pages/media/media');
var pressreleases_1 = require('../pages/pressreleases/pressreleases');
var reports_1 = require('../pages/reports/reports');
var settings_1 = require('../pages/settings/settings');
var sharegraph_1 = require('../pages/sharegraph/sharegraph');
var shareinformation_1 = require('../pages/shareinformation/shareinformation');
var MyIRApp = (function () {
    function MyIRApp(menu, platform, zone, globalVars, helper, authService) {
        var _this = this;
        this.menu = menu;
        this.zone = zone;
        this.globalVars = globalVars;
        this.helper = helper;
        this.authService = authService;
        // List of pages that can be navigated to from the left menu
        this.appPages = [
            { name: "about", component: about_1.AboutPage },
            { name: "calendar", component: calendar_1.CalendarPage },
            { name: "contacts", component: contact_1.ContactPage },
            { name: "historicalprice", component: historicalprice_1.HistoricalPricePage },
            { name: "investmentcalculator", component: investmentcalculator_1.InvestmentCalculatorPage },
            { name: "keyfinancials", component: keyfinancials_1.KeyFinancialsPage },
            { name: "media", component: media_1.MediaPage },
            { name: "pressreleases", component: pressreleases_1.PressReleasesPage },
            { name: "reports", component: reports_1.ReportsPage },
            { name: "settings", component: settings_1.SettingsPage },
            { name: "sharegraph", component: sharegraph_1.ShareGraphPage },
            { name: "shareinformation", component: shareinformation_1.ShareInformationPage }
        ];
        this.rootPage = home_1.HomePage;
        this.isOnline = true;
        this.menuSide = "left";
        // Call any initial plugins when ready
        platform.ready().then(function () {
            // StatusBar.styleDefault();
            // Splashscreen.hide();
            _this.globalVars.root = _this;
            _this.isOnline = _this.checkOnlineByNetworkState();
            _this.globalVars.isOnline = _this.isOnline;
            _this.bindEventsNetworkConnetion();
            _this.globalVars.isIOS = platform.is('ios');
            _this.globalVars.isTablet = platform.platforms().indexOf("tablet") >= 0;
            _this.globalVars.isNativeMode = platform.is("cordova");
            //if (this.globalVars.isNativeMode) {
            //    let path = "";
            //    if (this.globalVars.isIOS)
            //        path = cordova.file.dataDirectory;
            //    else
            //        path = cordova.file.externalApplicationStorageDirectory;
            //    window.resolveLocalFileSystemURL(path, function (dir) {
            //        this.globalVars.rootEntry = dir;
            //        this.globalVars.appPath = path;
            //    });
            //    //Check push notification is registered
            //    Push.hasPermission(data => {
            //        if (data.isEnabled) {
            //            this.helper.registerPushNotifications();
            //        }
            //    });
            //}
        });
        this.menuClass = "sidemenu-" + this.globalVars.generalSettings.menuImage;
        this.menuSide = "left";
    }
    MyIRApp.prototype.bindEventsNetworkConnetion = function () {
        var _this = this;
        var disconnectSubs = ionic_native_1.Network.onDisconnect().subscribe(function () {
            _this.helper.createOffileMess();
            _this.zone.run(function () {
                _this.globalVars.isOnline = false;
                _this.isOnline = false;
                if (_this.globalVars.activePage)
                    _this.globalVars.activePage.isOnline = false;
            });
        });
        var connectSubs = ionic_native_1.Network.onConnect().subscribe(function () {
            _this.helper.removeOffileMess();
            _this.zone.run(function () {
                _this.globalVars.isOnline = true;
                _this.isOnline = true;
                if (_this.globalVars.activePage)
                    _this.globalVars.activePage.isOnline = true;
            });
        });
    };
    MyIRApp.prototype.checkOnlineByNetworkState = function () {
        //return false;
        if (ionic_native_1.Network["connection"] && ionic_native_1.Network["connection"] == "none") {
            return false;
        }
        else {
            return true;
        }
    };
    MyIRApp.prototype.userAuthenticate = function () {
        //if (this.authService.hasLoggedIn()) {
        //    this.nav.push(AccountInfoPage, { module: "home" });
        //}
        //else {
        //    this.nav.push(SignInPage, { module: "home" });
        //}
    };
    __decorate([
        core_1.ViewChild(ionic_angular_1.Nav)
    ], MyIRApp.prototype, "nav", void 0);
    MyIRApp = __decorate([
        core_1.Component({
            templateUrl: 'app.template.html'
        })
    ], MyIRApp);
    return MyIRApp;
}());
exports.MyIRApp = MyIRApp;
