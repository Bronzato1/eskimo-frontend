import { autoinject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { Box } from '../dialogs/box';
import { Post } from '../models/post-models';
import { Tag } from '../models/tag-models';
import { Category } from '../models/category-models';
import * as download from 'downloadjs';
import environment from 'environment';
import moment = require('moment');
import { stringify } from 'querystring';

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
    getPosts(): Promise<Post[]> {
        return this.httpClient.fetch(`api/post/`)
            .then(response => response.json())
            .then(dto => {
                return dto.map(Post.fromObject);
            });
    }
    getPostsByPage(mediaId: number, categoryId: number, tagId: number, page: number): Promise<Post[]> {
        return this.httpClient.fetch(`api/post/getPostsByPage?mediaId=${mediaId}&categoryId=${categoryId}&tagId=${tagId}&page=${page}`)
            .then(response => response.json())
            .then(dto => {
                return dto.map(Post.fromObject);
            });
    }
    getPostsInFavorites(): Promise<Post[]> {
        return this.httpClient.fetch(`api/post/getPostsInFavorites`)
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
    getTotalPostPages(): Promise<number> {
        return this.httpClient.fetch(`api/post/getTotalPostPages`)
            .then(response => response.json())
            .then(val => {
                return Promise.resolve(val);
            });
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
    exportZip(ids) {
        return this.httpClient.fetch(`api/post/exportZip`, { method: 'POST', body: json(ids) })
            .then((response: Response) => response.blob())
            .then((blob: Blob) => {
                var ymd: string = moment(new Date()).format('YYYY-MM-DD').toString();
                var fileName: String = 'export-' + ymd + '.zip';
                download(blob, fileName, 'application/octetstream');
            })
    }
    importZip(file): Promise<any> {
        let formData = new FormData();
        formData.append('file', file[0]);
        return this.httpClient.fetch(`api/post/importZip`, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                var message = 'Importation réussie de ' + data.countSucceed + ' éléments sur ' + (data.countSucceed + data.countError) + '.';
                if (data.countError > 0)
                    message = message + '<br/><br/><u>Erreurs:</u><br/>' + data.errors.join('</br>');
                this.box.showNotification(message, 'Confirmation', 'Ok');
            })
            .catch(error => console.log(error));
    }
    deleteAll(): Promise<any> {
        return this.httpClient.fetch(`api/post/deleteAll`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                var message = 'Suppression réussie de ' + data.countImages + ' images et ' + data.countPosts + ' billets.';
                this.box.showNotification(message, 'Confirmation', 'Ok');
            })
            .catch(error => console.log(error));
    }
    uploadImageResize1200x600(file): Promise<string> {
        let formData = new FormData();
        formData.append('file', file);
        return this.httpClient.fetch(`api/froala/UploadImageResize1200x600`, {
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
    addPostToFavorite(id): Promise<Boolean> {
        return this.httpClient.fetch(`api/post/addPostToFavorite/${id}`, { method: 'POST' })
            .then((response: Response) => { return true; })
            .catch((response: Response) => { return false; });
    }
    removePostFromFavorite(id): Promise<Boolean> {
        return this.httpClient.fetch(`api/post/removePostFromFavorite/${id}`, { method: 'POST' })
            .then((repsonse: Response) => { return true; })
            .catch((response: Response) => { return false; });
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
}
