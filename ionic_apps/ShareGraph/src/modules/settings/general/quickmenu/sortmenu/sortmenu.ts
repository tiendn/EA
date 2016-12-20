import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Helper } from '../../../../../common/helper';
import { GlobalVars } from '../../../../../common/global-vars';
import { AppConfigService } from '../../../../../providers/appconfig-service';

@Component({
    selector: 'sort-menu',
    templateUrl: 'sortmenu.html'
})
export class SortMenuPage {
    moduleName = "Settings";
    headerTitle: string;
    defaultText: string;
    customText: string;
    sortMenuNote: string;
    showCustomBlock: boolean;
    currentSelected: string;
    noOfItem: number;
    modulesDisplayName: string;
    modules: any;

    constructor(public nav: NavController, public helper: Helper, public globalVars: GlobalVars, public appConfigService: AppConfigService) {
        this.headerTitle = helper.getPhrase("SortOrder", this.moduleName);
        this.defaultText = helper.getPhrase("Default", this.moduleName);
        this.customText = helper.getPhrase("Custom", this.moduleName);
        this.sortMenuNote = helper.getPhrase("CustomNote", this.moduleName);
        this.showCustomBlock = false;
        this.currentSelected = globalVars.generalSettings.quickMenu.isDefault ? "default" : "custom";
        this.noOfItem = globalVars.isIpad ? 7 : 5;
        this.getAllModule();
        this.modulesDisplayName = globalVars.root.modulesDisplayName;
    }

    ionViewDidEnter() {
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }

    getAllModule() {
        let allModules = this.globalVars.root.leftMenuModules.slice();
        let quickMenuModules = [];
        if (this.globalVars.generalSettings.quickMenu.customOrder.length > 0)
            quickMenuModules = this.globalVars.generalSettings.quickMenu.customOrder.slice();
        else
            quickMenuModules = this.globalVars.generalSettings.quickMenu.defaultOrder.slice();
        allModules.forEach(function (obj, index) {
            let module = quickMenuModules.filter(mol => mol.moduleName == obj.moduleName);
            if (module.length == 0)
                quickMenuModules.push(obj);
        });
        this.modules = quickMenuModules;
    }

    radioChange(value) {
        this.currentSelected = value;
        if (value == "default") {
            this.globalVars.generalSettings.quickMenu.isDefault = true;
            this.globalVars.homepage.modules = this.globalVars.generalSettings.quickMenu.defaultOrder;
        }
        else {
            this.globalVars.generalSettings.quickMenu.isDefault = false;
            this.setCustomQuickMenu();
        }
        this.appConfigService.setGeneralSettingsData();
    }

    reorderItems(indexes) {
        let element = this.modules[indexes.from];
        this.modules.splice(indexes.from, 1);
        this.modules.splice(indexes.to, 0, element);
        this.setCustomQuickMenu();
        this.appConfigService.setGeneralSettingsData();
    }

    setCustomQuickMenu() {
        let currentModules = this.modules.slice();
        this.globalVars.homepage.modules = currentModules.slice(0, this.noOfItem);
        this.globalVars.generalSettings.quickMenu.customOrder = this.globalVars.homepage.modules;
    }
}
