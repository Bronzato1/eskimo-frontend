import { DialogController } from 'aurelia-dialog';
import { useView, autoinject } from 'aurelia-framework';
import { CategoryGateway } from './../gateways/category-gateway';
import { Category } from './../models/category-models';
import { ValidationRules, ValidationController, ValidationControllerFactory, } from "aurelia-validation";

@autoinject()
export class ModalSpreakerImport {

    private controller: DialogController;
    private validationController: ValidationController;
    private selectedEpisodesCount: number;
    private categoryGateway: CategoryGateway;
    private categories: Category[];
    private categoryId;

    constructor(controller: DialogController, categoryGateway: CategoryGateway, validationController: ValidationControllerFactory) {
        this.controller = controller;
        this.categoryGateway = categoryGateway;
        this.validationController = validationController.createForCurrentScope();
    }
    private activate(model) {
        this.selectedEpisodesCount = model.selectedEpisodesCount;
        this.manageValidationRules();
        this.categoryGateway.getAllCategories().then(categories => { this.categories = categories });
    }
    private manageValidationRules() {
        var rules = ValidationRules
            .ensure('categoryId').required()
            .on(this);

        this.validationController.addObject(rules);
    }
    private ok() {
        this.validationController.validate().then(result => {
            if (result.valid) {
                var output = {
                    categoryId: this.categoryId
                };
                this.controller.ok(output);
            }
        });
    }
    private cancel() {
        this.controller.cancel();
    }
}
