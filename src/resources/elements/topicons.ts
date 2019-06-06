/// <reference path="../../global.d.ts" />

export class Topicons {
    private attached() {
        jQuery(document).ready(function () {
            jQuery("body")
                .find(".eskimo-panel-open")
                .panelslider({ side: "right", clickClose: !0, duration: 400 });

            jQuery("body")
                .find(".eskimo-panel-close")
                .on("click", function () {
                    return jQuery.panelslider.close(), !1;
                });
        });

    }
}
