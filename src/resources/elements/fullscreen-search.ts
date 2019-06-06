export class FullscreenSearch {
    private attached() {
        /* FULLSCREEN SEARCH */
        $("#eskimo-open-search").on('click', function (e) {
            e.preventDefault();
            $("#eskimo-fullscreen-search").fadeIn(200);
        });

        $("#eskimo-close-search").on('click', function (e) {
            e.preventDefault();
            $("#eskimo-fullscreen-search").fadeOut(200);
        });
    }
}
