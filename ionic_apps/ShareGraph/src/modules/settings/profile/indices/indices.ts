import {NavController, NavParams, ViewController, ModalController} from 'ionic-angular';
import {Component} from '@angular/core';
import {Helper} from '../../../../common/helper';
import { GlobalVars } from '../../../../common/global-vars';

import {AccountPage} from '../account/account';
import {AccountInfoPage} from '../account/accountinfo/accountinfo';
import {IndicesStocksPage} from './stocks/stocks';
import {AuthService} from '../../../../providers/auth-service';
import {IndicesIntroduction} from './introduction/introduction';
import {ProfileService} from '../../../../providers/profile-service';
import { SignInPage } from '../account/signin/signin';
import { CreateAccountPage } from '../account/createaccount/createaccount';

@Component({
    selector: 'setting-indices-page',
    templateUrl: 'indices.html',
    providers: [ProfileService]
})

export class IndicesPage {
    moduleName = "indices";
    headerTitle: string;
    accText: string;
    editText: string;
    enableIndices: any = false;
    hasLoggedIn: any=false;
    loggedInAs: string;
    enableWatchlistText:string;
    numberOfShare: any=0;

    constructor(public nav: NavController, 
                navParams: NavParams, 
                public modalCtrl: ModalController,
                public helper: Helper, 
                public globalVars: GlobalVars,
                public viewCtrl: ViewController, 
                public authServices:AuthService, 
                public profileService: ProfileService) {
        this.editText = "Edit";
        this.headerTitle = this.helper.getPhrase("indices", "ShareGraph");
        this.accText = this.helper.getPhrase("CreateAccount", "Settings");
        this.enableIndices = false;
        this.hasLoggedIn = this.authServices.hasLoggedIn();
        this.loggedInAs = this.helper.getPhrase("LoggedIn", "Settings");
        if(!this.hasLoggedIn)
        {
            this.loggedInAs = "Create an account to configure indices";
        }
    }

    ionEnableIndicesChange(){
        if(this.globalVars.user)
        {
            this.globalVars.profileSettings.enableIndices = this.enableIndices;
            //this.authServices.setProfileSettingsData();
            this.profileService.saveWatchlistSetting('indices', this.enableIndices);
        }
    }

    gotoStocks(sender){
        this.nav.push(IndicesStocksPage, null);
    }

    ionViewWillEnter(){
        var self=this;
        this.enableIndices = this.globalVars.profileSettings.enableIndices;
        this.numberOfShare = this.globalVars.profileSettings.indices.length;

        this.hasLoggedIn = this.authServices.hasLoggedIn();
        if(this.hasLoggedIn){
            this.accText = this.authServices.getUserName();
        }
        else{
            this.accText = this.helper.getPhrase("Account", "Settings");
            //Show introduction page for user who not login
            //For first time only
            if(!this.globalVars.profileSettings.showIndicesIntroduction)
            {
                let introModal = this.modalCtrl.create(IndicesIntroduction);
                introModal.onDidDismiss(data => {
                    if(data.moduleName=='signin')
                    {
                        self.nav.push(SignInPage, {module: 'introduction'})
                    }
                    else if(data.moduleName=='signup')
                    {
                        self.nav.push(CreateAccountPage, {module: 'introduction'})
                    }
                });
                    introModal.present();
                this.globalVars.profileSettings.showIndicesIntroduction=true;
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