# ==================== 第一阶段：构建前端项目 ====================
# 使用 Node 官方镜像（选择和你项目匹配的 Node 版本，如 18/20，推荐 18）
FROM node:22-bullseye-slim AS build-stage

# 设置工作目录（容器内的目录，相当于 cd 到这个目录）
WORKDIR /app

# 复制 package.json 和 package-lock.json（先复制依赖文件，利用 Docker 缓存）
COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm
# 安装前端依赖（npm 或 yarn 按需选择，这里用 pnpm）
RUN pnpm install --registry=https://registry.npmmirror.com/  # 国内源加速安装
# RUN pnpm install   

# 复制所有前端源码到容器工作目录
COPY . .

# 打包前端项目（根据你的项目打包命令修改，如 Vue 是 npm run build，React 也是）
RUN npm run build:weapp:preview
