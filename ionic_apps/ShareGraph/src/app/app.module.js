"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var storage_1 = require('@ionic/storage');
var app_component_1 = require('./app.component');
//Pages
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
/*Compornents*/
var scrolltab_1 = require('../components/scrolltab/scrolltab');
//Common
var global_vars_1 = require('../common/global-vars');
var helper_1 = require('../common/helper');
//Providers
var appconfig_service_1 = require('../providers/appconfig-service');
var translation_service_1 = require('../providers/translation-service');
var auth_service_1 = require('../providers/auth-service');
var profile_service_1 = require('../providers/profile-service');
var formatnumber_1 = require('../pipes/formatnumber');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.MyIRApp,
                home_1.HomePage,
                about_1.AboutPage,
                calendar_1.CalendarPage,
                contact_1.ContactPage,
                historicalprice_1.HistoricalPricePage,
                investmentcalculator_1.InvestmentCalculatorPage,
                keyfinancials_1.KeyFinancialsPage,
                media_1.MediaPage,
                pressreleases_1.PressReleasesPage,
                reports_1.ReportsPage,
                settings_1.SettingsPage,
                sharegraph_1.ShareGraphPage,
                shareinformation_1.ShareInformationPage,
                scrolltab_1.ScrollTabComponent,
                formatnumber_1.FormatNumber
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(app_component_1.MyIRApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                app_component_1.MyIRApp,
                home_1.HomePage,
                about_1.AboutPage,
                calendar_1.CalendarPage,
                contact_1.ContactPage,
                historicalprice_1.HistoricalPricePage,
                investmentcalculator_1.InvestmentCalculatorPage,
                keyfinancials_1.KeyFinancialsPage,
                media_1.MediaPage,
                pressreleases_1.PressReleasesPage,
                reports_1.ReportsPage,
                settings_1.SettingsPage,
                sharegraph_1.ShareGraphPage,
                scrolltab_1.ScrollTabComponent,
                shareinformation_1.ShareInformationPage
            ],
            providers: [storage_1.Storage, global_vars_1.GlobalVars, helper_1.Helper, appconfig_service_1.AppConfigService, translation_service_1.TranslationService, auth_service_1.AuthService, profile_service_1.ProfileService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
