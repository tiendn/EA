import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Globalization } from 'ionic-native';
import { Helper } from '../../../../common/helper';
import { GlobalVars } from '../../../../common/global-vars';
import { AppConfigService } from '../../../../providers/appconfig-service';

@Component({
    selector: 'page-setting-decimalseparator',
    templateUrl: 'decimalseparator.html'
})
export class DecimalSeparatorPage {

    moduleName = "Settings";
    headerTitle: string;
    defaultText: string;
    cancelText: string;
    doneText: string;
    separatorNote: string;
    currentValSelected: string;
    prevValSelected: string;
    data: any;

    constructor(public nav: NavController, public helper: Helper, public globalVars: GlobalVars, public appConfigService: AppConfigService) {
        this.headerTitle = helper.getPhrase("DecimalSeparator", this.moduleName);
        this.defaultText = helper.getPhrase("Default", this.moduleName);
        this.cancelText = helper.getPhrase("Cancel", this.moduleName);
        this.doneText = helper.getPhrase("Done", this.moduleName);
        this.separatorNote = helper.getPhrase("SeparatorDesc", this.moduleName);
        this.currentValSelected = globalVars.generalSettings.separator.isDefault ? "default" : globalVars.generalSettings.separator.decimal;
        this.prevValSelected = this.currentValSelected;
        this.data = [];
        globalVars.decimalSeparator.forEach((obj) => {
            obj["displayName"] = helper.getPhrase(obj.name, this.moduleName);
            this.data.push(obj);
        });
    }

    onCancel() {
        this.nav.pop();
    }

    onDone() {
        if (this.currentValSelected == "default") {
            this.globalVars.generalSettings.separator.isDefault = true;
            Globalization.getNumberPattern({ type: 'decimal' }).then(pattern => {
                let decimalseparator = pattern.decimal;
                let thousandseparator = pattern.grouping;
                if (decimalseparator != "," && decimalseparator != ".") {
                    thousandseparator = ",";
                    decimalseparator = ".";
                }
                this.globalVars.generalSettings.separator.decimal = decimalseparator;
                this.globalVars.generalSettings.separator.thousand = thousandseparator;
                this.appConfigService.setGeneralSettingsData();
                this.nav.pop();
            });
        }
        else {
            this.globalVars.generalSettings.separator.isDefault = false;
            this.globalVars.generalSettings.separator.decimal = this.currentValSelected;
            this.globalVars.generalSettings.separator.thousand = this.currentValSelected == "," ? "." : ",";
            this.appConfigService.setGeneralSettingsData();
            this.nav.pop();
        }
        this.globalVars.changedDecimalSeparator = true;
    }

    ionViewDidEnter() {
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }
}
