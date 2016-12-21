import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { File, Transfer, SocialSharing, Calendar } from 'ionic-native';
import { Helper } from '../../../common/helper';
import { GlobalVars } from '../../../common/global-vars';
import { ProgressBar } from '../../../components/progressbar/progressbar';
import { DownloadConfirm } from '../../../components/download-confirm/download-confirm';
import { CalendarService } from '../../../providers/calendar-service';

@Component({
    selector: 'calendar-detail',
    templateUrl: 'detail-component.html',
    providers: [CalendarService]
})

export class CalendarDetailComponent {

    moduleName = "Calendar";
    loading: any;
    isAttachmentView: boolean = false;
    Attachments: any = [];
    Message: string = "";
    showProgressBar: boolean = false;
    lstDownloading: Object = {};
    folderPath: string;
    isOpenAttachmentReader: boolean = false;
    eventType: string;
    downloadText: string;
    shareText: string;
    addEventToDeviceSuccess: string;
    eventAdded: boolean = false;
    hideFooter: boolean = true;
    isDownloaded: boolean = false;
    dateFormat: string;
    isOnline: boolean;
    eventData: any;
    currentFileOpen: any;

    constructor(public helper: Helper, public globalVars: GlobalVars, public modalController: ModalController, public calendarService: CalendarService) {
        helper.createFolder(this.moduleName);
        this.folderPath = globalVars.appPath + this.moduleName + "/";
        this.eventType = this.helper.getPhrase("EventType", "Calendar");
        this.downloadText = this.helper.getPhrase("Download", "Calendar");
        this.shareText = this.helper.getPhrase("Share", "Calendar");
        this.addEventToDeviceSuccess = this.helper.getPhrase("AddedEventSuccess", "Calendar");
        this.dateFormat = this.globalVars.generalSettings.shortDateFormat;
        globalVars.activePage = this;
        this.isOnline = globalVars.isOnline;
    }

    hideContent() {
        this.hideFooter = true;
        this.eventData = null;
    }

    getEventDetailData(eventData) {
        eventData.FullDisplayDate = this.helper.getEventDisplayDate(eventData, this.dateFormat);
        this.eventData = eventData;
        if (!eventData.EventAttachments) {
            this.calendarService.getEventAttachment(eventData.Id).then(data => {
                if (data instanceof Array && data.length > 0)
                    this.eventData.EventAttachments = data;
            });
        }
        this.hideFooter = false;
        //Check event is added
        let event = this.processEvent(eventData);
        Calendar.findEvent(event.title, event.location, event.notes, event.startDate, event.endDate).then((ev) => {
            if (ev == null || ev.length == 0) {
                this.isDownloaded = false;
            }
            else {
                this.isDownloaded = true;
            }
        });
    }

    openAttachment(attachment) {
        this.currentFileOpen = attachment;
        this.currentFileOpen.localPath = this.folderPath + encodeURIComponent(attachment.FileName);
        this.currentFileOpen.serverPath = attachment.Location;
        this.checkFile();
    }

    checkFile() {
        if (this.currentFileOpen) {
            this.isOpenAttachmentReader = true;
            if (!this.lstDownloading[this.currentFileOpen.FileName]) {
                File.checkFile(this.folderPath, this.currentFileOpen.FileName).then(() => {
                    if (this.lstDownloading[this.currentFileOpen.FileName]) {
                        let progressModal = this.modalController.create(ProgressBar, { filename: this.currentFileOpen.FileName });
                        progressModal.present();
                    }
                    else {
                        this.openDocumentView();
                    }
                }).catch(() => {
                    this.showDownloadingProcess();
                });
            }
            else {
                let progressModal = this.modalController.create(ProgressBar, { filename: this.currentFileOpen.FileName });
                progressModal.present();
            }
        }
    }
    showDownloadingProcess() {
        let progressModal = this.modalController.create(ProgressBar, { filename: this.currentFileOpen.FileName });
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
        let filename = encodeURIComponent(this.currentFileOpen.FileName);
        this.lstDownloading[filename] = new Transfer();
        this.lstDownloading[filename].download(this.currentFileOpen.serverPath, this.currentFileOpen.localPath, true).then((entry) => {
            this.helper.setMetaDataNoBackup(entry);
            this.globalVars.progressBar.closeModal(true);
            this.openDocumentView();
            if (this.lstDownloading[filename])
                delete this.lstDownloading[filename];
        }).catch(() => {
            if (this.lstDownloading[filename]) {
                this.lstDownloading[filename].abort();
                delete this.lstDownloading[filename];
                this.globalVars.progressBar.closeModal();
            }
        });
        this.lstDownloading[filename].onProgress((progressEvent) => {
            let pgBar = document.getElementById("irapp-progressbar");
            if (pgBar != null && progressEvent.lengthComputable && pgBar.getAttribute("filename") == this.currentFileOpen.FileName) {
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
            this.helper.openDocument(this, this.currentFileOpen.localPath, this.currentFileOpen.FileName.substring(0, this.currentFileOpen.FileName.lastIndexOf(".")));
    }

    onBackFromDocView() {
        this.isOpenAttachmentReader = false;
    }
    /*End Download Attachment*/

    /*Attachment SocialSharing*/
    sendEmail() {
        let filename = decodeURI(this.currentFileOpen.FileName.substring(0, this.currentFileOpen.FileName.lastIndexOf(".")));
        var appName = this.helper.getConfigData("common", "appname", true);
        var subjectEmail = this.helper.getConfigData("common", "companyname", true) + " - " + this.eventData.Title; //commonSettingsData.common.companyname + " - " + filename;
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
        let textContent = this.helper.getConfigData("common", "companyname", true) + " - " + this.eventData.Title + " (" + this.eventData.DisplayDate + ")";
        let urlApp = "";
        if (this.globalVars.isIOS)
            urlApp = this.helper.getConfigData("shareviaemail", "itunesappurl");
        else
            urlApp = this.helper.getConfigData("shareviaemail", "androidappurl");
        window.setTimeout( () => {
            SocialSharing.shareViaTwitter(textContent, null, urlApp);
        }, 1000);
    }
    /*End SocialSharing*/

    /*Footer Button Event*/
    onDownload() {
        let downloadConfirmModal = this.modalController.create(DownloadConfirm, { isDownloadAll: false, eventData: this.eventData });
        downloadConfirmModal.onDidDismiss(data => {
            if (data.eventAdded) {
                this.eventAdded = true;
                this.isDownloaded = true;
                setTimeout(() => {
                    this.eventAdded = false;
                }, 3000);
            }
        });
        downloadConfirmModal.present();
    }

    onShare(event) {
        this.helper.showSharePopup(this, event);
    }
    /*End Footer Button Event*/

    /*Share Events*/
    sendViaEmail() {
        var companyName = this.helper.getConfigData("common", "companyname", true);
        var appName = this.helper.getConfigData("common", "appname", true);
        var subjectEmail = companyName + " - " + this.eventData.EventType + " - " + this.eventData.DisplayDate;
        var hrefAttr = "http://www.euroland.com/?selectlanguage=" + this.helper.getLanguageName();
        var appUrl = this.globalVars.isIOS ? this.helper.getConfigData("shareviaemail", "itunesappurl") : this.helper.getConfigData("shareviaemail", "androidappurl");
        var descEmail = "";
        if (this.eventData.Text && this.eventData.Text != "")
            descEmail += "<br/><bdo dir='auto'>" + this.eventData.Text + "</bdo>";
        if (this.eventData.Location && this.eventData.Location != "")
            descEmail += "<br/><bdo dir='auto'>" + this.helper.getPhrase("Location", "Calendar") + ": " + this.eventData.Location + "</bdo>";
        if (this.eventData.LinkUrl && this.eventData.LinkUrl != "") {
            var linkDesc = this.eventData.LinkUrl;
            if (this.eventData.LinkDescription && this.eventData.LinkDescription != "")
                linkDesc = this.eventData.LinkDescription;
            descEmail += "<br/><a class='event_url' href='" + encodeURI(this.eventData.LinkUrl) + "'><bdo dir='auto'>" + linkDesc + "</bdo></a>";
        }
        var bodyEmail = "<bdo dir='auto'>" + this.eventData.Title + "</bdo>" + descEmail +
            "<br/><br/>" +
            "<a href='" + this.globalVars.serviceBaseUrl + "/fincalendar/file/" + this.globalVars.configData.companycode + "/" + this.globalVars.generalSettings.language.value + "/" + this.eventData.Id + "'><bdo dir='auto'>" + this.helper.getPhrase("AddToCalendar", "Calendar") + "</a>" +
            "</bdo><br/><br/><bdo dir='auto'>" +
            this.helper.getPhrase("Follow", "Calendar") + " " + companyName +
            "</bdo><br/><bdo dir='auto'>" +
            this.helper.getPhrase("DownloadApp", "ShareViaEmail").replace("[appname]", appName) +
            "</bdo><br/>" +
            "<a href='" + appUrl + "'>" + appUrl + "</a>" +
            "<div style='color:#979697;padding-top:30px;font-size:14px;'><bdo dir='auto'>" +
            appName + " " + this.helper.getPhrase("Footer", "ShareViaEmail").replace('[euroland.com]', '<a href="' + hrefAttr + '" class="ui-link">Euroland.com</a>') +
            "</bdo></div><br/>";

        if (this.globalVars.isIOS) {
            var imgUrl = this.globalVars.serviceBaseUrl + "company" + "/" + this.globalVars.configData.companycode.toLowerCase() + "/appicon.png";
            bodyEmail += "<img style='display:table-cell;' src='" + imgUrl + "' width='60px' height='60px' border=0></img>";
            window.location.href = "mailto:?subject=" + subjectEmail + "&body=" + encodeURIComponent(bodyEmail);
        }
        else
            SocialSharing.shareViaEmail(bodyEmail, subjectEmail, [""], [""], [""], [""]);
    }
    tweetThis() {
        var textContent = this.helper.getConfigData("common", "companyname", true) + " - " + this.eventData.EventType + " - " + this.eventData.DisplayDate + " - " + this.eventData.Title;
        var urlApp = "";
        if (this.globalVars.isIOS)
            urlApp = this.helper.getConfigData("shareviaemail", "itunesappurl");
        else
            urlApp = this.helper.getConfigData("shareviaemail", "androidappurl");
        SocialSharing.shareViaTwitter(textContent, null, urlApp);
    }
    /*End Share Events*/

    /*Events*/
    processEvent(eventData) {
        var title = eventData.Title;
        if (title.indexOf('"') >= 0) {
            title = title.replace(new RegExp('\\"', 'g'), "'");
        }
        title = title.replace(/<(?:.)*?>|\n/gi, "");
        title = this.helper.getConfigData("common", "companyname", true) + " - " + title;
        var calOptions = Calendar.getCalendarOptions();
        var startDate = new Date(eventData.EventDate);
        var endDate = new Date(eventData.EventEndDate);
        var location = eventData.Location;
        var notes = eventData.Text;
        if (notes.length == 0 && eventData.LinkDescription && eventData.LinkDescription != "")
            notes = eventData.LinkDescription;
        notes = notes.replace(/<(?:.)*?>|\n/gi, "");
        calOptions.url = eventData.LinkUrl;
        if (eventData.DateType != 1 || eventData.IsAllDayEvent) {
            var strEventDate = eventData.EventDate.split("T")[0].split("-");
            var strEndDate = eventData.EventEndDate.split("T")[0].split("-");
            startDate = new Date(strEventDate[0], parseFloat(strEventDate[1]) - 1, strEventDate[2]);
            endDate = new Date(strEndDate[0], parseFloat(strEndDate[1]) - 1, strEndDate[2]);
            calOptions.firstReminderMinutes = 900;
            if (endDate > startDate)
                endDate = new Date(endDate.setHours(24));
            else {
                var eventStartDate = new Date(strEventDate[0], parseFloat(strEventDate[1]) - 1, strEventDate[2]);
                endDate = new Date(eventStartDate.setHours(24));
            }
        }
        else {
            if (endDate < startDate) {
                var sDate = new Date(eventData.EventDate);
                endDate = new Date(sDate.setHours(sDate.getHours() + 1));
            }
        }
        return { title: title, startDate: startDate, endDate: endDate, location: location, notes: notes, calOptions: calOptions };
    }
}
