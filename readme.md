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
