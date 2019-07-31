import { resolve, reject } from "bluebird";
import { observable } from "aurelia-framework";

export class Authentication {
    constructor() {
        this.delay = 100;
        this.currentUser = null;
        this.users = ['admin'];
    }
    private delay: number;
    public currentUser: string;
    private users: string[];
    public login(name) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.users.includes(name)) {
                    this.currentUser = name;
                    resolve({ user: name });
                } else {
                    reject(new Error('Invalid credentials.'));
                }
            }, this.delay);
        });
    }
    public logout() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.currentUser = null;
                if (this.currentUser) {
                    reject(new Error('Error logging out.'));
                } else {
                    resolve({ success: true });
                }
            }, this.delay);
        });
    }
}
