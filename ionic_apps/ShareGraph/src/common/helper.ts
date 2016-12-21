import { Injectable } from '@angular/core';
import { LoadingController, ActionSheetController, PopoverController, Config, AlertController } from 'ionic-angular';
import { Push, File, ThemeableBrowser } from 'ionic-native';
import { GlobalVars } from './global-vars';
import { PopoverComponent } from '../components/popover/popover';

declare var WindowsAzure: any;

@Injectable()
export class Helper {
    dateMasks = {
        default: "ddd mmm dd yyyy HH:MM:ss",
        shortDate: "m/d/yy",
        mediumDate: "mmm d, yyyy",
        longDate: "mmmm d, yyyy",
        fullDate: "dddd, mmmm d, yyyy",
        shortTime: "h:MM TT",
        mediumTime: "h:MM:ss TT",
        longTime: "h:MM:ss TT Z",
        isoDate: "yyyy-mm-dd",
        isoTime: "HH:MM:ss",
        isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };
    arabicDigits = { "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤", "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩" };
    ISOFormatDate = "yyyy-mm-dd";
    paramDateFormat = "yyyymmdd";
    disableModulesOfflineMode = ["historicalprice", "investmentcalculator", "watchlist", "indices", "profile"];

    constructor(public config: Config, public loading: LoadingController,
        public actionSheetController: ActionSheetController,
        public popoverController: PopoverController,
        public alert: AlertController, public globalVars: GlobalVars) {
        
    }

    //Change Page
    goToModule(module, params = null) {
        if (this.userTokenHasExpired()) {//Token expired
            this.showConfirmLogin();
        }
        else {
            this.globalVars.currentModule = module.moduleName;
            if (module != null) {
                if (params != null)
                    this.globalVars.root.nav.push(module.component, params);
                else
                    this.globalVars.root.nav.push(module.component);
            }
        }
    }

    goToSettings(params = null) {
        if (params != null)
            this.globalVars.root.nav.push(this.getPage("settings"), params);
        else
            this.globalVars.root.nav.push(this.getPage("settings"));
    }

    getPage(name) {
        let moduleName = name.indexOf("report") == 0 ? "reports" : name;
        let module = this.globalVars.root.appPages.filter(module => module.name == moduleName);
        if (module.length > 0) {
            return module[0].component;
        }
        return null;
    }

    //Get Phrase By Language
    getPhrase(phraseId, module = "Common") {
        try {
            if (this.globalVars.configData.translations != null && this.globalVars.configData.translations != undefined) {
                let _module = module.toLowerCase();
                let _phraseId = phraseId.toLowerCase();
                if (this.globalVars.configData.translations[this.globalVars.generalSettings.language.value.toLowerCase()] != undefined) {
                    let customPhrase = this.globalVars.configData.translations[this.globalVars.generalSettings.language.value.toLowerCase()];
                    if (customPhrase[_module] != undefined && customPhrase[_module][_phraseId] != undefined) {
                        return customPhrase[_module][_phraseId];
                    }
                    else if (customPhrase.common != undefined && customPhrase.common[_phraseId] != undefined) {
                        return customPhrase.common[_phraseId];
                    }
                }
            }
            if (this.globalVars.phrasesData[module] != undefined && this.globalVars.phrasesData[module][phraseId] != undefined)
                return this.globalVars.phrasesData[module][phraseId];
            else {
                if (this.globalVars.phrasesData.Common[phraseId] != undefined)
                    return this.globalVars.phrasesData.Common[phraseId];
                else {
                    for (let key in this.globalVars.phrasesData.Common) {
                        if (key.toLowerCase() == phraseId) {
                            return this.globalVars.phrasesData.Common[key];
                        }
                    }
                }
            }
            return "";
        }
        catch (ex) {
            return "";
        }
    }

    // Get Language Name By LangCode
    getLanguageName() {
        let twoLetterLangName = this.globalVars.generalSettings.language.value.toLowerCase().split('-')[0];
        switch (twoLetterLangName) {
            case "en":
                return "english";
            case "de":
                return "german";
            case "es":
                return "spanish";
            case "fr":
                return "french";
            case "it":
                return "italian";
            case "nl":
                return "dutch";
            case "fi":
                return "finnish";
            case "sv":
                return "swedish";
            case "ru":
                return "russian";
            case "pl":
                return "polish";
            case "zh":
            case "cn":
            case "chs":
            case "tw":
            case "cht":
                return "chinese";
            case "ja":
                return "japanese";
            case "ko":
                return "korean";
            case "is":
                return "icelandic";
            case "da":
                return "danish";
            case "no":
            case "nb":
            case "nn":
                return "norwegian";
            case "ar":
                return "arabic";
            case "vi":
                return "vietnamese";
            default:
                return "english";
        }
    }

    //Convert date time from server format to client format
    convertJSDatePattern(pattern, isDate) {
        if (isDate) {
            if (pattern.indexOf("M") >= 0)
                pattern = pattern.replace(/M/g, 'm');
        }
        else {
            if (pattern.indexOf("m") >= 0)
                pattern = pattern.replace(/m/g, 'M');
            if (pattern.indexOf("a") >= 0)
                pattern = pattern.replace(/a/g, 'TT');
        }
        return pattern;
    }

    // Get config value from config data (settings.json)
    getConfigData(module, key, isGetByLang = false) {
        try {
            if (this.globalVars.configData[module] != undefined && this.globalVars.configData[module][key] != undefined) {
                if (!isGetByLang)
                    return this.globalVars.configData[module][key];
                else if (this.globalVars.configData[module][key][this.globalVars.generalSettings.language.value.toLowerCase()] != undefined) {
                    return this.globalVars.configData[module][key][this.globalVars.generalSettings.language.value.toLowerCase()];
                }
                else if (this.globalVars.configData[module][key]["en-gb"] != undefined) {
                    return this.globalVars.configData[module][key]["en-gb"];
                }
            }
            return "";
        }
        catch (ex) {
            return "";
        }
    }

    //Get config value by language
    getConfigValueByLang(objSetting) {
        if (objSetting[this.globalVars.generalSettings.language.value.toLowerCase()] != undefined)
            return objSetting[this.globalVars.generalSettings.language.value.toLowerCase()];
        else if (objSetting["en-gb"] != undefined)
            return objSetting["en-gb"];
        else return "";
    }

    // Get decimal digits by currency code
    getDecimalDigits(currency) {
        if (this.globalVars.configData.common.currencies != undefined) {
            let objCurrency = this.globalVars.configData.common.currencies.filter(currencyConfig => currencyConfig.code == currency);
            if (objCurrency.length > 0)
                return objCurrency[0].decimaldigits;
        }
        return 2;
    }

    //Get currency name by currency code
    getCurrencyName(code) {
        let currencyName = this.getPhrase(code, "CurrencyCode");
        if (currencyName != "" && currencyName.length > 0)
            return currencyName;
        else
            return code;
    }

    //Format number
    formatNumber(number, decimalPlaces = 2) {
        var c = decimalPlaces;
        var d = this.globalVars.generalSettings.separator.decimal;
        var t = this.globalVars.generalSettings.separator.thousand;
        c = isNaN(c = Math.abs(c)) ? 2 : c;
        d = d == undefined ? "," : d;
        t = t == undefined ? "." : t;
        var n = number, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
        var num = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - parseInt(i)).toFixed(c).slice(2) : "");
        if (this.globalVars.isArabic && this.globalVars.useEasternArabicNumbers)
            return this.convertToArabic(num);
        else
            return num;
    }

    //Convert number to Arabic digits
    convertToArabic(number) {
        var arabic = { "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤", "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩" };
        var chars = number.toString().split("");
        var newNum = new Array();
        for (var i = 0; i < chars.length; i++) {
            if (arabic[chars[i]] == undefined || arabic[chars[i]] == null)
                newNum[i] = chars[i];
            else
                newNum[i] = arabic[chars[i]];
        }
        return newNum.join("");
    }

    //Convert number from Arabic to Eng digits
    convertToEng(number) {
        var arabic = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9" };
        var chars = number.toString().split("");
        var newNum = new Array();
        for (var i = 0; i < chars.length; i++) {
            if (arabic[chars[i]] == undefined || arabic[chars[i]] == null)
                newNum[i] = chars[i];
            else
                newNum[i] = arabic[chars[i]];
        }
        return newNum.join("");
    }

    //Get market status
    //return true | false (open|close)
    getMarketStatus(marketId) {
        let date = new Date();
        let utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        let marketInfo = this.globalVars.configData.common.markets.filter(market => market.id == marketId);
        if (marketInfo.length > 0) {
            let UtcOffSet = marketInfo[0].baseutcoffset;
            // using supplied offset
            let tzOffSet = null;
            if (UtcOffSet != null && UtcOffSet != undefined) {
                tzOffSet = UtcOffSet.replace(":", ".").replace("GMT", "");
            }
            let newDate = new Date(utc + (3600000 * (tzOffSet)));
            let dayOff = null;
            if (marketInfo[0].businessdaysstot != undefined && marketInfo[0].businessdaysstot != null) {
                if (marketInfo[0].businessdaysstot)
                    dayOff = [5, 6];
                else
                    dayOff = [6, 0];
            }
            let currentDay = newDate.getDay();
            if (dayOff != null && dayOff.indexOf(currentDay) >= 0) {
                return false;
            }
            let timeByTZ = (newDate.getHours() * 60) + newDate.getMinutes();
            let marketOT = marketInfo[0].opentimelocal;
            let marketCT = marketInfo[0].closetimelocal;
            if (marketOT != undefined && marketOT != null && marketCT != undefined && marketCT != null) {
                marketOT = marketOT.split(":");
                marketOT = (parseFloat(marketOT[0]) * 60) + parseFloat(marketOT[1]);
                marketCT = marketCT.split(":");
                marketCT = (parseFloat(marketCT[0]) * 60) + parseFloat(marketCT[1]);
                if (marketOT <= timeByTZ && marketCT >= timeByTZ) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return true;
    }

    //Format date
    dateFormat(date, mask, arabicConvert = true) {
        let $scope = this;
        let utc = false;
        var token = /d{1,4}|m{1,4}|y{1,4}|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g, timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, timezoneClip = /[^-+\dA-Z]/g;
        // Regexes and supporting functions are cached through closure
        //return function (date, mask, utc) {
        //var dF = dateFormat;
        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }
        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");
        mask = String($scope.dateMasks[mask] || mask || $scope.dateMasks["default"]);
        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }
        var _ = utc ? "getUTC" : "get", d = date[_ + "Date"](), D = date[_ + "Day"](), m = date[_ + "Month"](), y = date[_ + "FullYear"](), H = date[_ + "Hours"](), M = date[_ + "Minutes"](), s = date[_ + "Seconds"](), L = date[_ + "Milliseconds"](), o = utc ? 0 : date.getTimezoneOffset(), flags = {
            d: d,
            dd: this.pad(d),
            //ddd:  dF.i18n.dayNames[D],
            //dddd: dF.i18n.dayNames[D + 7],
            ddd: this.globalVars.phrasesData.Common.DOWNames[D].slice(3),
            dddd: this.globalVars.phrasesData.Common.DOWNames[D],
            m: m + 1,
            mm: this.pad(m + 1),
            //mmm:  dF.i18n.monthNames[m],
            //mmmm: dF.i18n.monthNames[m + 12],
            mmm: this.globalVars.phrasesData.Common.MonthNamesShort[m],
            mmmm: this.globalVars.phrasesData.Common.MonthNames[m],
            y: y,
            yy: String(y).slice(2),
            yyy: String(y).slice(2),
            yyyy: y,
            h: H % 12 || 12,
            hh: this.pad(H % 12 || 12),
            H: H,
            HH: this.pad(H),
            M: M,
            MM: this.pad(M),
            s: s,
            ss: this.pad(s),
            l: this.pad(L, 3),
            L: this.pad(L > 99 ? Math.round(L / 10) : L),
            t: H < 12 ? "a" : "p",
            tt: H < 12 ? (this.globalVars.isArabic ? "ص" : "am") : (this.globalVars.isArabic ? "م" : "pm"),
            T: H < 12 ? "A" : "P",
            TT: H < 12 ? (this.globalVars.isArabic ? "ص" : "AM") : (this.globalVars.isArabic ? "م" : "PM"),
            Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
            o: (o > 0 ? "-" : "+") + this.pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
            //S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
        };
        var rDate = mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
        if (arabicConvert && this.globalVars.isArabic && this.globalVars.useEasternArabicNumbers)
            rDate = this.convertToArabic(rDate);
        return rDate
    }

    pad(val, len = 2) {
        val = String(val);
        len = len || 2;
        while (val.length < len) val = "0" + val;
        return val;
    }

    //Trigger show loading icon
    showLoading(page, cssClass = "loading-phone", dismissOnPageChange = false) {
        let loading = this.loading.create({
            content: "",
            showBackdrop: false,
            dismissOnPageChange: dismissOnPageChange,
            spinner: "ios",
            cssClass: cssClass
            //dismissOnPageChange: true
        });
        page.loading = loading;
        loading.present();
        //page.nav.present(loading);
    }

    //Trigger hide loading icon
    hideLoading(page) {
        if (page.loading) {
            page.loading.dismiss();
            page.loading = null;
        }
    }

    //Disable data backup
    setMetaDataNoBackup(entry) {
        entry.setMetadata(function () {
            //console.log("success setting metadata - DONE!");
        }, function () {
            //console.log("error setting metadata");
        }, { "com.apple.MobileBackup": 1 }
        );
    }

    //Get date format without year
    getDateFormatWithoutYear() {
        let dateFormat = this.globalVars.generalSettings.shortDateFormat.toLowerCase();
        let strPattern = '\\y';
        let regex = new RegExp(strPattern, 'g');
        if (dateFormat.indexOf("y") == 0) {
            dateFormat = dateFormat.replace(regex, '');
            dateFormat = dateFormat.substring(1, dateFormat.length);
        }
        else if (dateFormat.indexOf("y") > 0) {
            dateFormat = dateFormat.replace(regex, '');
            dateFormat = dateFormat.substring(0, dateFormat.length - 1);
        }
        return dateFormat;
    }

    //Create Share Popup For Iphone
    showSharePopup(scope, event, title = "") {
        let shareEmailText = "";
        let tweetThisText = "";
        let cancelText = "";
        if (this.globalVars.isIOS) {
            shareEmailText = this.getPhrase("SendViaEmail", "Common");
            tweetThisText = this.getPhrase("TweetThis", "Common");
            cancelText = this.getPhrase("Cancel", "Common");
        }
        else {
            shareEmailText = this.getPhrase("Mail");
            tweetThisText = this.getPhrase("Twitter");
        }
        if (this.globalVars.isTablet) {
            let popover = this.popoverController.create(PopoverComponent, {
                scope: scope,
                phrases: {
                    shareEmail: shareEmailText,
                    tweetThis: tweetThisText,
                    cancel: cancelText
                }
            }, {
                    cssClass: "irapp-share-popover"
                }
            );
            popover.present({
                ev: event
            });
        }
        else {
            let actionSheetOptions = {};
            if (this.globalVars.isIOS) {
                actionSheetOptions = {
                    buttons: [
                        {
                            text: shareEmailText,
                            handler: () => {
                                scope.sendViaEmail();
                            }
                        }, {
                            text: tweetThisText,
                            handler: () => {
                                scope.tweetThis();
                            }
                        }, {
                            text: cancelText,
                            role: 'cancel'
                        }
                    ]
                };
            }
            else {
                actionSheetOptions = {
                    title: title,
                    cssClass: "irapp-share-popup",
                    buttons: [
                        {
                            text: shareEmailText,
                            cssClass: "share-email-btn",
                            icon: "irapp-mail",
                            handler: () => {
                                scope.sendViaEmail();
                            }
                        }, {
                            text: tweetThisText,
                            icon: "irapp-twitter",
                            handler: () => {
                                scope.tweetThis();
                            }
                        }
                    ]
                };
            }
            let actionSheet = this.actionSheetController.create(actionSheetOptions);
            actionSheet.present();
        }
    }

    //Update Config
    setConfig(key, value, platform = "") {
        if (platform == "")
            this.config.set(platform, key, value);
        else
            this.config.set(key, value);
    }

    //Get Config
    getConfig(key) {
        return this.config.get(key);
    }

    updateDateTimeConfig() {
        this.setConfig("monthNames", this.globalVars.phrasesData.Common.MonthNames);
        this.setConfig("monthShortNames", this.globalVars.phrasesData.Common.MonthNamesShort);
        this.setConfig("dayNames", this.globalVars.phrasesData.Common.DOWNames);
        this.setConfig("dayShortNames", this.globalVars.phrasesData.Common.DOWNames);
    }

    //Create Alert
    createAlert(scope, title, subTitle) {
        let iAlert = this.alert.create({
            title: title,
            subTitle: subTitle,
            buttons: [
                {
                    text: this.getPhrase("OK", "Common"),
                    role: 'cancel',
                    handler: () => {
                        scope.closeAlert();
                    }
                }
            ]
        });
        iAlert.present();
    }

    //Create Confirm
    createConfirm(scope, title, subTitle, leftButtonTitle, rightButtonTitle) {
        let confirm = this.alert.create({
            title: title,
            subTitle: subTitle,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: leftButtonTitle,
                    role: 'cancel'
                    //handler: () => {
                    //    scope.closeAlert();
                    //}
                },
                {
                    text: rightButtonTitle,
                    handler: () => {
                        scope.closeConfirm();
                    }
                }
            ]
        });
        confirm.present();
    }

    //Get Chart Period By Config Value
    getDefaultChartPeriod(period) {
        switch (period) {
            case "3m": return 3;
            case "6m": return 6;
            case "1y": return 12;
            case "3y": return 36;
            default: return 1;
        }
    }

    /*Open Document By ThemeableBrowser Plugin*/
    openDocument(scope, path, title) {
        let iconPath = "assets/img/";
        let backIcon = iconPath + (this.globalVars.isArabic ? "back-arabic.png" : "back.png");
        let shareIcon = iconPath + "share.png";

        let options = {
            statusbar: {
                color: this.globalVars.configData.common.headercolor
            },
            toolbar: {
                height: 44,
                color: this.globalVars.configData.common.headercolor
            },
            title: {
                color: '#ffffff',
                showPageTitle: true,
                staticText: title
            },
            backButton: {
                wwwImage: backIcon,
                wwwImagePressed: backIcon,
                //wwwImageDestiny: 1,
                align: this.globalVars.isArabic ? 'right' : 'left',
                event: 'backPressed'
            },
            menu: {
                wwwImage: shareIcon,
                wwwImagePressed: shareIcon,
                //wwwImageDestiny: 2,
                align: this.globalVars.isArabic ? 'left' : 'right',
                cancel: this.getPhrase("Cancel"),
                items: [
                    {
                        event: 'sendEmail',
                        label: this.getPhrase("SendViaEmail")
                    },
                    {
                        event: 'shareTweet',
                        label: this.getPhrase("TweetThis")
                    }
                ]
            },
            backButtonCanClose: true
        };

        let view = new ThemeableBrowser(path, '_blank', options);

        view.on("backPressed").subscribe(data =>{
            scope.onBackFromDocView();
        });

        view.on("sendEmail").subscribe(data =>{
            if (this.globalVars.isOnline)
               scope.sendEmail();
        });

        view.on("shareTweet").subscribe(data =>{
            if (this.globalVars.isOnline) {
               view.close();
               scope.shareTweet();
           }
        });
    }

    //Get Module Display Name
    getDisplayModuleName(module) {
        if (module.indexOf("report") >= 0 && this.globalVars.configData.report) {
            let rpModule = this.globalVars.configData.report.filter(data => data.module == module);
            if (rpModule.length > 0 && rpModule[0].phraseid && rpModule[0].phraseid != null)
                return this.getPhrase(rpModule[0].phraseid.split("/")[1], rpModule[0].phraseid.split("/")[0]);
        }
        return this.getPhrase(module, "Common");
    }

    //Get language code
    getLanguageCode(lang) {
        let config_language = this.globalVars.language.filter(objLang => objLang.value == lang);
        if (config_language.length > 0)
            return lang;
        else {
            if (lang.indexOf("zh") >= 0)
                return "zh-cn";
            else {
                if (lang.length > 2 && lang.indexOf("-") > 0) {
                    lang = lang.split("-")[0];
                }
                let filterLang = this.globalVars.language.filter(objLang => objLang.value.indexOf(lang) == 0);
                if (filterLang.length > 0)
                    return filterLang[0].value;
                else
                    return "en-gb";
            }
        }
    }

    /*
     * Description: Function get index of object from list of object
     * Author: khanh.tx@euroland.com
     * Date: Oct 03, 2016
     */
    indexOfObject(list, obj) {
        var len = list.length;

        for (var i = 0; i < len; i++) {
            var keys = Object.keys(list[i]);
            var flg = true;
            for (var j = 0; j < keys.length; j++) {
                var value = list[i][keys[j]];
                if (obj[keys[j]] !== value) {
                    flg = false;
                }
            }
            if (flg == true) {
                return i;
            }
        }
        return -1;
    }
    /*
     * Function is used to exclude some list item form source list item
     * Author: khanh.tx@euroland.com
     * Date: Oct 03, 2016
     */
    excludeListObject(sourceList, excludeList) {
        var $scope = this;
        if (excludeList) {
            excludeList.forEach(function (item) {
                var index = $scope.indexOfObject(sourceList, item);
                if (index >= 0) {
                    sourceList.splice(index, 1);
                }
            })
        }
        return sourceList;
    }

    //Check expires token
    userTokenHasExpired() {
        return this.globalVars.user != null && this.globalVars.user[".expires"] && new Date(this.globalVars.user[".expires"]) < new Date();
    }
    checkTokenExpired() {
        if (this.userTokenHasExpired()) {
            this.showConfirmLogin();
        }
    }
    showConfirmLogin() {
        let expiredAlert = this.alert.create({
            title: this.getPhrase("TokenExpired", "Settings"),
            message: this.getPhrase("TokenExpiredDesc", "Settings"),
            buttons: [
                {
                    text: this.getPhrase("OK"),
                    role: 'cancel',
                    handler: () => {
                        this.globalVars.homepage.navCtrl.push(this.getPage("signin"));
                        //this.nav.push(SignInPage);
                    }
                }
            ]
        });
        expiredAlert.present();
    }

    /*Register push notifications*/
    registerPushNotifications(tags = "") {
        if (this.globalVars.isNativeMode) {
           //Register push notification
           let push = Push.init({
               android: {
                   senderID: '546128565693'
               },
               ios: {
                   alert: 'true',
                   badge: true,
                   sound: 'true'
               },
               windows: {}
           });

           push.on('registration', (data) => {
               console.log(data.registrationId);
           });

           push.on('notification', (data) => {
               console.log(data);
           });

           push.on('error', (error) => {
               console.log(error.message);
           });

           //Set glolbal variable
           this.globalVars.push = push;

           //Register Azure Notification Hub
           var connectionString = "Endpoint=sb://eurolandtesthub-ns.servicebus.windows.net/;SharedAccessKeyName=DefaultListenSharedAccessSignature;SharedAccessKey=JWhkaab3Qjnko8Tm3huYuB8jOQooXez/K24t2IbN0VA=",
               notificationHubPath = "eurolandtesthub";

           var hub = new WindowsAzure.Messaging.NotificationHub(notificationHubPath, connectionString);

           hub.registerApplicationAsync(tags).then((result) => {
               console.log("Registration successful: " + result.registrationId);
           });

           //Set glolbal variable
           this.globalVars.hub = hub;
        }
    }

    /*UnRegister push notifications*/
    unRegisterPushNotifications() {
        if (this.globalVars.push) {
            this.globalVars.push.unregister(() => {
                console.log('success');
            }, () => {
                console.log('error');
            });
        }
        if (this.globalVars.hub) {
            this.globalVars.hub.unregisterApplicationAsync();
        }
    }

    //Get Module DisplayName
    getModuleDisplayName() {
        let modulesName = {};
        for (let key in this.globalVars.configData.common.modules) {
            modulesName[key] = this.getDisplayModuleName(key);
        }
        this.globalVars.root.modulesDisplayName = modulesName;
        return modulesName;
    }

    //Open external link
    openExternalLink(url) {
        window.open(url, '_system');
    }

    /*Create Folder for module*/
    createFolder(folderName) {
        File.createDir(this.globalVars.appPath, folderName, false).then(entry => {
            this.setMetaDataNoBackup(entry);
        },
        (error) =>{
            //console.log(error);
        });
    }

    /*Create Multi Folders*/
    createTreeFolder(folders, path = "") {
        if (folders.length > 0) {
            let item = folders[0];
            folders.splice(0, 1);
            if (path == "") path = this.globalVars.appPath;
            if (item instanceof Array) {
                item.forEach((value) => {
                    File.createDir(path, value, false).then(entry => {
                        this.setMetaDataNoBackup(entry);
                    },
                    (error) => {
                        //console.log(error);
                    });
                });
                this.createTreeFolder(folders, path);
            }
            else {
                File.createDir(path, item, false).then(entry => {
                    this.setMetaDataNoBackup(entry);
                    this.createTreeFolder(folders, path + item);
                },
                (error) => {
                    this.createTreeFolder(folders, path + item);
                });
            }
        }
    }

    /*Get Display Date For Calendar Event*/
    getEventDisplayDate(eventData, dateFormat) {
        let displayDate = "";
        if (eventData.DateType == 1) {
            if (eventData.IsAllDayEvent) {
                let strEventDate = eventData.EventDate.split("T")[0].split("-");
                let eventDate = new Date(strEventDate[0], parseFloat(strEventDate[1]) - 1, strEventDate[2]);
                displayDate = this.dateFormat(eventDate, dateFormat) + " " + this.getPhrase("AllDay", "Calendar");
            }
            else {
                let eventDate = new Date(eventData.EventDate);
                displayDate = this.dateFormat(eventDate, dateFormat + " " + this.globalVars.generalSettings.timeFormat);
            }
        }
        else {
            let strEventDate = eventData.EventDate.split("T")[0].split("-");
            let strEndDate = eventData.EventEndDate.split("T")[0].split("-");
            let eventDate = new Date(strEventDate[0], parseFloat(strEventDate[1]) - 1, strEventDate[2]);
            let endDate = new Date(strEndDate[0], parseFloat(strEndDate[1]) - 1, strEndDate[2]);
            displayDate = this.dateFormat(eventDate, dateFormat);
            if (endDate > eventDate)
                displayDate += " - " + this.dateFormat(endDate, dateFormat);
            else
                displayDate += " " + this.getPhrase("AllDay", "Calendar");
        }
        return displayDate;
    }
    
    /**Offline Mess*/
    createOffileMess() {
        let offlineMess = "<div class='offline-mess'><span>No internet connection</span></div>";
        let offlineBackDrop = "<div class='offline-backdrop'></div>";
        if (this.globalVars.currentModule == "watchlist" || this.globalVars.currentModule == "indices") {
            let tabs = document.getElementsByTagName("ion-tabs");
            if (tabs.length > 0) {
                tabs[0].insertAdjacentHTML("beforeend", offlineBackDrop);
                tabs[0].insertAdjacentHTML("beforeend", offlineMess);
            }
        }
        else {
            let pages = document.getElementsByClassName("show-page");
            let activePage = pages[pages.length - 1];
            if (activePage.getElementsByClassName("offline-mess").length == 0) {
                activePage.getElementsByTagName("ion-header")[0].insertAdjacentHTML("beforeend", offlineMess);
            }
            if (this.disableModulesOfflineMode.indexOf(this.globalVars.currentModule) >= 0 && activePage.getElementsByClassName("offline-backdrop").length == 0) {
                let scrollContent = activePage.getElementsByClassName("scroll-content");
                if (scrollContent.length > 0)
                    scrollContent[scrollContent.length - 1].insertAdjacentHTML("beforeend", offlineBackDrop);
            }
        }
    }

    removeOffileMess() {
        let lstMess = document.getElementsByClassName("offline-mess");
        while (lstMess.length > 0) {
            lstMess[0].parentElement.removeChild(lstMess[0]);
        }
        let lstBackdrop = document.getElementsByClassName("offline-backdrop");
        while (lstBackdrop.length > 0) {
            lstBackdrop[0].parentElement.removeChild(lstBackdrop[0]);
        }
        //if (this.globalVars.currentModule == "home") {
        //    this.globalVars.homepage.getTickerData();
        //}
    }

    checkAppStatus() {
        if (this.globalVars.activePage)
            this.globalVars.activePage.isOnline = this.globalVars.isOnline;
        setTimeout(() => {
            if (this.globalVars.isOnline)
                this.removeOffileMess();
            else
                this.createOffileMess();
        }, 200);
    }

    getAuthMessage(messId) {
        if (this.globalVars.authErrorMessage[messId])
            return this.getPhrase(this.globalVars.authErrorMessage[messId], "Settings");
        else
            return "";
    }

    //Date Picker
    setDatePickerOptions(target) {
        target.monthNames = this.globalVars.phrasesData.Common.MonthNames;
        target.monthShortNames = this.globalVars.phrasesData.Common.MonthNamesShort;
        target.dayNames = this.globalVars.phrasesData.Common.DOWNames;
        target.dayShortNames = this.globalVars.phrasesData.Common.DOWNames;
        if (this.globalVars.isArabic) {
            let dayValues = [];
            let i = 0;
            while (i < 32) {
                i++;
                //dayValues.push(this.formatNumber(i, 0));
                dayValues.push(i.toString());
            }
            target.dayValues = dayValues;
        }
    }

    getDatePickerFormat(){
        let currentFormat = this.globalVars.generalSettings.shortDateFormat.toLowerCase();
        if(currentFormat.indexOf("y") == currentFormat.lastIndexOf("y"))
            currentFormat = currentFormat.replace("y","yyyy");
        return currentFormat.toUpperCase();
    }
}