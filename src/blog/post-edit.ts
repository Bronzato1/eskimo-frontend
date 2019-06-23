import { TagGateway } from '../models/tag-gateway';
import { PostGateway } from "../models/post-gateway";
import { CategoryGateway } from "../models/category-gateway";
import { autoinject, bindable } from "aurelia-framework";
import { ValidationRules, ValidationController, ValidationControllerFactory, } from "aurelia-validation";
import { DialogService } from 'aurelia-dialog';
import { Router } from "aurelia-router";
import { Post } from "../models/post-models";
import { Tag } from "../models/tag-models";
import { Box } from "../dialogs/box";
import { I18N } from "aurelia-i18n";
import environment from 'environment';
import secret from 'secret';
import * as moment from "moment";
import * as CodeMirror from 'codemirror';
import * as $ from 'jquery';

@autoinject()
export class PostEdit {
    @bindable datepicker;
    constructor(postGateway: PostGateway, tagGateway: TagGateway, categoryGateway: CategoryGateway, router: Router, box: Box, dialogService: DialogService, i18n: I18N, validationController: ValidationControllerFactory) {
        this.postGateway = postGateway;
        this.tagGateway = tagGateway;
        this.categoryGateway = categoryGateway;
        this.router = router;
        this.box = box;
        this.dialogService = dialogService
        this.i18n = i18n;
        this.validationController = validationController.createForCurrentScope();
    }
    private postGateway: PostGateway;
    private tagGateway: TagGateway;
    private categoryGateway: CategoryGateway;
    private router: Router;
    private box: Box;
    private dialogService: DialogService;
    private validationController: any;
    private post: Post;
    private categories = [];
    private i18n: I18N;
    private selectedFiles: any;
    private handlerQuickSaveFct;
    private get environment() {
        return environment;
    }
    private froalaConfig = {
        key: secret.froalaKey,
        toolbarInline: true,
        charCounterCount: false,
        imageUploadURL: environment.backendUrl + 'api/froala/UploadImage',
        fileUploadURL:  environment.backendUrl + 'api/froala/UploadFile',
        imageManagerLoadURL: environment.backendUrl + 'api/froala/LoadImages',
        imageManagerDeleteURL: environment.backendUrl + 'api/froala/DeleteImage',
        imageManagerDeleteMethod: 'POST',
        codeMirror: CodeMirror,
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

        return loadOrCreatheThePost().then(loadCategories).then(manageValidationRules);

        async function loadOrCreatheThePost() {
            if (params && params.id) {
                // LOAD
                var post = await self.postGateway.getPost(params.id);
                self.post = post;
                config.navModel.setTitle('Billet: ' + post.title);
            }
            else {
                // CREATE
                self.post = await new Post();
                config.navModel.setTitle('Nouveau billet');
            }
            return Promise.resolve(true);
        }

        async function loadCategories() {
            var categories = await self.categoryGateway.getAllCategories();
            self.categories = categories;
        }

        async function manageValidationRules() {
            ValidationRules.customRule(
                'validDate',
                (value, obj) => {
                    var d = new Date(value);
                    return value === null || value === undefined || value === '' || !isNaN(d.getTime());
                },
                `\${$displayName} must be a Date.`
            );

            ValidationRules
                .ensure((x: Post) => x.title).required()
                .ensure((x: Post) => x.categoryId).required()
                .ensure((x: Post) => x.creation).required().then().satisfiesRule('validDate')
                .ensure((x: Post) => x.readingTime).required().matches(new RegExp('^[0-9]*$'))
                .on(self.post);

            await self.validationController.addObject(self.post);
        }
    }
    private imageUploaded(e, editor, response) {
        // Parse response to get image url.
        var resp = JSON.parse(response);
        var img_url = environment.backendUrl + resp.link;
        console.log(img_url);
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
        var self = this;

        $(document).ready(() => {
            $('[autofocus]').focus();
            $('#fileChooser').change(function () {
                self.uploadImage();
            });
            document.addEventListener("keydown", this.handlerQuickSaveFct);
        });

        this.handlerQuickSaveFct = function handlerQuickSaveFct(zEvent) {
            // <CTRL> <SHIFT> <S> ----> sauver et rester sur la page
            if (zEvent.ctrlKey && zEvent.shiftKey && zEvent.key === "S") {
                self.savePost(true);
            }
        }
    }
    private detached() {
        document.removeEventListener("keydown", this.handlerQuickSaveFct, false);
    }
    private savePost(stayHere: Boolean = false) {
        this.validationController.validate()
            .then((result) => {
                if (result.valid)
                    saveThePost(this);
            });

        async function saveThePost(self: PostEdit) {
            var fct: any;
            var msgSaved = 'Les données ont été enregistrées avec succès dans la base de donnée.';
            var msgError = 'Une erreur s\'est produite';
            var title = 'Confirmation';
            var buttonOk = 'Ok';

            if (self.post.id)
                fct = self.postGateway.updatePost(self.post.id, self.post);
            else
                fct = self.postGateway.createPost(self.post);

            await fct.then((dto) => {
                self.post.id = dto.id; // utile pour la gestion des tags 
                self.box.showNotification(msgSaved, title, buttonOk)
                    .whenClosed(() => {
                        if (!stayHere)
                            self.router.navigate('postList');
                    });
            })
                .catch(() => self.box.showError(msgError, title, [buttonOk]));
        }
    }
    private showPostList() {
        this.router.navigateToRoute('postList');
    }
    private viewPost() {
        this.router.navigateToRoute('postView', { id: this.post.id });
    }
    private datepickerChanged() {
        this.datepicker.events.onHide = (e) => console.log('onHide');
        this.datepicker.events.onShow = (e) => console.log('onShow');
        this.datepicker.events.onChange = (e) => console.log('onChange');
        this.datepicker.events.onError = (e) => console.log('onError');
        this.datepicker.events.onUpdate = (e) => console.log('onUpdate');
    }
    private onTagCreated(tagName) {
        if (this.post.id) {
            var postId = this.post.id;
            var tag: Tag = { id: 0, name: tagName, postItemId: postId };
            this.tagGateway.createTag(tag);
        }
    }
    private onTagDeleted(tagName) {
        var postId = this.post.id;
        this.tagGateway.tagDeleted(postId, tagName);
    }
    private onTagUpdated(tagOldName, tagNewName) {
        var postId = this.post.id;
        this.tagGateway.tagUpdated(postId, tagOldName, tagNewName);
    }
    private uploadImage() {
        if (!this.selectedFiles) {
            $("#fileChooser").click();
            return;
        }
        this.postGateway.uploadImage(this.selectedFiles[0]).then(link => {
            this.post.image = environment.backendUrl + link;
        });
    }
    private get currentLanguage() {
        return this.i18n.getLocale();
    }
}
