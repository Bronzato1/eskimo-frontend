import { autoinject } from 'aurelia-framework';
import { SpreakerGateway } from '../gateways/spreaker-gateway';
import { PostGateway } from 'gateways/post-gateway';
import { AuthorGateway } from './../gateways/author-gateway';
import { Post } from '../models/post-models';
import { Author } from '../models/author-models';
import { Box } from '../dialogs/box';
import { ModalSpreakerImport } from './modal-spreaker-import';

@autoinject()
export class PostsSpreakerImport {
    private episodes = [];
    private nextUrl;
    private searchCriteria;
    private spreakerGateway: SpreakerGateway;
    private postGateway: PostGateway;
    private authorGateway: AuthorGateway;
    private modalSpreakerImport: ModalSpreakerImport;
    private box: Box;
    constructor(spreakerGateway: SpreakerGateway, postGateway: PostGateway, authorGateway: AuthorGateway, box: Box, modalSpreakerImport: ModalSpreakerImport) {
        this.spreakerGateway = spreakerGateway;
        this.postGateway = postGateway;
        this.authorGateway = authorGateway;
        this.box = box;
        this.modalSpreakerImport = modalSpreakerImport;
    }
    private clear() {
        this.searchCriteria = '';
        this.episodes = [];
    }
    private search() {
        this.spreakerGateway.searchEpisodes(this.searchCriteria).then(data => {
            this.nextUrl = data.next_url;
            this.episodes = data.items;
        }).catch(error => console.log(error));
    }
    private loadNextEpisodes() {
        this.spreakerGateway.loadNextEpisodes(this.nextUrl).then(data => {
            this.nextUrl = data.next_url;
            this.episodes.push.apply(this.episodes, data.items);
        });
    }
    private get selectedEpisodes() {
        return this.episodes.filter(episode => episode.isChecked == true);
    }
    private selectAll() {
        this.episodes.forEach(x => x.isChecked = true);
    }
    private unselectAll() {
        this.episodes.forEach(x => x.isChecked = false);
    }
    private importSelectionInDatabase() {

        //var self = this;

        var model = {
            selectedEpisodesCount: this.selectedEpisodes.length
        };

        this.box.showCustomDialog(ModalSpreakerImport, model)
            .whenClosed(response => {
                if (!response.wasCancelled) {

                    var results = [];

                    this.selectedEpisodes.forEach(async elm => {

                        var user = await this.spreakerGateway.searchUser(elm.author_id);

                        if (!user) {
                            results.push(`User {elm.author_id} not found`);
                            return;
                        }

                        var author = await this.authorGateway.getAuthorByName(htmlEscape(user.fullname));

                        if (!author) {
                            // Création de l'auteur dans la database
                            var newAuthor: Author = new Author();
                            newAuthor.name = user.fullname;
                            newAuthor.url = user.site_url;
                            author = await this.authorGateway.createAuthor(newAuthor);
                        }

                        // création du post
                        var post: Post = new Post();
                        post.media = 2;
                        post.readingTime = Math.trunc(elm.duration / 60000);
                        post.creation = elm.published_at;
                        post.image = response.output.category.image;
                        post.frenchTitle = elm.title;
                        post.englishTitle = elm.title;
                        post.frenchContent = `<iframe src="https://widget.spreaker.com/player?episode_id=${elm.episode_id}" width="100%" height="200px" frameborder="0"></iframe>`;
                        post.englishContent = post.frenchContent;
                        post.categoryId = response.output.category.id;
                        post.authorId = (<Author>author).id;

                        var createdPost = await this.postGateway.createPost(post);

                    });
                }
            });

        function htmlEscape(str) {
            return str
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }

        // I needed the opposite function today, so adding here too:
        function htmlUnescape(str) {
            return str
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&');
        }

    }
}
