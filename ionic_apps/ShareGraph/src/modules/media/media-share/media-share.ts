import {Component} from '@angular/core';
import {ViewController, NavController, NavParams} from 'ionic-angular';

@Component({
    templateUrl: './media-share.html'
})

export class MediaSharePopup {
    scope:any;

    constructor(public viewCtrl: ViewController, public nav: NavController, public navParams: NavParams) {
        this.viewCtrl = viewCtrl;
        this.nav = nav;
        this.navParams = navParams;
        this.scope = navParams.data.scope;
    }

    close() {
        this.viewCtrl.dismiss();
    }

    facebookSharing(){
        this.close();
        this.scope.shareWithFacebook();
    }

    twitterSharing(){
        this.close();
        this.scope.shareWithTwitter();
    }

    linkedinSharing(){
        this.close();
        this.scope.shareWithLinkedIn();
    }

    emailSharing(){
        this.close();
        this.scope.shareWithEmail();
    }
}
