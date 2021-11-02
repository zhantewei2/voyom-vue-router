import { __assign } from "tslib";
import { Subject, of, merge } from "rxjs";
import { map } from "rxjs/operators";
import { getPureUrl, queryparams } from "@ztwx/utils/lib/url";
var RouterChangeService = /** @class */ (function () {
    function RouterChangeService() {
        var _this = this;
        this.change = new Subject();
        this.historyHeap = [];
        this.historyHeapLength = 0;
        this.baseUrl = "/";
        this.routerMode = "history";
        this.immediateWatch = merge(of(1).pipe(map(function () { return _this.currentPath; })), this.change);
        this.initData();
        this.initHistoryHeap();
        window.addEventListener("popstate", function (e) {
            if (_this.preventPopState)
                return (_this.preventPopState = false);
            _this.changeNext({
                targetPath: _this.prePath || _this.getPath(),
                type: "back",
                pageCount: 1,
            });
        });
        var pushState = history.pushState;
        var replaceState = history.replaceState;
        var go = history.go;
        history.go = function (page) {
            if (!page || page > 0)
                return;
            _this.preventPopState = true;
            _this.changeNext({
                targetPath: _this.prePath || _this.getPath(),
                type: "back",
                pageCount: Math.abs(page),
            });
            go.call(history, page);
        };
        history.pushState = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.changeNext({
                targetPath: _this.getPath(args[2] || "/"),
                type: "advance",
                pageCount: 1,
            });
            //@ts-ignore
            pushState.apply(history, args);
        };
        history.replaceState = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.changeNext({
                targetPath: _this.getPath(args[2] || "/"),
                type: "replace",
                pageCount: 1,
            });
            replaceState.apply(history, args);
        };
    }
    RouterChangeService.prototype.reLaunch = function (_a) {
        var _this = this;
        var path = _a.path;
        if (this.historyHeap.length && this.historyHeap.length > 1) {
            this.go(0 - this.historyHeap.length + 1);
        }
        setTimeout(function () {
            _this.replace(path);
        }, 10);
    };
    /**
     * reset heap. when set routerMode;
     * @param mode
     */
    RouterChangeService.prototype.setRouterMode = function (mode) {
        this.routerMode = mode;
        this.resetHistoryHeap();
    };
    RouterChangeService.prototype.getBaseUrlFromDom = function () {
        var baseDom = document.querySelector("base[href]");
        if (!baseDom)
            return "/";
        return baseDom.getAttribute("href");
    };
    RouterChangeService.prototype.setBaseUrl = function (url) {
        this.baseUrl = url;
    };
    RouterChangeService.prototype.getHistoryPath = function (url) {
        var matcher = url.match(/https?:\/\/.*?(\/.*$)/);
        if (!matcher)
            matcher = url.match(/^(\/.*)/);
        if (!matcher)
            return "/";
        var matcherPath = matcher[1];
        return this.cleanBaseUrl(matcherPath);
    };
    RouterChangeService.prototype.getHashPath = function (url) {
        var splitUrl = url.split("#");
        if (splitUrl.length < 2)
            return "";
        return splitUrl.slice(1).join("#");
    };
    RouterChangeService.prototype.getPath = function (url) {
        url = url || location.href;
        if (this.routerMode === "history") {
            return this.getHistoryPath(url);
        }
        else if (this.routerMode === "hash") {
            return this.getHashPath(url);
        }
    };
    RouterChangeService.prototype.cleanBaseUrl = function (path) {
        if (!this.baseUrl)
            return path;
        path = path || this.getPath(path);
        var baseUrlIndex = path.indexOf(this.baseUrl);
        return baseUrlIndex >= 0 ? path.slice(this.baseUrl.length - 1) : path;
    };
    RouterChangeService.prototype.hasHistory = function () {
        return this.historyHeapLength > 1;
    };
    RouterChangeService.prototype.getLastedPath = function () {
        return this.historyHeapLength
            ? this.historyHeap[this.historyHeapLength - 1]
            : undefined;
    };
    Object.defineProperty(RouterChangeService.prototype, "prePath", {
        get: function () {
            return this.historyHeapLength > 1
                ? this.historyHeap[this.historyHeapLength - 2]
                : undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RouterChangeService.prototype, "currentPath", {
        get: function () {
            return this.getLastedPath() || this.getPath();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RouterChangeService.prototype, "currentPurePath", {
        get: function () {
            return getPureUrl(this.currentPath);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RouterChangeService.prototype, "currentParams", {
        get: function () {
            return queryparams.dencode(this.currentPath);
        },
        enumerable: false,
        configurable: true
    });
    RouterChangeService.prototype.initHistoryHeap = function () {
        this.historyHeap.push(this.getPath());
        this.historyHeapLength++;
    };
    RouterChangeService.prototype.initData = function () {
        this.hostPath = location.protocol + "//" + location.hostname;
        this.setBaseUrl(this.getBaseUrlFromDom());
    };
    RouterChangeService.prototype.joinPath = function (path, _a) {
        var root = _a.root, params = _a.params;
        if (params) {
            var queryParams = queryparams.encode(params);
            if (queryParams)
                path += "?" + queryParams;
        }
        if (root)
            return path;
        return this.routerMode === "hash"
            ? location.origin + location.pathname + "#" + path
            : this.baseUrl + (path.startsWith("/") ? path.slice(1) : path);
    };
    RouterChangeService.prototype.ensureFirstExists = function () {
        if (!this.historyHeapLength) {
            this.historyHeap.push(this.getPath());
            this.historyHeapLength++;
        }
    };
    RouterChangeService.prototype.resetHistoryHeap = function () {
        this.historyHeapLength = 0;
        this.historyHeap = [];
        this.initHistoryHeap();
    };
    RouterChangeService.prototype.changeNext = function (changeRoute) {
        var type = changeRoute.type, targetPath = changeRoute.targetPath;
        if (type === "advance") {
            this.historyHeap.push(targetPath);
            this.historyHeapLength++;
        }
        else if (type === "replace") {
            if (this.historyHeapLength)
                this.historyHeap[this.historyHeapLength - 1] = targetPath;
        }
        else if (type === "back") {
            if (this.historyHeapLength > 1) {
                var maxHeapIndex = this.historyHeapLength - 1;
                var backCount = changeRoute.pageCount > maxHeapIndex
                    ? maxHeapIndex
                    : changeRoute.pageCount;
                this.historyHeap.pop();
                this.historyHeap.splice(maxHeapIndex - backCount + 1, backCount);
                this.historyHeapLength -= backCount;
                this.ensureFirstExists();
            }
            else {
                this.resetHistoryHeap();
                console.debug("No history heap to back");
            }
        }
        this.change.next(changeRoute);
    };
    RouterChangeService.prototype.back = function () {
        history.back();
    };
    RouterChangeService.prototype.go = function (count) {
        history.go(count);
    };
    RouterChangeService.prototype.push = function (path, opts) {
        if (opts === void 0) { opts = {}; }
        history.pushState(null, opts.title || "", this.joinPath(path, opts));
    };
    RouterChangeService.prototype.replace = function (path, opts) {
        if (opts === void 0) { opts = {}; }
        history.replaceState(null, opts.title || "", this.joinPath(path, opts));
    };
    RouterChangeService.prototype.popup = function (popState) {
        var currentPath = this.currentPath;
        var purePath = getPureUrl(currentPath);
        var params = queryparams.dencode(currentPath);
        this.push(purePath, { params: __assign(__assign({}, params), popState) });
    };
    RouterChangeService.prototype.tab = function (tabState) {
        var currentPath = this.currentPath, purePath = getPureUrl(currentPath), params = queryparams.dencode(currentPath);
        this.replace(purePath, { params: __assign(__assign({}, params), tabState) });
    };
    return RouterChangeService;
}());
export { RouterChangeService };
export var routerChangeService = new RouterChangeService();
//# sourceMappingURL=router-change.js.map