import { Router, RouterConfiguration, Redirect } from 'aurelia-router';
import { Authentication } from 'services/authentication';
import { autoinject } from 'aurelia-framework';

export class App {
    configureRouter(config: RouterConfiguration, router: Router) {
        config.addPipelineStep('postcomplete', PostCompleteStep);
        config.addPipelineStep('authorize', AuthorizeStep);
        config.map([

            { route: '', redirect: 'posts' },

            // B L O G

            { route: 'posts', name: 'posts', moduleId: 'blog/posts' },
            { route: 'postList', name: 'postList', moduleId: 'blog/post-list', settings: { auth: true } },
            { route: 'postEdit', name: 'postEdit', moduleId: 'blog/post-edit', settings: { auth: true } },
            { route: 'postView', name: 'postView', moduleId: 'blog/post-view' },
            { route: 'categoryList', name: 'categoryList', moduleId: 'blog/category-list', settings: { auth: true } },
            { route: 'categoryEdit', name: 'categoryEdit', moduleId: 'blog/category-edit', settings: { auth: true } },

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
            { route: 'blog2', name: 'blog2', moduleId: 'pages/test/blog2' },
            { route: 'blog3', name: 'blog3', moduleId: 'pages/test/blog3' },
            { route: 'singlePost', name: 'singlePost', moduleId: 'pages/test/single-post' },
            { route: 'category', name: 'category', moduleId: 'pages/test/category' },
            { route: 'tag', name: 'tag', moduleId: 'pages/test/tag' },
            { route: 'otherFeatures', name: 'otherFeatures', moduleId: 'pages/test/other-features' },
            { route: 'search', name: 'search', moduleId: 'pages/test/search' },
            { route: 'testFroala', name: 'testFroala', moduleId: 'pages/test/test-froala' }
        ]);
        this.router = router;
    }
    private router;
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

        /* CALCULATE PAGE TITLE NEGATIVE MARGIN */
        var adjustPageTitle = function () {
            // var coord = $('#eskimo-main-container > .container').offset();
            // if (!coord) return;
            // var distance = coord.left - 295;
            // $('#eskimo-main-container').find('.eskimo-page-title').css('margin-right', -distance);
            // $('#eskimo-main-container').find('.eskimo-page-title').css('padding-right', distance);
            $('#eskimo-main-container').find('.eskimo-page-title').css('opacity', 1);
        };

        $(document).ready(function () {
            adjustPageTitle();
            $('#eskimo-main-menu').find('.eskimo-menu-ul > li:has(ul) > a').addClass("eskimo-menu-down");
            $('body').find('select').addClass('custom-select');
            $('body').find('.eskimo-masonry-grid').css('opacity', '1');
        });

        $(window).on('resize orientationchange', function () {
            adjustPageTitle();
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
