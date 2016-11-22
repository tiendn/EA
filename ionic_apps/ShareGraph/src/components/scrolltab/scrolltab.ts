import {NavController, NavParams, IONIC_DIRECTIVES} from 'ionic-angular';
import {Component} from '@angular/core';
import {Helper} from '../../common/helper';

@Component({
    selector: 'scroll-tab',
    templateUrl: 'scrolltab.html'
    //directives: [IONIC_DIRECTIVES]
})

export class ScrollTabComponent {

    hideTab: boolean = true;
    currentId: number = 0;
    target: any;
    data: any;

    constructor(public helper: Helper) {
    }

    genTabData(target, data, idKey = "instrumentid", nameKey = "") {
        if (data.length > 1) {
            data.forEach((obj) => {
                obj.id = obj[idKey];
                if (nameKey == "")
                    obj.displayName = this.helper.getConfigValueByLang(obj.name);
                else {
                    let name = obj[nameKey];
                    if (name.indexOf("/") > 0)
                        obj.displayName = this.helper.getPhrase(name.split("/")[1], name.split("/")[0]);
                    else
                        obj.displayName = name;
                }
            });
            this.target = target;
            this.data = data;
            this.hideTab = false;
        }
    }
}