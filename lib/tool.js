export var setting = {
    ChildComponent: {
        render: function (h) {
            return h("router-view");
        }
    }
};
export var resolveUrl = function (url, url2) {
    return url
        ? (url.endsWith("/") ? url.slice(0, url.length - 1) : url) +
            (url2.startsWith("/") ? url2 : "/" + url2)
        : url2 || "";
};
//# sourceMappingURL=tool.js.map