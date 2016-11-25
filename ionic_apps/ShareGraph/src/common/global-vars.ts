import {Injectable} from '@angular/core';

@Injectable()
export class GlobalVars {
    //Static variables
    serviceBaseUrl = "http://10.10.15.8/myirappapi2/";
    externalAccServiceUrl = "http://server.vn/myirappapi2/";
    apiPath = "api";
    apiVersion = "v1";
    retry = 3;
    tickerTimeInterval = 60000;
    currencyStorageTTL = 3600000;
    settingStorageTTL = 7200000;
    requestTimeout = 10000;
    decimalSeparator = [
        {
            name: "Comma",
            value: ","
        },
        {
            name: "Dot",
            value: "."
        }
    ];
    language = [
        {
            name: "English",
            value: "en-gb"
        },
        {
            name: "日本語",
            value: "ja-jp"
        },
        {
            name: "Pусский",
            value: "ru-ru"
        },
        {
            name: "Norsk",
            value: "nb-no"
        },
        {
            name: "Svenska",
            value: "sv-se"
        },
        {
            name: "Suomi",
            value: "fi-fi"
        },
        {
            name: "Dansk",
            value: "da-dk"
        },
        {
            name: "Español",
            value: "es-es"
        },
        {
            name: "Deutsch",
            value: "de-de"
        },
        {
            name: "Français",
            value: "fr-fr"
        },
        {
            name: "Íslenska",
            value: "is-is"
        },
        {
            name: "Italiano",
            value: "it-it"
        },
        {
            name: "Português",
            value: "pt-pt"
        },
        {
            name: "العربية",
            value: "ar-ae"
        },
        {
            name: "简体中文",
            value: "zh-cn"
        },
        {
            name: "繁體中文",
            value: "zh-tw"
        },
        {
            name: "한국어",
            value: "ko-kr"
        }
    ];
    useEasternArabicNumbers = true;

    sharegraph = {
        timeInterval: 60000,
        historyStorageTTL: 900000,
        intradayStorageTTL: 300000,
        performanceDataStorageTTL: 900000
    };
    calendar = {
        storageTTL: 300000
    };
    historicalprice = {
        storageTTL: 900000
    };
    pressreleases = {
        storageTTL: 300000
    };
    report = {
        storageTTL: 300000,
        downloadLimit: 10
    };
    keyfinancials = {
        storageTTL: 300000
    };
    disclosures = {
        storageTTL: 300000
    }

    httpRequestHeader = {
        headers: {
            'Authorization': "Basic bm9ybWFsdXNlcjpwNmVqYVByRQ=="
        }
    };

    //Dynamic variables
    appPath: string;
    companyCode: any;
    root: any;
    rootEntry: any;
    servicesUrl = this.serviceBaseUrl + this.apiPath + "/" + this.apiVersion + "/";
    externalServiceUrl = this.externalAccServiceUrl + this.apiPath + "/" + this.apiVersion + "/";
    configData: any;
    phrasesData: any;
    generalSettings: any = {
        language: {
            isDefault: true,
            value: "en-GB",
            name: "English"
        },
        separator: {
            isDefault: true,
            decimal: ".",
            thousand: ",",
            name: ""
        },
        decimalDigits: 2,
        currency: {
            isDefault: true,
            value: ""
        },
        quickMenu: {
            isDefault: true,
            customOrder: [],
            defaultOrder: []
        },
        menuImage: "image1",
        pushNotifications: {
            pressreleases: false,
            reports: false,
            media: false
        },
        shortDateFormat: "dd/mm/yyyy",
        longDateFormat: "dddd mmmm dd, yyyy",
        timeFormat: "hh:MM"
    };
    profileSettings: any = {
        showWatchlistIntroduction: false,
        showIndicesIntroduction: false,
        enableWatchlist: false,
        watchlist: [],
        enableIndices: false,
        indices: [],
        emailAlert: 0
    };
    user: any;
    translations: any;
    activePage: any;
    push: any;
    hub: any;
    isOnline: boolean = true;
    isArabic: boolean = false;
    isTablet: boolean = false;
    isIpad: boolean = false;
    isNativeMode: boolean = false;
    currentModule: string;
    isIOS: boolean = true;
    changedLanguage: boolean = false;
    changedDecimalSeparator: boolean = false;
    changedCurrency: boolean = false;
    isCloseCompareModal: boolean = false;
    progressBar: any;
    downloadConfirm: any;
    /*Report*/
    reportsDownloading: any;
    reportFileTransfers: any;
    reportPendingDownload: any;
    /*Historical Price*/
    hpSelectedDate: any;
    /*Press Releases*/
    prDetail: any;
    /*Calendar*/
    fincalModule: any;

    constructor() {
    }

    //Set global variables
    setGlobalVar(key, value) {
        this[key] = value;
    }

    //Get dynamic global variables
    getGlobalVar(key) {
        return this[key];
    }
}