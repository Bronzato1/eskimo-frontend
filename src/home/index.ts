import { autoinject } from 'aurelia-dependency-injection';
import { inject } from 'aurelia-framework';
import { Post } from 'models/post-models';
import { PostGateway } from 'models/post-gateway';
import { I18N } from 'aurelia-i18n';

@autoinject()
export class Index {
    constructor(postGateway: PostGateway, i18n: I18N) {
        this.postGateway = postGateway;
        this.i18n = i18n;
    }
    private posts: Array<Post> = [];
    private postGateway: PostGateway;
    private i18n: I18N;
    private activate() {
        var self = this;
        return this.postGateway.getAllPosts().then((posts) => {
            self.posts.splice(0);
            self.posts.push.apply(self.posts, posts);
        });
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
        var excerpt = txt.substring(0,250) + '...';
        return this.stripHtml(excerpt);
    }
    private stripHtml(html){
        // Create a new div element
        var temporalDivElement = document.createElement("div");
        // Set the HTML content with the providen
        temporalDivElement.innerHTML = html;
        // Retrieve the text property of the element (cross-browser support)
        return temporalDivElement.textContent || temporalDivElement.innerText || "";
    }
}
