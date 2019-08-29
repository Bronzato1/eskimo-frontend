/// <reference path="global.d.ts" />

import { bindable, autoinject, singleton } from "aurelia-framework";
import { Router } from "aurelia-router";
import { runInThisContext } from "vm";
import { SlidePanel } from './slide-panel';

@autoinject()
@singleton()
export class TopHeader {
    constructor(router: Router, slidePanel: SlidePanel) {
        this.router = router;
        this.slidePanel = slidePanel;
    }
    @bindable filter;
    private router: Router;
    private slidePanel: SlidePanel;
    private get viewMode() {
        return this.slidePanel.currentViewMode;
    }
    private get showFilter() {
        return this.slidePanel.currentViewMode == 'list';
    }
    private attached() {
        jQuery(document).ready(function () {
            (<any>$('i,a')).tooltip();
            $('[data-toggle="tooltip"]').on('click', function () {
                (<any>$(this)).tooltip('hide');
            })
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
    private switchListView() {
        var params = this.slidePanel.getRouteParameters();
        this.router.navigateToRoute('postsListView', params);
    }
    private switchGridView() {
        var params = this.slidePanel.getRouteParameters();
        this.router.navigateToRoute('postsGridView', params);
    }
    private switchMasoView() {
        var params = this.slidePanel.getRouteParameters();
        this.router.navigateToRoute('postsMasoView', params);
    }
}
