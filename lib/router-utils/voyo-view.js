import { getPureUrl } from "@ztwx/utils/lib/url";
import { routerChangeService } from "./router-change";
var VoyoViewManager = /** @class */ (function () {
    function VoyoViewManager(routerChangeService) {
        var _this = this;
        this.cacheComponents = [];
        routerChangeService.immediateWatch.subscribe(function (a) {
            _this.pathActive = getPureUrl(routerChangeService.currentPath);
            _this.backPageCount = a.pageCount || 0;
            _this.routeBehavior = a.type || "init";
        });
    }
    VoyoViewManager.prototype.exists = function (key) {
        return this.cacheComponents.find(function (i) { return i.key === key; });
    };
    VoyoViewManager.prototype.pageLeave = function (key) {
        var type = this.routeBehavior;
        var pageCount = this.backPageCount;
        if (this.routeBehavior === "back") {
            if (pageCount && pageCount > 1) {
                var maxCacheIndex = this.cacheComponents.length - 1;
                var startIndex = maxCacheIndex - pageCount + 1;
                startIndex = startIndex < 0 ? 0 : startIndex;
                this.cacheComponents.splice(startIndex, pageCount);
            }
            else {
                this.cacheComponents.pop();
            }
        }
        else if (this.routeBehavior === "replace") {
            this.cacheComponents.pop();
        }
    };
    VoyoViewManager.prototype.saveComponent = function (key, vNode) {
        // if (voyoViewManager.routeBehavior !== "advance") return;
        var cacheComponent = this.exists(key);
        if (cacheComponent && vNode.componentInstance) {
            cacheComponent.componentInstance = vNode.componentInstance;
        }
        else {
            this.cacheComponents.push({
                componentInstance: vNode.componentInstance,
                key: key,
            });
        }
    };
    VoyoViewManager.prototype.restoreComponent = function (key, vNode) {
        var cacheEntity = this.exists(key);
        if (cacheEntity && cacheEntity.componentInstance) {
            return (vNode.componentInstance = cacheEntity.componentInstance);
        }
        else {
            return vNode;
        }
    };
    return VoyoViewManager;
}());
var voyoViewManager = new VoyoViewManager(routerChangeService);
export var voyoView = {
    functional: true,
    name: "voyo-router-view",
    render: function (h, _a) {
        var parent = _a.parent;
        var route = parent.$route;
        if (!route.matched || !route.matched.length)
            return null;
        var matchedInfo = route.matched[0];
        var matchedVNode = matchedInfo.components.default;
        var routeKey = voyoViewManager.pathActive;
        var data = {
            hook: {
                insert: function (v) { },
                init: function (v) {
                    v.componentInstance &&
                        v.componentInstance.onShow &&
                        v.componentInstance.onShow();
                    if (v.data.keepAlive)
                        voyoViewManager.saveComponent(routeKey, v);
                },
                destroy: function (v) {
                    v.componentInstance &&
                        v.componentInstance.onHide &&
                        v.componentInstance.onHide();
                    voyoViewManager.pageLeave(routeKey);
                },
            },
            routeKey: routeKey,
            keepAlive: true,
        };
        return h(matchedVNode, data);
    },
};
export var VoyoRouterView = {
    render: function (h) {
        var viewVNode = h(voyoView);
        var routeKey = viewVNode.data && viewVNode.data.routeKey;
        if (routeKey)
            voyoViewManager.restoreComponent(routeKey, viewVNode);
        return viewVNode;
    },
};
//# sourceMappingURL=voyo-view.js.map