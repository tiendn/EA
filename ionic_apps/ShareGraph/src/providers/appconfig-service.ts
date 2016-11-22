import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../common/global-vars';

@Injectable()
export class AppConfigService {
    data: any;
    configStorageKey = "appconfig";
    defaultSettingsStorageKey = "appdefaultsettings";
    userConfigStorageKey = "userconfig";
    appBuildVersionStorageKey = "buildversion";
    generalSettingStorageKey = "generalsettings";

    constructor(public http: Http, public storage: Storage, public globalVars: GlobalVars) { }

    //Get company data from company/settings.json
    load() {
        return new Promise(resolve => {
            this.http.get('assets/company/settings.json').subscribe(
                res => {
                    this.data = res.json();
                    resolve(this.data);
                },
                error => {
                    console.log(error);
                    resolve(null);
                }
            );
        });
    }

    //Check app version, if new => clear all storage
    checkAppVersion(buildVersion) {
        this.storage.get(this.appBuildVersionStorageKey).then(data => {
            if (data != buildVersion) {
                this.storage.clear();
                this.storage.set(this.appBuildVersionStorageKey, buildVersion);
            }
        });
    }

    //Get general settings from storage
    getGeneralSettingsData() {
        return new Promise(resolve => {
            this.storage.get(this.generalSettingStorageKey).then(data => {
                if (data != null)
                    resolve(data);
                else
                    resolve(null);
            });
        });
    }

    //Set general settings to storage
    setGeneralSettingsData() {
        if (this.globalVars.generalSettings)
            this.storage.set(this.generalSettingStorageKey, this.globalVars.generalSettings);
    }
}