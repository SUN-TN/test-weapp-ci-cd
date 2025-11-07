# taro 项目模板

- 打包工具： webpack5

- http 客户端： 基于 axios 封装

- 状态管理工具： mobx,mobx-react-lite

- UI 库： React

- UI 框架：NutUI

- 开发语言： TypeScript，JavaScript

## 项目目录结构

```bash
├── config # 项目配置文件目录
├── dist # 项目打包输出目录
├── src # 项目源代码目录
│ ├── api # 服务目录
│ ├── assets # 静态资源目录
│ ├── components # 组件目录
│ ├── constant # 常量目录
│ ├── pages # 页面目录
│ ├── stores # 状态管理目录
│ ├── utils # 工具函数目录
│ ├── app.tsx # 应用入口文件
│ ├── index.html # 应用 HTML 文件
├── .gitignore # Git 忽略文件
├── package.json # 项目依赖配置文件
├── README.md # 项目说明文档
├── tsconfig.json # TypeScript 配置文件
```

## 开发环境启动

```bash
npm run dev:weapp
```

## 生产环境打包

```bash
npm run build:weapp
```
