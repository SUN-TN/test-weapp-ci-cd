import React, { useEffect } from "react";
import { useDidShow, useDidHide } from "@tarojs/taro";
import StoresContext, { context } from "@/stores/context";
import '@/utils/withResolversPolyfill';
import {a} from '@/utils/test'

console.log('====================================');
console.log(a,a);
console.log('====================================');

// 全局样式
import "./app.scss";

function App(props: { children: React.ReactNode }) {
  // 可以使用所有的 React Hooks
  useEffect(() => {});

  // 对应 onShow
  useDidShow(() => {});

  // 对应 onHide
  useDidHide(() => {});

  return (
    <StoresContext.Provider value={context}>{props.children}</StoresContext.Provider>
  );
}

export default App;
