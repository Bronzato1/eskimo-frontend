import 'rrssb';
import * as $ from 'jquery';
import { bindable } from 'aurelia-framework';

export class Rrssb {

    @bindable title;
    @bindable image;
    @bindable link;

    attached() {
        (<any>window).rrssbInit();
        //(<any>$('.rrssb-buttons')).rrssb();
      }    
}
