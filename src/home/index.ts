import { autoinject } from 'aurelia-dependency-injection';
import { Post } from 'models/post-models';
import { PostGateway } from 'models/post-gateway';
import { I18N } from 'aurelia-i18n';

@autoinject()
export class Index {
    constructor(postGateway: PostGateway, i18n: I18N) {
        this.postGateway = postGateway;
        this.i18n = i18n;
    }
    private allPosts: Array<Post> = [];
    private favoritePosts: Array<Post> = [];
    private postGateway: PostGateway;
    private i18n: I18N;
    private activate() {

        var self = this;
        var promise1 = loadPostsWithPagination();
        var promise2 = loadPostsInFavorites();

        return Promise.all([promise1, promise2]);

        function loadPostsWithPagination(): Promise<void | Post[]> {
            return self.postGateway.getPostsWithPagination(1).then((posts) => {
                self.allPosts.splice(0);
                self.allPosts.push.apply(self.allPosts, posts);
            });
        }
        function loadPostsInFavorites(): Promise<void | Post[]> {
            return self.postGateway.getPostsInFavorites().then((posts) => {
                self.favoritePosts.splice(0);
                self.favoritePosts.push.apply(self.favoritePosts, posts);
            });
        }
    }
    private attached() {
        var self = this;
        $(document).ready(() => {
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
}
