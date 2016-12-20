import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';
import {Helper} from '../../../common/helper';
import { GlobalVars } from '../../../common/global-vars';
import {DownloadService} from '../../../providers/download-service';
import {MediaService} from '../../../providers/media-service';
@Component({
    selector: 'start-download-confirm',
    templateUrl: 'confirmdownload.html',
    providers: [DownloadService, MediaService]
})
export class ConfirmDownloadPage {
    downloadLength:any=0;
    mediaCategory:any=[];

    constructor(public nav: NavController, navParams:NavParams, public view:ViewController, public helper:Helper, 
                public downloadService: DownloadService, public mediaService: MediaService, public globalVars:GlobalVars) {
        this.downloadLength = navParams.get("length");
        //Create folders
        helper.createFolder("Reports");
        
        mediaService.loadCategory(globalVars.companyCode, 'en-GB').then(data=>{
            this.mediaCategory = data;
            this.mediaCategory.forEach(function(f){
                helper.createTreeFolder(["Media",[f.Id]]);
            });
        });
    }

    closeConfirm(){
        this.downloadService.setDownloadQueue([]);
        this.view.dismiss();
    }

    startDownload(){
        this.view.dismiss({isStarting:true});
    }
}