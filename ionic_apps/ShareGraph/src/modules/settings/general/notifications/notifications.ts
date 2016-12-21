import { Component } from '@angular/core';
//import { NavController } from 'ionic-angular';
import { Helper } from '../../../../common/helper';
import { GlobalVars } from '../../../../common/global-vars';
import { AppConfigService } from '../../../../providers/appconfig-service';

@Component({
    selector: 'page-setting-notifications',
    templateUrl: 'notifications.html'
})
export class NotificationsPage {
    moduleName = "Settings";
    headerTitle: string;
    pushDesc: string;
    pressReleasesText: string;
    reportText: string;
    mediaText: string;
    pushPR: boolean;
    pushRP: boolean;
    pushMedia: boolean;

    constructor(public helper: Helper, public globalVars: GlobalVars, public appConfigService: AppConfigService) {
        this.headerTitle = helper.getPhrase("PushNotifications", this.moduleName);
        this.pushDesc = helper.getPhrase("PushNotificationDesc", this.moduleName);
        this.pressReleasesText = helper.getPhrase("PressReleases");
        this.reportText = helper.getPhrase("Report");
        this.mediaText = helper.getPhrase("Media");
        this.pushPR = globalVars.generalSettings.pushNotifications ? globalVars.generalSettings.pushNotifications.pressreleases : false;
        this.pushRP = globalVars.generalSettings.pushNotifications ? globalVars.generalSettings.pushNotifications.reports : false;
        this.pushMedia = globalVars.generalSettings.pushNotifications ? globalVars.generalSettings.pushNotifications.media : false;
    }

    ionViewDidEnter() {
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }

    onChange(toogle) {
        this.globalVars.generalSettings.pushNotifications = {
            pressreleases: this.pushPR,
            reports: this.pushRP,
            media: this.pushMedia
        };
        let checkedCount = toogle._form._inputs.filter(tg => tg._checked == true).length;
        if (toogle.checked) {
            if (checkedCount == 1) {
                //this.helper.createConfirm(this, this.helper.getPhrase("PushConfirmTitle", this.moduleName),
                //    this.helper.getPhrase("PushConfirmDesc", this.moduleName),
                //    this.helper.getPhrase("DontAllow", this.moduleName),
                //    this.helper.getPhrase("OK"));
                this.helper.registerPushNotifications();
            }
        }
        else {
            if (checkedCount == 0) {
                this.helper.unRegisterPushNotifications();
            }
        }
        this.appConfigService.setGeneralSettingsData();
    }
}
