import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Helper } from '../../common/helper';
import { ContactService } from '../../providers/contact-service';

@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html',
    providers: [ContactService]
})
export class ContactPage {
    headerTitle: string;
    activeTab: string; 
    HTMLContent: any;

    constructor(public helper: Helper, public domSanitizer: DomSanitizer, public contactService: ContactService) {
        this.headerTitle = helper.getPhrase("Contacts");
    }

    ionViewDidLoad() {
        this.activeTab = "contact";
        this.loadHTMLContent();
    }

    loadHTMLContent() {
        this.contactService.getContactData(this.activeTab).then(data => {
            this.HTMLContent = this.domSanitizer.bypassSecurityTrustHtml(data.toString());
        });
    }

    changeTab(tabId) {
        if (this.activeTab != tabId) {
            this.activeTab = tabId;
            this.loadHTMLContent();
        }
    }
}
