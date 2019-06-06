import {DialogService} from 'aurelia-dialog';
import {CustomDialogType, DialogBoxParameters, DialogBoxViewModel} from './dialog-box';
import {autoinject} from 'aurelia-framework';

@autoinject
export class Box {
    constructor(private dialogService: DialogService) {
    }
    public showError(message: string, title: string = null, buttons: string[] = null) {
        return this.dialogService.open({ viewModel: DialogBoxViewModel, model: { message: message, title: title, buttons: buttons, autofocusButton: buttons[0], dialogType: CustomDialogType.Error } });
    }
    public showQuestion(message: string, title: string = null, primaryButton: string, secondaryButton: string) {
        return this.dialogService.open({ viewModel: DialogBoxViewModel, model: { message: message, title: title, primaryButton: primaryButton, secondaryButton: secondaryButton, dialogType: CustomDialogType.Question }, keyboard: ['Escape'] });
    }
    public showWarning(message: string, title: string = null, buttons: string[] = null) {
        return this.dialogService.open({ viewModel: DialogBoxViewModel, model: { message: message, title: title, buttons: buttons, autofocusButton: buttons[0], dialogType: CustomDialogType.Warning } });        
    }
    public showNotification(message: string, title: string = null, primaryButton: string) {        
        return this.dialogService.open({ viewModel: DialogBoxViewModel, model: { message: message, title: title, primaryButton: primaryButton, dialogType: CustomDialogType.Notification }, keyboard: ['Escape'] });
    }
    public showEditDialog(viewModel, entityIdToEdit: number, title: string = null, dialogClass: string = null) {
        return this.dialogService.open({ viewModel: DialogBoxViewModel, model: { title: title, dialogType: CustomDialogType.Edit, editVm: viewModel, param1: -100, insideDialog: true } });        
    }
    public showInput(message: string, title: string = null, buttons: string[] = null) {
        return this.dialogService.open({ viewModel: DialogBoxViewModel, model: { message: message, title: title, buttons: buttons, dialogType: CustomDialogType.Input } });
    }
    public showInputWithIcon(message: string, title: string = null, icon: string, buttons: string[] = null) {
        return this.dialogService.open({ viewModel: DialogBoxViewModel, model: { message: message, title: title, buttons: buttons, dialogType: CustomDialogType.Input, icon: icon } });
    }
}

