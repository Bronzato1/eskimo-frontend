import { inject } from 'aurelia-framework';
import * as salvattore from 'salvattore';

export class About {
	private attached() {
		salvattore.init();
    }
}
