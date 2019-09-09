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

    private categoryGateway: CategoryGateway;
    private router: Router;
    private box: Box;
    private dialogService: DialogService;
    private category: Category;
    private i18n: I18N;
    private selectedFiles: any;
    private colors = [
        { code: 'blue', frenchName: 'Bleu', englishName: 'Blue' },
        { code: 'red', frenchName: 'Rouge', englishName: 'Red' },
        { code: 'green', frenchName: 'Vert', englishName: 'Green' },
        { code: 'yellow', frenchName: 'Jaune', englishName: 'Jaune' },
        { code: 'blueviolet', frenchName: 'Bleu violet', englishName: 'Blue violet' },
        { code: 'chartreuse', frenchName: 'Chartreuse', englishName: 'Chartreuse' }
    ];

    constructor(categoryGateway: CategoryGateway, router: Router, box: Box, dialogService: DialogService, i18n: I18N) {
        this.categoryGateway = categoryGateway;
        this.router = router;
        this.box = box;
        this.dialogService = dialogService;
        this.i18n = i18n;
    }
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

        var self = this;

        $(document).ready(() => {
            $('[autofocus]').focus();
        });

        $('#fileChooser').change(function () {
            self.uploadImage();
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
    private uploadImage() {
        if (!this.selectedFiles) {
            $("#fileChooser").click();
            return;
        }
        this.categoryGateway.uploadImageCategory(this.selectedFiles[0]).then(link => {
            this.category.image = environment.backendUrl + link;
        });
    }
}
