import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';
import {Helper} from '../../../../../common/helper';
import { GlobalVars } from '../../../../../common/global-vars';
import {IndicesAddStocks} from '../addnewstocks/addnewstocks';

import {ProfileService} from '../../../../../providers/profile-service';

@Component({
    selector: 'indices-stocks-page',
    templateUrl: 'stocks.html',
    providers: [ProfileService]
})
export class IndicesStocksPage {
    moduleName:any="indices";
    editText:string;
    headerTitle:string;
    backText:string;
    canEdit:any=false;
    isedit:any=false;
    selectedShare:any=[];
    isRtl:any=false;
    SlideItem:any;
    clsDeleteButton:string;
    constructor(public nav: NavController, 
                navParams: NavParams, 
                public helper: Helper, 
                public viewCtrl: ViewController, 
                public profileService: ProfileService, 
                public globalVars: GlobalVars) 
    {
        this.editText = "Edit";
        this.headerTitle = this.helper.getPhrase("Indices", "ShareGraph");
        this.backText = this.helper.getPhrase("Back", "Common");
        this.canEdit = this.isedit = false;
        this.selectedShare = [];

        this.isRtl = this.globalVars.isArabic;
        this.clsDeleteButton=this.isRtl?"delete-button-rtl":"";
    }

    ionViewLoaded(){
    }

    gotoAddNewStock(){
        this.nav.push(IndicesAddStocks);
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
            this.saveIndices(this.selectedShare);
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
        this.saveIndices(this.selectedShare);
    }

    logDrag(item){
        this.SlideItem= item;
    }

    goBack()
    {
        this.saveIndices(this.selectedShare);

        this.nav.pop();
    }

    reorderItems(indexes)
    {
        let element = this.selectedShare[indexes.from];
        this.selectedShare.splice(indexes.from, 1);
        this.selectedShare.splice(indexes.to, 0, element);

    }

    ionViewWillEnter(){
        this.selectedShare = this.globalVars.profileSettings.indices
        this.canEdit = this.selectedShare && this.selectedShare.length>0;
    }

    saveIndices(lstShares)
    {
        this.globalVars.profileSettings.indices = lstShares;
        //Save watchlist to database
        var arrInstrumentID = [];
        lstShares.forEach(function(item){
            arrInstrumentID.push(item.Id);
        })
        if(arrInstrumentID.length>0)
        {
            this.profileService.saveWatchlistData(this.moduleName, arrInstrumentID.toString());
        }
    }

    openDisclaimerLink(){
        let disclaimerLink = "https://www.euroland.com/disclaimer/"+ this.globalVars.generalSettings.language.value +".html";
        this.helper.openExternalLink(disclaimerLink);
    }
}
