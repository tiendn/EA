import {Component} from '@angular/core';
import {ViewController, NavController, NavParams} from 'ionic-angular';

@Component({
    templateUrl: './media-download-confirm.html'
})

export class MediaDownloadPopup {    
    header:string;
    scope:any;
    notification:string;
    yes:string;
    no:string;

    constructor(public viewCtrl: ViewController, public nav: NavController, public navParams: NavParams) {
        this.header = navParams.data.headerPiece + ' \"' + navParams.data.filename + '\"';
        this.notification = navParams.data.notification;
        this.yes = navParams.data.yes;
        this.no = navParams.data.no;
        this.scope = navParams.data.scope;
    }

    close() {
        this.viewCtrl.dismiss();
    }

    startD(){
        this.close();
        this.scope.startDownload();
    }
}
