import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../common/global-vars';
import { Helper } from '../common/helper';
import 'rxjs/Rx';

@Injectable()
export class CalendarService {
    apiName = "fincalendar";
    eventTypeApiName = "eventtype";
    servicesUrl: any;
    storageKey: any;
    storageData: any;
    eventTypeStorageKey: string;
    pagesize: number;
    lastDate: string = "";
    removeIds: string;
    eventType: string;
    data: any;

    constructor(public http: Http, public storage: Storage, public globalVars: GlobalVars, public helper: Helper) {
        this.servicesUrl = globalVars.servicesUrl + this.apiName + "/";
    }

    getEventTypes() {
        this.eventTypeStorageKey = this.apiName + "_" + this.eventTypeApiName + "_" + this.globalVars.generalSettings.language.value.toLowerCase();
        return new Promise(resolve => {
            this.storage.get(this.eventTypeStorageKey).then((sData) => {
                if (sData != null) {
                    var storageData = sData;
                    var TTL = this.globalVars.calendar.storageTTL;
                    if (this.globalVars.isOnline && TTL <= (new Date().getTime() - storageData.cacheTime)) {
                        this.getEventTypesFromDB(resolve);
                    }
                    else {
                        resolve(storageData.data);
                    }
                }
                else {
                    this.getEventTypesFromDB(resolve);
                }
            });
        });
    }

    getEventTypesFromDB(resolve) {
        if (this.globalVars.isOnline) {
            this.http.get(this.servicesUrl + this.eventTypeApiName + "/" + this.globalVars.companyCode + "/" + this.globalVars.generalSettings.language.value)
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(
                res => {
                    if (res != undefined && res != null) {
                        let data = res.json();
                        if (data.length > 0) {
                            var sData = { cacheTime: new Date().getTime(), data: data };
                            this.storage.set(this.eventTypeStorageKey, sData);
                            resolve(data);
                        }
                        else
                            resolve([]);
                    }
                    else
                        resolve([]);
                },
                error => {
                    console.log(error);
                    resolve([]);
                }
                );
        }
        else
            resolve([]);
    }

    getEventData(eventtype, pagesize, lastDate = "", removeIds = "") {
        this.storageKey = this.apiName + "_" + this.globalVars.generalSettings.language.value.toLowerCase();
        this.pagesize = pagesize;
        this.lastDate = lastDate;
        this.removeIds = removeIds;
        this.eventType = eventtype;
        return new Promise(resolve => {
            this.storage.get(this.storageKey).then((sData) => {
                if (sData != null) {
                    var storageData = sData;
                    this.storageData = storageData;
                    if (!storageData[eventtype.Name]) {
                        this.getEventDataFromDB(resolve);
                    }
                    else {
                        var TTL = this.globalVars.calendar.storageTTL;
                        if (this.globalVars.isOnline && TTL <= (new Date().getTime() - storageData[eventtype.Name].cacheTime)) {
                            this.getEventDataFromDB(resolve);
                        }
                        else {
                            this.getEventDataFromStorage(resolve);
                        }
                    }
                }
                else {
                    this.getEventDataFromDB(resolve);
                }
            });
        });
    }

    getEventDataFromDB(resolve) {
        if (this.globalVars.isOnline) {
            var url = this.servicesUrl + this.globalVars.companyCode + "/" + this.globalVars.generalSettings.language.value;
            if (this.eventType && this.eventType["ID"] != 0) {
                url += "/" + this.eventType["ID"];
            }
            url += "/" + this.pagesize;
            if (this.lastDate != "")
                url += "/" + this.lastDate;
            if (this.removeIds != "")
                url += "/" + this.removeIds;
            this.http.get(url)
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(
                res => {
                    if (res != undefined && res != null) {
                        let data = res.json();
                        if (data.length > 0) {
                            this.data = data.slice();
                            if (this.lastDate == "") {
                                this.data = this.data.slice(0, this.pagesize);
                            }
                            resolve(this.data);
                            var sData = { cacheTime: new Date().getTime() };
                            if (this.lastDate.length > 0 && this.storageData[this.eventType["Name"]]) {
                                sData["data"] = this.storageData[this.eventType["Name"]].data.concat(data);
                            }
                            else {
                                sData["data"] = data;
                            }
                            if (this.storageData) {
                                this.storageData[this.eventType["Name"]] = sData;
                                this.storage.set(this.storageKey, this.storageData);
                            }
                            else {
                                var storageObj = {};
                                storageObj[this.eventType["Name"]] = sData;
                                this.storage.set(this.storageKey, storageObj);
                            }
                        }
                        else {
                            resolve([]);
                        }
                    }
                },
                error => {
                    console.log(error);
                    resolve([]);
                }
                );
        }
        else
            resolve([]);
    }

    getEventDataFromStorage(resolve) {
        var arrIds = this.removeIds.split(",");
        var dataFilter = this.storageData[this.eventType["Name"]].data.filter(obj => new Date(obj.EventDate) <= new Date(this.lastDate) && arrIds.indexOf(obj.Id.toString()) < 0);
        if (dataFilter.length > 0) {
            if (dataFilter.length >= this.pagesize) {
                this.data = dataFilter.slice(0, this.pagesize);
                resolve(this.data);
            }
            else {
                this.storageData[this.eventType["Name"]].data.slice(0, -dataFilter.length);
                this.getEventDataFromDB(resolve);
            }
        }
        else {
            this.getEventDataFromDB(resolve);
        }
    }

    getAllUpcomingData() {
        return new Promise(resolve => {
            if (this.globalVars.isOnline) {
                var url = this.servicesUrl + this.globalVars.companyCode + "/" + this.globalVars.generalSettings.language.value;
                this.http.get(url)
                    .timeout(this.globalVars.requestTimeout)
                    .retry(this.globalVars.retry)
                    .subscribe(
                    res => {
                        if (res != undefined && res != null) {
                            let data = res.json();
                            if (data.length > 0) {
                                resolve(data);
                            }
                            else {
                                resolve([]);
                            }
                        }
                        else {
                            resolve([]);
                        }
                    },
                    error => {
                        console.log(error);
                        resolve([]);
                    }
                    );
            }
            else {
                resolve([]);
            }
        });
    }

    getEventAttachment(id) {
        return new Promise(resolve => {
            if (this.globalVars.isOnline) {
                var url = this.servicesUrl + "attachments/" + id;
                this.http.get(url)
                    .timeout(this.globalVars.requestTimeout)
                    .retry(this.globalVars.retry)
                    .subscribe(
                    res => {
                        if (res != undefined && res != null) {
                            let data = res.json();
                            if (data.length > 0) {
                                this.setAttachmentsToStorage(id, data);
                                resolve(data);
                            }
                            else {
                                resolve([]);
                            }
                        }
                        else {
                            resolve([]);
                        }
                    },
                    error => {
                        console.log(error);
                        resolve([]);
                    }
                    );

            }
            else {
                resolve([]);
            }
        });
    }

    setAttachmentsToStorage(eventId, attData) {
        this.eventTypeStorageKey = this.apiName + "_" + this.eventTypeApiName + "_" + this.globalVars.generalSettings.language.value.toLowerCase();
        return new Promise(resolve => {
            this.storage.get(this.eventTypeStorageKey).then( (sData) => {
                if (sData != null) {
                    let storageData = sData;
                    for (let i = 0; i < storageData.length; i++) {
                        if (storageData.Id == eventId) {
                            storageData[i].EventAttachments = attData;
                            this.storage.set(this.eventTypeStorageKey, storageData);
                            break;
                        }
                    }
                }
            });
        });
    }

}