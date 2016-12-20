import { Component, ViewChild } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Helper } from '../../../common/helper';
import { CalendarDetailComponent } from '../component/detail-component';

@Component({
    selector: 'page-calendar-detail',
    templateUrl: 'detail-page.html'
})
export class CalendarDetailPage {

    @ViewChild(CalendarDetailComponent) calendarDetailComponent: CalendarDetailComponent;
    headerTitle: string;
    eventData: any;

    constructor(public navParams: NavParams, public helper: Helper) {
        this.headerTitle = helper.getPhrase("Calendar", "Common");
        this.eventData = navParams.get("eventData");
    }

    ionViewDidLoad() {
        this.calendarDetailComponent.getEventDetailData(this.eventData);
    }

    ionViewDidEnter() {
        this.helper.checkAppStatus();
    }
}
