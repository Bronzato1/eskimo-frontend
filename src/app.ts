import { Router, RouterConfiguration } from 'aurelia-router';

export class App {
    configureRouter(config: RouterConfiguration, router: Router) {
        config.addPipelineStep('postcomplete', PostCompleteStep);
        config.map([
            { route: '', redirect: 'index' },
            { route: 'index', name: 'index', moduleId: 'pages/index' },
            { route: 'index2', name: 'index2', moduleId: 'pages/index2' },
            { route: 'index3', name: 'index3', moduleId: 'pages/index3' },
            { route: 'about', name: 'about', moduleId: 'pages/about' },
            { route: 'about2', name: 'about2', moduleId: 'pages/about2' },
            { route: 'author', name: 'author', moduleId: 'pages/author' },
            { route: 'blog', name: 'blog', moduleId: 'pages/blog' },
            { route: 'blog2', name: 'blog2', moduleId: 'pages/blog2' },
            { route: 'blog3', name: 'blog3', moduleId: 'pages/blog3' },
            { route: 'singlePost', name: 'singlePost', moduleId: 'pages/single-post' },
            { route: 'category', name: 'category', moduleId: 'pages/category' },
            { route: 'otherFeatures', name: 'otherFeatures', moduleId: 'pages/other-features' },
            { route: 'search', name: 'search', moduleId: 'pages/search' }
        ]);
        this.router = router;
    }
    private router: Router;
    attached() {

    }
}

class PostCompleteStep {
    run(routingContext, next) {
        this.customScripts();
        return next();
    }

    private customScripts() {

        /* SCROLL TOP AT EVERY PAGE LOADING */
        $("html,body").scrollTop(0);

        /* CALCULATE PAGE TITLE NEGATIVE MARGIN */
        var adjustPageTitle = function () {
            var distance = $('#eskimo-main-container > .container').offset().left - 295;
            $('#eskimo-main-container').find('.eskimo-page-title').css('margin-right', -distance);
            $('#eskimo-main-container').find('.eskimo-page-title').css('padding-right', distance);
            $('#eskimo-main-container').find('.eskimo-page-title').css('opacity', 1);
        };

        /* HORIZONTAL CARD IMAGES */
        var cardImages = function () {
            $('body').find(".card-horizontal-right").each(function () {
                if ($(this).attr('data-img')) {
                    var card_img = $(this).data('img');
                    $(this).css('background-image', 'url("' + card_img + '")');
                }
            });
        };

        /* MOBILE MENU */
        var adjustMenuForMobiles = function () {
            $("#eskimo-menu-toggle").on('click', function () {
                $("#eskimo-social-cell,#eskimo-main-menu").toggle();
            });
        };

        $(document).ready(function () {

            adjustMenuForMobiles();
            adjustPageTitle();
            cardImages();
            $('#eskimo-main-menu').find('.eskimo-menu-ul > li:has(ul) > a').addClass("eskimo-menu-down");
            $('body').find('select').addClass('custom-select');
            $('body').find('.eskimo-masonry-grid').css('opacity', '1');
        });

        $(window).on('resize orientationchange', function () {
            adjustPageTitle();
        });

    }
}
