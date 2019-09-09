import { autoinject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { Box } from '../dialogs/box';
import { Category } from '../models/category-models';
import * as download from 'downloadjs';
import environment from 'environment';
import moment = require('moment');

@autoinject()
export class CategoryGateway {
    private httpClient: HttpClient;
    private box: Box;
    constructor(box: Box) {
        this.httpClient = new HttpClient().configure(config => {
            this.box = box;
            config
                .useStandardConfiguration()
                .withBaseUrl(environment.backendUrl);
        });
    }
    createCategory(category: Category) {

        return this.httpClient.fetch(`api/category`, {
            method: 'post',
            body: json(category)
        })
            .then(response => response.json())
            .then(Category.fromObject)
            .catch(error => {
                console.log('Result ' + error.status + ': ' + error.statusText);
            });
    }
    getAllCategories(): Promise<Category[]> {
        return this.httpClient.fetch(`api/category`)
            .then(response => response.json())
            .then(dto => {
                if (dto.length == 0) {
                    return Promise.resolve([]);
                }
                else {
                    return dto.map(Category.fromObject);
                }
            });
    }
    getCategory(id): Promise<Category> {
        return this.httpClient.fetch(`api/category/${id}`)
            .then(response => response.json())
            .then(Category.fromObject);
    }
    updateCategory(id, category: Category): Promise<void> {
        return this.httpClient.fetch(`api/category/${id}`, { method: 'put', body: json(category) })
            .then(saved => {
                console.log('Result ' + saved.status + ': ' + saved.statusText);
                return Promise.resolve();
            })
            .catch(error => {
                console.log('Result ' + error.status + ': ' + error.statusText);
                return Promise.reject();
            });
    }
    deleteCategory(id) {
        return this.httpClient.fetch(`api/category/${id}`, {
            method: 'delete'
        })
            .then((response: Response) => {
                console.log('Result ' + response.status + ': ' + response.statusText);
            })
            .catch(error => {
                console.log('Result ' + error.status + ': ' + error.statusText);
            });
    }
    deleteImageCategory(file): Promise<string> {
        let formData = new FormData();
        formData.append('src', file);
        return this.httpClient.fetch(`api/froala/DeleteImage`, {
            method: 'post',
            body: formData
        }).then(response => response.json())
            .then(data => {
                return data;
            });
    }
    uploadImageCategory(file): Promise<string> {
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
}
