import { HttpClient, json } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';
import secret from '../secret';

@autoinject
export class Translator {
    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
    }
    private httpClient: HttpClient;
    public translate(from, to, html) {
        var data = {
            from: from,
            to: to,
            html: html
        }
        return this.httpClient.fetch('api/translator/translate', { method: 'POST', body: json(data) })
            .then((response: Response) => response.json())
            .then((data) => {
                return data.success && Promise.resolve(data.success.result);
            });
    }
}
