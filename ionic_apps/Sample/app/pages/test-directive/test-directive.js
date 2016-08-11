import { Component } from '@angular/core';
import { MyDirective} from '../DirectiveService/MyDirective';
import {Directive} from 'angular2/core';
/*
  Generated class for the TestDirectivePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Directive({
    selector: '[predefined-card]'
})
@Component({
  templateUrl: 'build/pages/test-directive/test-directive.html',
  selector : 'mk-dicrective',
  directives: [MyDirective],

})
export class TestDirectivePage {
  constructor() {

  }
}
