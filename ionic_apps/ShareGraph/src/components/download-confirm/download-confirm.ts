import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Calendar } from 'ionic-native';
import { Helper } from '../../common/helper';
import { GlobalVars } from '../../common/global-vars';
import { CalendarService } from '../../providers/calendar-service';

@Component({
    selector: 'download-confirm',
    templateUrl: 'download-confirm.html',
    providers: [CalendarService]
})

export class DownloadConfirm {
    downloadAllUpcomingEvent: boolean;
    title: string;
    detail: string;
    eventData: any;
    yes: string;
    no: string;

    constructor(public navParams: NavParams, public viewCtrl: ViewController, public helper: Helper, public calendarService: CalendarService, public globalVars: GlobalVars) {
        if (navParams.get("isDownloadAll") == undefined || navParams.get("isDownloadAll")) {
            this.downloadAllUpcomingEvent = true;
            this.title = helper.getPhrase("DownloadTitle", "Calendar");
            this.detail = helper.getPhrase("DownloadDetail", "Calendar");
        }
        else {
            this.downloadAllUpcomingEvent = false;
            this.title = helper.getPhrase("DownloadOneEventTitle", "Calendar");
            this.detail = helper.getPhrase("DownloadOneEventDetail", "Calendar");
            this.eventData = navParams.get("eventData");
        }

        this.yes = this.helper.getPhrase("Yes", "Calendar");
        this.no = this.helper.getPhrase("No", "Calendar");
        globalVars.downloadConfirm = this;
    }

    closeModal(isAdded = false) {
        this.viewCtrl.dismiss({ eventAdded: isAdded });
    }

    onDownload() {
        if (this.downloadAllUpcomingEvent) {
            this.helper.showLoading(this);
            this.calendarService.getAllUpcomingData().then(data => {
                if (data != null && data instanceof Array && data.length > 0) {
                    this.addEventToDeviceCalendar(data);
                }
                else {
                    this.helper.hideLoading(this);
                    setTimeout(() => {
                        this.closeModal();
                    }, 500);
                }
            });
        }
        else {
            let data = [];
            data.push(this.eventData);
            this.addEventToDeviceCalendar(data);
        }
    }

    addEventToDeviceCalendar(data) {
        if (data.length > 0) {
            var eventData = data[0];
            data.splice(0, 1);
            var event = this.processEvent(eventData);
            Calendar.findEvent(event.title, event.location, event.notes, event.startDate, event.endDate).then((ev) => {
                if (ev == null || ev.length == 0) {
                    Calendar.createEventWithOptions(event.title, event.location, event.notes, event.startDate, event.endDate, event.calOptions).then((mess) => {
                        this.addEventToDeviceCalendar(data);
                    });
                }
                else {
                    this.addEventToDeviceCalendar(data);
                }
            });
        }
        else {
            this.helper.hideLoading(this);
            setTimeout(() => {
                this.closeModal(true);
            }, 1000);
        }
    }

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