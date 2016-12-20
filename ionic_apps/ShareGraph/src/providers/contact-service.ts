import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalVars } from '../common/global-vars';
import 'rxjs/Rx';

@Injectable()
export class ContactService {
    apiName = "contact";

    constructor(public http: Http, public globalVars: GlobalVars) { }

    getContactData(filename, lang = "") {
        if (lang == "")
            lang = this.globalVars.generalSettings.language.value.split("-")[0];
        return new Promise(resolve => {
            this.http.get("assets/company/contact/" + filename + "_" + lang + ".html")
                .subscribe(
                data => {
                    if (data != null)
                        resolve(data["_body"]);
                    else
                        resolve("");
                },
                err => {
                    if (lang != "en")
                        this.getDefaultContactData(resolve, filename);
                    else
                        resolve("");
                }
                );
        });
    }

    getDefaultContactData(resolve, filename) {
        this.http.get("company/contact/" + filename + "_en.html")
            .subscribe(
            data => {
                if (data != null)
                    resolve(data["_body"]);
                else
                    resolve("");
            },
            err => {
                resolve("");
            }
            );
    }
}