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

    constructor(public nav: NavController, public navParams: NavParams, public helper: Helper, public globalVars: GlobalVars, public profileService: ProfileService) {
    }
}
