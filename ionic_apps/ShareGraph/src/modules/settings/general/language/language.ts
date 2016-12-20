import { Component } from '@angular/core';
import { NavController,  Platform } from 'ionic-angular';
import { Globalization } from 'ionic-native';
import { Helper } from '../../../../common/helper';
import { GlobalVars } from '../../../../common/global-vars';
import { TranslationService } from '../../../../providers/translation-service';
import { AppConfigService } from '../../../../providers/appconfig-service';

@Component({
    selector: 'page-setting-language',
    templateUrl: 'language.html'
})
export class LanguagePage {
    platform: any;
    moduleName = "Settings";
    headerTitle: string;
    defaultText: string;
    cancelText: string;
    doneText: string;
    currentLangSelected: string;
    prevLangSelected: string;
    languages: any;

    constructor(platform: Platform, public nav: NavController, public helper: Helper, public globalVars: GlobalVars,
        public translationService: TranslationService, public appConfigService: AppConfigService) {
        this.platform = platform;
        this.headerTitle = helper.getPhrase("Language", this.moduleName);
        this.defaultText = helper.getPhrase("Default", this.moduleName);
        this.cancelText = helper.getPhrase("Cancel", this.moduleName);
        this.doneText = helper.getPhrase("Done", this.moduleName);
        this.currentLangSelected = globalVars.generalSettings.language.isDefault ? "default" : globalVars.generalSettings.language.value;
        this.prevLangSelected = this.currentLangSelected;
    }

    ionViewDidLoad() {
        this.languages = this.globalVars.language;
    }

    ionViewDidEnter() {
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }

    onCancel() {
        this.nav.pop();
    }

    onDone() {
        let prevLang = this.globalVars.generalSettings.language.value;
        if (this.currentLangSelected == "default") {
            this.globalVars.generalSettings.language.isDefault = true;
            if (this.globalVars.isNativeMode) {
                Globalization.getPreferredLanguage().then(lang => {
                    if (lang != null && lang.value.length > 0) {
                        this.globalVars.generalSettings.language.value = this.helper.getLanguageCode(lang.value.toLowerCase());
                    }
                    else {
                        this.globalVars.generalSettings.language.value = "en-gb";
                    }
                    this.changeLanguage(prevLang);
                });
            }
            else {
                this.globalVars.generalSettings.language.value = "en-gb";
                this.globalVars.generalSettings.language.name = "English";
                this.changeLanguage(prevLang);
            }
        }
        else {
            this.globalVars.generalSettings.language.value = this.currentLangSelected;
            this.globalVars.generalSettings.language.isDefault = false;
            let objLang = this.languages.filter(lang => lang.value.toLowerCase() == this.currentLangSelected.toLowerCase());
            if (objLang.length > 0)
                this.globalVars.generalSettings.language.name = objLang[0].name;
            this.changeLanguage(prevLang);            
        }
    }

    changeLanguage(prevLang) {
        if (prevLang != this.globalVars.generalSettings.language.value) {
            this.globalVars.changedLanguage = true;
            let oldDir = this.platform.dir();
            let lang = this.globalVars.generalSettings.language.value;
            if (lang.indexOf("zh") < 0) {
                if (lang.indexOf("-") > 0)
                    lang = lang.split("-")[0];
            }
            this.platform.setLang(lang, true);
            if (lang.indexOf("ar") >= 0) {
                this.platform.setDir("rtl");
                this.globalVars.isArabic = true;
                this.globalVars.root.menuSide = "right";
            }
            else {
                if (this.platform.isRTL())
                    this.platform.setDir("ltr");
                this.globalVars.isArabic = false;
                this.globalVars.root.menuSide = "left";
            }
            let newDir = this.platform.dir();
            this.globalVars.isChangeLayout = newDir != oldDir;
            this.translationService.load(lang).then(data => {
                this.globalVars.phrasesData = data;
                //let platform = irApp.isIOS ? "ios" : "android";
                //alert(this.helper.getPhrase("Back"));
                this.helper.setConfig("backButtonText", this.helper.getPhrase("Back"), "ios");
                this.helper.updateDateTimeConfig();
                this.appConfigService.setGeneralSettingsData();
                this.nav.pop();
            });
        }
        else {
            this.nav.pop();
        }
    }
}
