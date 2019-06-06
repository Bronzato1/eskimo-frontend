define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            config.map([
                { route: '', redirect: 'index' },
                { route: 'index', name: 'index', moduleId: 'index' },
                { route: 'test', name: 'test', moduleId: 'test' }
            ]);
            this.router = router;
        };
        return App;
    }());
    exports.App = App;
});
//# sourceMappingURL=app.js.map