import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Helper } from '../../../common/helper';
import { GlobalVars } from '../../../common/global-vars';
import { ChartsPage} from './charts/charts';
import { PerformancePage} from './performance/performance';
import { ComparePage} from './compare/compare';
import { ProfileService } from '../../../providers/profile-service';

@Component({
    selector: 'compare-tab',
    templateUrl: 'comparetab.html'
})
export class CompareTab {
    moduleName = "ShareGraph";
    headerTitle: string;
    rootParams: any;
    chartsText: string;
    compareText: string;
    performanceText: string;
    charts: any;
    compare: any;
    performance: any;
    type: string;

    constructor(public nav: NavController, public navParams: NavParams, public view: ViewController, public helper: Helper, public globalVars: GlobalVars, public profileService: ProfileService) {
        //Get params from Sharegraph page
        let params = this.navParams.get("params");
        let compareData = [];
        this.type = params.type;
        if (params.type == "watchlist") {
            this.headerTitle = this.helper.getPhrase("Watchlist");
            compareData = this.profileService.getWatchlistConfig();
        }
        else {
            this.headerTitle = this.helper.getPhrase("Indices");
            compareData = this.profileService.getIndicesConfig();
        }

        //Append compare data to params
        params.compareData = compareData;
        //Set root params
        this.rootParams = params;

        this.chartsText = this.helper.getPhrase("Charts", this.moduleName);
        this.compareText = this.helper.getPhrase("Compare", this.moduleName);
        this.performanceText = this.helper.getPhrase("Performance", this.moduleName);
        this.charts = ChartsPage;
        this.compare = ComparePage;
        this.performance = PerformancePage;
    }

    ionViewWillEnter() {
        this.globalVars.currentModule = this.navParams.get("params").type;
    }

    closeModal() {
        //this.globalVars.isCloseCompareModal = true;
        this.view.dismiss();
    }
    
}
