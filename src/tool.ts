import { RouterView } from "vue-router";
import { h } from "vue";

export const ChildComponent = () =>
  Promise.resolve(h(RouterView));

export const patchFirst = (main: any, patch: any) => {
  const old = main;
};

export const resolveUrl = (url: string | undefined, url2: string) => {
  return url
    ? (url.endsWith("/") ? url.slice(0, url.length - 1) : url) +
        (url2.startsWith("/") ? url2 : "/" + url2)
    : url2 || "";
};
