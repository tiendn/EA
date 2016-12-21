import { Component } from '@angular/core';
import { Helper } from '../../common/helper';
import { GlobalVars } from '../../common/global-vars';
import { AboutService } from '../../providers/about-service';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html',
    providers: [AboutService]
})
export class AboutPage {
    titleBar:string;
    about:string;

    constructor(public helper: Helper, public globalVars: GlobalVars, public aboutService:AboutService){
        this.titleBar = helper.getPhrase('About','Common');
      	aboutService.loadAboutData(globalVars.generalSettings.language.value.toLowerCase()).then(data => {
      		if(globalVars.isIOS) this.about = 'aboutIOS';
      		else this.about = 'aboutAndroid';  		
            // console.log(data['_body']);
      		document.getElementById('content').innerHTML = data['_body'];
      	});
    }

}
