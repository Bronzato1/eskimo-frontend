import {AuthorGateway} from "../gateways/author-gateway";
import {autoinject, bindable} from "aurelia-framework";
import {DialogService} from 'aurelia-dialog';
import {Router} from "aurelia-router";
import {Author} from "../models/author-models";
import {Box} from "../dialogs/box";
import {I18N} from 'aurelia-i18n';
import environment from 'environment';
import secret from 'secret';
import * as moment from "moment";
import * as CodeMirror from 'codemirror';
import * as $ from 'jquery';

@autoinject()
export class AuthorEdit {
    constructor(authorGateway: AuthorGateway, router: Router, box: Box, dialogService: DialogService, i18n: I18N) {
        this.authorGateway = authorGateway;
        this.router = router;
        this.box = box;
        this.dialogService = dialogService;
        this.i18n = i18n;
    }
    private authorGateway: AuthorGateway;
    private router: Router;
    private box: Box;
    private dialogService: DialogService;
    private author: Author;
    private i18n: I18N;
    private activate(params, config) {
        var self = this;
        if (params && params.id)
            return loadTheAuthor();

        async function loadTheAuthor() {
            var author = await self.authorGateway.getAuthor(params.id);
            self.author = author;
            config.navModel.setTitle(author.name);
        }
    }
    private attached() {
        $(document).ready(() => {
            $('[autofocus]').focus();
        });
    }
    private saveAuthor() {
        saveTheAuthor(this);

        async function saveTheAuthor(self: AuthorEdit) {
            var fct: any;
            var msgSaved = 'Les données ont été enregistrées';
            var msgError = 'Une erreur s\'est produite';
            var title = 'Confirmation';
            var buttonOk = 'Ok';

            if (self.author.id)
                fct = self.authorGateway.updateAuthor(self.author.id, self.author);
            else
                fct = self.authorGateway.createAuthor(self.author);

            await fct.then(() => self.box.showNotification(msgSaved, title, buttonOk)
                .whenClosed(() => self.router.navigate('authorList')))
                .catch(() => self.box.showError(msgError, title, [buttonOk]));
        }
    }
    private showAuthorList() {
        this.router.navigateToRoute('authorList');
    }
    private get currentLanguage() {
        return this.i18n.getLocale();
    }
}
