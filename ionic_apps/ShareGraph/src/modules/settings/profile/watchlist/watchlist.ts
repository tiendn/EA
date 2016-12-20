import {NavController, NavParams, ModalController, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';
import {Helper} from '../../../../common/helper';
import { GlobalVars } from '../../../../common/global-vars';

import {AccountPage} from '../account/account';
import {AccountInfoPage} from '../account/accountinfo/accountinfo';
import {WatchlistStocksPage} from './stocks/stocks';
import {AuthService} from '../../../../providers/auth-service';
import {ProfileService} from '../../../../providers/profile-service';
import {WatchlistIntroduction} from './introduction/introduction';
import { SignInPage } from '../account/signin/signin';
import { CreateAccountPage } from '../account/createaccount/createaccount';

@Component({
    selector: 'setting-watchlist-page',
    templateUrl: 'watchlist.html',
    providers: [ProfileService]
})

export class SettingWatchlistPage {
    moduleName = "Watchlist";
    headerTitle: string;
    accText: string;
    editText: string;
    enableWatchlist: any = false;
    hasLoggedIn: any=false;
    loggedInAs: string;
    enableWatchlistText:string;
    numberOfShare: any=0;
    enableWatchlistCss:string;
    constructor(public nav: NavController, 
                navParams: NavParams, 
                public modalCtrl: ModalController, 
                public helper: Helper, 
                public globalVars: GlobalVars,
                public viewCtrl: ViewController, 
                public authServices: AuthService, 
                public profileService: ProfileService) {
        this.headerTitle = this.helper.getPhrase("Watchlist", "ShareGraph");
        this.accText = this.helper.getPhrase("CreateAccount", "Settings");
        this.editText = "Edit";
        this.enableWatchlist = false;
        this.hasLoggedIn = authServices.hasLoggedIn();
        this.loggedInAs = helper.getPhrase("LoggedIn", "Settings");
        this.enableWatchlistText = helper.getPhrase("EnableWatchlist", "Settings");
        if(!this.hasLoggedIn)
        {
            this.loggedInAs = "Create an account to configure watchlist";
        }
        else
        {
            this.enableWatchlistCss = 'setting-enable-watchlist';
        }
    }

    ionEnableWatchlistChange(){
        if(this.globalVars.user)
        {
            this.globalVars.profileSettings.enableWatchlist = this.enableWatchlist;
            this.profileService.saveWatchlistSetting('watchlist', this.enableWatchlist);
        }
    }

    gotoStocks(sender){
        this.nav.push(WatchlistStocksPage, null);
    }

    ionViewWillEnter(){
        var self=this;

        this.enableWatchlist = this.globalVars.profileSettings.enableWatchlist;
        this.numberOfShare = this.globalVars.profileSettings.watchlist.length;
        
        this.hasLoggedIn = this.authServices.hasLoggedIn();
        if(this.hasLoggedIn){
            this.accText = this.authServices.getUserName();
        }
        else{
            this.accText = this.helper.getPhrase("Account", "Settings");
            //Show introduction page for user who not login
            //For first time only
            if(!this.globalVars.profileSettings.showWatchlistIntroduction)
            {
                let introModal = this.modalCtrl.create(WatchlistIntroduction);
                introModal.onDidDismiss(data => {
                    if(data.moduleName=='signin')
                    {
                        self.nav.push(SignInPage, {module: 'introduction'});
                    }
                    else if(data.moduleName=='signup')
                    {
                        self.nav.push(CreateAccountPage, {module: 'introduction'})
                    }
                });
                    introModal.present();
                this.globalVars.profileSettings.showWatchlistIntroduction=true;
            }
        }
    }

    gotoAccount()
    {
        if(this.hasLoggedIn)
            this.nav.push(AccountInfoPage);
        else
            this.nav.push(AccountPage);
    }
}