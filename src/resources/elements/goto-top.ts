export class GotoTop {
    private attached() {
        $(document).ready(() => {
            /* GO TO TOP BUTTON */
            $(window).on('scroll', function () {
                if ($(this).scrollTop() > 300) {
                    $("#eskimo-gototop").css('bottom', 0);
                } else {
                    $("#eskimo-gototop").css('bottom', '-50px');
                }
            });

            $("#eskimo-gototop").on('click', function (e) {
                e.preventDefault();
                $("html, body").animate({
                    scrollTop: 0
                }, 500);
                return false;
            });
        });
    }
}
