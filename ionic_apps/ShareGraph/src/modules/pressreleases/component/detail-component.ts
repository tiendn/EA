import { Component } from '@angular/core';
import { NavController, ModalController, Content } from 'ionic-angular';
import { File, Transfer, SocialSharing } from 'ionic-native';
import { DomSanitizer } from '@angular/platform-browser';
import { Helper } from '../../../common/helper';
import { GlobalVars } from '../../../common/global-vars';
import { PressReleasesService } from '../../../providers/pressreleases-service';
import { ProgressBar } from '../../../components/progressbar/progressbar';

@Component({
    selector: 'pr-detail',
    templateUrl: 'detail-component.html',
    providers: [PressReleasesService]
})

export class PressReleasesDetailComponent {
    moduleName = "PressReleases";
    loading: any;
    isAttachmentView: boolean = false;
    Attachments: any = [];
    Message: any = "";
    attachmentPhrase: string;
    oneDayChangePhrase: string;
    showProgressBar: boolean = false;
    blobUrl: string;
    lstDownloading: Object = {};
    folderPath: string;
    isOpenAttachmentReader: boolean = false;
    dateFormat: string;
    prMasterData: any;
    currentFileOpen: any;
    oneDayChangeData: any;

    constructor(public nav: NavController, public helper: Helper, public prService: PressReleasesService, public domSanitizationService: DomSanitizer,
        public modalController: ModalController, public content: Content, public globalVars: GlobalVars) {
        this.attachmentPhrase = helper.getPhrase("Attachments", this.moduleName);
        this.oneDayChangePhrase = helper.getPhrase("OneDayChange", this.moduleName);
        this.blobUrl = globalVars.configData.common.bloburl + globalVars.configData.common.attachmentsblobcontainer;
        helper.createFolder(this.moduleName);
        this.folderPath = globalVars.appPath + this.moduleName + "/";
        this.isOpenAttachmentReader = false;
        this.dateFormat = globalVars.generalSettings.shortDateFormat;
    }

    getPrDetailData(prMasterData) {
        if (!this.globalVars.prDetail)
            this.globalVars.prDetail = this;
        //this.createFolder();
        if (this.globalVars.isIpad)
            this.helper.showLoading(this, "loading-right");
        else
            this.helper.showLoading(this);
        let dateNumeric = prMasterData.DateNumeric.toString();
        prMasterData.FullDisplayDate = this.helper.dateFormat(new Date(dateNumeric.slice(0, 4), (parseFloat(dateNumeric.slice(4, 6)) - 1), dateNumeric.slice(6, 8)), this.dateFormat);
        this.prMasterData = prMasterData;
        this.prService.getPRDetail(this.prMasterData.Id).then(detailData => {
            if (detailData["Message"].trim().length > 0)
                this.Message = this.domSanitizationService.bypassSecurityTrustHtml(detailData["Message"]);
            this.Attachments = detailData["Attachments"];
            this.helper.hideLoading(this);
            this.getOneDayChange();
        });
    }

    openAttachment(attachment) {
        this.currentFileOpen = attachment;
        this.currentFileOpen.localPath = this.folderPath + encodeURIComponent(attachment.atFileName);
        this.currentFileOpen.serverPath = this.blobUrl + "/" + attachment.atId + "/" + attachment.atFileName;

        this.checkFile();
    }
    getOneDayChange() {
        if (this.globalVars.isOnline) {
            let iDs = [],
                date = this.prMasterData.DateNumeric.toString().slice(0, 8);
            this.globalVars.configData.common.instruments.forEach((obj) => {
                iDs.push(obj.instrumentid);
            });
            this.prService.get1DChangeData(iDs.toString(), date).then(data => {
                if (data instanceof Array && data.length > 0) {
                    this.oneDayChangeData = data;
                }
            });
        }
        //this.oneDayChangeData = [{name: "SHR1", price: 3.2},{name: "SHR2", price: 2.5},{name: "SHR3", price: -0.2}];
    }
    hideContent() {
        this.prMasterData = null;
    }

    /*Download Attachment*/
    checkFile() {
        if (this.currentFileOpen) {
            this.isOpenAttachmentReader = true;
            if (!this.lstDownloading[this.currentFileOpen.atFileName]) {
                File.checkFile(this.folderPath, this.currentFileOpen.atFileName).then(() => {
                    if (this.lstDownloading[this.currentFileOpen.atFileName]) {
                        let progressModal = this.modalController.create(ProgressBar, { filename: this.currentFileOpen.atFileName });
                        progressModal.present();
                    }
                    else {
                        this.openDocumentView();
                    }
                }).catch(() => {
                    if (this.globalVars.isOnline)
                        this.showDownloadingProcess();
                });
            }
            else {
                let progressModal = this.modalController.create(ProgressBar, { filename: this.currentFileOpen.atFileName });
                progressModal.present();
            }
        }
    }
    showDownloadingProcess() {
        let progressModal = this.modalController.create(ProgressBar, { filename: this.currentFileOpen.atFileName });
        progressModal.onDidDismiss(data => {
            if (!data.complete) {
                this.isOpenAttachmentReader = false;
            }
        });
        progressModal.present().then(() => {
            this.createFileTransferDownload();
        });
    }
    createFileTransferDownload() {
        let filename = this.currentFileOpen.atFileName;
        this.lstDownloading[filename] = new Transfer();
        this.lstDownloading[filename].download(encodeURI(this.currentFileOpen.serverPath), this.currentFileOpen.localPath, true).then((entry) => {
            this.helper.setMetaDataNoBackup(entry);
            this.globalVars.progressBar.closeModal(true);
            this.openDocumentView();
            delete this.lstDownloading[filename];
        }).catch(() => {
            this.lstDownloading[filename].abort();
        });
        this.lstDownloading[filename].onProgress((progressEvent) => {
            let pgBar = document.getElementById("irapp-progressbar");
            if (pgBar != null && progressEvent.lengthComputable && pgBar.getAttribute("filename") == this.currentFileOpen.atFileName) {
                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                pgBar.style.width = perc + "%";
            }
        });
    }
    removeFiles(localPath, filename) {
        File.removeFile(localPath, filename);
    }
    
    openDocumentView() {
        if (this.isOpenAttachmentReader)
            this.helper.openDocument(this, this.currentFileOpen.localPath, this.currentFileOpen.atFileName.substring(0, this.currentFileOpen.atFileName.lastIndexOf(".")));
    }

    onBackFromDocView() {
        this.isOpenAttachmentReader = false;
    }
    /*End Download Attachment*/

    /*Social Shareing*/
    sendEmail() {
        let filename = decodeURI(this.currentFileOpen.atFileName.substring(0, this.currentFileOpen.atFileName.lastIndexOf(".")));
        var appName = this.helper.getConfigData("common", "appname", true);
        var subjectEmail = this.helper.getConfigData("common", "companyname", true) + " - " + this.prMasterData.Title; //commonSettingsData.common.companyname + " - " + filename;
        var hrefAttr = "http://www.euroland.com/?selectlanguage=" + this.helper.getLanguageName();
        var appUrl = this.globalVars.isIOS ? this.helper.getConfigData("shareviaemail", "itunesappurl") : this.helper.getConfigData("shareviaemail", "androidappurl");
        var imgUrl = this.globalVars.serviceBaseUrl + "company" + "/" + this.globalVars.configData.companycode.toLowerCase() + "/appicon.png";
        var bodyEmail = "<br/>" +
            "<a href='" + this.currentFileOpen.serverPath + "'><bdo dir='auto'>" + filename + "</bdo></a>" +
            "<br/><br/><bdo dir='auto'>" +
            this.helper.getPhrase("DownloadApp", "ShareViaEmail").replace("[appname]", appName) +
            "</bdo><br/>" +
            "<a href='" + appUrl + "'>" + appUrl + "</a><br/>" +
            "<div style='color:#979697;padding-top:30px;font-size:14px;'><bdo dir='auto'>" +
            appName + " " + this.helper.getPhrase("Footer", "ShareViaEmail").replace('[euroland.com]', '<a href="' + hrefAttr + '" class="ui-link">Euroland.com</a>') +
            "</bdo></div><br/>";
        if (!this.globalVars.isIOS) {
            //if (cordova.plugins.email != undefined) {
            //    cordova.plugins.email.open({
            //        to: '',
            //        subject: subjectEmail,
            //        body: bodyEmail,
            //        attachments: androidIconUrl,
            //        isHtml: true
            //    });
            //}
            //else {
            //    window.location.href = "mailto:?subject=" + subjectEmail + "&body=" + encodeURIComponent(bodyEmail);
            //}
        }
        else {
            bodyEmail += "<img style='display:table-cell;' src='" + imgUrl + "' width='60px' height='60px' border=0></img>";
            window.location.href = "mailto:?subject=" + subjectEmail + "&body=" + encodeURIComponent(bodyEmail);
        }
    }

    shareTweet() {
        setTimeout(() => {
            let textContent = this.helper.getConfigData("common", "companyname", true) + " - " + this.prMasterData.Title;
            SocialSharing.shareViaTwitter(textContent, null, this.currentFileOpen.serverPath);
        }, 1000);
    }
    /*End Social Shareing*/

    scrollToAttachment() {
        if (!this.globalVars.isTablet)
            this.content.scrollToBottom(0);
        else {
            let scrollEl = document.getElementsByClassName("pr-detail-container")[0];
            scrollEl.scrollTop = scrollEl.scrollHeight;
        }
    }
}
