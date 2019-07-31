import { I18N } from 'aurelia-i18n';
import { inject, autoinject, observable } from 'aurelia-framework';
import { Router, activationStrategy } from 'aurelia-router';
import { MailGateway } from '../gateways/mail-gateway';
import { ValidationRules, ValidationController, ValidationControllerFactory, } from "aurelia-validation";
import * as salvattore from 'salvattore';
import environment from 'environment';

@autoinject()
export class About {
    constructor(i18n: I18N, router: Router, mailGateway: MailGateway, validationController: ValidationControllerFactory) {
        this.i18n = i18n;
        this.router = router;
        this.mailGateway = mailGateway;
        this.validationController = validationController.createForCurrentScope();
    }
    @observable
    private pincode: string = '';
    private pincodes: number[] = [1369, 2468];
    private pincodeValid;
    private showDownloads: boolean;
    private i18n: I18N;
    private router: Router;
    private id: string;
    private sendername: string;
    private senderemail: string;
    private senderphone: string;
    private sendermessage: string;
    private mailGateway: MailGateway;
    private contactMailSent: boolean;
    private validationController: any;
    private determineActivationStrategy() {
        return activationStrategy.invokeLifecycle;
    }
    private activate(params) {
        if (params && params.id) {
            window.sessionStorage.setItem('ignoreScrollTop', 'true');
            this.id = params.id;
            this.router.navigateToRoute('about', {}, { trigger: false, replace: true });
            this.smoothScroll();
        }
        this.manageValidationRules();
    }
    private attached() {
        salvattore.init();
        this.smoothScroll();

        $(document).ready(function () {
            (<any>$('[data-toggle="tooltip"]')).tooltip();
            $('.btn-more').on('click', function () {
                $(this).hide();
            });
        });
    }
    private detached() {
    }
    private smoothScroll() {
        if (this.id && $("#" + this.id).offset()) {
            var delta = (this.isMobileVersion) ? 650 : 50;
            var p = $('#' + this.id).offset();
            $('body, html').animate({ 'scrollTop': p.top - delta }, 350);
        }
    }
    private manageValidationRules() {
        ValidationRules
            .ensure((x: About) => x.sendername).required()
            .ensure((x: About) => x.senderemail).required()
            .ensure((x: About) => x.sendermessage).required()
            .on(this);

        this.validationController.addObject(this);
    }
    private get isMobileVersion() {
        var is_mobile = true;
        if ($('#eskimo-menu-toggle').css('display') == 'none') {
            is_mobile = false;
        }
        return is_mobile;
    }
    private animateProgressBars() {

        var x = 0;
        var elms = $('.progress-bar');

        window.setTimeout(letsgo, 50);

        function letsgo() {
            elms.each(x => {
                var elm = elms.eq(x);
                if ($(elm).is(":visible"))
                    elm.css('width', '100%');
            });
        }

        //var intervalID = window.setInterval(action, 20);
        // function action() {
        //     var a = Math.floor(Math.random() * 25); // between 0 and 24
        //     var elm = elms.eq(a);
        //     if ($(elm).is(":visible"))
        //         elm.css('width', '100%');
        //     if (++x === 100) {
        //         window.clearInterval(intervalID);
        //         alert('finish');
        //     }
        // }
    }
    private downloadcv(lng: string) {
        var link = document.createElement("a");
        link.download = 'name.pdf';
        link.href = environment.backendUrl + 'uploads/cv-' + lng + '.pdf';
        link.target = '_blank';
        link.click();
    }
    private sendMessage() {
        this.validationController.validate()
            .then((result) => {
                if (result.valid)
                    sendTheMessage(this);
            });
        function sendTheMessage(self) {
            self.mailGateway.sendMail(self.sendername, self.senderemail, self.senderphone, self.sendermessage).then((result) => {
                self.contactMailSent = result;
            });
        }
    }
    private resetMailAlert(e: MouseEvent) {
        this.contactMailSent = null;
        this.sendername = null;
        this.senderemail = null;
        this.senderphone = null;
        this.sendermessage = null;
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    private pincodeChanged(e) {
        var self = this;
        this.pincodeValid = (this.pincode.length == 4) ? this.pincodes.includes(+this.pincode) : undefined;
        if (this.pincodeValid)
            window.setTimeout(function () { self.showDownloads = true; }, 2000);
    }
}
