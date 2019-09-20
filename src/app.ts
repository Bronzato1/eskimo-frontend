import { Router, RouterConfiguration, Redirect } from 'aurelia-router';
import { Authentication } from 'services/authentication';
import { Container, autoinject, inject } from 'aurelia-framework';
import { SlidePanel } from './slide-panel';
import { TopHeader } from './top-header';

@autoinject
export class App {
    constructor(container: Container, slidePanel: SlidePanel, topHeader: TopHeader) {
        this.container = container;
        this.slidePanel = slidePanel;
        this.topHeader = topHeader;
    }
    private container: Container;
    private slidePanel: SlidePanel;
    private topHeader: TopHeader;
    configureRouter(config: RouterConfiguration) {
        config.addPipelineStep('postcomplete', PostCompleteStep);
        config.addPipelineStep('authorize', AuthorizeStep);
        config.map([

            { route: '', redirect: 'postsListView' },

            // B L O G

            { route: 'postsGridView', name: 'postsGridView', moduleId: 'blog/posts-grid-view' },
            { route: 'postsListView', name: 'postsListView', moduleId: 'blog/posts-list-view' },
            { route: 'postsMasoView', name: 'postsMasoView', moduleId: 'blog/posts-maso-view' },
            { route: 'postsGoogView', name: 'postsGoogView', moduleId: 'blog/posts-goog-view' },
            { route: 'postsListAdmin', name: 'postsListAdmin', moduleId: 'blog/posts-list-admin', settings: { auth: true } },
            { route: 'postsSpreakerImport', name: 'postsSpreakerImport', moduleId: 'blog/posts-spreaker-import', settings: { auth: true } },
            { route: 'postEdit', name: 'postEdit', moduleId: 'blog/post-edit', settings: { auth: true } },
            { route: 'postView', name: 'postView', moduleId: 'blog/post-view' },
            { route: 'categoryList', name: 'categoryList', moduleId: 'blog/category-list', settings: { auth: true } },
            { route: 'categoryEdit', name: 'categoryEdit', moduleId: 'blog/category-edit', settings: { auth: true } },
            { route: 'authorList', name: 'authorList', moduleId: 'blog/author-list', settings: { auth: true } },
            { route: 'authorEdit', name: 'authorEdit', moduleId: 'blog/author-edit', settings: { auth: true } },
            
            // A B O U T

            { route: 'about', name: 'about', moduleId: 'about/about' },
            { route: 'cv', name: 'cv', moduleId: 'about/cv' },

            // A U T H E N T I C A T I O N

            { route: 'login', name: 'login', moduleId: 'login/login' },
            { route: 'logout', name: 'logout', moduleId: 'logout/logout', settings: { auth: true } },

            // T E S T

            { route: 'index2', name: 'index2', moduleId: 'pages/test/index2' },
            { route: 'index3', name: 'index3', moduleId: 'pages/test/index3' },
            { route: 'about2', name: 'about2', moduleId: 'pages/test/about2' },
            { route: 'author', name: 'author', moduleId: 'pages/test/author' },
            { route: 'blog', name: 'blog', moduleId: 'pages/test/blog' },
            { route: 'blog2', name: 'blog2', moduleId: 'pages/test/blog2' },
            { route: 'blog3', name: 'blog3', moduleId: 'pages/test/blog3' },
            { route: 'singlePost', name: 'singlePost', moduleId: 'pages/test/single-post' },
            { route: 'category', name: 'category', moduleId: 'pages/test/category' },
            { route: 'tag', name: 'tag', moduleId: 'pages/test/tag' },
            { route: 'otherFeatures', name: 'otherFeatures', moduleId: 'pages/test/other-features' },
            { route: 'search', name: 'search', moduleId: 'pages/test/search' },
            { route: 'testFroala', name: 'testFroala', moduleId: 'pages/test/test-froala' }
        ]);
    }
    attached() {
        $(document).ready(function () {
            /* ADJUST MENU FOR MOBILES */
            $("#eskimo-menu-toggle").on('click', function (e) {
                $("#eskimo-language-cell,#eskimo-social-cell,#eskimo-main-menu").toggle();
            });
        });
    }
    detached() {
        $("#eskimo-menu-toggle").off("click");
    }
}

class PostCompleteStep {
    run(routingContext, next) {
        this.customScripts();
        return next();
    }

    private customScripts() {

        /* MOBILE MENU HIDING AT EVERY PAGE LOADING */
        $("#eskimo-language-cell,#eskimo-social-cell,#eskimo-main-menu").hide();

        /* SCROLL TOP AT EVERY PAGE LOADING */
        var ignore = window.sessionStorage.getItem('ignoreScrollTop');
        if (ignore) {
            window.sessionStorage.removeItem('ignoreScrollTop');
        } else {
            $("html,body").scrollTop(0);
        }

        $(document).ready(function () {
            $('#eskimo-main-menu').find('.eskimo-menu-ul > li:has(ul) > a').addClass("eskimo-menu-down");
            $('body').find('select').addClass('custom-select');
        });
    }
}

@autoinject
class AuthorizeStep {

    constructor(private authentication: Authentication) {
        
    }

    run(navigationInstruction, next) {

        let currentUser = this.authentication.currentUser;
        let isLoggedIn = currentUser != null;

        // currently active route config
        let currentRoute = navigationInstruction.config;

        // settings object will be preserved during navigation
        let loginRequired = currentRoute.settings && currentRoute.settings.auth === true;

        if (isLoggedIn === false && loginRequired === true)
            return next.cancel(new Redirect('login'));

        return next();
    }
}
