import { autoinject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { Box } from '../dialogs/box';
import { Author } from '../models/author-models';
import * as download from 'downloadjs';
import environment from 'environment';
import moment = require('moment');

@autoinject()
export class AuthorGateway {
    private httpClient: HttpClient;
    private box: Box;
    constructor(httpClient: HttpClient, box: Box) {
        this.httpClient = httpClient.configure(config => {
            this.box = box;
            config
                .useStandardConfiguration()
                .withBaseUrl(environment.backendUrl);
        });
    }
    createAuthor(author: Author) {

        return this.httpClient.fetch(`api/author`, {
            method: 'post',
            body: json(author)
        })
            .then(response => response.json())
            .then(Author.fromObject)
            .catch(error => {
                console.log('Result ' + error.status + ': ' + error.statusText);
            });
    }
    getAllAuthors(): Promise<Author[]> {
        return this.httpClient.fetch(`api/author`)
            .then(response => response.json())
            .then(dto => {
                if (dto.length == 0) {
                    return Promise.resolve([]);
                }
                else {
                    return dto.map(Author.fromObject);
                }
            });
    }
    getAuthor(id): Promise<Author> {
        return this.httpClient.fetch(`api/author/${id}`)
            .then(response => response.json())
            .then(Author.fromObject);
    }
    updateAuthor(id, author: Author): Promise<void> {
        return this.httpClient.fetch(`api/author/${id}`, { method: 'put', body: json(author) })
            .then(saved => {
                console.log('Result ' + saved.status + ': ' + saved.statusText);
                return Promise.resolve();
            })
            .catch(error => {
                console.log('Result ' + error.status + ': ' + error.statusText);
                return Promise.reject();
            });
    }
    deleteAuthor(id) {
        return this.httpClient.fetch(`api/author/${id}`, {
            method: 'delete'
        })
            .then((response: Response) => {
                console.log('Result ' + response.status + ': ' + response.statusText);
            })
            .catch(error => {
                console.log('Result ' + error.status + ': ' + error.statusText);
            });
    }
}
