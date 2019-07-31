import { autoinject } from 'aurelia-dependency-injection';
import { Post } from 'models/post-models';
import { PostGateway } from 'gateways/post-gateway';
import { I18N } from 'aurelia-i18n';

@autoinject()
export class Posts {
    constructor(postGateway: PostGateway, i18n: I18N) {
        this.postGateway = postGateway;
        this.i18n = i18n;
    }
    private allPosts: Array<Post> = [];
    private favoritePosts: Array<Post> = [];
    private loadedPages: number;
    private totalPages: number;
    private postGateway: PostGateway;
    private i18n: I18N;
    private activate() {
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
        return this.postGateway.getPostsByPage(this.loadedPages).then((posts) => {
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
}
