import { Component } from '@angular/core';
import { MyDirective} from '../DirectiveService/MyDirective';
/*
  Generated class for the TestDirectivePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  templateUrl: 'build/pages/test-directive/test-directive.html',
  directives: [MyDirective],

})
export class TestDirectivePage {
  constructor() {

  }
}
