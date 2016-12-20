import { Component, ViewChild, NgZone } from '@angular/core';
import { Content, ModalController } from 'ionic-angular';
import { File, Transfer, SocialSharing } from 'ionic-native';
import { Helper } from '../../common/helper';
import { GlobalVars } from '../../common/global-vars';
import { ReportsService } from '../../providers/reports-service';
//import { ScrollTabComponent } from '../../components/scrolltab/scrolltab';
import { ProgressBar } from '../../components/progressbar/progressbar';

@Component({
    selector: 'page-reports',
    templateUrl: 'reports.html',
    providers: [ReportsService]
})
export class ReportsPage {

    //@ViewChild(ScrollTabComponent) scrollTab: ScrollTabComponent;
    @ViewChild(Content) content: Content;
    //@ViewChild(ProgressBar) progressBar: ProgressBar;

    moduleName = "Reports";
    headerTitle: string;
    groupByYear: boolean = false;
    regex = new RegExp('\\_', 'g');
    isMultiPrefix: boolean = false;
    folderPath: string;
    blobThumbnailUrl: string;
    blobReportUrl: string;
    isOpenFileReader: boolean = false;
    thumbnailSize: string;
    thumbnailRatio: string;
    reportsDownloaded: any = [];
    lstDelete: any;
    isShowFooter: boolean = false;
    reportsDownloading: any;
    tabData: any;
    reportLang: string;
    currentTabData: any;
    orientation: string;
    reportData: any;
    groupData: any;
    data: any;
    currentGroup: any;
    thumbnailSuffixName: string;
    thumbnailFileTransfer: any;
    currentReport: any;
    lstDownloading: any;
    displaySuffix: boolean;
    hideTab: boolean = true;
    currentId: number;

    constructor(public helper: Helper, public reportsService: ReportsService, public modalController: ModalController, 
        public globalVars: GlobalVars, public zone: NgZone) {
        this.headerTitle = helper.getPhrase("Library");
        this.helper.createFolder(this.moduleName);
        this.folderPath = globalVars.appPath + this.moduleName + "/";
         this.blobThumbnailUrl = globalVars.configData.common.bloburl + globalVars.configData.common.pdfthumbnailblobcontainer + "/" + globalVars.companyCode.toUpperCase() + "/";
         this.blobReportUrl = globalVars.configData.common.bloburl + globalVars.configData.common.pdfreportsblobcontainer + "/" + globalVars.companyCode.toUpperCase() + "/";
        //this.blobThumbnailUrl = globalVars.configData.common.bloburl + globalVars.configData.common.pdfthumbnailblobcontainer + "/" + "AE-EMAAR" + "/";
        //this.blobReportUrl = globalVars.configData.common.bloburl + globalVars.configData.common.pdfreportsblobcontainer + "/" + "AE-EMAAR" + "/";
        this.isOpenFileReader = false;
        this.thumbnailSize = globalVars.isTablet ? "_86_125" : "_63_90";
        this.thumbnailRatio = "";
        if (window.devicePixelRatio > 1) {
            if (window.devicePixelRatio <= 2)
                this.thumbnailRatio = "_2x";
            else
                this.thumbnailRatio = "_3x";
        }
        //this.reportsDownloaded = [];
        this.lstDelete = [];
    }

    /*Page Events*/
    ionViewDidLoad() {
        this.helper.checkTokenExpired();
        this.reportsDownloading = this.globalVars.reportsDownloading ? this.globalVars.reportsDownloading : [];
        this.checkFileInStartDownload();
        if (this.globalVars.configData.report) {
            let rpFilterData = this.globalVars.configData.report.filter(data => data.module == this.globalVars.currentModule);
            if (rpFilterData.length > 0) {
                let configData = rpFilterData[0];
                if (configData.tabs && configData.tabs.length > 0) {
                    //this.tabData = configData.tabs;
                    //this.scrollTab.genTabData(this, this.tabData, "tabid", "phraseid");
                    this.genTabContent(configData.tabs);
                    /*if (!this.tabData[0].displayName) {
                        let phraseId = this.tabData[0].phraseid;
                        if (phraseId.indexOf("/") > 0)
                            this.tabData[0].displayName = this.helper.getPhrase(phraseId.split("/")[1], phraseId.split("/")[0]);
                        else
                            this.tabData[0].displayName = this.helper.getPhrase(phraseId);
                    }
                    this.selectedTab(this.tabData[0]);*/
                }
            }
            this.reportLang = this.getThreeLetterLanguage();
        }
    }

    ionViewDidEnter() {
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }

    genTabContent(data) {
        if (data.length > 0) {
            data.forEach((obj) => {
                obj.id = obj["tabid"];
                let name = obj["phraseid"];
                if (name.indexOf("/") > 0)
                    obj.displayName = this.helper.getPhrase(name.split("/")[1], name.split("/")[0]);
                else
                    obj.displayName = name;
            });
            this.tabData = data;
            this.hideTab = data.length <=1 ;
            this.selectedTab(this.tabData[0]);
        }
    }
    /*End Page Events*/

    /*Toolbar Events*/
    selectedTab(data) {
        this.helper.checkTokenExpired();
        if (!this.isShowFooter) {
            this.data = [];
            this.currentTabData = data;
            this.helper.showLoading(this);
            //this.scrollTab.currentId = data.id;
            this.currentId = data.id;
            let groupByYear = data.groupbyyear;
            this.isMultiPrefix = data.nameprefix.indexOf(",") > 0;
            this.displaySuffix = data.displayassuffix;
            this.orientation = data.orientation.toLowerCase();
            let orientationInName = this.orientation == "landscape" ? "_land" : "";
            this.thumbnailSuffixName = this.thumbnailSize + orientationInName + this.thumbnailRatio + ".jpg";
            this.reportsService.getReportData(data.tabid).then(res => {
                if (res instanceof Array && res.length > 0) {
                    this.content.resize();
                    this.reportData = this.processData(res, groupByYear);
                    if (!data.groupbyyear) {
                        this.groupData = null;
                        this.data = this.reportData;
                    }
                    else {
                        if (!this.currentGroup || this.currentGroup.length == 0)
                            this.selectedGroup(this.groupData[0]);
                        else
                            this.selectedGroup(this.currentGroup);
                    }
                    this.removePendingFiles();
                    var rpData = this.data.slice();
                    if (rpData.length > 0)
                        this.checkReportDownloaded(rpData);
                }
                this.helper.hideLoading(this);
            });
        }
    }

    selectedGroup(year) {
        this.helper.checkTokenExpired();
        //if(this.currentGroup != year){
        this.currentGroup = year;
        if (this.reportData[year]) {
            this.data = this.reportData[year];
            let rpData = this.data.slice();
            if (rpData.length > 0)
                this.checkReportDownloaded(rpData);
        }
        //}
    }
    /*End Toolbar Events*/

    /*Gen Report Content*/
    processData(data, groupByYear) {
        let retData = null;
        if (groupByYear) {
            retData = {};
            let currentGroup = "";
            let groupData = [];
            //Get group data
            data.forEach((obj, index) => {
                let fileNameWithoutEx = obj.FileName.substring(0, obj.FileName.lastIndexOf("."));
                let yearInFileName = this.getYearInFileName(fileNameWithoutEx);
                if (currentGroup != yearInFileName) {
                    currentGroup = yearInFileName;
                    groupData.push(currentGroup);
                    retData[currentGroup] = [];
                }
                obj.DisplayName = this.getDisplayName(fileNameWithoutEx);
                obj.LocalThumbnailUrl = this.getThumbnailUrl(fileNameWithoutEx, obj.ETag);
                obj.LocalFileUrl = this.getLocalFileUrl(obj);
                obj.ServerFileUrl = this.getServerFileUrl(obj);
                retData[currentGroup].push(obj);
            });
            if (groupData.length > 0) {
                //bind data for group toolbar
                this.groupData = groupData;
            }
        }
        else {
            data.forEach((obj, index) => {
                let fileNameWithoutEx = obj.FileName.substring(0, obj.FileName.lastIndexOf("."));
                obj.DisplayName = this.getDisplayName(fileNameWithoutEx);
                obj.LocalThumbnailUrl = this.getThumbnailUrl(fileNameWithoutEx, obj.ETag);
                obj.LocalFileUrl = this.getLocalFileUrl(obj);
                obj.ServerFileUrl = this.getServerFileUrl(obj);
            });
            retData = data;
        }
        return retData;
    }
    getLocalFileUrl(report) {
        return this.folderPath + report.FileName.replace(".", "_" + report.ETag + ".");
    }
    getServerFileUrl(report) {
        return this.blobReportUrl + report.FileName;
    }
    checkReportDownloaded(data) {
        if (data.length > 0) {
            let report = data[0];
            data.splice(0, 1);
            let filenameWithETag = report.FileName.replace(".", "_" + report.ETag + ".");
            if (this.reportsDownloading.length > 0 && this.reportsDownloading.indexOf(report.FileName) >= 0) {
                this.checkReportDownloaded(data);
            }
            else {
                File.checkFile(this.folderPath, filenameWithETag).then(() => {
                    this.reportsDownloaded.push(report.FileName);
                    this.checkReportDownloaded(data);
                }).catch(() => {
                    this.checkReportDownloaded(data);
                });
            }
        }
    }
    /*End Gen Report Content*/

    /*Load Thumbnail*/
    getThumbnailUrl(filename, etag) {
        return this.folderPath + filename + "_" + etag + this.thumbnailSuffixName;
    }

    getThumbnail(img, item) {
        //console.log(img);
        
        //let filename = img.getAttribute("filename");
        let filename = item.FileName;

        //let etag = img.getAttribute("etag");
        if (!this.thumbnailFileTransfer)
            this.thumbnailFileTransfer = new Transfer();
        let serverUrl = this.blobThumbnailUrl + filename.substring(0, filename.lastIndexOf(".")) + this.thumbnailSuffixName;
        let localUrl = item.LocalThumbnailUrl;
        this.thumbnailFileTransfer.download(encodeURI(serverUrl), localUrl, true).then((entry) => {
            img.target.src = localUrl;
        }).catch(()=> { });
    }
    /*End Load Thumbnail*/

    /*Open Report*/
    openReport(item) {
        if (!this.isShowFooter) {
            this.currentReport = item;
            this.isOpenFileReader = true;
            //Check file is downloaded
            let filenameWithETag = item.FileName.replace(".", "_" + item.ETag + ".");
            File.checkFile(this.folderPath, filenameWithETag).then(() => {
                if (this.reportsDownloading.length > 0 && this.reportsDownloading.indexOf(this.currentReport.FileName) >= 0) {
                    this.showDownloadingProgress(item, true);
                }
                else {
                    this.openFileReader();
                }
            }).catch(() => {
                if (this.globalVars.isOnline)
                    this.showDownloadingProgress(item);
            });
        }
    }

    showDownloadingProgress(item, isDownloading = false) {
        let progressModal = this.modalController.create(ProgressBar, { filename: item.FileName, showFooter: true });
        progressModal.present().then(() => {
            if (!isDownloading)
                this.createFileTransferDownload();
        });
        progressModal.onDidDismiss(data => {
            if (!data.complete) {
                this.isOpenFileReader = false;
                if (data.status == "abort") {
                    this.onAbort();
                }
                else {
                    this.onMoveToBackground();
                }
            }
        });
    }

    createFileTransferDownload() {
        let filename = this.currentReport.FileName;
        this.reportsDownloading.push(this.currentReport.FileName);
        this.saveListDownloading();
        if (!this.globalVars.reportFileTransfers)
            this.globalVars.reportFileTransfers = {};

        this.globalVars.reportFileTransfers[filename] = new Transfer();
        
        this.globalVars.reportFileTransfers[filename].download(encodeURI(this.currentReport.ServerFileUrl), this.currentReport.LocalFileUrl, true).then((entry) => {
            this.globalVars.activePage.helper.setMetaDataNoBackup(entry);
            this.downloadSuccess(filename);
            /*this.globalVars.progressBar.closeModal(true);
            this.globalVars.activePage.reportsDownloaded.push(filename);
            let index = this.globalVars.activePage.reportsDownloading.indexOf(filename);
            if (index >= 0)
                this.globalVars.activePage.reportsDownloading.splice(index, 1);
            this.globalVars.activePage.saveListDownloading();
            this.globalVars.activePage.openFileReader();
            delete this.globalVars.activePage.lstDownloading[filename];*/
        }).catch(() => {
            /*this.globalVars.activePage.onAbort();
            let index = this.globalVars.activePage.reportsDownloading.indexOf(filename);
            if (index >= 0)
                this.globalVars.activePage.reportsDownloading.splice(index, 1);
            this.globalVars.activePage.saveListDownloading();
            this.globalVars.progressBar.closeModal(false);*/
            this.downloadFailed(filename);
        });
        this.globalVars.reportFileTransfers[filename].onProgress((progressEvent) => {
            if (progressEvent.lengthComputable) {
                this.onProgressDownload(filename, progressEvent);
                /*let pgBar = document.getElementById("irapp-progressbar");
                let pgBarOnItem = document.getElementById(filename);
                let perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                if (pgBar != undefined && pgBar != null && this.currentReport.FileName == filename) {
                    //this.progressBar.setProgressPercentage(perc);
                    pgBar.style.width = perc + "%";
                }
                if (pgBarOnItem != undefined && pgBarOnItem != null) {
                    pgBarOnItem.style.width = perc + "%";
                }*/
            }
        });
    }

    /*createFolder() {
        let $scope = this;
        if (this.globalVars.rootEntry != null) {
            this.globalVars.rootEntry.getDirectory(this.moduleName, {
                create: true,
                exclusive: true
            }, function (entry) {
                $scope.helper.setMetaDataNoBackup(entry);
            }, function () { });
        }
    }*/
    onMoveToBackground() {
        this.isOpenFileReader = false;
    }
    onAbort() {
        this.isOpenFileReader = false;
        if(this.currentReport && this.currentReport["FileName"]){
            if(this.globalVars.reportFileTransfers && this.globalVars.reportFileTransfers[this.currentReport.FileName]){
                this.globalVars.reportFileTransfers[this.currentReport.FileName].abort();
                delete this.globalVars.reportFileTransfers[this.currentReport.FileName];
            }
            else{
                this.globalVars.startDownloadingFile.downloader.abort();
            }
        }
        //this.downloadFailed(this.currentReport.FileName);
        /*if (this.currentReport && this.currentReport.FileName && this.globalVars.reportFileTransfers[this.currentReport.FileName]) {
            alert(1212121212);
            this.globalVars.reportFileTransfers[this.currentReport.FileName].abort();
            delete this.globalVars.reportFileTransfers[this.currentReport.FileName];
        }
        else{
            alert(1);
        }*/
    }
    openFileReader() {
        if (this.isOpenFileReader)
            this.helper.openDocument(this, this.currentReport.LocalFileUrl, this.currentReport.DisplayName);
    }

    onBackFromDocView() {
        this.isOpenFileReader = false;
    }
    /*End Open Report*/

    /*Common Fn*/
    getYearInFileName(filename) {
        return filename.match(/\d+$/)[0];
    }

    getDisplayName(filename) {
        let prefixFilename = filename.substring(0, filename.indexOf("_"));
        filename = filename.replace(this.reportLang, "");
        let rx = new RegExp("(^AR_*)", "");
        let rx_quarterly = new RegExp("(^Q[0-9]_*)", "");
        if (rx.test(filename) || (!this.isMultiPrefix && !rx_quarterly.test(filename)))
            filename = filename.replace(prefixFilename, "");
        else {
            //let rx_quarterly = new RegExp("(^Q[0-9]_*)", "");
            if (this.displaySuffix && !rx_quarterly.test(filename)) {
                filename = filename.replace(prefixFilename, "") + " " + prefixFilename;
            }
        }
        if (filename.indexOf("_") >= 0) {
            let strPattern = '\\_';
            let regex = new RegExp(strPattern, 'g');
            filename = filename.replace(regex, " ");
        }
        if (filename.indexOf("  ") >= 0) {
            let strPattern = '\\  ';
            let regex = new RegExp(strPattern, 'g');
            filename = filename.replace(regex, " ");
        }
        return filename.trim();
    }
    getThreeLetterLanguage() {
        if (this.globalVars.configData.report.languages) {
            let arrLang = this.globalVars.configData.report.languages.split(",");
            if (arrLang.indexOf(this.globalVars.generalSettings.language.value) >= 0) {
                switch (this.globalVars.generalSettings.language.value.toLowerCase()) {
                    case "en-gb":
                        return "ENG";
                    case "ja-jp":
                        return "JPN";
                    case "ru-ru":
                        return "RUS";
                    case "nb-no":
                        return "NOR";
                    case "sv-se":
                        return "SWE";
                    case "fi-fi":
                        return "FIN";
                    case "da-dk":
                        return "DAN";
                    case "es-es":
                        return "ESP";
                    case "de-de":
                        return "GER";
                    case "fr-fr":
                        return "FRA";
                    case "is-is":
                        return "NOR";
                    case "is-is":
                        return "ISL";
                    case "it-it":
                        return "ITA";
                    case "pt-pt":
                        return "PTG";
                    case "ar-ae":
                        return "ARA";
                    case "zh-cn":
                        return "CHS";
                    case "zh-tw":
                        return "CHT";
                    case "ko-kr":
                        return "KOR";
                    default:
                        return "ENG";
                }
            }
        }
        return "ENG";
    }
    /*End Common Fn*/

    /*SocialSharing*/
    sendEmail() {
        let rpname = this.currentReport.DisplayName;
        let reportTypeName = this.currentTabData.displayName;
        let appName = this.helper.getConfigData("common", "appname", true);
        let subjectEmail = this.helper.getConfigData("common", "companyname", true);
        let hrefAttr = "http://www.euroland.com/?selectlanguage=" + this.helper.getLanguageName();
        let appUrl = this.globalVars.isIOS ? this.helper.getConfigData("shareviaemail", "itunesappurl") : this.helper.getConfigData("shareviaemail", "androidappurl");
        let imgUrl = this.globalVars.serviceBaseUrl + "company" + "/" + this.globalVars.configData.companycode.toLowerCase() + "/appicon.png";
        let bodyEmail = "<br/>" +
            "<a href='" + this.currentReport.ServerFileUrl + "'><bdo dir='auto'>" + reportTypeName + " " + rpname + "</bdo></a>" +
            "<br/><br/>" +
            this.helper.getPhrase("DownloadApp", "ShareViaEmail").replace("[appname]", appName) +
            "<br/>" +
            "<a href='" + appUrl + "'>" + appUrl + "</a><br/>" +
            "<div style='color:#979697;padding-top:30px;font-size:14px;'><bdo dir='auto'>" +
            appName + " " + this.helper.getPhrase("Footer", "ShareViaEmail").replace('[euroland.com]', '<a href="' + hrefAttr + '" class="ui-link">Euroland.com</a>') +
            "</div></bdo><br/>";
        bodyEmail += "<img style='display:table-cell;' src='" + imgUrl + "' width='60px' height='60px' border=0></img>";
        window.location.href = "mailto:?subject=" + subjectEmail + "&body=" + encodeURIComponent(bodyEmail);
    }

    shareTweet() {
        let shareText = this.helper.getConfigData("common", "companyname", true) + " - " + this.currentTabData.displayName + " " + this.currentReport.DisplayName;
        setTimeout(() => {
            SocialSharing.shareViaTwitter(shareText, null, this.currentReport.ServerFileUrl);
        }, 1000);
    }
    /*End SocialSharing*/

    openPopupRemoveFile(item) {
        if (!this.isShowFooter)
            this.isShowFooter = true;
        let index = this.lstDelete.indexOf(item.FileName);
        if (index < 0) {
            this.lstDelete.push(item.FileName);
        }
        else {
            this.lstDelete.splice(index, 1);
        }
    }

    hideFooter() {
        this.isShowFooter = false;
        this.lstDelete = [];
    }

    deleteFiles() {
        if (this.lstDelete.length > 0) {
            this.helper.showLoading(this);
            this.removeFileFromDevice(this.lstDelete.slice());
        }
    }

    removeFileFromDevice(files) {
        if (files.length > 0) {
            let filename = files[0];
            files.splice(0, 1);
            let report = this.data.filter(obj => obj.FileName == filename);
            if (report.length > 0) {
                let filenameWithETag = filename.replace(".", "_" + report[0].ETag + ".");
                File.removeFile(this.folderPath, filenameWithETag).then(data => {
                    if (this.reportsDownloaded.indexOf(filename) >= 0)
                        this.reportsDownloaded.splice(this.reportsDownloaded.indexOf(filename), 1);
                    this.removeFileFromDevice(files);
                }, error => {
                    this.removeFileFromDevice(files);
                });
            }
            else {
                this.removeFileFromDevice(files);
            }
        }
        else {
            this.lstDelete = [];
            this.isShowFooter = false;
            this.helper.hideLoading(this);
        }
    }

    removePendingFiles() {
        if (this.globalVars.reportPendingDownload) {
            this.removeFileFromDevice(this.globalVars.reportPendingDownload);
        }
    }

    saveListDownloading() {
        this.globalVars.reportsDownloading = this.reportsDownloading;
        this.reportsService.saveListDownloadingData(this.globalVars.reportsDownloading);
    }

    /*Check File In Start Download (Home Page)*/
    checkFileInStartDownload(){
        if(this.globalVars.startDownloadingFile){
            this.globalVars.startDownloadingFile.progressCallback = (data) => {
                if (this.globalVars.startDownloadingFile.module.toLowerCase().indexOf("report") >= 0){
                    if(this.reportsDownloading.indexOf(this.globalVars.startDownloadingFile.fileName) < 0){
                        this.zone.run(() => {
                            this.reportsDownloading.push(this.globalVars.startDownloadingFile.fileName);
                        });
                    }
                    this.onProgressDownload(this.globalVars.startDownloadingFile.fileName, data);
                }
            };
            this.globalVars.startDownloadingFile.downloadedCallback = (data) => {
                if (this.globalVars.startDownloadingFile.module.toLowerCase().indexOf("report") >= 0)
                    this.downloadSuccess(this.globalVars.startDownloadingFile.fileName);
            };
            this.globalVars.startDownloadingFile.downloadFailed = (data) => {
                if (this.globalVars.startDownloadingFile.module.toLowerCase().indexOf("report") >= 0)
                    this.downloadFailed(this.globalVars.startDownloadingFile.fileName);
            };
        }
    }

    onProgressDownload(filename, data){
        let pgBar = document.getElementById("irapp-progressbar");
        let pgBarOnItem = document.getElementById(filename);
        let perc = Math.floor(data.loaded / data.total * 100);
        if (pgBar != undefined && pgBar != null && this.currentReport.FileName == filename) {
            pgBar.style.width = perc + "%";
        }
        if (pgBarOnItem != undefined && pgBarOnItem != null) {
            pgBarOnItem.style.width = perc + "%";
        }
    }

    downloadSuccess(filename){
        if(this.globalVars.progressBar)
            this.globalVars.progressBar.closeModal(true);
        this.globalVars.activePage.reportsDownloaded.push(filename);
        let index = this.globalVars.activePage.reportsDownloading.indexOf(filename);
        if (index >= 0)
            this.globalVars.activePage.reportsDownloading.splice(index, 1);
        this.globalVars.activePage.saveListDownloading();
        this.globalVars.activePage.openFileReader();
        if(this.globalVars.activePage.lstDownloading && this.globalVars.activePage.lstDownloading[filename]){
            delete this.globalVars.activePage.lstDownloading[filename];
        }
    }

    downloadFailed(filename){
        //this.globalVars.activePage.onAbort();
        if (this.currentReport && this.globalVars.reportFileTransfers && this.globalVars.reportFileTransfers[this.currentReport.FileName]) {
            this.globalVars.reportFileTransfers[this.currentReport.FileName].abort();
        }
        let index = this.globalVars.activePage.reportsDownloading.indexOf(filename);
        if (index >= 0)
            this.globalVars.activePage.reportsDownloading.splice(index, 1);
        this.globalVars.activePage.saveListDownloading();
        if(this.globalVars.progressBar)
            this.globalVars.progressBar.closeModal(false);
    }
}
