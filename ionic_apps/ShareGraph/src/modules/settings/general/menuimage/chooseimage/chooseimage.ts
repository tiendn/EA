import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Helper } from '../../../../../common/helper';
import { GlobalVars } from '../../../../../common/global-vars';
import { AppConfigService } from '../../../../../providers/appconfig-service';

@Component({
    selector: 'choose-image',
    templateUrl: 'chooseimage.html'
})
export class ChooseImagePage {
    moduleName = "Settings";
    headerTitle: string;
    cancelText: string;
    doneText: string;
    currentImage: string;
    imagesData: any;
    imageSelected: string;
    filePath: string;

    constructor(public nav: NavController, public helper: Helper, public globalVars: GlobalVars, public appConfigService: AppConfigService) {
        this.headerTitle = helper.getPhrase("MenuImage", this.moduleName);
        this.cancelText = helper.getPhrase("Cancel", this.moduleName);
        this.doneText = helper.getPhrase("Done", this.moduleName);
        this.currentImage = globalVars.generalSettings.menuImage + ".jpg";
        this.imagesData = globalVars.configData.common.menuimages;
        this.filePath = "assets/company/menuimages/thumbnails/";
        this.imageSelected = this.currentImage;
    }

    ionViewDidEnter() {
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }

    onCancel() {
        this.nav.pop();
    }

    onDone() {
        this.globalVars.generalSettings.menuImage = this.imageSelected.split(".")[0];
        this.globalVars.root.menuClass = "sidemenu-" + this.globalVars.generalSettings.menuImage;
        this.appConfigService.setGeneralSettingsData();
        this.nav.pop();
    }

    selectedImage(item) {
        this.imageSelected = item;
    }
}