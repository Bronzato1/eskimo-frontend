import { autoinject } from "aurelia-framework";
import { Router, activationStrategy } from "aurelia-router";
import { PostGateway } from "../gateways/post-gateway";
import { Post } from "../models/post-models";
import { Tag } from "../models/tag-models";
import { Category } from "../models/category-models";
import { I18N } from 'aurelia-i18n';
import { SlidePanel } from './../slide-panel';
import { TopHeader } from './../top-header';

@autoinject()
export class PostsListView {
    constructor(router: Router, postGateway: PostGateway, i18n: I18N, slidePanel: SlidePanel, topHeader: TopHeader) {
        this.router = router;
        this.postGateway = postGateway;
        this.i18n = i18n;
        this.slidePanel = slidePanel;
        this.topHeader = topHeader;
    }
    private router: Router;
    private postGateway: PostGateway;
    private posts: Array<Post> = [];
    private categoryId: number;
    private tagId: number;
    private mediaId: number;
    private loadedPages: number;
    private category: Category;
    private i18n: I18N;
    private slidePanel: SlidePanel;
    private topHeader: TopHeader;
    determineActivationStrategy() {
        return activationStrategy.replace;
    }
    private activate(params) {

        this.slidePanel.currentViewMode = 'list';
        this.mediaId = this.slidePanel.selectedMedia = params.mediaId || '';
        this.categoryId =  this.slidePanel.selectedCategory = params.categoryId || '';
        this.tagId = this.slidePanel.selectedTag = params.tagId || '';
        this.loadedPages = 1;

        return this.postGateway.getPostsByPage(this.mediaId, this.categoryId, this.tagId, this.loadedPages)
            .then(posts => {
                this.posts.splice(0);
                this.posts.push.apply(this.posts, posts);
            });
    }
    private viewSettings() {
        this.router.navigateToRoute('administration');
    }
    private get currentLanguage() {
        return this.i18n.getLocale();
    }
    private get filter() {
        return this.topHeader.filter;
    }
    private filtered(tags: Tag[], currentLanguage) {
        return tags.filter(x => x.language == currentLanguage);
    }
    private switchFavorite(post: Post) {

        var promise: Promise<Boolean>;

        if (post.favorite)
            promise = this.postGateway.removePostFromFavorite(post.id)
        else
            promise = this.postGateway.addPostToFavorite(post.id);

        promise.then(value => {
            if (value == true) {
                // success
                post.favorite = !post.favorite;
            }
            else {
                // error
                alert('Error!');
            }
        });
    }
    private viewPost(post: Post) {
        this.router.navigateToRoute('postView', { id: post.id });
    }
}
