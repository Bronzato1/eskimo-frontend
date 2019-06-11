import { inject } from 'aurelia-framework';
import * as salvattore from 'salvattore';

export class Index2 {
    private attached() {
        salvattore.init();
    }
}
