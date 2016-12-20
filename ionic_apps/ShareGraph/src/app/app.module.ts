import { NgModule } from '@angular/core';

import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MyIRApp } from './app.component';

//Pages
import { HomePage } from '../modules/home/home';
import {AboutPage} from '../modules/about/about';
import {CalendarPage} from '../modules/calendar/calendar';
import {ContactPage} from '../modules/contact/contact';
import {HistoricalPricePage} from '../modules/historicalprice/historicalprice';
import {InvestmentCalculatorPage} from '../modules/investmentcalculator/investmentcalculator';
import {KeyFinancialsPage} from '../modules/keyfinancials/keyfinancials';
import {MediaPage} from '../modules/media/media';
import {PressReleasesPage} from '../modules/pressreleases/pressreleases';
import {ReportsPage} from '../modules/reports/reports';
import {SettingsPage} from '../modules/settings/settings';
import {ShareGraphPage} from '../modules/sharegraph/sharegraph';
import {ShareInformationPage} from '../modules/shareinformation/shareinformation';

import {MediaDetailPage} from '../modules/media/media-detail';
import {MediaDownloadPopup} from '../modules/media/media-download-confirm/media-download-confirm';
import {MediaSharePopup} from '../modules/media/media-share/media-share';

import {KeyFinancialsPhoneDetailPage} from '../modules/keyfinancials/keyfinancialsPhoneDetail';

import {CompareTab} from '../modules/sharegraph/comparetab/comparetab';
import {ChartsPage} from '../modules/sharegraph/comparetab/charts/charts';
import {ComparePage} from '../modules/sharegraph/comparetab/compare/compare';
import {PerformancePage} from '../modules/sharegraph/comparetab/performance/performance';

import {ICalDetailPage} from '../modules/investmentcalculator/detail-page/detail-page';
import {ICalDetailComponent} from '../modules/investmentcalculator/component/detail-component';
import {ICalComparePage} from '../modules/investmentcalculator/compare/compare';

import {HPDetailPage} from '../modules/historicalprice/detail-page/detail-page';
import {HPDetailComponent} from '../modules/historicalprice/component/detail-component';
import {HPWatchListPage} from '../modules/historicalprice/watchlist/watchlist';

import {PressReleasesDetailPage} from '../modules/pressreleases/detail-page/detail-page';
import {PressReleasesDetailComponent} from '../modules/pressreleases/component/detail-component';

import {CalendarDetailPage} from '../modules/calendar/detail-page/detail-page';
import {CalendarDetailComponent} from '../modules/calendar/component/detail-component';

/*Settings - General*/
import {SettingAboutPage} from '../modules/settings/general/about/about';
import {SettingHelpPage} from '../modules/settings/general/help/help';
import {CurrencyPage} from '../modules/settings/general/currency/currency';
import {DecimalSeparatorPage} from '../modules/settings/general/decimalseparator/decimalseparator';
import {LanguagePage} from '../modules/settings/general/language/language';
import {MenuImagePage} from '../modules/settings/general/menuimage/menuimage';
import {ChooseImagePage} from '../modules/settings/general/menuimage/chooseimage/chooseimage';
import {NotificationsPage} from '../modules/settings/general/notifications/notifications';
import {QuickMenuPage} from '../modules/settings/general/quickmenu/quickmenu';
import {SortMenuPage} from '../modules/settings/general/quickmenu/sortmenu/sortmenu';
import {StreamPage} from '../modules/settings/general/stream/stream';

/*Settings - Profile - Account*/
import {AccountPage} from '../modules/settings/profile/account/account';
import {AccountComponent} from '../modules/settings/profile/account/component/account-component';
import {SettingWatchlistPage} from '../modules/settings/profile/watchlist/watchlist';
import {WatchlistIntroduction} from '../modules/settings/profile/watchlist/introduction/introduction';
import {WatchlistStocksPage} from '../modules/settings/profile/watchlist/stocks/stocks';
import {WatchlistAddStocks} from '../modules/settings/profile/watchlist/addnewstocks/addnewstocks'
import {IndicesPage} from '../modules/settings/profile/indices/indices';
import {IndicesStocksPage} from '../modules/settings/profile/indices/stocks/stocks';
import {IndicesAddStocks} from '../modules/settings/profile/indices/addnewstocks/addnewstocks'
import {IndicesIntroduction} from '../modules/settings/profile/indices/introduction/introduction';

/*Download*/
import { ConfirmDownloadPage } from '../modules/startdownload/confirmdownload/confirmdownload';
import { StartDownloadPage } from '../modules/startdownload/startdownload';

/*Settings - Profile - Account - Account Info*/
import {AccountInfoPage} from '../modules/settings/profile/account/accountinfo/accountinfo';
import {AccountInfoComponent} from '../modules/settings/profile/account/accountinfo/component/accountinfo-component';

/*Settings - Profile - Account - ChangePassword*/
import {ChangePasswordPage} from '../modules/settings/profile/account/changepassword/changepassword';
import {ChangePasswordComponent} from '../modules/settings/profile/account/changepassword/component/changepassword-component';

/*Settings - Profile - Account - Create Account*/
import {CreateAccountPage} from '../modules/settings/profile/account/createaccount/createaccount';
import {CreateAccountComponent} from '../modules/settings/profile/account/createaccount/component/createaccount-component';

/*Settings - Profile - Account - Forgot Pass*/
import {ForgotPasswordPage} from '../modules/settings/profile/account/forgotpassword/forgotpassword';
import {ForgotPasswordComponent} from '../modules/settings/profile/account/forgotpassword/component/forgotpassword-component';

/*Settings - Profile - Account - Signin*/
import {SignInPage} from '../modules/settings/profile/account/signin/signin';
import {SignInComponent} from '../modules/settings/profile/account/signin/component/signin-component';

/*Compornents*/
import {ScrollTabComponent} from '../components/scrolltab/scrolltab';
import {ProgressBar} from '../components/progressbar/progressbar';
import {DownloadConfirm} from '../components/download-confirm/download-confirm';
import {PopoverComponent} from '../components/popover/popover';

//Common
import { GlobalVars } from '../common/global-vars'; 
import { Helper } from '../common/helper'; 

//Providers
import { AppConfigService } from '../providers/appconfig-service';
import { TranslationService } from '../providers/translation-service';
import { AuthService } from '../providers/auth-service';
import { ProfileService } from '../providers/profile-service'; 
import { FormatNumber } from '../pipes/formatnumber';

@NgModule({
    declarations: [
        MyIRApp,
        HomePage,
        AboutPage,
        CalendarPage,
        ContactPage,
        HistoricalPricePage,
        InvestmentCalculatorPage,
        KeyFinancialsPage,
        MediaPage,
        MediaDetailPage,
        MediaDownloadPopup,
        MediaSharePopup,
        KeyFinancialsPhoneDetailPage,
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
        ICalDetailComponent,
        ICalComparePage,
        HPDetailPage,
        HPDetailComponent,
        PressReleasesDetailPage,
        PressReleasesDetailComponent,
        CalendarDetailPage,
        CalendarDetailComponent,
        DownloadConfirm,
        PopoverComponent,
        SettingAboutPage,
        SettingHelpPage,
        CurrencyPage,
        DecimalSeparatorPage,
        LanguagePage,
        MenuImagePage,
        ChooseImagePage,
        NotificationsPage,
        QuickMenuPage,
        SortMenuPage,
        StreamPage,
        AccountPage,
        AccountComponent,
        AccountInfoPage,
        AccountInfoComponent,
        ChangePasswordPage,
        ChangePasswordComponent,
        CreateAccountPage,
        CreateAccountComponent,
        ForgotPasswordPage,
        ForgotPasswordComponent,
        SignInPage,
        SignInComponent,
        HPWatchListPage,
        SettingWatchlistPage,
        WatchlistIntroduction,
        WatchlistStocksPage,
        WatchlistAddStocks,
        IndicesPage,
        IndicesStocksPage,
        IndicesAddStocks,
        IndicesIntroduction,
        ConfirmDownloadPage,
        StartDownloadPage
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
        InvestmentCalculatorPage,
        ICalComparePage,
        KeyFinancialsPage,
        MediaDetailPage,
        MediaDownloadPopup,
        MediaSharePopup,
        KeyFinancialsPhoneDetailPage,
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
        ICalDetailPage,
        HPDetailPage,
        PressReleasesDetailPage,
        CalendarDetailPage,
        DownloadConfirm,
        PopoverComponent,
        SettingAboutPage,
        SettingHelpPage,
        CurrencyPage,
        DecimalSeparatorPage,
        LanguagePage,
        MenuImagePage,
        ChooseImagePage,
        NotificationsPage,
        QuickMenuPage,
        SortMenuPage,
        StreamPage,
        AccountPage,
        AccountInfoPage,
        ChangePasswordPage,
        CreateAccountPage,
        ForgotPasswordPage,
        SignInPage,
        HPWatchListPage,
        SettingWatchlistPage,
        WatchlistIntroduction,
        WatchlistStocksPage,
        WatchlistAddStocks,
        IndicesPage,
        IndicesStocksPage,
        IndicesAddStocks,
        IndicesIntroduction,
        ConfirmDownloadPage,
        StartDownloadPage
    ],
    providers: [Storage, GlobalVars, Helper, AppConfigService, TranslationService, AuthService, ProfileService]
})
export class AppModule { }
