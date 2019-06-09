import { Router, RouterConfiguration } from 'aurelia-router';

export class App {
    configureRouter(config: RouterConfiguration, router: Router) {
        config.addPipelineStep('postcomplete', PostCompleteStep);
        config.map([
            { route: '', redirect: 'index' },
            { route: 'index', name: 'index', moduleId: 'pages/test/index' },
            { route: 'index2', name: 'index2', moduleId: 'pages/test/index2' },
            { route: 'index3', name: 'index3', moduleId: 'pages/test/index3' },
            { route: 'about', name: 'about', moduleId: 'pages/test/about' },
            { route: 'about2', name: 'about2', moduleId: 'pages/test/about2' },
            { route: 'author', name: 'author', moduleId: 'pages/test/author' },
            { route: 'blog', name: 'blog', moduleId: 'pages/test/blog' },
            { route: 'blog2', name: 'blog2', moduleId: 'pages/test/blog2' },
            { route: 'blog3', name: 'blog3', moduleId: 'pages/test/blog3' },
            { route: 'singlePost', name: 'singlePost', moduleId: 'pages/test/single-post' },
            { route: 'category', name: 'category', moduleId: 'pages/test/category' },
            { route: 'otherFeatures', name: 'otherFeatures', moduleId: 'pages/test/other-features' },
            { route: 'search', name: 'search', moduleId: 'pages/test/search' },
            { route: 'testFroala', name: 'testFroala', moduleId: 'pages/test/test-froala' },
            { route: 'postList', name: 'postList', moduleId: 'blog/post-list' },
            { route: 'postEdit', name: 'postEdit', moduleId: 'blog/post-edit' },
            { route: 'postView', name: 'postView', moduleId: 'blog/post-view' }
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
            var coord = $('#eskimo-main-container > .container').offset();
            if (!coord) return;
            var distance = coord.left - 295;
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
