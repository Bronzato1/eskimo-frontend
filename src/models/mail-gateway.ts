import { autoinject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import environment from 'environment';
import { promises } from 'fs';

@autoinject()
export class MailGateway {
    private httpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl(environment.backendUrl);
        });
    }
    sendMail(sendername, senderemail, senderphone, sendermessage): Promise<boolean> {
        var data = {
            name: sendername,
            email: senderemail,
            phone: senderphone,
            message: sendermessage
        }
        return this.httpClient.fetch('api/mail/sendMail', { method: 'POST', body: json(data) })
            .then((response: Response) => response.json())
            .then((data) => {
                return data.success && Promise.resolve(data.success);
            });
    }
}
