voyo-micro vue-router
---
### About

Routing configuration loaded by micro-module.

Expend the `vue-router(^v3.0)`.

### Install
```
npm i @voyom/vue-router
```

### Usage

##### main.ts
```js
import { VoyoRouterMain} from "@voyom/vue-router";
import {createRouter} from "vue-router"; 

const voyoRouterMain=new VoyoRouterMain({
  routes:[
    {
      path:"/a",component:A
    },
    {
      path:"/module-a",
      module:()=>import("a.module")
    }
  ]
});

const vueRouter=createRouter({
  routes:[]
});

voyoRouterMain.mount(vueRouter);
```

##### a.module.ts
```js
import {VoyoRouterChild} from "@voyom/vue-router";


export default new VoyoRouterChild({
  routes: [
    {
      path: "c",component: C
    },
    { 
      path: "d",
      module: ()=>import("a-child.module") //Load A deeper module.
    },
  ],
})

```


Cache Router
---
```javascript
import { VoyoRouterView, routerChangeService } from "@voyom/vue-router";

routerChangeService.routerMode = "hash"; // "hash" | "history" ;
Vue.component("voyo-router-view",VoyoRouterView);
```

As the page forward , the old page is automatically pushed into the cache.

When returned, the current page is destroyed, the cached page is automatically restored.

Page component will have new life hooks，when you use `voyo-router-view`:
- **onShow()** When page is visible.
- **onHide()** page hidden

#### restore scroll position

1. Restore body scrollPosition `(pc)`
2. Each page has its own `scroll-view` `(mobile)`.  `scroll-view` restore scrollPosition when `connectedCallback()` or `activated()` callback;


