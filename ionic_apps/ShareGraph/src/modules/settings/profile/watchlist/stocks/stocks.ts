import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';
import {Helper} from '../../../../../common/helper';
import {WatchlistAddStocks} from '../addnewstocks/addnewstocks';
import { GlobalVars } from '../../../../../common/global-vars';
import {ProfileService} from '../../../../../providers/profile-service';

@Component({
    selector: 'setting-watchlist-stocks',
    templateUrl: 'stocks.html',
    providers: [ProfileService]
})
export class WatchlistStocksPage {
    canEdit:any=false;
    isedit:any=false;
    selectedShare:any = [];
    editText: string = "Edit";
    headerTitle: string;
    deleteText: string;
    backText: string;
    addNewStocks:string;
    isRtl:any=false;
    SlideItem:any;
    constructor(public nav: NavController, navParams: NavParams, public helper: Helper, public viewCtrl: ViewController, public profileService: ProfileService, public globalVars: GlobalVars) {
        
        this.canEdit = this.isedit = false;
        this.selectedShare = [];

        this.editText = "Edit";
        this.headerTitle = this.helper.getPhrase("Watchlist", "ShareGraph");
        this.deleteText = this.helper.getPhrase("Delete", "Common");
        this.backText = this.helper.getPhrase("Back", "Common");
        this.addNewStocks = this.helper.getPhrase("AddNewStocks", "Settings");

        this.isRtl = this.globalVars.isArabic;
    }

    ionViewLoaded(){
    }

    gotoAddNewStock(){
        this.nav.push(WatchlistAddStocks);
    }

    editWatchList(){
        if(!this.isedit)
        {
            if(this.SlideItem)
            {
                this.SlideItem.close();
            }

            this.isedit = true;
            this.editText = "Done";
        }
        else
        {
            this.isedit=false;
            this.editText = "Edit";
            this.canEdit = this.selectedShare.length>0;
            //Save watchlist after done button is clicked
            this.saveWatchlist(this.selectedShare);
        }
    }

    removeItem(item){
        for(var i = 0; i < this.selectedShare.length; i++) {
            if(this.selectedShare[i] == item){
                this.selectedShare.splice(i, 1);
            }
        }
        if(!this.isedit)
        {
            this.canEdit = this.selectedShare.length>0;
        }
        
        this.saveWatchlist(this.selectedShare);
    }

    ionViewWillEnter(){
        this.selectedShare = this.globalVars.profileSettings.watchlist;
        this.canEdit = this.selectedShare && this.selectedShare.length>0;
    }

    logDrag(item){
        this.SlideItem= item;
    }

    goBack()
    {
        this.saveWatchlist(this.selectedShare);

        this.nav.pop();
    }

    saveWatchlist(lstShares)
    {
        this.globalVars.profileSettings.watchlist = lstShares;
        //Save watchlist to database
        var arrInstrumentID = [];
        lstShares.forEach(function(item){
            arrInstrumentID.push(item.Id);
        })
        
        if(arrInstrumentID.length>0)
        {
            this.profileService.saveWatchlistData("watchlist", arrInstrumentID.toString());
        }
    }

    reorderItems(indexes)
    {
        let element = this.selectedShare[indexes.from];
        this.selectedShare.splice(indexes.from, 1);
        this.selectedShare.splice(indexes.to, 0, element);
    }

    openDisclaimerLink(){
        let disclaimerLink = "https://www.euroland.com/disclaimer/"+ this.globalVars.generalSettings.language.value +".html";
        this.helper.openExternalLink(disclaimerLink);
    }
}
