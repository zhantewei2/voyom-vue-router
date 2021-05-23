import { RouterView } from "vue-router";
import { h } from "vue";
export var ChildComponent = function () {
    return Promise.resolve(h(RouterView));
};
export var patchFirst = function (main, patch) {
    var old = main;
};
export var resolveUrl = function (url, url2) {
    return url
        ? (url.endsWith("/") ? url.slice(0, url.length - 1) : url) +
            (url2.startsWith("/") ? url2 : "/" + url2)
        : url2 || "";
};
//# sourceMappingURL=tool.js.map