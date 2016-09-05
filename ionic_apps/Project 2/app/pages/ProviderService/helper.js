import {Injectable} from '@angular/core';

@Injectable()
export class Helper {
    static get parameters() {
    }

    constructor() {
        this.httpRequestHeader = {
            headers: {
                'Authorization': "Basic bm9ybWFsdXNlcjpwNmVqYVByRQ=="
            }
        };
        this.dateMasks = {
            "default": "ddd mmm dd yyyy HH:MM:ss",
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
    }
    //Change Page
    // goToModule(module, params = null){
    //     irApp.currentModule = module.moduleName;
    //     if(module != null){
    //         if(params != null)
    //             irApp.nav.push(module.component, params);
    //         else
    //             irApp.nav.push(module.component);
    //     }
    // }
    // goToSettings(params = null){
    //     if(params != null)
    //         irApp.nav.push(this.getPage("settings"), params);
    //     else
    //         irApp.nav.push(this.getPage("settings"));
    // }
    // getPage(name){
    //     let moduleName = name.indexOf("report") == 0 ? "reports" : name;
    //     let module = irApp.root.appPages.filter(module => module.name == moduleName);
    //     if(module.length > 0){
    //         return module[0].component;
    //     }
    //     return null;
    // }
    
    //Format date
    dateFormat(date, mask, utc){
        let $scope = this;
        var token = /d{1,4}|m{1,4}|y{1,4}|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g, timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, timezoneClip = /[^-+\dA-Z]/g, pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };
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
            dd: pad(d),
            //ddd:  dF.i18n.dayNames[D],
            //dddd: dF.i18n.dayNames[D + 7],
            // ddd: irApp.phrasesData.Common.DOWNames[D].slice(3),
            // dddd: irApp.phrasesData.Common.DOWNames[D],
            m: m + 1,
            mm: pad(m + 1),
            //mmm:  dF.i18n.monthNames[m],
            //mmmm: dF.i18n.monthNames[m + 12],
            // mmm: irApp.phrasesData.Common.MonthNamesShort[m],
            // mmmm: irApp.phrasesData.Common.MonthNames[m],
            y: y,
            yy: String(y).slice(2),
            yyy: String(y).slice(2),
            yyyy: y,
            h: H % 12 || 12,
            hh: pad(H % 12 || 12),
            H: H,
            HH: pad(H),
            M: M,
            MM: pad(M),
            s: s,
            ss: pad(s),
            l: pad(L, 3),
            L: pad(L > 99 ? Math.round(L / 10) : L),
            t: H < 12 ? "a" : "p",
            // tt: H < 12 ? (irApp.isArabic ? "ص" : "am") : (irApp.isArabic ? "م" : "pm"),
            T: H < 12 ? "A" : "P",
            // TT: H < 12 ? (irApp.isArabic ? "ص" : "AM") : (irApp.isArabic ? "م" : "PM"),
            Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
            o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
            S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
        };
        var rDate = mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
        // if(irApp.isArabic && irApp.defaultSettings.common.useEasternArabicNumbers)
        //     rDate = this.convertToArabic(rDate);
        return rDate
        //};
    }
    
}
