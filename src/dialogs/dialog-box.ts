import {DialogController} from 'aurelia-dialog';
import {autoinject} from 'aurelia-framework';

export interface ListDialogResultsInterface {
    operation: string;
    selectedEntities: any[];
}
export interface DialogBoxParameters {
    message: string;
    title?: string;
    primaryButton: string;
    secondaryButton?: string;
    dialogType?: CustomDialogType;
    editVm?: any;
    input?: string;
    icon?: string;

}
export enum CustomDialogType {
    Error,
    Question,
    Warning,
    Notification,
    Edit,
    Input
}

@autoinject
export class DialogBoxViewModel {
    constructor(private controller: DialogController) {
        
    }
    public params: DialogBoxParameters;
    public customVM: any;
    public input: string;
    public inputField: any;
    public activate(config: DialogBoxParameters) {
        this.params = config;
    }
    public attached() {
      $(document).ready(() => 
      {
        $('button[autofocus]').focus();
      });
    }
    public cancel() {
        this.customVM.currentViewModel.innerCancel(false, true);
        this.controller.cancel();
    }
    public buttonClicked(button) {        
      this.controller.ok(button);
    }
    public getViewStrategy() {
        if (this.params.dialogType === CustomDialogType.Error)
            return "./error-box.html";
        else if (this.params.dialogType === CustomDialogType.Question) {
            return "./question-box.html";
        }
        else if (this.params.dialogType === CustomDialogType.Notification) {
            return "./notification-box.html";
        }
        else if (this.params.dialogType === CustomDialogType.Warning) {
            return "./warning-box.html";
        }
        else if (this.params.dialogType === CustomDialogType.Edit) {
            return "./edit-dialog.html";
        }
        else if (this.params.dialogType === CustomDialogType.Input) {
            return "./input-box.html";
        }

        return null;
    }
}
