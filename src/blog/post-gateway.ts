import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import { Box } from '../dialogs/box';
import {Post} from './post-models';
import * as download from 'downloadjs';
import environment from 'environment';
import moment = require('moment');

@inject(HttpClient, Box)
export class PostGateway {
  private httpClient: HttpClient;
  private box: Box;
  constructor(httpClient:HttpClient, box: Box) {
    this.httpClient = httpClient.configure(config => {
      this.box = box;
      config
        .useStandardConfiguration()
        .withBaseUrl(environment.backendUrl);
    });
  }
  getAll(): Promise<Post[]> {
    return this.httpClient.fetch(`api/post/`)
      .then(response => response.json())
      .then(dto => 
        { 
          return dto.map(Post.fromObject); 
        });
  }
  getById(id): Promise<Post> {
    return this.httpClient.fetch(`api/post/${id}`)
      .then(response => response.json())
      .then(Post.fromObject);
  }
  updateById(id, post: Post): Promise<void> {
    return this.httpClient.fetch(`api/post/${id}`, { method: 'put', body: json(post) })
    .then(saved => 
      { 
        console.log('Result ' + saved.status + ': ' + saved.statusText);
        return Promise.resolve();
      })
    .catch(error => 
      {
        console.log('Result ' + error.status + ': ' + error.statusText);
        return Promise.reject();
      });
  }
  createById(post: Post): Promise<void | Post> {
    return this.httpClient.fetch(`api/post`, {
      method: 'post',
      body: json(post)
    })
    .then(response => response.json())
    .then(Post.fromObject)
    .catch(error => 
      {
        console.log('Result ' + error.status + ': ' + error.statusText);
      });
  }
  deleteById(id): Promise<void> {
    return this.httpClient.fetch(`api/post/${id}`, {
      method: 'delete'
    })
    .then((response: Response) => 
      {
        console.log('Result ' + response.status + ': ' + response.statusText);
      })
    .catch(error => 
      {
        console.log('Result ' + error.status + ': ' + error.statusText);
      });
  }
  tagAdded(postId, tagName) {
    var data = {
      postId: postId,
      tagName: tagName
    }
    return this.httpClient.fetch(`api/post/tagAdded`, { method: 'POST', body: json(data) });
  }
  tagDeleted(postId, tagName) {
    var data = {
      postId: postId,
      tagName: tagName
    }
    return this.httpClient.fetch(`api/post/tagDeleted`, { method: 'POST', body: json(data) });
  }
  tagChanged(postId, tagOldName, tagNewName) {
    var data = {
      postId: postId,
      tagOldName: tagOldName,
      tagNewName: tagNewName
    }
    return this.httpClient.fetch(`api/post/tagChanged`, { method: 'POST', body: json(data) });
  }
  downloadZip(ids) {
    return this.httpClient.fetch(`api/post/downloadZip`, { method: 'POST', body: json(ids) })
    .then((response: Response) => response.blob())
    .then((blob: Blob) => 
    {
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
  clearAllData() {
    return this.httpClient.fetch(`api/post/clearAllData`)
    .then(response => response.json())
    .then(data => 
    {
      this.box.showNotification('Suppression de ' + data.count + ' éléments', 'Confirmation', 'Ok');
    })
    .catch(error =>
      {
        console.log('Result ' + error.status + ': ' + error.statusText);
        console.log('Message ' + error.message);
      });
  }
}
