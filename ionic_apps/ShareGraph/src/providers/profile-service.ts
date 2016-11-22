import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../common/global-vars';
import 'rxjs/Rx';

@Injectable()
export class ProfileService {
    constructor(public http: Http, public storage: Storage, public globalVars: GlobalVars) { }

    getProfileStatus() {
        return new Promise(resolve => {
            resolve(null);
        });
    }

    getProfileData() {
        return new Promise(resolve => {
            resolve(null);
        });
    }

    isEnabledWatchlist() {
        return true;
    }

    isEnabledIndices() {
        return true;
    }

    getWatchlistConfig() {
        return [];
    }

    getIndicesConfig() {
        return [];
    }

}