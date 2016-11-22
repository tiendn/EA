import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalVars } from '../common/global-vars';

@Injectable()
export class TranslationService {
    data: any;

    constructor(public http: Http, public globalVars: GlobalVars) { }

    load(langCode) {
        return new Promise(resolve => {
            this.http.get('assets/data/lang/' + langCode + '.json').subscribe(
                res => {
                    this.data = res.json();
                    resolve(this.data);
                },
                error => {
                    console.log(error);
                    resolve(null);
                }                   
            );
        });
    }
}