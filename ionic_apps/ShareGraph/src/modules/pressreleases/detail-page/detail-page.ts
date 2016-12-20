import { Component, ViewChild } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Helper } from '../../../common/helper';
import { PressReleasesDetailComponent } from '../component/detail-component';

@Component({
    selector: 'page-hp-detail',
    templateUrl: 'detail-page.html'
})
export class PressReleasesDetailPage {

    @ViewChild(PressReleasesDetailComponent) prDetailComponent: PressReleasesDetailComponent;
    headerTitle: string;
    prMasterData: any;

    constructor(public navParams: NavParams, public helper: Helper) {
        this.prMasterData = this.navParams.get("prData");
        this.headerTitle = this.prMasterData.Title;
    }

    /*-----Page Event----*/
    ionViewDidLoad() {
        this.prDetailComponent.getPrDetailData(this.prMasterData);
    }
    ionViewDidEnter() {
        this.helper.checkAppStatus();
    }
    /*-----End Page Event----*/

}
