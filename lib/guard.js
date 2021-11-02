export var guardShouldLoad = function (moduleRegister, to, from, next, nextFn) {
    if (moduleRegister.shouldLoad) {
        moduleRegister.shouldLoad(to, from, function (nextParams) {
            if (nextParams !== undefined && nextParams !== true)
                return next(nextParams);
            nextFn();
        });
    }
    else {
        nextFn();
    }
};
//# sourceMappingURL=guard.js.map