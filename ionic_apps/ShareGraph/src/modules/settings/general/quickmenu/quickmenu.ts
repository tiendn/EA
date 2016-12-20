import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Helper } from '../../../../common/helper';
import { GlobalVars } from '../../../../common/global-vars';
import { SortMenuPage } from './sortmenu/sortmenu';

@Component({
    selector: 'page-setting-quickmenu',
    templateUrl: 'quickmenu.html'
})
export class QuickMenuPage {
    moduleName = "Settings";
    headerTitle: string;
    menuNote: string;
    quickMenuViewText: string;
    sortText: string;
    modules: any;
    modulesDisplayName: any;
    type: string;

    constructor(public nav: NavController,
        public helper: Helper, public globalVars: GlobalVars) {
        this.headerTitle = helper.getPhrase("QuickMenu", this.moduleName);
        this.menuNote = helper.getPhrase("QuickMenuNote", this.moduleName);
        this.quickMenuViewText = helper.getPhrase("QuickMenuView", this.moduleName);
        this.sortText = helper.getPhrase("SortOrder", this.moduleName);
        this.modules = globalVars.homepage.modules;
        this.modulesDisplayName = helper.getModuleDisplayName();
    }

    ionViewWillEnter() {
        this.type = this.globalVars.generalSettings.quickMenu.isDefault ? this.helper.getPhrase("Default", this.moduleName) : this.helper.getPhrase("Custom", this.moduleName);
        this.modules = this.globalVars.homepage.modules;
    }

    ionViewDidEnter() {
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }

    goToQuickMenuView() {
        this.nav.push(SortMenuPage);
    }

}
