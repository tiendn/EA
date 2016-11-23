import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Helper } from '../../../../common/helper';
import { GlobalVars } from '../../../../common/global-vars';
//import { ChartsPage} from './charts/charts';
//import { PerformancePage} from './performance/performance';
//import { ComparePage} from './compare/compare';
import { ProfileService } from '../../../../providers/profile-service';

@Component({
    selector: 'page-performance',
    templateUrl: 'performance.html'
})
export class PerformancePage {
    moduleName : string = "ShareGraph";
    itemHeader : any;
    data : any = [];
    constructor(public nav: NavController, public navParams: NavParams, public helper: Helper,
     public globalVars: GlobalVars, public profileService: ProfileService) {
        this.moduleName = "ShareGraph";
        this.itemHeader = [helper.getPhrase("Button6Month", this.moduleName),helper.getPhrase("52W", this.moduleName),helper.getPhrase("YTD", this.moduleName)];
    }

    getInstrumentIds(compareData)
    {
        let lstInstrumentIDs = [];

        this.globalVars.configData.common.instruments.forEach((item) => {
            lstInstrumentIDs.push(item.instrumentid);
        });

        compareData.forEach((item)=>{
            lstInstrumentIDs.push(item.Id);
        })

        return lstInstrumentIDs.toString();
    }

    ionViewDidLoad(){
        this.helper.showLoading(this);
        let iDs = this.getInstrumentIds(this.navParams.data.compareData);
        this.profileService.getPerformanceData(this.navParams.data.type, iDs).then(data => {
            this.data = data;
            this.helper.hideLoading(this);
        });
    }
    
}
