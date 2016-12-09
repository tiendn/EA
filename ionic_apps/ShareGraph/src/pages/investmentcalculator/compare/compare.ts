import {Component, Renderer} from '@angular/core';
//import { NavController, NavParams, ViewController} from 'ionic-angular';
import { NavParams, ViewController} from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import {Helper} from '../../../common/helper';
import {ICalService} from '../../../providers/ical-service';
import { GlobalVars } from '../../../common/global-vars';

@Component({
    selector: 'page-ical-compare',
    templateUrl: 'compare.html',
    providers :[ICalService]
    
})

export class ICalComparePage {
    private data = [];
    private modulename = "InvestmentCalculator";
    private type;
    private loadDone = false; // Kiem tra nap xong data chua , nap xong thi hien dong chu
    private lstId ; 
    private watchlistText;
    private fromText = "";
    private toText = "";
    private changeText = "";
    private changePercentText = "";
    private footerText ;
    private fDateValue;
    private eDateValue;
    private decimalDigits;
    constructor(public navParams: NavParams, public helper: Helper, public viewCtrl: ViewController,
        public sanitizationService: DomSanitizer, public globalVars: GlobalVars, public iCalService: ICalService, public renderer: Renderer) {
        this.lstId = this.getWatchlistIDs(); //Get watchlist share ids from config
        this.fromText = helper.getPhrase("From", this.modulename);
        this.toText = helper.getPhrase("To", this.modulename);
        this.changeText = helper.getPhrase("Change", this.modulename);
        this.changePercentText = helper.getPhrase("ChangePercent", this.modulename);
        this.footerText = sanitizationService.bypassSecurityTrustHtml(helper.getPhrase("Footer",this.modulename).replace("<a>","<a class='link-to-settings' id='ical_linktosettings'>"));
    }

    //The function make to separate wathlist share id
    getWatchlistIDs()
    {
        var lstWatchlistShare = this.globalVars.profileSettings.watchlist;
        var lstWatchlistArray = [];
        
        this.globalVars.configData.common.instruments.forEach((item) => {
            lstWatchlistArray.push(item.instrumentid);
        });

        lstWatchlistShare.forEach(function(item, index){
            lstWatchlistArray.push(item.Id);
        })

        return lstWatchlistArray.toString();
    }

    closeModal(){
        this.viewCtrl.dismiss();
    }

    ionViewDidLoad(){
        let params = this.navParams.get("data");
        this.type = this.navParams.get("type");
        this.watchlistText = this.type == "watchlist" ? this.helper.getPhrase("Watchlist", this.modulename) : this.helper.getPhrase("Indices", this.modulename);;
        this.fDateValue = params.dSDate;
        this.eDateValue = params.dEDate;
        this.decimalDigits = params.decimalDigits;
        this.iCalService.getCompareData(this.type, this.lstId , params.pSDate, params.pEDate).then(data => {
            if(data != null && data instanceof Array && data.length > 0){
                this.data = data;
            }
            this.loadDone = true;
            if (this.type == "indices") 
                this.footerText = "";

            if (this.footerText != "") {
                this.renderer.listen(document.getElementById("ical_linktosettings"), 'click', (event) => {
                    //this.nav.push(this.helper.getPage("settings"));
                    this.viewCtrl.dismiss({ goToSettings: true });
                });
            }
        });
    }
}
