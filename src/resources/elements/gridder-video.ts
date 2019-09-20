import { Category } from '../../models/category-models';
import { Post } from '../../models/post-models';
import { bindable } from "aurelia-framework";

export class GridderVideo {

    @bindable posts: Post[];
    @bindable categories;

    private currentTag;
    private player;

    constructor() {
    }
    private bind() {
        jQuery(document.body).on('click', '.header .fa-play-circle', (e) => this.playPauseVideo(e, this));
        jQuery(document.body).on('click', '.header .fa-pause-circle', (e) => this.playPauseVideo(e, this));
        jQuery(document.body).on('click', '.table .fa-play', (e) => this.playPauseVideo(e, this));
        jQuery(document.body).on('click', '.table .fa-pause', (e) => this.playPauseVideo(e, this));
    }
    private onContent() {
        //  onContent --> Gridder content loaded
        this.initializePlayer();
    }
    private onClosed() {
        // onClosed --> Gridder closed
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }
    }
    private getPostsOfCategory(category: Category): Post[] {
        return this.posts.filter(x => x.categoryId == category.id);
    }
    private playPauseVideo(event, self) {

        var postId = $(event.currentTarget).attr("data-post-id");
        var post: Post = this.posts.find(x => x.id == Number(postId));

        if (self.currentTag && self.currentTag.dataset.postId == post.id) {
            // SAME ELEMENT
            if ($('.header').children('.fa-play-circle').length > 0) {
                this.playCurrentVideo();
            } else {
                this.pauseCurrentVideo();
            }
        } else {
            // PLAY ANOTHER ELEMENT
            $('.header .fa-play-circle').removeClass('fa-play-circle').addClass('fa-pause-circle');
            $('.table .fa-pause').removeClass('fa-pause').addClass('fa-play');
            $('.table .fa-play').closest('tr').removeClass('active');
            $(event.currentTarget).removeClass('fa-play').addClass('fa-pause');
            $(event.currentTarget).closest('tr').addClass('active');
            $('.header .fa-pause-circle').attr('data-post-id', postId);
            $('#current-reading-item').text(post.frenchTitle);
            self.currentTag = event.currentTarget;
            this.player.loadVideoById(post.youtubeVideoId, 0, "large");
            this.player.playVideo();
        }

    }
    private playCurrentVideo() {
        $('.header .fa-play-circle').removeClass('fa-play-circle').addClass('fa-pause-circle');
        $(this.currentTag).removeClass('fa-play').addClass('fa-pause');
        this.player.playVideo();
    }
    private pauseCurrentVideo() {
        $('.header .fa-pause-circle').removeClass('fa-pause-circle').addClass('fa-play-circle');
        $('.table .fa-pause').removeClass('fa-pause').addClass('fa-play');
        this.player.pauseVideo();
    }
    private initializePlayer() {

        var self = this;
        var firstYoutubeVideoId = this.posts[0].youtubeVideoId;

        if (typeof YT !== 'undefined') {
            createYoutubePlayer();
            // Youtube API script already loaded so stop here
            return;
        }

        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        (<any>window).onYouTubeIframeAPIReady = function () {
            createYoutubePlayer();
        }

        function createYoutubePlayer() {
            self.player = new YT.Player('player', {
                videoId: firstYoutubeVideoId,
                host: 'https://www.youtube.com',
                //enablejsapi: 1,
                //origin: 'https://localhost:9000',
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }
        function onPlayerReady(event) {
            // Initialize interface
            $('.header .fa-pause-circle').removeClass('fa-pause-circle').addClass('fa-play-circle');
            $('.table .fa-pause').removeClass('fa-pause').addClass('fa-play');
            // Preselect 1st video on main Play button
            $('.header .fa-play-circle').attr('data-post-id', self.posts[0].id);
            $('.table .fa-play:first').first().closest('tr').addClass('active');
            self.player.cueVideoById(self.posts[0].youtubeVideoId, 0, "large");
            self.currentTag = $('.table .fa-play:first')[0];
        }
        function onPlayerStateChange(event) {
            switch (event.data) {
                case YT.PlayerState.ENDED:
                    break;
                case YT.PlayerState.PLAYING:
                    self.playCurrentVideo();
                    break;
                case YT.PlayerState.PAUSED:
                    self.pauseCurrentVideo();
                    break;
                case YT.PlayerState.BUFFERING:
                    break;
                case YT.PlayerState.CUED:
                    break;

            }
        }
    }
}
