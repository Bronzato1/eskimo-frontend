/// <reference path="global.d.ts" />
import { Router } from 'aurelia-router';
import { autoinject, observable, singleton } from 'aurelia-framework';
import { CategoryGateway } from './gateways/category-gateway';
import { TagGateway } from './gateways/tag-gateway';
import { Category } from './models/category-models';
import { Tag } from './models/tag-models';
import { I18N } from 'aurelia-i18n';

@autoinject()
@singleton()
export class SlidePanel {
    constructor(router: Router, categoryGateway: CategoryGateway, tagGateway: TagGateway, i18n: I18N) {
        this.router = router;
        this.categoryGateway = categoryGateway;
        this.tagGateway = tagGateway;
        this.i18n = i18n;
    }
    private router: Router;
    private categoryGateway: CategoryGateway;
    private tagGateway: TagGateway;
    private i18n: I18N;
    public currentViewMode;
    @observable
    public selectedMedia = '';
    @observable
    public selectedCategory = '';
    @observable
    public selectedTag = '';
    private categories: Array<Category>;
    private tags: Array<Tag>;
    private bind() {

        var promise1 = this.categoryGateway.getAllCategories().then((categories) => this.categories = categories);
        var promise2 = this.tagGateway.getAllTags().then((tags) => this.tags = tags);

        return Promise.all([promise1, promise2]).then(([categories, tags]) => {
            this.categories = categories;
            this.tags = tags.filter(x => x.language == this.currentLanguage);
        });
    }
    private contactMe() {
        jQuery.panelslider.close(), !1;
        this.router.navigateToRoute('about', { id: 'contact' });
    }
    private get currentLanguage() {
        return this.i18n.getLocale();
    }
    private selectedMediaChanged() {
        if (!this.router) return;
        var route = this.getRoute();
        var params = this.getRouteParameters();
        this.router.navigateToRoute(route, params);
    }
    private selectedCategoryChanged() {
        if (!this.router) return;
        var route = this.getRoute();
        var params = this.getRouteParameters();
        this.router.navigateToRoute(route, params);
    }
    private selectedTagChanged() {
        if (!this.router) return;
        var route = this.getRoute();
        var params = this.getRouteParameters();
        this.router.navigateToRoute(route, params);
    }
    public getRoute() {
        return (this.currentViewMode == 'list') ? 'postsListView' : 'postsGridView';
    }
    public getRouteParameters() {

        var jsondata = {};

        if (this.selectedMedia)
            jsondata['mediaId'] = this.selectedMedia;

        if (this.selectedCategory)
            jsondata['categoryId'] = this.selectedCategory;

        if (this.selectedTag)
            jsondata['tagId'] = this.selectedTag;

        return jsondata;
    }
}

// Ci-dessous
// Le code (js minimifié) qui va gérer l'affichage du panneau de droite ainsi que la zone de recherche

// @ts-ignore
!function (e) { "use strict"; function i(i, a) { var s = i.outerWidth(!0), o = {}; if (!i.is(":visible") && !n) { switch (n = !0, i.addClass("ps-active-panel").css({ position: "fixed", top: 0, height: "100%", "z-index": 9999999999 }), i.data(a), e("html").addClass("overflow-hidden"), e("body").addClass("overflow-hidden"), e("#eskimo-overlay").bind("touchmove", !1), e("#eskimo-overlay").fadeIn(200), a.side) { case "left": i.css({ left: "-" + s + "px", right: "auto" }), o.left = "+=" + s; break; case "right": i.css({ left: "auto", right: "-" + s + "px" }), o.right = "+=" + s }t.animate({}, a.duration), i.show().animate(o, a.duration, function () { n = !1, "function" == typeof a.onOpen && a.onOpen() }) } } var t = e("body"), n = !1; e.panelslider = function (t, n) { var a = e(".ps-active-panel"); n = e.extend({}, { side: "left", duration: 200, clickClose: !0, onOpen: null }, n), a.is(":visible") && a[0] != t[0] ? e.panelslider.close(function () { i(t, n) }) : a.length && !a.is(":hidden") || i(t, n) }, e.panelslider.close = function (i) { var a = e(".ps-active-panel"), s = a.data("duration"), o = a.outerWidth(!0), l = {}; if (a.length && !a.is(":hidden") && !n) { switch (n = !0, a.data("side")) { case "left": l.left = "-=" + o; break; case "right": l.right = "-=" + o }a.animate(l, s), t.animate({}, s, function () { a.fadeOut(200), a.removeClass("ps-active-panel"), e("html").removeClass("overflow-hidden"), e("body").removeClass("overflow-hidden"), e("#eskimo-overlay").fadeOut(200), n = !1, i && i() }) } }, e(document).bind("click keyup", function (i) { var t = e(".ps-active-panel"); "keyup" == i.type && 27 != i.keyCode || t.is(":visible") && t.data("clickClose") && e.panelslider.close() }), e(document).on("click", ".ps-active-panel", function (e) { e.stopPropagation() }), e.fn.panelslider = function (i) { return this.on("click", function (t) { var n = e(".ps-active-panel"), a = e(this.getAttribute("href")); n.is(":visible") && a[0] == n[0] ? e.panelslider.close() : e.panelslider(a, i), t.preventDefault(), t.stopPropagation() }), this } }(jQuery);
