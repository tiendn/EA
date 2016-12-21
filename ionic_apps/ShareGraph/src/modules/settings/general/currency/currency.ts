import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Helper } from '../../../../common/helper';
import { GlobalVars } from '../../../../common/global-vars';
import { CurrencyService } from '../../../../providers/currency-service';
import { AppConfigService } from '../../../../providers/appconfig-service';

@Component({
    selector: 'page-setting-currency',
    templateUrl: 'currency.html',
    providers: [CurrencyService]
})
export class CurrencyPage {

    moduleName = "Settings";
    headerTitle: string;
    cancelText: string;
    doneText: string;
    defaultText: string;
    currencyDesc: string;
    currencyNote: string;
    currentValSelected: string;
    prevValSelected: string;
    currencies: any;

    constructor(public nav: NavController, navParams: NavParams,
        public helper: Helper, public globalVars: GlobalVars, public currencyService: CurrencyService, public appConfigService: AppConfigService) {
        this.headerTitle = helper.getPhrase("Currency", this.moduleName);
        this.cancelText = helper.getPhrase("Cancel", this.moduleName);
        this.doneText = helper.getPhrase("Done", this.moduleName);
        this.defaultText = helper.getPhrase("Default", this.moduleName);
        this.currencyDesc = helper.getPhrase("CurrencyDesc", this.moduleName);
        this.currencyNote = helper.getPhrase("CurrencyNote", this.moduleName);
        this.currentValSelected = globalVars.generalSettings.currency.isDefault ? "default" : globalVars.generalSettings.currency.value;
        this.prevValSelected = this.currentValSelected;
    }

    ionViewDidLoad() {
        this.helper.showLoading(this);
        this.currencyService.getCurrenciesData().then(data => {
            if (data instanceof Array && data.length > 0) {
                this.currencies = data;
            }
            this.helper.hideLoading(this);
        });
    }

    ionViewDidEnter() {
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }

    onCancel() {
        this.nav.pop();
    }

    onDone() {
        this.globalVars.generalSettings.currency.isDefault = this.currentValSelected == "default";
        this.globalVars.generalSettings.currency.value = this.currentValSelected;
        this.appConfigService.setGeneralSettingsData();
        this.globalVars.changedCurrency = true;
        this.nav.pop();
    }
}
