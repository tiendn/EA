import {NavParams, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';
import {GlobalVars} from '../../common/global-vars';
import {Helper} from '../../common/helper';

@Component({
    selector: 'progress-tab',
    templateUrl: 'progressbar.html'
})

export class ProgressBar {

    fileName: string;
    progressPercent: string = "0px";
    isShowFooter: boolean = false;
    moveToBGText: string;
    cancelText: string;

    constructor(public navParams: NavParams, public viewCtrl: ViewController, public globalVars: GlobalVars, public helper: Helper) {
        this.fileName = this.navParams.get("filename");
        this.viewCtrl = viewCtrl;
        this.globalVars.progressBar = this;
    }

    ionViewDidLoad() {
        if (this.navParams.get("showFooter") == true) {
            if (!this.moveToBGText)
                this.moveToBGText = this.helper.getPhrase("MoveToBackground", "Report");
            if (!this.cancelText)
                this.cancelText = this.helper.getPhrase("Cancel", "Report");
            this.isShowFooter = true;
        }
    }

    closeModal(isComplete = false) {
        this.viewCtrl.dismiss({ complete: isComplete });
    }

    setProgressPercentage(percent) {
        this.progressPercent = percent + "%";
    }

    moveToBG() {
        this.viewCtrl.dismiss({ status: "moveToBG" });
    }

    cancel() {
        this.viewCtrl.dismiss({ status: "abort" });
    }
}