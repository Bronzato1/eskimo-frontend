/// <reference path="global.d.ts" />

import { bindable, autoinject, singleton } from "aurelia-framework";
import { Router } from "aurelia-router";
import { runInThisContext } from "vm";
import { SlidePanel } from './slide-panel';

@autoinject()
@singleton()
export class TopHeader {

    @bindable filter;
    private router: Router;
    private slidePanel: SlidePanel;

    constructor(router: Router, slidePanel: SlidePanel) {
        this.router = router;
        this.slidePanel = slidePanel;
    }

    private get viewMode() {
        return this.slidePanel.currentViewMode;
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
        this.slidePanel.currentViewMode = 'list';
        this.slidePanel.reloadView();
    }
    private switchGridView() {
        this.slidePanel.currentViewMode = 'gid';
        this.slidePanel.reloadView();
    }
    private switchMasoView() {
        this.slidePanel.currentViewMode = 'maso';
        this.slidePanel.reloadView();
    }
    private filterChanged() {
        this.slidePanel.currentFilter = this.filter;
        this.slidePanel.reloadView();
    }
}
