import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

@Component({
    selector: 'popover',
    templateUrl: 'popover.html'
})

export class PopoverComponent {
    phrases: any;
    currentScope: any;

    constructor(public viewController: ViewController, public navParams: NavParams) {
        this.phrases = this.navParams.get("phrases");
        this.currentScope = this.navParams.get("scope");
    }

    close() {
        this.viewController.dismiss();
    }

    shareEmail() {
        this.close();
        this.currentScope.sendViaEmail();
    }

    shareTweet() {
        this.close();
        this.currentScope.tweetThis();
    }
}