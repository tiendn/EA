import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Helper } from '../../../common/helper';
import { GlobalVars } from '../../../common/global-vars';
import { ICalService } from '../../../providers/ical-service';

import { ProfileService } from '../../../providers/profile-service';
//import {ICalWatchListPage} from '../../pages/investmentcalculator/watchlist/watchlist';
//import {ICalIndicesPage} from '../../pages/investmentcalculator/indices/indices';

export interface ICalPhrases {
    instrument: string;
    change: string;
    changePercent: string;
    compare: string;
    watchlist: string;
    indices: string;
    startDate: string;
    sharePrice: string;
    shareBought: string;
    value: string;
    endDate: string;
}

@Component({
    selector: 'ical-detail',
    templateUrl: 'detail-component.html',
    providers: [ICalService]
})

export class ICalDetailComponent {

    moduleName = "InvestmentCalculator";
    enableWatchList: boolean;
    enableIndices: boolean;
    icalPhrases: ICalPhrases;
    unit: any;
    decimalDigits: number;
    instrumentName: string;
    paramsData: any;
    icalData: any;

    constructor(public helper: Helper, public icalService: ICalService, public modalController: ModalController, public profileService: ProfileService, public globalVars: GlobalVars) {
        this.enableWatchList = profileService.isEnabledWatchlist();
        this.enableIndices = profileService.isEnabledIndices();
        this.getPhrases();
    }

    getPhrases() {
        this.icalPhrases = {
            instrument: this.helper.getPhrase("Instrument", this.moduleName),
            change: this.helper.getPhrase("Change", this.moduleName),
            changePercent: this.helper.getPhrase("ChangePercent", this.moduleName),
            compare: this.helper.getPhrase("Compare", this.moduleName),
            watchlist: this.helper.getPhrase("Watchlist", this.moduleName),
            indices: this.helper.getPhrase("Indices", this.moduleName),
            startDate: this.helper.getPhrase("StartDate", this.moduleName),
            sharePrice: this.helper.getPhrase("SharePrice", this.moduleName),
            shareBought: this.helper.getPhrase("ShareBought", this.moduleName),
            value: this.helper.getPhrase("Value", this.moduleName),
            endDate: this.helper.getPhrase("EndDate", this.moduleName)
        };
    }

    getICalData(inputData) {
        //if (isIpad)
        //    this.helper.showLoading(this, "loading-right");
        //else
            this.helper.showLoading(this);
        this.unit = inputData.unit;
        this.decimalDigits = this.helper.getDecimalDigits(this.unit);
        this.instrumentName = "";
        if (this.globalVars.configData.common.instruments.length > 0) {
            let dataFilter = this.globalVars.configData.common.instruments.filter(ins => ins.instrumentid == inputData.instrumentid);
            if (dataFilter.length > 0) {
                this.instrumentName = this.helper.getConfigValueByLang(dataFilter[0].name);
            }
        }

        let strPattern = '\\-';
        let regex = new RegExp(strPattern, 'g');
        let sDate = inputData.startDate;
        let eDate = inputData.endDate;
        if (this.globalVars.isArabic) {
            sDate = this.helper.convertToEng(sDate);
            eDate = this.helper.convertToEng(eDate);
        }
        inputData.startDate = sDate.replace(regex, "");
        inputData.endDate = eDate.replace(regex, "");

        this.paramsData = inputData;

        //inputData.startDate = this.helper.dateFormat(new Date(inputData.startDate), this.helper.paramDateFormat);
        //inputData.endDate = this.helper.dateFormat(new Date(inputData.endDate), this.helper.paramDateFormat);

        this.icalService.getICalData(inputData).then(data => {
            if (data != null) {
                this.icalData = this.processData(data);
            }
            else {
                this.createDefaultData();
            }
            this.helper.hideLoading(this);
        });
    }

    processData(data) {
        data.Unit = this.unit;
        data.StartValue = data.ShareBought * data.StartPrice;
        data.Change = data.EndValue - data.StartValue;
        data.ChangePercent = data.Change / data.StartValue * 100;
        data.StartDate = this.helper.dateFormat(new Date(data.StartDate), this.globalVars.generalSettings.shortDateFormat);
        data.EndDate = this.helper.dateFormat(new Date(data.EndDate), this.globalVars.generalSettings.shortDateFormat);
        return data;
    }

    createDefaultData() {
        this.icalData = {
            StartValue: 0,
            Change: 0,
            ChangePercent: 0,
            StartDate: "",
            EndDate: "",
            StartPrice: 0,
            ShareBought: 0,
            EndPrice: 0,
            EndValue: 0
        }
    }

    showModal(type) {
        //let modal = null;
        //let params = {
        //    dSDate: this.icalData.StartDate,
        //    dEDate: this.icalData.EndDate,
        //    pSDate: this.paramsData.startDate,
        //    pEDate: this.paramsData.endDate,
        //    decimalDigits: this.decimalDigits
        //};
        //if (type == "watchlist")
        //    modal = this.modalController.create(ICalWatchListPage, { data: params });
        //else
        //    modal = this.modalController.create(ICalIndicesPage, { data: params });
        //modal.present();
    }
}
