import { Component, ViewChild } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Helper } from '../../../common/helper';
import { ICalDetailComponent } from '../component/detail-component';

@Component({
    selector: 'page-ical-detail',
    templateUrl: 'detail-page.html'
})
export class ICalDetailPage {

    @ViewChild(ICalDetailComponent) iCalDetailComponent: ICalDetailComponent;
    headerTitle: string;

    constructor(public navParams: NavParams, helper: Helper) {
        this.headerTitle = helper.getPhrase("InvestmentCalculator", "Common");
    }

    /*Page Events*/
    ionViewDidLoad() {
        let inputData = this.navParams.get("inputData");
        this.iCalDetailComponent.getICalData(inputData);
    }

}
