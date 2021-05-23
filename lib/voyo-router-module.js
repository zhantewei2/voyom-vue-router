import { __extends } from "tslib";
import { Subject } from "rxjs";
var RouterModuleHooks = /** @class */ (function () {
    function RouterModuleHooks() {
        this.moduleStartSubject = new Subject();
        this.moduleErrorSubject = new Subject();
        this.moduleSuccessSubject = new Subject();
    }
    RouterModuleHooks.prototype.loadModuleStart = function () {
        this.moduleStartSubject.next(null);
    };
    RouterModuleHooks.prototype.loadModuleError = function (e) {
        this.moduleErrorSubject.next(e);
    };
    RouterModuleHooks.prototype.loadModuleSuccess = function (moduleRegister) {
        this.moduleSuccessSubject.next(moduleRegister);
    };
    RouterModuleHooks.prototype.onLoadModuleStart = function (run) {
        return this.moduleStartSubject.subscribe(run);
    };
    RouterModuleHooks.prototype.onLoadModuleError = function (run) {
        return this.moduleErrorSubject.subscribe(run);
    };
    RouterModuleHooks.prototype.onLoadModuleSuccess = function (run) {
        return this.moduleSuccessSubject.subscribe(run);
    };
    return RouterModuleHooks;
}());
export { RouterModuleHooks };
var VoyoRouterModule = /** @class */ (function (_super) {
    __extends(VoyoRouterModule, _super);
    function VoyoRouterModule(_a) {
        var routes = _a.routes, name = _a.name;
        var _this = _super.call(this) || this;
        _this.routes = routes;
        _this.name = name;
        return _this;
    }
    return VoyoRouterModule;
}(RouterModuleHooks));
export { VoyoRouterModule };
//# sourceMappingURL=voyo-router-module.js.map