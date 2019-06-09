import { PostGateway } from "./post-gateway";
import { inject, bindable } from "aurelia-framework";
import { DialogService } from 'aurelia-dialog';
import { Router } from "aurelia-router";
import { Post } from "./post-models";
import { Box } from "../dialogs/box";
import environment from 'environment';
import secret from 'secret';
import * as moment from "moment";
import * as $ from 'jquery';

@inject(PostGateway, Router, Box, DialogService)
export class PostEdit {
  @bindable datepicker;
  constructor(postGateway: PostGateway, router: Router, box: Box, dialogService: DialogService) {
    this.postGateway = postGateway;
    this.router = router;
    this.box = box;
    this.dialogService = dialogService
  }
  private postGateway: PostGateway;
  private router: Router;
  private box: Box;
  private dialogService: DialogService;
  private post: Post;
  private froalaConfig = {
    key: secret.froalaKey,
    toolbarInline: true,
    charCounterCount: false,
    imageUploadURL: 'http://localhost:5000/api/froala/UploadImage',
    fileUploadURL: 'http://localhost:5000/api/froala/UploadFile',
    imageManagerLoadURL: 'http://localhost:5000/api/froala/LoadImages',
    imageManagerDeleteURL: 'http://localhost:5000/api/froala/DeleteImage',
    imageManagerDeleteMethod: 'POST',
    htmlUntouched: true,
    toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', '|', 'fontFamily', 'fontSize', 'color', 'inlineClass', 'inlineStyle', 'paragraphStyle', 'lineHeight', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'fontAwesome', 'insertHR', 'selectAll', 'clearFormatting', '|', 'html', '|', 'undo', 'redo', 'colorizeCode'],
    codeBeautifierOptions: {
      end_with_newline: true,
      indent_inner_html: true,
      extra_liners: "['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', ul', 'ol', 'table', 'dl']",
      brace_style: 'expand',
      indent_char: ' ',
      indent_size: 4,
      wrap_line_length: 0
    }
  }
  private froalaEvents = {
    'image.uploaded': this.imageUploaded,
    'image.removed': this.imageRemoved,
    'image.file.unlink': this.imageFileUnlink
  }
  private activate(params, config) {
    var self = this;
    
    // return self.postGateway.getById(params.id).then(post => 
    //   {
    //     self.post = post;
    //     config.navModel.setTitle(post.title);
    //   });
    
    
    if (params && params.id)
      return loadThePost();

    async function loadThePost() {
      var post = await self.postGateway.getById(params.id);
      self.post = post;
      config.navModel.setTitle(post.title);
    }
  }
  private imageUploaded(e, editor, response) {
    // Parse response to get image url.
    var resp = JSON.parse(response);
    var img_url = environment.backendUrl + resp.link;

    // Insert image.
    editor.image.insert(img_url, false, null, editor.image.get(), response);
    return false;
  }
  private imageRemoved(e, editor, $img) {
    $.ajax({
      // Request method.
      method: "POST",

      // Request URL.
      url: environment.backendUrl + "api/froala/DeleteImage",

      // Request params.
      data: {
        src: $img.attr('src')
      }
    })
      .done(function (data) {
        console.log('image was deleted');
      })
      .fail(function (err) {
        console.log('image delete problem: ' + JSON.stringify(err));
      })
  }
  private imageFileUnlink(e, editor, link) {
    $.ajax({
      // Request method.
      method: "POST",

      // Request URL.
      url: environment.backendUrl + "api/froala/DeleteFile",

      // Request params.
      data: {
        src: link.getAttribute('href')
      }
    })
      .done(function (data) {
        console.log('file was deleted');
      })
      .fail(function (err) {
        console.log('file delete problem: ' + JSON.stringify(err));
      })
  }
  private attached() {
    $(document).ready(() => {
      $('[autofocus]').focus();
    });
  }
  private savePost() {
    saveThePost(this);

    async function saveThePost(self: PostEdit) {
      var fct: any;
      var msgSaved = 'Les données ont été enregistrées';
      var msgError = 'Une erreur s\'est produite';
      var title = 'Confirmation';
      var buttonOk = 'Ok';

      if (self.post.id)
        fct = self.postGateway.updateById(self.post.id, self.post);
      else
        fct = self.postGateway.createById(self.post);

      await fct.then(() => self.box.showNotification(msgSaved, title, buttonOk)
        .whenClosed(() => self.router.navigate('postList')))
        .catch(() => self.box.showError(msgError, title, [buttonOk]));
    }
  }
  private showPostList() {
    this.router.navigateToRoute('postList');
  }
  private datepickerChanged() {
    this.datepicker.events.onHide = (e) => console.log('onHide');
    this.datepicker.events.onShow = (e) => console.log('onShow');
    this.datepicker.events.onChange = (e) => console.log('onChange');
    this.datepicker.events.onError = (e) => console.log('onError');
    this.datepicker.events.onUpdate = (e) => console.log('onUpdate');
  }
  private onTagAdded(tagName) {
    var postId = this.post.id;
    this.postGateway.tagAdded(postId, tagName);
  }
  private onTagDeleted(tagName) {
    var postId = this.post.id;
    this.postGateway.tagDeleted(postId, tagName);
  }
  private onTagChanged(tagOldName, tagNewName) {
    var postId = this.post.id;
    this.postGateway.tagChanged(postId, tagOldName, tagNewName);
  }
}
