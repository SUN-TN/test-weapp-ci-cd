export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/category/category',
    'pages/shoppingCart/shoppingCart',
    'pages/mine/mine',
  ],
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/category/category',
        text: '分类'
      },
      {
        pagePath: 'pages/shoppingCart/shoppingCart',
        text: '购物车'
      },
      {
        pagePath: 'pages/mine/mine',
        text: '我的'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
