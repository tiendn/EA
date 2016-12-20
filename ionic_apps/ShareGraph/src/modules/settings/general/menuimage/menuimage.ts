import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Helper } from '../../../../common/helper';
import { GlobalVars } from '../../../../common/global-vars';
import { ChooseImagePage } from './chooseimage/chooseimage';

@Component({
    selector: 'page-setting-menuimage',
    templateUrl: 'menuimage.html'
})
export class MenuImagePage {
    moduleName = "Settings";
    headerTitle: string;
    menuImageHeader: string;
    chooseImageText: string;
    filePath: string;
    currentMenuImageSrc: string;

    constructor(public nav: NavController, public helper: Helper, public globalVars: GlobalVars) {
        this.headerTitle = helper.getPhrase("MenuImage", this.moduleName);
        this.menuImageHeader = this.headerTitle;
        this.chooseImageText = helper.getPhrase("ChooseNewImage", this.moduleName);
        this.filePath = "assets/company/menuimages/thumbnails/";
    }

    ionViewWillEnter() {
        this.currentMenuImageSrc = this.filePath + this.globalVars.generalSettings.menuImage + ".jpg";
    }

    ionViewDidEnter() {
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }

    changeMenuImage() {
        this.nav.push(ChooseImagePage);
    }

}
