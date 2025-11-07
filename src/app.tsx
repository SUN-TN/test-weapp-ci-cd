import React, { useEffect } from "react";
import { useDidShow, useDidHide } from "@tarojs/taro";
import AppContext, { context } from "@/context";
import process from "process/browser";
global.process = process;
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
    <AppContext.Provider value={context}>{props.children}</AppContext.Provider>
  );
}

export default App;
