import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Helper } from '../../../../common/helper';
import { GlobalVars } from '../../../../common/global-vars';
//import { ChartsPage} from './charts/charts';
//import { PerformancePage} from './performance/performance';
//import { ComparePage} from './compare/compare';
import { ProfileService } from '../../../../providers/profile-service';

@Component({
    selector: 'page-compare',
    templateUrl: 'compare.html'
})
export class ComparePage {
    data : any = [];
    moduleName : string = "ShareGraph";
    dateTitle : string ;
    footerContent : string[];
    currency: boolean;
    constructor(public nav: NavController, public navParams: NavParams, public helper: Helper, public globalVars: GlobalVars, public profileService: ProfileService) {
        let rootParams = this.navParams.data;
        let iDs = this.getInstrumentIds(rootParams.compareData);
        helper.showLoading(this);
        if (rootParams.type === "watchlist"){
            this.dateTitle = helper.getPhrase("Today", this.moduleName);
            this.footerContent = ['All share data is presented in the currency of your choice. Configure via ','setting','.'];
            this.currency = true;
        }
        else{
            this.dateTitle = helper.getPhrase("EndOfDay", this.moduleName);
            this.footerContent = ['','',''];
            this.currency = false;
        }
        this.profileService.getCompareData(rootParams.type, iDs).then(data => {
            this.data = data;
            helper.hideLoading(this);
        });
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
}
