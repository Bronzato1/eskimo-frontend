import { PostGateway } from "../gateways/post-gateway";
import { autoinject, bindable } from "aurelia-framework";
import { I18N } from 'aurelia-i18n';
import { Router } from "aurelia-router";
import { Post } from "../models/post-models";
import { Author } from "../models/author-models";
import { Tag } from "../models/tag-models";

@autoinject()
export class PostView {
    constructor(postGateway: PostGateway, router: Router, i18n: I18N) {
        this.postGateway = postGateway;
        this.router = router;
        this.i18n = i18n;
    }
    private postGateway: PostGateway;
    private router: Router;
    private i18n: I18N;
    private post: Post;
    private activate(params, config) {
        var self = this;

        if (params && params.id)
            return loadThePost();

        async function loadThePost() {
            var post = await self.postGateway.getPost(params.id);
            self.post = post;
            config.navModel.setTitle(post.frenchTitle);
        }
    }
    private attached() {
        //this.overlay();
    }
    private get currentLanguage() {
        return this.i18n.getLocale();
    }
    private filtered(tags: Tag[], currentLanguage) {
        return tags.filter(x => x.language == currentLanguage);
    }
    private overlay() {

        var div: Element = document.getElementsByClassName('eskimo-featured-img')[0];

        if (!div)
            return;

        var img: Element = div.getElementsByTagName('img')[0];
        var overlay: Element = div.getElementsByClassName('overlay')[0];
        var icon: Element = div.getElementsByClassName('icon')[0];
        var i: Element = div.getElementsByTagName('i')[0];

        if (!overlay) {

            i = document.createElement("i");

            icon = document.createElement("div");
            icon.className = "icon";
            icon.appendChild(i);

            overlay = document.createElement("div");
            overlay.className = "overlay";
            overlay.appendChild(icon);
        }

        switch (this.post.media) {
            case 1: // Text
                break;
            case 2: // Audio
                i.className = "fa fa-microphone";
                break;
            case 3: /// Video
                i.className = "fa fa-youtube-play";
                break;
            default:
                return;
        }
        img.parentNode.insertBefore(overlay, img.nextSibling);
    }
    private navigateToAuthorUrl(author: Author) {
        if (author.url.startsWith('http')) {
            var url = author.url;
            var win = window.open(url, '_blank');
            win.focus();
        } else {
            this.router.navigateToRoute('about');
        }
    }
}
