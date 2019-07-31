import { autoinject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { Box } from '../dialogs/box';
import { Tag } from '../models/tag-models';
import * as download from 'downloadjs';
import environment from 'environment';
import moment = require('moment');

@autoinject()
export class TagGateway {
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
    createTag(tag: Tag): Promise<void | Tag> {
        return this.httpClient.fetch(`api/tag`, {
            method: 'post',
            body: json(tag)
        })
            .then(response => response.json())
            .then(Tag.fromObject)
            .catch(error => {
                console.log('Result ' + error.status + ': ' + error.statusText);
            });
    }
    tagUpdated(postId, tagOldName, tagNewName, language) {
        var data = {
            postId: postId,
            tagOldName: tagOldName,
            tagNewName: tagNewName,
            language: language
        }
        return this.httpClient.fetch(`api/tag/updateTag`, { method: 'POST', body: json(data) });
    }
    tagDeleted(postId, tagName) {
        var data = {
            postId: postId,
            tagName: tagName
        }
        return this.httpClient.fetch(`api/tag/deleteTag`, { method: 'POST', body: json(data) });
    }
}
