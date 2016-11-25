import { Component, ViewChild } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Helper } from '../../../common/helper';
import { HPDetailComponent } from '../component/detail-component';

@Component({
    selector: 'page-hp-detail',
    templateUrl: 'detail-page.html'
})
export class HPDetailPage {

    @ViewChild(HPDetailComponent) hpDetailComponent: HPDetailComponent;
    headerTitle: string;

    constructor(public navParams: NavParams, helper: Helper) {
        this.headerTitle = helper.getPhrase("HistoricalPrice", "Common");
    }

    /*Page Events*/
    ionViewDidLoad() {
        let paramData = this.navParams.get("data");
        this.hpDetailComponent.genHistoricalPriceContent(paramData.instrumentId, paramData.selectedDate, paramData.decimalDigits, paramData.currency);
    }

}
