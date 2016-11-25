import { NgModule } from '@angular/core';

import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MyIRApp } from './app.component';

//Pages
import { HomePage } from '../pages/home/home';
import {AboutPage} from '../pages/about/about';
import {CalendarPage} from '../pages/calendar/calendar';
import {ContactPage} from '../pages/contact/contact';
import {HistoricalPricePage} from '../pages/historicalprice/historicalprice';
import {HPWatchListPage} from '../pages/historicalprice/watchlist/watchlist';
import {HPDetailPage} from '../pages/historicalprice/detail-page/detail-page';
import {HPDetailComponent} from '../pages/historicalprice/component/detail-component';
import {InvestmentCalculatorPage} from '../pages/investmentcalculator/investmentcalculator';
import {KeyFinancialsPage} from '../pages/keyfinancials/keyfinancials';
import {MediaPage} from '../pages/media/media';
import {PressReleasesPage} from '../pages/pressreleases/pressreleases';
import {ReportsPage} from '../pages/reports/reports';
import {SettingsPage} from '../pages/settings/settings';
import {ShareGraphPage} from '../pages/sharegraph/sharegraph';
import {ShareInformationPage} from '../pages/shareinformation/shareinformation';
import {CompareTab} from '../pages/sharegraph/comparetab/comparetab';
import {ChartsPage} from '../pages/sharegraph/comparetab/charts/charts';
import {ComparePage} from '../pages/sharegraph/comparetab/compare/compare';
import {PerformancePage} from '../pages/sharegraph/comparetab/performance/performance';

import {ICalDetailPage} from '../pages/investmentcalculator/detail-page/detail-page';
import {ICalDetailComponent} from '../pages/investmentcalculator/component/detail-component';

/*Compornents*/
import {ScrollTabComponent} from '../components/scrolltab/scrolltab';
import {ProgressBar} from '../components/progressbar/progressbar';

//Common
import { GlobalVars } from '../common/global-vars'; 
import { Helper } from '../common/helper'; 
//Providers
import { AppConfigService } from '../providers/appconfig-service';
import { TranslationService } from '../providers/translation-service';
import { AuthService } from '../providers/auth-service';
import { ProfileService } from '../providers/profile-service'; 
import { FormatNumber } from '../pipes/formatnumber';
import { HistoricalPriceService } from '../providers/historicalprice-service';
@NgModule({
    declarations: [
        MyIRApp,
        HomePage,
        AboutPage,
        CalendarPage,
        ContactPage,
        HistoricalPricePage,
        HPWatchListPage,
        HPDetailPage,
        HPDetailComponent,
        InvestmentCalculatorPage,
        KeyFinancialsPage,
        MediaPage,
        PressReleasesPage,
        ReportsPage,
        SettingsPage,
        ShareGraphPage,
        ShareInformationPage,
        CompareTab,
        ChartsPage,
        ComparePage,
        PerformancePage,
        ScrollTabComponent,
        FormatNumber,
        ProgressBar,
        ICalDetailPage,
        ICalDetailComponent
    ],
    imports: [
        IonicModule.forRoot(MyIRApp, {
            tabsPlacement: "top"
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyIRApp,
        HomePage,
        AboutPage,
        CalendarPage,
        ContactPage,
        HistoricalPricePage,
        HPWatchListPage,
        HPDetailPage,
        HPDetailComponent,
        InvestmentCalculatorPage,
        KeyFinancialsPage,
        MediaPage,
        PressReleasesPage,
        ReportsPage,
        SettingsPage,
        ShareGraphPage,
        ScrollTabComponent,
        ShareInformationPage,
        CompareTab,
        ChartsPage,
        ComparePage,
        PerformancePage,
        ProgressBar,
        ICalDetailPage
    ],
    providers: [Storage, GlobalVars, Helper, AppConfigService, TranslationService, AuthService, ProfileService,HistoricalPriceService]
})
export class AppModule { }
