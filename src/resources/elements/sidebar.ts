import { I18N } from 'aurelia-i18n';
import { autoinject } from 'aurelia-framework';

@autoinject()
export class Sidebar {
    constructor(i18n: I18N) {
        this.i18n = i18n;
        this.i18n.setLocale('fr');
    }
    static inject = [I18N];
    private i18n: I18N;
    private attached() {
        $(document).ready(() => {
            /* MAIN MENU */
            $('#eskimo-main-menu').find(".eskimo-menu-ul > li > a").on('click', function () {
                var nxtLink = $(this).next();
                if ((nxtLink.is('ul')) && (nxtLink.is(':visible'))) {
                    nxtLink.slideUp(300);
                    $(this).removeClass("eskimo-menu-up").addClass("eskimo-menu-down");
                }
                if ((nxtLink.is('ul')) && (!nxtLink.is(':visible'))) {
                    $('#eskimo-main-menu').find('.eskimo-menu-ul > li > ul:visible').slideUp(300);
                    nxtLink.slideDown(300);
                    $('#eskimo-main-menu').find('.eskimo-menu-ul > li:has(ul) > a').removeClass("eskimo-menu-up").addClass("eskimo-menu-down");
                    $(this).addClass("eskimo-menu-up");
                }
                if (nxtLink.is('ul')) {
                    return false;
                } else {
                    return true;
                }
            });
        });
    }
    private switchToFrench() {
        this.i18n.setLocale('fr');
    }
    private switchToEnglish() {
        this.i18n.setLocale('en');
    }
}
