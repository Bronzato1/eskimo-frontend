import {CategoryGateway} from "../gateways/category-gateway";
import {autoinject, bindable} from "aurelia-framework";
import {DialogService} from 'aurelia-dialog';
import {Router} from "aurelia-router";
import {Category} from "../models/category-models";
import {Box} from "../dialogs/box";
import {I18N} from 'aurelia-i18n';
import environment from 'environment';
import secret from 'secret';
import * as moment from "moment";
import * as CodeMirror from 'codemirror';
import * as $ from 'jquery';

@autoinject()
export class CategoryEdit {
    constructor(categoryGateway: CategoryGateway, router: Router, box: Box, dialogService: DialogService, i18n: I18N) {
        this.categoryGateway = categoryGateway;
        this.router = router;
        this.box = box;
        this.dialogService = dialogService;
        this.i18n = i18n;
    }
    private categoryGateway: CategoryGateway;
    private router: Router;
    private box: Box;
    private dialogService: DialogService;
    private category: Category;
    private i18n: I18N;
    private colors = [
        { code: 'blue', frenchName: 'Bleu', englishName: 'Blue' },
        { code: 'red', frenchName: 'Rouge', englishName: 'Red' },
        { code: 'green', frenchName: 'Vert', englishName: 'Green' },
        { code: 'blueviolet', frenchName: 'Bleu violet', englishName: 'Blue violet' },
        { code: 'chartreuse', frenchName: 'Chartreuse', englishName: 'Chartreuse' }
    ];
    private activate(params, config) {
        var self = this;
        if (params && params.id)
            return loadTheCategory();

        async function loadTheCategory() {
            var category = await self.categoryGateway.getCategory(params.id);
            self.category = category;
            config.navModel.setTitle(category.frenchName);
        }
    }
    private attached() {
        $(document).ready(() => {
            $('[autofocus]').focus();
        });
    }
    private saveCategory() {
        saveTheCategory(this);

        async function saveTheCategory(self: CategoryEdit) {
            var fct: any;
            var msgSaved = 'Les données ont été enregistrées';
            var msgError = 'Une erreur s\'est produite';
            var title = 'Confirmation';
            var buttonOk = 'Ok';

            if (self.category.id)
                fct = self.categoryGateway.updateCategory(self.category.id, self.category);
            else
                fct = self.categoryGateway.createCategory(self.category);

            await fct.then(() => self.box.showNotification(msgSaved, title, buttonOk)
                .whenClosed(() => self.router.navigate('categoryList')))
                .catch(() => self.box.showError(msgError, title, [buttonOk]));
        }
    }
    private showCategoryList() {
        this.router.navigateToRoute('categoryList');
    }
    private get currentLanguage() {
        return this.i18n.getLocale();
    }
}
