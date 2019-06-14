import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { PostGateway } from "../models/post-gateway";
import { Post } from "../models/post-models";
import { Box } from "../dialogs/box";
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import * as moment from "moment";
import 'moment/locale/fr'

@autoinject()
export class PostList {
    constructor(router: Router, postGateway: PostGateway, box: Box, eventAggregator: EventAggregator, i18n: I18N) {
        this.router = router;
        this.postGateway = postGateway;
        this.box = box;
        this.eventAggregator = eventAggregator;
        this.i18n = i18n;
    }
    private router: Router;
    private postGateway: PostGateway;
    private box: Box;
    private eventAggregator: EventAggregator;
    private posts: Array<Post> = [];
    private zipFile: any;
    private i18n: I18N;
    private activate() {
        return this.postGateway.getAllPosts()
            .then(posts => {
                this.posts.splice(0);
                this.posts.push.apply(this.posts, posts);
            });
    }
    private attached() {
        var self = this;
        $(document).ready(() => {
            $('#fileChooser').change(function () {
                self.importData();
            });
        });
    }
    private exportSelectedPosts() {
        var ids = this.selectedPosts.map(x => x.id);
        this.postGateway.downloadZip(ids);
    }
    private importData() {
        if (!this.zipFile) {
            $("#fileChooser").click();
            return;
        }
        this.postGateway.uploadZip(this.zipFile);
    }
    private clearAllPosts() {
        var message = 'Cette opération est irréversible. Etes-vous sur ?';
        var title = 'Suppression totale';
        var buttonOk = 'Ok';
        var buttonCancel = 'Annuler';

        this.box.showQuestion(message, title, buttonOk, buttonCancel).whenClosed((response) => {
            if (!response.wasCancelled && response.output == buttonOk)
                this.postGateway.clearAllPosts();
        });
    }
    private createNewPost() {
        this.router.navigateToRoute('postEdit');
    }
    private deletePost(post: Post) {
        var message = 'Voulez-vous vraiment supprimer l\'élément ?';
        var title = 'Suppression';
        var buttonYes = 'Oui';
        var buttonNo = 'Non';

        this.box.showQuestion(message, title, buttonYes, buttonNo).whenClosed(response => {
            if (!response.wasCancelled && response.output == buttonYes)
                performTheDelete(this);
        });

        async function performTheDelete(self: PostList) {
            await self.postGateway.deletePost(post.id);
            var pos = self.posts.findIndex(x => x.id == post.id);
            self.posts.splice(pos, 1);
        }
    }
    private deleteSelectedPosts() {
        var cptr = this.selectedPosts.length;
        var message = `Voulez-vous vraiment supprimer ${cptr == 1 ? 'l\'élément' : 'les ' + cptr + ' éléments'} ?`;
        var title = 'Suppression';
        var buttonYes = 'Oui';
        var buttonNo = 'Non';

        this.box.showQuestion(message, title, buttonYes, buttonNo).whenClosed(response => {
            if (!response.wasCancelled && response.output == buttonYes) {
                this.posts.forEach(post => {
                    if (post.isChecked)
                        performTheDelete(this, post);
                });
            }
        });

        async function performTheDelete(self: PostList, post: Post) {
            await self.postGateway.deletePost(post.id);
            var pos = self.posts.findIndex(x => x.id == post.id);
            self.posts.splice(pos, 1);
        }
    }
    private viewSettings() {
        this.router.navigateToRoute('administration');
    }
    private checkChange(value, groupKey, groupItems) {
        this.eventAggregator.publish('checkChange', { groupKey: groupKey, groupItems: groupItems });
    }
    private get selectedPosts() {
        return this.posts.filter(post => post.isChecked == true);
    }
    private get currentLanguage() {
        return this.i18n.getLocale();
    }
}
