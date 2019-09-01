import { Translator } from './../services/translator';
import { TagGateway } from '../gateways/tag-gateway';
import { PostGateway } from "../gateways/post-gateway";
import { CategoryGateway } from "../gateways/category-gateway";
import { AuthorGateway } from "../gateways/author-gateway";
import { autoinject, bindable } from "aurelia-framework";
import { ValidationRules, ValidationController, ValidationControllerFactory, } from "aurelia-validation";
import { HttpClient } from 'aurelia-fetch-client';
import { DialogService } from 'aurelia-dialog';
import { Router } from "aurelia-router";
import { Post } from "../models/post-models";
import { Author } from "../models/author-models";
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
    private postGateway: PostGateway;
    private tagGateway: TagGateway;
    private categoryGateway: CategoryGateway;
    private authorGateway: AuthorGateway;
    private router: Router;
    private box: Box;
    private translator: Translator;
    private dialogService: DialogService;
    private validationController: any;
    private post: Post;
    private categories = [];
    private authors = [];
    private medias = [];
    private i18n: I18N;
    private selectedFiles: any;
    private handlerQuickSaveFct;
    private currentLng: string = 'fr';
    private httpClient: HttpClient;
    private imageVisibility: boolean;
    private settingsVisibility: boolean

    constructor(postGateway: PostGateway, tagGateway: TagGateway, categoryGateway: CategoryGateway, authorGateway: AuthorGateway, router: Router, box: Box, dialogService: DialogService, i18n: I18N, validationController: ValidationControllerFactory, translator: Translator, httpClient: HttpClient) {
        this.postGateway = postGateway;
        this.tagGateway = tagGateway;
        this.categoryGateway = categoryGateway;
        this.authorGateway = authorGateway;
        this.router = router;
        this.box = box;
        this.dialogService = dialogService
        this.i18n = i18n;
        this.validationController = validationController.createForCurrentScope();
        this.translator = translator;
        this.httpClient = httpClient;
    }
    private get environment() {
        return environment;
    }
    private froalaConfig =
        {
            key: secret.froalaKey,
            toolbarInline: false,
            charCounterCount: false,
            imageUploadURL: environment.backendUrl + 'api/froala/UploadImage',
            fileUploadURL: environment.backendUrl + 'api/froala/UploadFile',
            imageManagerLoadURL: environment.backendUrl + 'api/froala/LoadImages',
            imageManagerDeleteURL: environment.backendUrl + 'api/froala/DeleteImage',
            imageManagerDeleteMethod: 'POST',
            codeMirror: CodeMirror,
            htmlUntouched: true,
            videoResponsive: false,
            //toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', '|', 'fontFamily', 'fontSize', 'color', 'inlineClass', 'inlineStyle', 'paragraphStyle', 'lineHeight', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'fontAwesome', 'insertHR', 'selectAll', 'clearFormatting', '|', 'html', '|', 'undo', 'redo', 'colorizeCode'],
            toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', '|', 'fontFamily', 'fontSize', 'color', 'inlineClass', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'quote', 'insertLink', 'insertImage', 'insertVideo', '|', 'insertHR', '|', 'html', '|', 'undo', 'redo', 'colorizeCode'],
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
    private froalaEvents =
        {
            'image.uploaded': this.imageUploaded,
            'image.removed': this.imageRemoved,
            'image.file.unlink': this.imageFileUnlink
        }
    private activate(params, config) {
        var self = this;

        return loadOrCreatheThePost()
            .then(loadCategories)
            .then(loadAuthors)
            .then(loadMedias)
            .then(manageValidationRules);

        async function loadOrCreatheThePost() {
            if (params && params.id) {
                // LOAD
                var post = await self.postGateway.getPost(params.id);
                self.post = post;
                config.navModel.setTitle('Billet: ' + post.frenchTitle);
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

        async function loadAuthors() {
            var authors = await self.authorGateway.getAllAuthors();
            self.authors = authors;
        }

        async function loadMedias() {
            var medias = [
                { id: 1, value: 'Text' },
                { id: 2, value: 'Audio' },
                { id: 3, value: 'Vidéo' }
            ];
            self.medias = medias;
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
                .ensure((x: Post) => x.frenchTitle).required()
                .ensure((x: Post) => x.englishTitle).required()
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

        this.overlay();

        this.settingsVisibility = !this.post.id; // NO ID -> CREATION MODE

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
                            self.router.navigate('postsListAdmin');
                    });
            })
                .catch(() => self.box.showError(msgError, title, [buttonOk]));
        }
    }
    private showPostList() {
        this.router.navigateToRoute('postsListAdmin');
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
    private onFrenchTagCreated(tagName) {
        if (this.post.id) {
            var postId = this.post.id;
            var tag: Tag = { id: 0, name: tagName, postItemId: postId, language: 'fr' };
            this.tagGateway.createTag(tag);
        }
    }
    private onEnglishTagCreated(tagName) {
        if (this.post.id) {
            var postId = this.post.id;
            var tag: Tag = { id: 0, name: tagName, postItemId: postId, language: 'en' };
            this.tagGateway.createTag(tag);
        }
    }
    private onTagDeleted(tagName) {
        var tagId = this.post.tags.find(x => x.name == tagName && x.language == this.currentLng).id;
        this.tagGateway.tagDeleted(tagId);
    }
    private onTagUpdated(tagOldName, tagNewName) {
        var postId = this.post.id;
        var language = this.i18n.getLocale();
        this.tagGateway.tagUpdated(postId, tagOldName, tagNewName, language);
    }
    private uploadImage() {
        if (!this.selectedFiles) {
            $("#fileChooser").click();
            return;
        }
        this.postGateway.uploadImageResize1200x600(this.selectedFiles[0]).then(link => {
            this.post.image = environment.backendUrl + link;
            this.imageVisibility = true;
        });
    }
    private get currentLanguage() {
        return this.i18n.getLocale();
    }
    private setCurrentLng(lng) {
        this.currentLng = lng;
    }
    private translateServerSide(from: string, to: string) {
        
        var content = (from == 'fr') ? this.post.frenchContent : this.post.englishContent;
        this.translator.translate(from, to, content).then((data) => {
            if (to == 'fr') {
                this.post.frenchContent = data;
            } else {
                this.post.englishContent = data;
            };
        }).catch((error) => {
            debugger;
        });

        var title = (from == 'fr') ? this.post.frenchTitle : this.post.englishTitle;
        this.translator.translate(from, to, title).then((data) => {
            if (to == 'fr') {
                this.post.frenchTitle = data;
            } else {
                this.post.englishTitle = data;
            };
        }).catch((error) => {
            debugger;
        });
    }
    private async translateClientSide(from: string, to: string) {
        const subscriptionKey = secret.translatorKey;
        const baseUrl = 'https://api-eur.cognitive.microsofttranslator.com';
        const body = [{ 'text': (from == 'fr') ? this.post.frenchContent : this.post.englishContent }];
        const init: HeadersInit = { "Content-Type": "application/json" };
        const headers = new Headers(init);
        const response = await this.httpClient.fetch(`${baseUrl}/translate?api-version=3.0&to=${to}&textType=html&Subscription-Key=${subscriptionKey}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (response.ok) {
            var data = await response.json();
            var obj = (data.length > 0) ? data[0] : null;
            var translation = (obj.translations.length > 0) ? obj.translations[0].text : null;
            if (to == 'fr') {
                this.post.frenchContent = translation;
            } else {
                this.post.englishContent = translation;
            };
        };
    }
    private overlay() {

        var div: Element = document.getElementsByClassName('eskimo-featured-img')[0];

        if (!div)
            return;

        var img: Element = div.getElementsByTagName('img')[0];
        var overlay: Element = div.getElementsByClassName('overlay')[0];
        var icon: Element = div.getElementsByClassName('icon')[0];
        var i: Element = div.getElementsByTagName('i')[0];

        if (!overlay) {

            i = document.createElement("i");

            icon = document.createElement("div");
            icon.className = "icon";
            icon.appendChild(i);

            overlay = document.createElement("div");
            overlay.className = "overlay";
            overlay.appendChild(icon);
        }

        switch (this.post.media) {
            case 1: // Text
                break;
            case 2: // Audio
                i.className = "fa fa-microphone";
                break;
            case 3: /// Video
                i.className = "fa fa-youtube-play";
                break;
            default:
                return;
        }
        img.parentNode.insertBefore(overlay, img.nextSibling);
    }
    private loadThumbnailFromYoutube_320_180() {
        var id = this.post.youtubeVideoId;
        this.post.image = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
        this.imageVisibility = true;
    }
    private loadThumbnailFromYoutube_480_360() {
        var id = this.post.youtubeVideoId;
        this.post.image = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        this.imageVisibility = true;
    }
    private loadThumbnailFromYoutube_1280_720() {
        var id = this.post.youtubeVideoId;
        this.post.image = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
        this.imageVisibility = true;
    }
    private openInYoutube() {
        var id = this.post.youtubeVideoId;
        var url = `https://www.youtube.com/watch?v=${id}`;
        var win = window.open(url, '_blank');
        win.focus();
    }
    private deleteImage() {

        var self = this;

        $.ajax({
            // Request method.
            method: "POST",

            // Request URL.
            url: environment.backendUrl + "api/froala/DeleteFile",

            // Request params.
            data: {
                src: this.post.image
            }
        })
            .done(function (data) {
                console.log('file was deleted');
                self.post.image = null;
            })
            .fail(function (err) {
                console.log('file delete problem: ' + JSON.stringify(err));
            })
    }
    private showHideImage() {
        this.imageVisibility = !this.imageVisibility;
    }
    private showHideSettings() {
        this.settingsVisibility = !this.settingsVisibility;
    }
    private navigateToAuthorUrl(author: Author) {
        if (author.url.startsWith('http')) {
            var url = author.url;
            var win = window.open(url, '_blank');
            win.focus();
        } else {
            this.router.navigateToRoute('about');
        }
    }
}
