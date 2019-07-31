import { Authentication } from '../services/authentication';
import { autoinject } from 'aurelia-framework';

@autoinject()
export class Logout {
    constructor(authentication: Authentication) {
        this.authentication = authentication;
    }
    private authentication: Authentication;
    private name: string;
    private error: string;
    private activate() {
        this.error = null;
    }
    private logout() {
        this.error = null;
        this.authentication.logout().then((data:any) => {
            console.log(data.success);
        }).catch((error) => {
            this.error = error.message;
        });
    }
}
