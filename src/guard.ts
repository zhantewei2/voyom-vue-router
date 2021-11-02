import {ModuleRegister} from "./types";

export const guardShouldLoad=(moduleRegister:ModuleRegister,to:any,from:any,next:any,nextFn:()=>void)=>{
  if(moduleRegister.shouldLoad){
    moduleRegister.shouldLoad(to,from,(nextParams:string|boolean)=>{
      if(nextParams!==undefined&&nextParams!==true)return next(nextParams);
      nextFn();
    })
  }else{
    nextFn();
  }
}