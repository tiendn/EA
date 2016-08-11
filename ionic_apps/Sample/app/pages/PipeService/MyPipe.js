import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'myPipe'
})
export class StartedPipe {
  transform(value ,status){
    // alert(status);
    return value + ' ok';
  }


}
// If you want to create a new pipe.
@Pipe({
  name: 'myPipe1'
})
export class StartedPip1e {
  transform(value ,status){
    // alert(status);
    return value + ' ok';
  }


}
