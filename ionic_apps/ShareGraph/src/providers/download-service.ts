import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../common/global-vars';

@Injectable()

export class DownloadService {
    apiName = "download";
    language = "en-gb";
    servicesUrl:string;
    constructor(public http: Http, public storage: Storage, public globalVars: GlobalVars)
    {
        this.language = globalVars.generalSettings.language.value;
    }

    getDownloadData() {
        this.servicesUrl = this.globalVars.servicesUrl + this.apiName + '/' + this.globalVars.companyCode + "/" + this.language;
        if (this.globalVars.isOnline) {
            return new Promise(resolve => {
                this.http.get(this.servicesUrl)
                    .timeout(this.globalVars.requestTimeout)
                    .retry(this.globalVars.retry)
                    .subscribe(
                    res => {
                        let data = res.json();
                        resolve(data);
                    },
                    error => {
                        console.log(error);
                    }
                );
            });
        }
    }

    getStartDownloadLength(){
        this.servicesUrl = this.globalVars.servicesUrl + this.apiName +'/totalsize/'+ this.globalVars.companyCode +'/'+ this.language;
        if(this.globalVars.isOnline)
        {
            return new Promise(resolve=>{
                this.http.get(this.servicesUrl)
                    .timeout(this.globalVars.requestTimeout)
                    .retry(this.globalVars.retry)
                    .subscribe(
                        res => {
                            let data = res.json();
                            resolve(data);
                        },
                        error => {
                            console.log(error);
                        }
                    );
            })
        }
    }
    
    getDownloadQueue()
    {
        return new Promise(resolve=>{
            this.storage.get('_downloadqueue').then((data)=>{
                resolve(data);
            })
        })
    }

    setDownloadQueue(queue)
    {
        this.storage.set('_downloadqueue', JSON.stringify(queue));
    }
}