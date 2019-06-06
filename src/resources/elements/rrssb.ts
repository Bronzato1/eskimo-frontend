import 'rrssb';
import * as $ from 'jquery';

export class Rrssb {
    attached() {
        (<any>window).rrssbInit();
        //(<any>$('.rrssb-buttons')).rrssb();
      }    
}
