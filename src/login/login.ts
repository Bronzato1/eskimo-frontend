import { Authentication } from '../services/authentication';
import { autoinject, inject } from 'aurelia-framework';

@inject(Authentication)
export class Login {
    constructor(authentication: Authentication) {
        this.authentication = authentication;
    }
    private authentication: Authentication;
    private name: string;
    private error: string;
    private activate() {
        this.error = null;
    }
    private login() {
        this.error = null;
        this.authentication.login(this.name).then((data:any) => {
            console.log(data.user);
        }).catch((error) => {
            this.error = error.message;
        });
    }
}
