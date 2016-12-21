import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Helper } from '../../../common/helper';
import { GlobalVars } from '../../../common/global-vars';
import { HPDetailComponent } from '../component/detail-component';

@Component({
    selector: 'page-hp-detail',
    templateUrl: 'detail-page.html'
})
export class HPDetailPage {

    @ViewChild(HPDetailComponent) hpDetailComponent: HPDetailComponent;
    headerTitle: string;

    constructor(public navParams: NavParams, public helper: Helper, public globalVars: GlobalVars, public view: ViewController) {
        this.headerTitle = helper.getPhrase("HistoricalPrice", "Common");
    }

    /*Page Events*/
    ionViewDidLoad() {
        let paramData = this.navParams.get("data");
        this.hpDetailComponent.genHistoricalPriceContent(paramData.instrumentId, paramData.selectedDate, paramData.decimalDigits, paramData.currency);
    }

    /**
     * Changed Settings
     */
    ionViewWillEnter() {
        if (this.globalVars.changedLanguage || this.globalVars.changedDecimalSeparator || this.globalVars.changedCurrency) {
            if (this.globalVars.changedLanguage) {
                this.headerTitle = this.helper.getPhrase("HistoricalPrice", "Common");
                this.hpDetailComponent.getPhrases();
                this.hpDetailComponent.getInstrumentName();
                this.view.setBackButtonText(this.helper.getPhrase("Back"));
            }
            if (this.globalVars.changedCurrency) {
                let currency = "";
                if (this.globalVars.generalSettings.currency.isDefault) {
                    let instrument = this.globalVars.configData.common.instruments.filter(instrument => instrument.instrumentid == this.hpDetailComponent.instrumentId);
                    if (instrument.length > 0) {
                        currency = instrument[0].currencycode;
                    }
                }
                else {
                    currency = this.globalVars.generalSettings.currency.value;
                }
                this.hpDetailComponent.currency = currency;
            }
            this.hpDetailComponent.refreshHistoricalPriceContent();
        }
    }
}
