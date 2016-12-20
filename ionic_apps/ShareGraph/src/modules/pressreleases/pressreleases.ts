import { Component, ViewChild, Renderer } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Keyboard } from 'ionic-native';
import { Helper } from '../../common/helper';
import { GlobalVars } from '../../common/global-vars';
import { PressReleasesService } from '../../providers/pressreleases-service';
import { PressReleasesDetailPage } from './detail-page/detail-page';
import { PressReleasesDetailComponent } from './component/detail-component';

@Component({
    selector: 'page-pressreleases',
    templateUrl: 'pressreleases.html',
    providers: [PressReleasesService]
})
export class PressReleasesPage {

    @ViewChild(PressReleasesDetailComponent) prComponent: PressReleasesDetailComponent;
    @ViewChild('prListView') prListView;

    loading: any;
    searchQuery: string = "";
    prData: any = [];
    //currentGroup: number = 0;
    currentIndex: number = -1;
    groupDateFormat: string = "mmmm yyyy";
    searchKeyword: string = "";
    showSearchBox: boolean = false;
    showMessNoData: boolean = false;
    showContent: boolean = false;
    dateFormat: string;
    isOnline: boolean;
    pagesize: number;
    prDivMaster: any;
    onProgress: boolean;
    currentPRItem: any;
    loadmore: any;
    headerTitle: string;
    searchPlaceHolder: string;
    noDataText: string;
    currentGroup: string;
    isIpad: boolean = false;

    constructor(public nav: NavController, public helper: Helper, public prService: PressReleasesService, public globalVars: GlobalVars, public renderer: Renderer) {
        this.dateFormat = helper.getDateFormatWithoutYear();
        this.isOnline = globalVars.isOnline;
        this.isIpad = globalVars.isIpad;
        this.getAllPhrasesInPage();
    }

    /*-----Page Event----*/
    ionViewDidLoad() {
        this.helper.checkTokenExpired();
        this.helper.showLoading(this);
        if (window.innerWidth > window.innerHeight)
            this.pagesize = Math.ceil(window.innerWidth / 70);
        else
            this.pagesize = Math.ceil(window.innerHeight / 70);
        this.getPRData();
        if (this.globalVars.isIpad) {
            this.renderer.listen(this.prListView.nativeElement, 'scroll', (event) => {
                this.onDivScroll();
            })
        }
    }
    ionViewDidEnter() {
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    }
    onDivScroll() {
        if (!this.globalVars.activePage.onProgress && this.globalVars.activePage.prListView.nativeElement.scrollHeight - this.globalVars.activePage.prListView.nativeElement.scrollTop === this.globalVars.activePage.prListView.nativeElement.clientHeight) {
            this.globalVars.activePage.helper.showLoading(this.globalVars.activePage, "loading-left");
            this.globalVars.activePage.getPRData();
        }
    }
    /*-----End Page Event----*/

    /*-----Bind Data Master Page----*/
    getPRData() {
        this.onProgress = true;
        let lastDateNumeric = 0;
        let removeIds = "";
        if (this.prData.length > 0) {
            lastDateNumeric = this.prData[this.currentIndex].data[this.prData[this.currentIndex].data.length - 1].DateNumeric;
            let lstItemRemove = this.prData[this.currentIndex].data.filter(obj => obj.DateNumeric == lastDateNumeric);
            if (lstItemRemove.length > 0) {
                lstItemRemove.forEach(function (item) {
                    removeIds += item.Id + ",";
                });
            }
            if (removeIds.length > 0)
                removeIds = removeIds.slice(0, -1);
        }
        this.prService.getPRData(this.pagesize, lastDateNumeric, removeIds, this.searchKeyword).then(data => {
            if (data != null && data instanceof Array && data.length > 0) {
                this.showMessNoData = false;
                data.forEach((obj) => {
                    let dateNumeric = obj.DateNumeric.toString();
                    let group = dateNumeric.slice(0, 6);
                    let displayDate = new Date(dateNumeric.slice(0, 4), (parseFloat(dateNumeric.slice(4, 6)) - 1), dateNumeric.slice(6, 8));
                    if (this.currentGroup != group) {
                        this.currentGroup = group;
                        this.currentIndex++;
                        this.prData.push({ divider: this.helper.dateFormat(displayDate, this.groupDateFormat), data: [] });
                        //this.data.push({divider: this.helper.dateFormat(displayDate, this.groupDateFormat)});
                    }
                    let prItem = obj;
                    prItem.DisplayDate = this.helper.dateFormat(displayDate, this.dateFormat);
                    this.prData[this.currentIndex].data.push(prItem);
                    //this.data.push(prItem);
                });
                if (!this.currentPRItem && this.globalVars.isTablet) {
                    setTimeout(() => {
                        this.getPRDetail(this.prData[0].data[0]);
                    }, 1000);
                }
            }
            else {
                if (this.prData || this.prData.length == 0)
                    this.showMessNoData = true;
            }
            this.helper.hideLoading(this);
            if (this.loadmore && this.loadmore != null) {
                this.loadmore.complete();
                this.loadmore = null;
            }
            this.onProgress = false;
        });
    }
    loadMoreData(event) {
        this.helper.checkTokenExpired();
        if (!this.loadmore || this.loadmore == null) {
            this.loadmore = event;
            setTimeout(() => {
                this.getPRData();
            }, 500);
        }
    }
    /*-----End Bind Data Master Page----*/

    /*-----Common FN----*/
    getAllPhrasesInPage() {
        this.headerTitle = this.helper.getPhrase("PressReleases", "Common");
        this.searchPlaceHolder = this.helper.getPhrase("Search", "PressReleases");
        this.noDataText = this.helper.getPhrase("MsgNoData", "PressReleases");
    }
    /*-----End Common FN----*/
    /*-----Search------*/
    showSearch() {
        this.showSearchBox = true;
        this.searchQuery = " ";
    }
    onBlur(event) {
        this.onSearch(event.target.value.trim());
    }
    onClear(event) {
        this.searchQuery = "";
        event.target.value = "";
    }

    refreshPRProperties() {
        this.currentIndex = -1;
        this.currentGroup = "";
        this.prData = [];
    }

    onKeyDown(event) {
        if (event.keyCode == 13) {
            this.onSearch(event.target.value.trim());
        }
    }

    onSearch(currentValue) {
        Keyboard.close();
        if (this.searchKeyword.trim() != currentValue && this.isOnline) {
            this.helper.showLoading(this);
            this.refreshPRProperties();
            this.searchKeyword = currentValue;
            if (this.globalVars.isIpad)
                this.prComponent.hideContent();
            this.getPRData();
        }
    }
    /*-----End Search------*/
    /*-----Details--------*/
    getPRDetail(prItem) {
        if (this.helper.userTokenHasExpired()) {
            this.helper.showConfirmLogin();
        }
        else {
            if (!this.globalVars.isIpad || (!this.currentPRItem || this.currentPRItem.Id != prItem.Id)) {
                this.currentPRItem = prItem;
                if (!this.globalVars.isIpad)
                    this.nav.push(PressReleasesDetailPage, { prData: prItem });
                else
                    this.prComponent.getPrDetailData(prItem);
            }
        }
    }
}
