var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var scriptinjector = (function () {
        function scriptinjector() {
        }
        scriptinjector.prototype.attached = function () {
            if (this.url) {
                this.scripttag = document.createElement('script');
                if (this.isAsync) {
                    this.scripttag.async = true;
                }
                this.scripttag.setAttribute('src', this.url);
                document.body.appendChild(this.scripttag);
            }
        };
        scriptinjector.prototype.detached = function () {
            if (this.scripttag) {
                this.scripttag.remove();
            }
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], scriptinjector.prototype, "url", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], scriptinjector.prototype, "isAsync", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Object)
        ], scriptinjector.prototype, "scripttag", void 0);
        scriptinjector = __decorate([
            aurelia_framework_1.noView(),
            aurelia_framework_1.customElement('scriptinjector')
        ], scriptinjector);
        return scriptinjector;
    }());
    exports.scriptinjector = scriptinjector;
});
//# sourceMappingURL=scriptinjector.js.map