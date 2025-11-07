import type { UserConfigExport } from "@tarojs/cli";
export default {
  logger: {
    quiet: false,
    stats: true,
  },
  mini: {},
  h5: {
    devServer: {
      port: 10086, // 端口号
      open: false, // 服务启动时是否自动打开浏览器
      proxy: {
        // 代理所有以 /api 开头的请求
        "/api": {
          target: "http://192.168.31.112:3000", // 后端地址
          changeOrigin: true, // 修改 Origin 为后端地址
          secure: false, // 如果是https需要设置为false
          pathRewrite(path) {
            console.log("rewrite path", path);
            return path;
          },
          logLevel: "debug", // 开启代理调试日志
        },
      },
    },
  },
} satisfies UserConfigExport<"webpack5">;
