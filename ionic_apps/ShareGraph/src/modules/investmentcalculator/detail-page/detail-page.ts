import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Helper } from '../../../common/helper';
import { GlobalVars } from '../../../common/global-vars';
import { ICalDetailComponent } from '../component/detail-component';

@Component({
    selector: 'page-ical-detail',
    templateUrl: 'detail-page.html'
})
export class ICalDetailPage {

    @ViewChild(ICalDetailComponent) iCalDetailComponent: ICalDetailComponent;
    headerTitle: string;

    constructor(public navParams: NavParams, public helper: Helper, public view: ViewController, public globalVars: GlobalVars) {
        this.setHeaderTitle();
    }

    setHeaderTitle() {
        this.headerTitle = this.helper.getPhrase("InvestmentCalculator", "Common");
    }

    /*Page Events*/
    ionViewDidLoad() {
        let inputData = this.navParams.get("inputData");
        this.iCalDetailComponent.getICalData(inputData);
    }

    /*Changed Settings*/
    ionViewWillEnter() {
        if (this.globalVars.changedLanguage || this.globalVars.changedDecimalSeparator || this.globalVars.changedCurrency) {
            if (this.globalVars.changedLanguage) {
                this.setHeaderTitle();
                this.iCalDetailComponent.getPhrases();
                this.iCalDetailComponent.getInstrumentName();
                this.view.setBackButtonText(this.helper.getPhrase("Back"));
            }
            if (this.globalVars.changedCurrency) {
                let masterData = this.iCalDetailComponent.masterData;
                let currency = "";
                if (this.globalVars.generalSettings.currency.isDefault) {
                    let instrument = this.globalVars.configData.common.instruments.filter(instrument => instrument.instrumentid == this.iCalDetailComponent.unit);
                    if (instrument.length > 0) {
                        currency = instrument[0].currencycode;
                    }
                }
                else {
                    currency = this.globalVars.generalSettings.currency.value;
                }
                masterData.unit = currency;
                this.iCalDetailComponent.getICalData(masterData);
            }
            else if (this.globalVars.changedDecimalSeparator) {
                let icalData = this.iCalDetailComponent.icalData;
                this.iCalDetailComponent.createDefaultData();
                setTimeout(() => {
                    this.iCalDetailComponent.icalData = icalData;
                }, 100);
            }
        }
    }
}
