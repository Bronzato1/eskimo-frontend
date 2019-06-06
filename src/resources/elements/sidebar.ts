export class Sidebar {
    private attached() {
        $(document).ready(() => {
            /* MAIN MENU */
            $('#eskimo-main-menu').find(".eskimo-menu-ul > li > a").on('click', function () {
                var nxtLink = $(this).next();
                if ((nxtLink.is('ul')) && (nxtLink.is(':visible'))) {
                    nxtLink.slideUp(300);
                    $(this).removeClass("eskimo-menu-up").addClass("eskimo-menu-down");
                }
                if ((nxtLink.is('ul')) && (!nxtLink.is(':visible'))) {
                    $('#eskimo-main-menu').find('.eskimo-menu-ul > li > ul:visible').slideUp(300);
                    nxtLink.slideDown(300);
                    $('#eskimo-main-menu').find('.eskimo-menu-ul > li:has(ul) > a').removeClass("eskimo-menu-up").addClass("eskimo-menu-down");
                    $(this).addClass("eskimo-menu-up");
                }
                if (nxtLink.is('ul')) {
                    return false;
                } else {
                    return true;
                }
            });
        });
    }
}
