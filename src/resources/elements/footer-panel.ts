import { MailGateway } from '../../gateways/mail-gateway';
import { autoinject } from 'aurelia-framework';

@autoinject()
export class FooterPanel {
    constructor(mailGateway: MailGateway) {
        this.mailGateway = mailGateway;
    }
    private email: string;
    private mailGateway: MailGateway;
    private signupSuccessful: boolean;
    private signup() {
        this.mailGateway.signup(this.email).then((result) => {
            this.signupSuccessful = result;
        });
    }
}
