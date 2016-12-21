import { Component, ViewChild, Renderer } from '@angular/core';
import { NavController, ModalController, Content } from 'ionic-angular';
import { Helper } from '../../common/helper';
import { GlobalVars } from '../../common/global-vars';
import { CalendarService } from '../../providers/calendar-service';
import { DownloadConfirm } from '../../components/download-confirm/download-confirm';
import { CalendarDetailPage } from './detail-page/detail-page';
import { CalendarDetailComponent } from './component/detail-component';
//import { ScrollTabComponent } from '../../components/scrolltab/scrolltab';

export interface EventType {
    ID: number;
    Name: string;
}

@Component({
    selector: 'page-calendar',
    templateUrl: 'calendar.html',
    providers: [CalendarService]
})
export class CalendarPage {
    @ViewChild(CalendarDetailComponent) calendarDetailComponent: CalendarDetailComponent;
    //@ViewChild(ScrollTabComponent) scrollTab: ScrollTabComponent;
    @ViewChild(Content) content: Content;
    @ViewChild('listEvents') listEvents;

    //currentEventType: EventType = {
    //    ID: -1, Name: ""
    //};
    currentEventType: EventType;
    disableShare: boolean = true;
    groupDateFormat: string = "mmmm yyyy";
    showMessNoData: boolean = false;
    currentGroup: string = "";
    currentIndex: number = -1;
    dateFormat: string;
    eventData: any = [];
    eventAdded: boolean = false;
    isOnline: boolean;
    pagesize: number;
    divMaster: any;
    headerTitle: string;
    noDataText: string;
    addEventToDeviceSuccess: string;
    currentEvent: any;
    onProgress: boolean;
    loadmore: any;
    tabData: any;
    currentEventTypeId: number;

    constructor(public nav: NavController, public helper: Helper, public globalVars: GlobalVars, public calendarService: CalendarService,
        public modalController: ModalController, public renderer: Renderer) {
        this.getAllPhrasesInPage();
        this.dateFormat = helper.getDateFormatWithoutYear();
        this.getAllEventType();
    }

    /*Page Events*/
    ionViewDidLoad() {
        this.isOnline = this.globalVars.isOnline;
        this.helper.showLoading(this);
        if (window.innerWidth > window.innerHeight)
            this.pagesize = Math.ceil(window.innerWidth / 70);
        else
            this.pagesize = Math.ceil(window.innerHeight / 70);
        if (this.globalVars.isIpad) {
            //this.divMaster = document.getElementById("calendar-master-content");
            //this.divMaster.addEventListener("scroll", this.onDivScroll);
            this.renderer.listen(this.listEvents.nativeElement, 'scroll', (event) => {
                this.onDivScroll();
            })
            this.globalVars.fincalModule = this;
        }
    }

    getAllPhrasesInPage() {
        this.headerTitle = this.helper.getPhrase("Calendar", "Common");
        this.noDataText = this.helper.getPhrase("MsgNoData", "Calendar");
        this.addEventToDeviceSuccess = this.helper.getPhrase("AddedAllEventSuccess", "Calendar");
    }

    ionViewDidEnter() {
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }
    /*End Page Events*/

    /*EventType Tabs*/
    getAllEventType() {
        this.calendarService.getEventTypes().then(data => {
            if (data instanceof Array && data.length > 0) {
                let tabData = data.slice();

                let allEventType = { ID: 0, Name: this.helper.getPhrase("All", "Calendar") };
                tabData.unshift(allEventType);

                //this.scrollTab.genTabData(this, data, "ID", "Name");
                this.tabData = tabData;
                //this.eventTypes = data;
                //this.hideTab = false;
                //allEventType["id"] = 0;
                this.currentEventType = allEventType;
                this.currentEventTypeId = 0;
                this.getEventData();
                this.content.resize();
            }
            else {
                this.helper.hideLoading(this);
                this.showMessNoData = true;
            }
        });
    }

    selectedTab(eventType) {
        this.helper.checkTokenExpired();
        if (this.currentEventType["ID"] != eventType.ID) {
            this.helper.showLoading(this);
            //this.scrollTab.currentId = eventType.id;
            this.currentEventTypeId = eventType.ID;
            this.currentEventType = eventType;
            this.eventData = [];
            this.currentIndex = -1;
            this.currentGroup = "";
            this.currentEvent = null;
            this.getEventData();
            if (this.globalVars.isTablet) {
                this.calendarDetailComponent.hideContent();
            }
        }
    }
    /*End EventType Tabs*/

    /*Button Events*/
    showDownloadConfirm(event) {
        //let $scope = this;
        let downloadConfirmModal = this.modalController.create(DownloadConfirm);
        downloadConfirmModal.onDidDismiss(data => {
            if (data.eventAdded) {
                this.eventAdded = true;
                setTimeout(() => {
                    this.eventAdded = false;
                }, 3000);
            }
        });
        downloadConfirmModal.present();
    }
    /*End Button Events*/

    /*Listview*/
    getEventData() {
        this.onProgress = true;
        let lastDate = "";
        let removeIds = "";
        if (this.eventData.length > 0 && this.currentIndex >= 0) {
            lastDate = this.eventData[this.currentIndex].data[this.eventData[this.currentIndex].data.length - 1].EventDate;
            let lstItemRemove = this.eventData[this.currentIndex].data.filter(obj => obj.EventDate.toString() == lastDate.toString());
            //let lstItemRemove = this.eventData[key].filter(obj => obj.EventDate.toString() == lastDate.toString());
            if (lstItemRemove.length > 0) {
                lstItemRemove.forEach(function (item) {
                    removeIds += item.Id + ",";
                });
            }
            if (removeIds.length > 0)
                removeIds = removeIds.slice(0, -1);
            lastDate = lastDate.replace(new RegExp('\\-', 'g'), '').replace(new RegExp('\\:', 'g'), '');
            if (lastDate.indexOf(".") > 0)
                lastDate = lastDate.substring(0, lastDate.indexOf("."));
        }
        this.calendarService.getEventData(this.currentEventType, this.pagesize, lastDate, removeIds).then(data => {
            if (data != null && data instanceof Array && data.length > 0) {
                if (this.eventData.length == 0 && this.currentEventType.ID == 0) {
                    this.disableShare = new Date(data[0].EventDate) <= new Date();
                }
                this.showMessNoData = false;
                data.forEach((obj) => {
                    let event = obj;
                    let date = new Date(event.EventDate);
                    let group = this.helper.dateFormat(date, this.groupDateFormat);
                    if (this.currentGroup != group) {
                        this.currentGroup = group;
                        this.currentIndex++;
                        this.eventData.push({ divider: this.currentGroup, data: [] });
                    }
                    event.DisplayDate = this.helper.getEventDisplayDate(event, this.dateFormat);;
                    this.eventData[this.currentIndex].data.push(event);
                });
                if ((!this.currentEvent || this.currentEvent == null) && this.globalVars.isTablet) {
                    setTimeout(() => {
                        this.getEventDetail(this.eventData[0].data[0]);
                    }, 1000);
                }
            }
            else {
                if (!this.eventData || this.eventData.length == 0)
                    this.showMessNoData = true;
            }
            this.helper.hideLoading(this);
            if (this.loadmore && this.loadmore != null) {
                this.loadmore.complete();
                this.loadmore = null;
            }
            this.onProgress = false;
        });
    }
    loadMoreData(event) {
        if (this.currentIndex >= 0 && (!this.loadmore || this.loadmore == null)) {
            this.loadmore = event;
            setTimeout(() => {
                this.getEventData();
            }, 500);
        }
        else {
            event.complete();
        }
    }
    onDivScroll() {
        if (this.currentIndex >= 0 && !this.onProgress && this.listEvents.nativeElement.scrollHeight - this.listEvents.nativeElement.scrollTop === this.listEvents.nativeElement.clientHeight) {
            this.helper.showLoading(this.globalVars.activePage, "loading-left");
            this.getEventData();
        }
    }
    /*End Listview*/

    /*Detail*/
    getEventDetail(event) {
        if (this.helper.userTokenHasExpired()) {
            this.helper.showConfirmLogin();
        }
        else {
            if (!this.globalVars.isTablet || (!this.currentEvent || this.currentEvent.Id != event.Id)) {
                this.currentEvent = event;
                if (!this.globalVars.isTablet)
                    this.nav.push(CalendarDetailPage, { eventData: event });
                else
                    this.calendarDetailComponent.getEventDetailData(event);
            }
        }
    }
    /*End Detail*/
}
