import { Component, Renderer } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Helper } from '../../../common/helper';
import { GlobalVars } from '../../../common/global-vars';
import { HistoricalPriceService } from '../../../providers/historicalprice-service';
//import {SettingsPage} from '../../../modules/settings/settings';

@Component({
    selector: 'page-hp-watchlist',
    templateUrl: 'watchlist.html',
    providers : [HistoricalPriceService]
})
export class HPWatchListPage {
    data : any = []; // Data
    loadDone : boolean = false; // Kiem tra nap xong data chua , nap xong thi hien dong chu
    moduleName : string = "InvestmentCalculator";
    watchListText : string ;
    dateText : string;
    closeText : string;
    volumeText : string;
    lstId : string;
    footerText : any;
    decimalDigits : number;
    dateValue : number;
    // hpriceServices : HistoricalPriceService;
    constructor(public navParams: NavParams, public viewCtrl: ViewController, public hpriceService: HistoricalPriceService,
        public helper: Helper, public globalVars: GlobalVars, public domSanitizer: DomSanitizer, public renderer: Renderer) {
        this.watchListText = helper.getPhrase("Watchlist", this.moduleName);
        this.dateText = helper.getPhrase("Date", this.moduleName);
        this.closeText = helper.getPhrase("Close", this.moduleName);
        this.volumeText = helper.getPhrase("Volume", this.moduleName);
        this.lstId = this.getWatchlistIDs(); //Get watchlist share ids from config
        this.footerText = domSanitizer.bypassSecurityTrustHtml(helper.getPhrase("Footer",this.moduleName).replace("<a>","<a class='link-to-settings' id='hp_linktosettings'>"));
    }

    getWatchlistIDs()
    {
        let ids = [];
        this.globalVars.configData.common.instruments.forEach((item) => {
            ids.push(item.instrumentid);
        });
        this.globalVars.profileSettings.watchlist.forEach((item) => {
            ids.push(item.Id);
        })
        return ids.toString();
    }

    closeModal(){
        this.viewCtrl.dismiss();
    }

    ionViewDidLoad(){
        let params = this.navParams.get("data");
        this.decimalDigits = params.decimalDigits;
        let selectedDateObj = params.selectedDate;
        this.dateValue = this.helper.dateFormat(new Date(selectedDateObj.year.value, (selectedDateObj.month.value - 1), selectedDateObj.day.value),this.globalVars.generalSettings.shortDateFormat);
        this.hpriceService.getWatchListData(this.lstId, params.paramDate).then(data => {
            if(data != null && data instanceof Array && data.length > 0){
                this.data = data;
            }
            // this.data = this.data.push( data);
            // this.data = this.data.push( data);
            this.loadDone = true;
        });
        setTimeout(() => {
            this.renderer.listen(document.getElementById("hp_linktosettings"), 'click', (event) => {
                //this.nav.push(this.helper.getPage("settings"));
                this.viewCtrl.dismiss({goToSettings: true});
            });
        }, 1000);
    }
}
