import { Category } from './../../models/category-models';
import { CategoryGateway } from './../../gateways/category-gateway';
import { Authentication } from './../../services/authentication';
import { I18N } from 'aurelia-i18n';
import { autoinject, Container } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { runInThisContext } from 'vm';

@autoinject()
export class Sidebar {
    constructor(i18n: I18N) {
        this.i18n = i18n;
        this.categoryGateway = Container.instance.get(CategoryGateway);
        this.i18n.setLocale('fr');
        this.router = Container.instance.get(Router);
        this.authentication = Container.instance.get(Authentication);
    }
    static inject = [I18N];
    private i18n: I18N;
    private router: Router;
    private authentication: Authentication;
    private categoryGateway: CategoryGateway;
    private categories: Array<Category>;
    private get currentUser() {
        return this.authentication.currentUser;
    }
    private bind() {
        this.categoryGateway.getAllCategories().then((categories) => this.categories = categories );
    }
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
    private get currentLanguage() {
        return this.i18n.getLocale();
    }
}
