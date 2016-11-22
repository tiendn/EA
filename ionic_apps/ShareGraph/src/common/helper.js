"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var popover_1 = require('../components/popover/popover');
//import {SignInPage} from '../pages/settings/profile/account/signin/signin';
var Helper = (function () {
    function Helper(config, loading, actionSheetController, popoverController, alert, globalVars) {
        this.config = config;
        this.loading = loading;
        this.actionSheetController = actionSheetController;
        this.popoverController = popoverController;
        this.alert = alert;
        this.globalVars = globalVars;
        this.dateMasks = {
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
        this.arabicDigits = { "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤", "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩" };
        this.ISOFormatDate = "yyyy-mm-dd";
        this.paramDateFormat = "yyyymmdd";
        this.disableModulesOfflineMode = ["historicalprice", "investmentcalculator", "watchlist", "indices", "profile"];
    }
    //Change Page
    Helper.prototype.goToModule = function (module, params) {
        if (params === void 0) { params = null; }
        if (this.userTokenHasExpired()) {
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
    };
    Helper.prototype.goToSettings = function (params) {
        if (params === void 0) { params = null; }
        if (params != null)
            this.globalVars.root.nav.push(this.getPage("settings"), params);
        else
            this.globalVars.root.nav.push(this.getPage("settings"));
    };
    Helper.prototype.getPage = function (name) {
        var moduleName = name.indexOf("report") == 0 ? "reports" : name;
        var module = this.globalVars.root.appPages.filter(function (module) { return module.name == moduleName; });
        if (module.length > 0) {
            return module[0].component;
        }
        return null;
    };
    //Get Phrase By Language
    Helper.prototype.getPhrase = function (phraseId, module) {
        if (module === void 0) { module = "Common"; }
        try {
            if (this.globalVars.configData.translations != null && this.globalVars.configData.translations != undefined) {
                var _module = module.toLowerCase();
                var _phraseId = phraseId.toLowerCase();
                if (this.globalVars.configData.translations[this.globalVars.generalSettings.language.value.toLowerCase()] != undefined) {
                    var customPhrase = this.globalVars.configData.translations[this.globalVars.generalSettings.language.value.toLowerCase()];
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
                    for (var key in this.globalVars.phrasesData.Common) {
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
    };
    // Get Language Name By LangCode
    Helper.prototype.getLanguageName = function () {
        var twoLetterLangName = this.globalVars.generalSettings.language.value.toLowerCase().split('-')[0];
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
    };
    //Convert date time from server format to client format
    Helper.prototype.convertJSDatePattern = function (pattern, isDate) {
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
    };
    // Get config value from config data (settings.json)
    Helper.prototype.getConfigData = function (module, key, isGetByLang) {
        if (isGetByLang === void 0) { isGetByLang = false; }
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
    };
    //Get config value by language
    Helper.prototype.getConfigValueByLang = function (objSetting) {
        if (objSetting[this.globalVars.generalSettings.language.value.toLowerCase()] != undefined)
            return objSetting[this.globalVars.generalSettings.language.value.toLowerCase()];
        else if (objSetting["en-gb"] != undefined)
            return objSetting["en-gb"];
        else
            return "";
    };
    // Get decimal digits by currency code
    Helper.prototype.getDecimalDigits = function (currency) {
        if (this.globalVars.configData.common.currencies != undefined) {
            var objCurrency = this.globalVars.configData.common.currencies.filter(function (currencyConfig) { return currencyConfig.code == currency; });
            if (objCurrency.length > 0)
                return objCurrency[0].decimaldigits;
        }
        return 2;
    };
    //Get currency name by currency code
    Helper.prototype.getCurrencyName = function (code) {
        var currencyName = this.getPhrase(code, "CurrencyCode");
        if (currencyName != "" && currencyName.length > 0)
            return currencyName;
        else
            return code;
    };
    //Format number
    Helper.prototype.formatNumber = function (number, decimalPlaces) {
        if (decimalPlaces === void 0) { decimalPlaces = 2; }
        var c = decimalPlaces;
        var d = this.globalVars.generalSettings.separator.decimal;
        var t = this.globalVars.generalSettings.separator.thousand;
        var n = number, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
        var num = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - parseInt(i)).toFixed(c).slice(2) : "");
        if (this.globalVars.isArabic && this.globalVars.useEasternArabicNumbers)
            return this.convertToArabic(num);
        else
            return num;
    };
    //Convert number to Arabic digits
    Helper.prototype.convertToArabic = function (number) {
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
    };
    //Convert number from Arabic to Eng digits
    Helper.prototype.convertToEng = function (number) {
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
    };
    //Get market status
    //return true | false (open|close)
    Helper.prototype.getMarketStatus = function (marketId) {
        var date = new Date();
        var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        var marketInfo = this.globalVars.configData.common.markets.filter(function (market) { return market.id == marketId; });
        if (marketInfo.length > 0) {
            var UtcOffSet = marketInfo[0].baseutcoffset;
            // using supplied offset
            var tzOffSet = null;
            if (UtcOffSet != null && UtcOffSet != undefined) {
                tzOffSet = UtcOffSet.replace(":", ".").replace("GMT", "");
            }
            var newDate = new Date(utc + (3600000 * (tzOffSet)));
            var dayOff = null;
            if (marketInfo[0].businessdaysstot != undefined && marketInfo[0].businessdaysstot != null) {
                if (marketInfo[0].businessdaysstot)
                    dayOff = [5, 6];
                else
                    dayOff = [6, 0];
            }
            var currentDay = newDate.getDay();
            if (dayOff != null && dayOff.indexOf(currentDay) >= 0) {
                return false;
            }
            var timeByTZ = (newDate.getHours() * 60) + newDate.getMinutes();
            var marketOT = marketInfo[0].opentimelocal;
            var marketCT = marketInfo[0].closetimelocal;
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
    };
    //Format date
    Helper.prototype.dateFormat = function (date, mask, arabicConvert) {
        if (arabicConvert === void 0) { arabicConvert = true; }
        var $scope = this;
        var utc = false;
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
        if (isNaN(date))
            throw SyntaxError("invalid date");
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
        };
        var rDate = mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
        if (arabicConvert && this.globalVars.isArabic && this.globalVars.useEasternArabicNumbers)
            rDate = this.convertToArabic(rDate);
        return rDate;
    };
    Helper.prototype.pad = function (val, len) {
        if (len === void 0) { len = 2; }
        val = String(val);
        len = len || 2;
        while (val.length < len)
            val = "0" + val;
        return val;
    };
    //Trigger show loading icon
    Helper.prototype.showLoading = function (page, cssClass, dismissOnPageChange) {
        if (cssClass === void 0) { cssClass = "loading-phone"; }
        if (dismissOnPageChange === void 0) { dismissOnPageChange = false; }
        var loading = this.loading.create({
            content: "",
            showBackdrop: false,
            dismissOnPageChange: dismissOnPageChange,
            spinner: "ios",
            cssClass: cssClass
        });
        page.loading = loading;
        loading.present();
        //page.nav.present(loading);
    };
    //Trigger hide loading icon
    Helper.prototype.hideLoading = function (page) {
        if (page.loading) {
            page.loading.dismiss();
            page.loading = null;
        }
    };
    //Disable data backup
    Helper.prototype.setMetaDataNoBackup = function (entry) {
        entry.setMetadata(function () {
            //console.log("success setting metadata - DONE!");
        }, function () {
            //console.log("error setting metadata");
        }, { "com.apple.MobileBackup": 1 });
    };
    //Get date format without year
    Helper.prototype.getDateFormatWithoutYear = function () {
        var dateFormat = this.globalVars.generalSettings.shortDateFormat.toLowerCase();
        var strPattern = '\\y';
        var regex = new RegExp(strPattern, 'g');
        if (dateFormat.indexOf("y") == 0) {
            dateFormat = dateFormat.replace(regex, '');
            dateFormat = dateFormat.substring(1, dateFormat.length);
        }
        else if (dateFormat.indexOf("y") > 0) {
            dateFormat = dateFormat.replace(regex, '');
            dateFormat = dateFormat.substring(0, dateFormat.length - 1);
        }
        return dateFormat;
    };
    //Create Share Popup For Iphone
    Helper.prototype.showSharePopup = function (scope, event) {
        var shareEmailText = this.getPhrase("SendViaEmail", "Common");
        var tweetThisText = this.getPhrase("TweetThis", "Common");
        var cancelText = this.getPhrase("Cancel", "Common");
        if (this.globalVars.isTablet) {
            var popover = this.popoverController.create(popover_1.PopoverComponent, {
                scope: scope,
                phrases: {
                    shareEmail: shareEmailText,
                    tweetThis: tweetThisText,
                    cancel: cancelText
                }
            }, {
                cssClass: "irapp-share-popover"
            });
            popover.present({
                ev: event
            });
        }
        else {
            var actionSheet = this.actionSheetController.create({
                buttons: [
                    {
                        text: shareEmailText,
                        handler: function () {
                            scope.sendViaEmail();
                        }
                    }, {
                        text: tweetThisText,
                        handler: function () {
                            scope.tweetThis();
                        }
                    }, {
                        text: cancelText,
                        role: 'cancel'
                    }
                ]
            });
            actionSheet.present();
        }
    };
    //Update Config
    Helper.prototype.setConfig = function (key, value, platform) {
        if (platform === void 0) { platform = ""; }
        if (platform == "")
            this.config.set(platform, key, value);
        else
            this.config.set(key, value);
    };
    //Get Config
    Helper.prototype.getConfig = function (key) {
        return this.config.get(key);
    };
    Helper.prototype.updateDateTimeConfig = function () {
        this.setConfig("monthNames", this.globalVars.phrasesData.Common.MonthNames);
        this.setConfig("monthShortNames", this.globalVars.phrasesData.Common.MonthNamesShort);
        this.setConfig("dayNames", this.globalVars.phrasesData.Common.DOWNames);
        this.setConfig("dayShortNames", this.globalVars.phrasesData.Common.DOWNames);
    };
    //Create Alert
    Helper.prototype.createAlert = function (scope, title, subTitle) {
        var iAlert = this.alert.create({
            title: title,
            subTitle: subTitle,
            buttons: [
                {
                    text: this.getPhrase("OK", "Common"),
                    role: 'cancel',
                    handler: function () {
                        scope.closeAlert();
                    }
                }
            ]
        });
        iAlert.present();
    };
    //Create Confirm
    Helper.prototype.createConfirm = function (scope, title, subTitle, leftButtonTitle, rightButtonTitle) {
        var confirm = this.alert.create({
            title: title,
            subTitle: subTitle,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: leftButtonTitle,
                    role: 'cancel'
                },
                {
                    text: rightButtonTitle,
                    handler: function () {
                        scope.closeConfirm();
                    }
                }
            ]
        });
        confirm.present();
    };
    //Get Chart Period By Config Value
    Helper.prototype.getDefaultChartPeriod = function (period) {
        switch (period) {
            case "3m": return 3;
            case "6m": return 6;
            case "1y": return 12;
            case "3y": return 36;
            default: return 1;
        }
    };
    /*Open Document By ThemeableBrowser Plugin*/
    Helper.prototype.openDocument = function (scope, path, title) {
        //let iconPath = "src/img/";
        //let backIcon = iconPath + (irApp.isArabic ? "back-arabic.png" : "back.png");
        //let shareIcon = iconPath + "share.png";
        //let view = cordova.ThemeableBrowser.open(path, '_blank', {
        //    statusbar: {
        //        color: irApp.configData.common.headercolor
        //    },
        //    toolbar: {
        //        height: 44,
        //        color: irApp.configData.common.headercolor
        //    },
        //    title: {
        //        color: '#ffffff',
        //        showPageTitle: true,
        //        staticText: title
        //    },
        //    backButton: {
        //        wwwImage: backIcon,
        //        wwwImagePressed: backIcon,
        //        //wwwImageDestiny: 1,
        //        align: irApp.isArabic ? 'right' : 'left',
        //        event: 'backPressed'
        //    },
        //    menu: {
        //        wwwImage: shareIcon,
        //        wwwImagePressed: shareIcon,
        //        //wwwImageDestiny: 2,
        //        align: irApp.isArabic ? 'left' : 'right',
        //        cancel: this.getPhrase("Cancel"),
        //        items: [
        //            {
        //                event: 'sendEmail',
        //                label: this.getPhrase("SendViaEmail")
        //            },
        //            {
        //                event: 'shareTweet',
        //                label: this.getPhrase("TweetThis")
        //            }
        //        ]
        //    },
        //    backButtonCanClose: true
        //}).addEventListener('backPressed', function (e) {
        //    scope.onBackFromDocView();
        //}).addEventListener('sendEmail', function (e) {
        //    if (irApp.isOnline)
        //        scope.sendEmail();
        //}).addEventListener('shareTweet', function (e) {
        //    if (irApp.isOnline) {
        //        view.close();
        //        scope.shareTweet();
        //    }
        //}).addEventListener(cordova.ThemeableBrowser.EVT_ERR, function (e) {
        //    console.error(e.message);
        //}).addEventListener(cordova.ThemeableBrowser.EVT_WRN, function (e) {
        //    console.log(e.message);
        //});
    };
    //Get Module Display Name
    Helper.prototype.getDisplayModuleName = function (module) {
        if (module.indexOf("report") >= 0 && this.globalVars.configData.report) {
            var rpModule = this.globalVars.configData.report.filter(function (data) { return data.module == module; });
            if (rpModule.length > 0 && rpModule[0].phraseid && rpModule[0].phraseid != null)
                return this.getPhrase(rpModule[0].phraseid.split("/")[1], rpModule[0].phraseid.split("/")[0]);
        }
        return this.getPhrase(module, "Common");
    };
    //Get language code
    Helper.prototype.getLanguageCode = function (lang) {
        var config_language = this.globalVars.language.filter(function (objLang) { return objLang.value == lang; });
        if (config_language.length > 0)
            return lang;
        else {
            if (lang.indexOf("zh") >= 0)
                return "zh-cn";
            else {
                if (lang.length > 2 && lang.indexOf("-") > 0) {
                    lang = lang.split("-")[0];
                }
                var filterLang = this.globalVars.language.filter(function (objLang) { return objLang.value.indexOf(lang) == 0; });
                if (filterLang.length > 0)
                    return filterLang[0].value;
                else
                    return "en-gb";
            }
        }
    };
    /*
     * Description: Function get index of object from list of object
     * Author: khanh.tx@euroland.com
     * Date: Oct 03, 2016
     */
    Helper.prototype.indexOfObject = function (list, obj) {
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
    };
    /*
     * Function is used to exclude some list item form source list item
     * Author: khanh.tx@euroland.com
     * Date: Oct 03, 2016
     */
    Helper.prototype.excludeListObject = function (sourceList, excludeList) {
        var $scope = this;
        if (excludeList) {
            excludeList.forEach(function (item) {
                var index = $scope.indexOfObject(sourceList, item);
                if (index >= 0) {
                    sourceList.splice(index, 1);
                }
            });
        }
        return sourceList;
    };
    //Check expires token
    Helper.prototype.userTokenHasExpired = function () {
        return this.globalVars.user != null && this.globalVars.user[".expires"] && new Date(this.globalVars.user[".expires"]) < new Date();
    };
    Helper.prototype.checkTokenExpired = function () {
        if (this.userTokenHasExpired()) {
            this.showConfirmLogin();
        }
    };
    Helper.prototype.showConfirmLogin = function () {
        //let expiredAlert = this.alert.create({
        //    title: this.getPhrase("TokenExpired", "Settings"),
        //    message: this.getPhrase("TokenExpiredDesc", "Settings"),
        //    buttons: [
        //        {
        //            text: this.getPhrase("OK"),
        //            role: 'cancel',
        //            handler: () => {
        //                irApp.homepage.nav.push(SignInPage);
        //            }
        //        }
        //    ]
        //});
        //expiredAlert.present();
    };
    /*Register push notifications*/
    Helper.prototype.registerPushNotifications = function (tags) {
        //if (window.cordova) {
        //    //Register push notification
        //    let push = Push.init({
        //        android: {
        //            senderID: '546128565693'
        //        },
        //        ios: {
        //            alert: 'true',
        //            badge: true,
        //            sound: 'true'
        //        },
        //        windows: {}
        //    });
        if (tags === void 0) { tags = ""; }
        //    push.on('registration', (data) => {
        //        console.log(data.registrationId);
        //    });
        //    push.on('notification', (data) => {
        //        console.log(data);
        //    });
        //    push.on('error', (error) => {
        //        console.log(error.message);
        //    });
        //    //Set glolbal variable
        //    irApp.push = push;
        //    //Register Azure Notification Hub
        //    var connectionString = "Endpoint=sb://eurolandtesthub-ns.servicebus.windows.net/;SharedAccessKeyName=DefaultListenSharedAccessSignature;SharedAccessKey=JWhkaab3Qjnko8Tm3huYuB8jOQooXez/K24t2IbN0VA=",
        //        notificationHubPath = "eurolandtesthub";
        //    var hub = new WindowsAzure.Messaging.NotificationHub(notificationHubPath, connectionString);
        //    hub.registerApplicationAsync(tags).then((result) => {
        //        console.log("Registration successful: " + result.registrationId);
        //    });
        //    //Set glolbal variable
        //    irApp.hub = hub;
        //}
    };
    /*UnRegister push notifications*/
    Helper.prototype.unRegisterPushNotifications = function () {
        if (this.globalVars.push) {
            this.globalVars.push.unregister(function () {
                console.log('success');
            }, function () {
                console.log('error');
            });
        }
        if (this.globalVars.hub) {
            this.globalVars.hub.unregisterApplicationAsync();
        }
    };
    //Get Module DisplayName
    Helper.prototype.getModuleDisplayName = function () {
        var modulesName = {};
        for (var key in this.globalVars.configData.common.modules) {
            modulesName[key] = this.getDisplayModuleName(key);
        }
        this.globalVars.root.modulesDisplayName = modulesName;
        return modulesName;
    };
    //Open external link
    Helper.prototype.openExternalLink = function (url) {
        //alert(url);
        //let browser = new InAppBrowser(url, '_system');
        var browser = window.open(url, '_system');
    };
    /*Create Folder for module*/
    Helper.prototype.createFolder = function (folderName) {
        var $scope = this;
        if (this.globalVars.rootEntry != null) {
            this.globalVars.rootEntry.getDirectory(folderName, {
                create: true,
                exclusive: true
            }, function (entry) {
                $scope.setMetaDataNoBackup(entry);
            }, function () { });
        }
    };
    /*Get Display Date For Calendar Event*/
    Helper.prototype.getEventDisplayDate = function (eventData, dateFormat) {
        var displayDate = "";
        if (eventData.DateType == 1) {
            if (eventData.IsAllDayEvent) {
                var strEventDate = eventData.EventDate.split("T")[0].split("-");
                var eventDate = new Date(strEventDate[0], parseFloat(strEventDate[1]) - 1, strEventDate[2]);
                displayDate = this.dateFormat(eventDate, dateFormat) + " " + this.getPhrase("AllDay", "Calendar");
            }
            else {
                var eventDate = new Date(eventData.EventDate);
                displayDate = this.dateFormat(eventDate, dateFormat + " " + this.globalVars.generalSettings.timeFormat);
            }
        }
        else {
            var strEventDate = eventData.EventDate.split("T")[0].split("-");
            var strEndDate = eventData.EventEndDate.split("T")[0].split("-");
            var eventDate = new Date(strEventDate[0], parseFloat(strEventDate[1]) - 1, strEventDate[2]);
            var endDate = new Date(strEndDate[0], parseFloat(strEndDate[1]) - 1, strEndDate[2]);
            displayDate = this.dateFormat(eventDate, dateFormat);
            if (endDate > eventDate)
                displayDate += " - " + this.dateFormat(endDate, dateFormat);
            else
                displayDate += " " + this.getPhrase("AllDay", "Calendar");
        }
        return displayDate;
    };
    /*Create Multi Folders*/
    Helper.prototype.createTreeFolder = function (folders, entry) {
        if (entry === void 0) { entry = null; }
        if (this.globalVars.rootEntry != null) {
            var $scope_1 = this;
            if (folders.length > 0) {
                var item_1 = folders[0];
                folders.splice(0, 1);
                if (entry == null)
                    entry = this.globalVars.rootEntry;
                if (Array.isArray(item_1)) {
                    item_1.forEach(function (value) {
                        entry.getDirectory(value, {
                            create: true,
                            exclusive: true
                        }, function (cEntry) {
                            $scope_1.setMetaDataNoBackup(cEntry);
                        }, function (error) {
                        });
                    });
                    $scope_1.createTreeFolder(folders, entry);
                }
                else {
                    entry.getDirectory(item_1, {
                        create: true,
                        exclusive: true
                    }, function (cEntry) {
                        $scope_1.setMetaDataNoBackup(cEntry);
                        $scope_1.createTreeFolder(folders, cEntry);
                    }, function (error) {
                        var nextItem = folders[0];
                        var defaultParentFolder = Array.isArray(item_1) ? item_1[0] : item_1;
                        if (!Array.isArray(nextItem)) {
                            //if(nextItem.indexOf("/") < 0)
                            folders[0] = defaultParentFolder + "/" + nextItem;
                        }
                        else {
                            nextItem.forEach(function (value, index) {
                                //if(value.indexOf("/") < 0)
                                folders[0][index] = defaultParentFolder + "/" + value;
                            });
                        }
                        $scope_1.createTreeFolder(folders, entry);
                    });
                }
            }
        }
    };
    /**Offline Mess*/
    Helper.prototype.createOffileMess = function () {
        var offlineMess = "<div class='offline-mess'><span>No internet connection</span></div>";
        var offlineBackDrop = "<div class='offline-backdrop'></div>";
        if (this.globalVars.currentModule == "watchlist" || this.globalVars.currentModule == "indices") {
            var tabs = document.getElementsByTagName("ion-tabs");
            if (tabs.length > 0) {
                tabs[0].insertAdjacentHTML("beforeend", offlineBackDrop);
                tabs[0].insertAdjacentHTML("beforeend", offlineMess);
            }
        }
        else {
            var pages = document.getElementsByClassName("show-page");
            var activePage = pages[pages.length - 1];
            if (activePage.getElementsByClassName("offline-mess").length == 0) {
                activePage.getElementsByTagName("ion-header")[0].insertAdjacentHTML("beforeend", offlineMess);
            }
            if (this.disableModulesOfflineMode.indexOf(this.globalVars.currentModule) >= 0 && activePage.getElementsByClassName("offline-backdrop").length == 0) {
                var scrollContent = activePage.getElementsByTagName("scroll-content");
                if (scrollContent.length > 0)
                    scrollContent[scrollContent.length - 1].insertAdjacentHTML("beforeend", offlineBackDrop);
            }
        }
    };
    Helper.prototype.removeOffileMess = function () {
        var lstMess = document.getElementsByClassName("offline-mess");
        while (lstMess.length > 0) {
            lstMess[0].parentElement.removeChild(lstMess[0]);
        }
        var lstBackdrop = document.getElementsByClassName("offline-backdrop");
        while (lstBackdrop.length > 0) {
            lstBackdrop[0].parentElement.removeChild(lstBackdrop[0]);
        }
        //if (this.globalVars.currentModule == "home") {
        //    this.globalVars.homepage.getTickerData();
        //}
    };
    Helper.prototype.checkAppStatus = function () {
        var _this = this;
        if (this.globalVars.activePage)
            this.globalVars.activePage.isOnline = this.globalVars.isOnline;
        setTimeout(function () {
            if (_this.globalVars.isOnline)
                _this.removeOffileMess();
            else
                _this.createOffileMess();
        }, 200);
    };
    Helper = __decorate([
        core_1.Injectable()
    ], Helper);
    return Helper;
}());
exports.Helper = Helper;
