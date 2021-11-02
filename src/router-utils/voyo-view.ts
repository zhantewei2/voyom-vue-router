import { getPureUrl } from "@ztwx/utils/lib/url";
import { CreateElement, RenderContext, VNode } from "vue";
import {routerChangeService,RouterChangeService} from "./router-change"


export interface CacheComponent {
  componentInstance: any;
  key: string;
  // vNode: VNode;
}

class VoyoViewManager {
  pathActive: string;
  routeBehavior: "init" | "back" | "advance" | "replace";
  backPageCount: number;
  cacheComponents: CacheComponent[] = [];
  constructor(routerChangeService: RouterChangeService) {
    
    routerChangeService.immediateWatch.subscribe(a => {
      this.pathActive = getPureUrl(routerChangeService.currentPath);
      this.backPageCount = a.pageCount || 0;
      this.routeBehavior = a.type || "init";
    });
  }
  exists(key: string): CacheComponent | undefined {
    return this.cacheComponents.find(i => i.key === key);
  }
  pageLeave(key: string) {
    const type = this.routeBehavior;
    const pageCount = this.backPageCount;
    if (this.routeBehavior === "back") {
      if (pageCount && pageCount > 1) {
        const maxCacheIndex = this.cacheComponents.length - 1;
        let startIndex = maxCacheIndex - pageCount + 1;
        startIndex = startIndex < 0 ? 0 : startIndex;
        this.cacheComponents.splice(startIndex, pageCount);
      } else {
        this.cacheComponents.pop();
      }
    } else if (this.routeBehavior === "replace") {
      this.cacheComponents.pop();
    }
  }
  saveComponent(key: string, vNode: VNode) {
    // if (voyoViewManager.routeBehavior !== "advance") return;
    const cacheComponent: CacheComponent | undefined = this.exists(key);
    if (cacheComponent && vNode.componentInstance) {
      cacheComponent.componentInstance = vNode.componentInstance;
    } else {
      this.cacheComponents.push({
        componentInstance: vNode.componentInstance,
        key,
      });
    }
  }
  restoreComponent(key: string, vNode: any) {
    const cacheEntity: CacheComponent | undefined = this.exists(key);
    if (cacheEntity && cacheEntity.componentInstance) {
      return (vNode.componentInstance = cacheEntity.componentInstance);
    } else {
      return vNode;
    }
  }
}

const voyoViewManager = new VoyoViewManager(routerChangeService);

export const voyoView: any = {
  functional: true,
  name: "voyo-router-view",
  render(this: any, h: CreateElement, { parent }: RenderContext) {
    const route = parent.$route;
    if (!route.matched || !route.matched.length) return null;
    const matchedInfo = route.matched[0];
    const matchedVNode = matchedInfo.components.default;
    const routeKey = voyoViewManager.pathActive;
    const data = {
      hook: {
        insert(v: any) {},
        init(v: any) {
          v.componentInstance &&
            v.componentInstance.onShow &&
            v.componentInstance.onShow();

          if (v.data.keepAlive) voyoViewManager.saveComponent(routeKey, v);
        },
        destroy(v: any) {
          v.componentInstance &&
            v.componentInstance.onHide &&
            v.componentInstance.onHide();
          voyoViewManager.pageLeave(routeKey);
        },
      },
      routeKey,
      keepAlive: true,
    };
    return h(matchedVNode, data);
  },
};

export const VoyoRouterView = {
  render(h: CreateElement) {
    const viewVNode: any = h(voyoView);
    const routeKey = viewVNode.data && viewVNode.data.routeKey;
    if (routeKey) voyoViewManager.restoreComponent(routeKey, viewVNode);
    return viewVNode;
  },
};

