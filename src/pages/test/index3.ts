import { inject } from 'aurelia-framework';
import * as salvattore from 'salvattore';

export class Index3 {
	private attached() {
		salvattore.init();
    }
}
