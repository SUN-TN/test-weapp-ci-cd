import { useContext } from "react";

import { observer as o } from "mobx-react-lite";

import defaultContext from "@/context";

/* eslint-disable */
export const useStore = () => useContext(defaultContext); // 提供 useStore 方法

export const observer = o; // 向外暴露 observer 方法, 方便使用它的组件不需要再次 import mobx