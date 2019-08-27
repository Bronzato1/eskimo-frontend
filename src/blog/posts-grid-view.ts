import { Container, computedFrom } from 'aurelia-framework';
import { Category } from './../models/category-models';
import { autoinject } from 'aurelia-dependency-injection';
import { activationStrategy } from 'aurelia-router';
import { Router } from "aurelia-router";
import { Post } from 'models/post-models';
import { PostGateway } from 'gateways/post-gateway';
import { I18N } from 'aurelia-i18n';
import { SlidePanel } from './../slide-panel';

@autoinject()
export class PostsGridView {

    private router: Router;
    private allPosts: Array<Post> = [];
    private favoritePosts: Array<Post> = [];
    private categoryId: number;
    private tagId: number;
    private mediaId: number;
    private loadedPages: number;
    private category: Category;
    private totalPages: number;
    private postGateway: PostGateway;
    private i18n: I18N;
    private slidePanel: SlidePanel;

    constructor(router: Router, postGateway: PostGateway, i18n: I18N, slidePanel: SlidePanel) {
        this.router = router;
        this.postGateway = postGateway;
        this.i18n = i18n;
        this.slidePanel = slidePanel;
    }
    determineActivationStrategy() {
        return activationStrategy.replace;
    }
    private activate(params) {

        this.slidePanel.currentViewMode = 'grid';
        this.mediaId = this.slidePanel.selectedMedia = params.mediaId || '';
        this.categoryId =  this.slidePanel.selectedCategory = params.categoryId || '';
        this.tagId = this.slidePanel.selectedTag = params.tagId || '';
        this.loadedPages = 1;

        var promise1 = this.loadPostsByPage();
        var promise2 = this.loadPostsInFavorites();
        var promise3 = this.getTotalPostPages();

        return Promise.all([promise1, promise2, promise3]);
    }
    private attached() {
        var self = this;
        $(document).ready(() => {

        });
    }
    private loadPostsByPage(): Promise<void | Post[]> {

        return this.postGateway.getPostsByPage(this.mediaId, this.categoryId, this.tagId, this.loadedPages).then((posts) => {
            this.allPosts.push.apply(this.allPosts, posts);
            setTimeout(this.adjustHorizontalCardImages, 100);
        });
    }
    private loadPostsInFavorites(): Promise<void | Post[]> {
        return this.postGateway.getPostsInFavorites().then((posts) => {
            this.favoritePosts.splice(0);
            this.favoritePosts.push.apply(this.favoritePosts, posts);
        });
    }
    private getTotalPostPages(): Promise<void | number> {
        return this.postGateway.getTotalPostPages().then((tot) => {
            this.totalPages = tot;
        });
    }
    private get currentLanguage() {
        return this.i18n.getLocale();
    }
    private excerpt(txt: string) {
        if (!txt) return '';
        var excerpt = txt.substring(0, 250) + '...';
        return this.stripHtml(excerpt);
    }
    private stripHtml(html) {
        // Create a new div element
        var temporalDivElement = document.createElement("div");
        // Set the HTML content with the providen
        temporalDivElement.innerHTML = html;
        // Retrieve the text property of the element (cross-browser support)
        return temporalDivElement.textContent || temporalDivElement.innerText || "";
    }
    private loadMorePosts() {
        this.loadedPages++;
        this.loadPostsByPage();
    }
    private adjustHorizontalCardImages() {
        /* HORIZONTAL CARD IMAGES */
        $('body').find(".card-horizontal-right").each(function () {
            if ($(this).attr('data-img')) {
                var card_img = $(this).data('img');
                $(this).css('background-image', 'url("' + card_img + '")');
            }
        });
    }
    private getTitle() {
        var title = this.i18n.tr('postList.title');

        if (this.category)
            title += ' | Filtre sur <span class="badge badge-' + this.category.color + '"> ' + this.category.frenchName + '</span>';

        return title;
    }
}
