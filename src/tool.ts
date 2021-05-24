import { CreateElement } from "vue";
export const ChildComponent = {
  render(h: CreateElement) {
    return h("router-view");
  },
};

export const resolveUrl = (url: string | undefined, url2: string) => {
  return url
    ? (url.endsWith("/") ? url.slice(0, url.length - 1) : url) +
        (url2.startsWith("/") ? url2 : "/" + url2)
    : url2 || "";
};
