import { I18N } from 'aurelia-i18n';
import { inject, autoinject } from 'aurelia-framework';
import { Router, activationStrategy } from 'aurelia-router';
import * as salvattore from 'salvattore';

@autoinject()
export class About {
    constructor(i18n: I18N, router: Router) {
        this.i18n = i18n;
        this.router = router;
    }
    private i18n: I18N;
    private router: Router;
    private id: string;
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
    }
    private attached() {
        salvattore.init();
        this.smoothScroll();
    }
    private get aboutMe() {
        return this.i18n.tr('about.aboutMe');
    }
    private smoothScroll() {
        if (this.id && $("#" + this.id).offset()) {
            var p = $('#' + this.id).offset();
            $('body, html').animate({ 'scrollTop': p.top - 50 }, 350);
        }
    }
}
