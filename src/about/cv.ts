import { inject } from 'aurelia-framework';
import * as salvattore from 'salvattore';

export class Cv {
	private attached() {
		salvattore.init();
    }
}
