import packageJson from '../package.json'

// 示例, 如果你使用 `vs code` 作为开发工具， 你还可以使用注释的语法引入插件包含的声明文件，可获得类似于typescript的友好提示
/**
 * @typedef { import("@tarojs/plugin-mini-ci").CIOptions } CIOptions
 * @type {CIOptions}
 */
export const CIPluginOpt = {
  weapp: {
    appid: 'wx7c5b86f05701e73a',
    privateKeyPath: 'config/private.wx7c5b86f05701e73a.key',
  },
  // 版本号
  version: packageJson.version || '1.0.0',
  // 版本发布描述
  desc: '版本描述',
}
