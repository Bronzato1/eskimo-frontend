import { autoinject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { Box } from '../dialogs/box';
import { Post } from './post-models';
import { Tag } from './tag-models';
import { Category } from './category-models';
import * as download from 'downloadjs';
import environment from 'environment';
import moment = require('moment');

@autoinject()
export class PostGateway {
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
    createPost(post: Post): Promise<void | Post> {
        return this.httpClient.fetch(`api/post`, {
            method: 'post',
            body: json(post)
        })
            .then(response => response.json())
            .then(dto => {
                var post = Post.fromObject(dto);
                return Promise.resolve(post);
            })
            .catch(error => {
                console.log('Result ' + error.status + ': ' + error.statusText);
            });
    }
    getAllPosts(): Promise<Post[]> {
        return this.httpClient.fetch(`api/post/`)
            .then(response => response.json())
            .then(dto => {
                return dto.map(Post.fromObject);
            });
    }
    getPost(id): Promise<Post> {
        return this.httpClient.fetch(`api/post/${id}`)
            .then(response => response.json())
            .then(Post.fromObject);
    }
    updatePost(id, post: Post): Promise<void | Post> {
        return this.httpClient.fetch(`api/post/${id}`, {
            method: 'put',
            body: json(post)
        })
            .then(response => response.json())
            .then(dto => {
                var post = Post.fromObject(dto);
                return Promise.resolve(post);
            })
            .catch(error => {
                console.log('Result ' + error.status + ': ' + error.statusText);
                return Promise.reject();
            });
    }
    deletePost(id): Promise<void> {
        return this.httpClient.fetch(`api/post/${id}`, {
            method: 'delete'
        })
            .then((response: Response) => {
                console.log('Result ' + response.status + ': ' + response.statusText);
            })
            .catch(error => {
                console.log('Result ' + error.status + ': ' + error.statusText);
            });
    }
    downloadZip(ids) {
        return this.httpClient.fetch(`api/post/downloadZip`, { method: 'POST', body: json(ids) })
            .then((response: Response) => response.blob())
            .then((blob: Blob) => {
                var ymd: string = moment(new Date()).format('YYYY-MM-DD').toString();
                var fileName: String = 'export-' + ymd + '.zip';
                download(blob, fileName, 'application/octetstream');
            })
    }
    uploadZip(file) {
        let formData = new FormData();
        formData.append('file', file[0]);
        this.httpClient.fetch(`api/post/uploadZip`, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                this.box.showNotification('Importation de ' + data.count + ' éléments', 'Confirmation', 'Ok');
            })
            .catch(error => console.log(error));
    }
    uploadImage(file): Promise<string> {
        let formData = new FormData();
        formData.append('file', file);
        return this.httpClient.fetch(`api/froala/UploadImage`, {
            method: 'post',
            body: formData
        }).then(response => response.json())
            .then(data => {
                return data.link;
            });
    }
    clearAllPosts() {
        return this.httpClient.fetch(`api/post/clearAllPosts`)
            .then(response => response.json())
            .then(data => {
                this.box.showNotification('Suppression de ' + data.count + ' éléments', 'Confirmation', 'Ok');
            })
            .catch(error => {
                console.log('Result ' + error.status + ': ' + error.statusText);
                console.log('Message ' + error.message);
            });
    }
}
