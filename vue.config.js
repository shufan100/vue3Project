
module.exports = {
  // 当前应用是被部署在一个域名的根路径上就用'/',如果是部署在子路径上 '/my-app'（根据后端来）
  publicPath: process.env.NODE_ENV === 'production' ? '/static' : '/',
  outputDir: 'dist', // build打包后的文件名(生产环境构建文件的目录)(编译前会自动先将之前的dist包删除)
  assetsDir: 'assets', // 放置生成的静态资源 (js、css、img、fonts)
  lintOnSave: false, // 是否开启eslint (否在开发环境下通过 eslint-loader 在每次保存时 lint 代码) （值为boolean | 'warning' | 'default' | 'error'）
  productionSourceMap: false, // (编译后生成的map.js，提示打印文件位置) 默认true
  devServer: {
    open: true, // 是否自动弹出浏览器页面
    // host: "localhost",
    host: '0.0.0.0',
    port: '8080',
    https: false, // 是否使用https协议
    hotOnly: false, // 是否开启热更新
    proxy: {
      '/api': {
        target: 'http://192.168.2.89:8012', // API服务器的地址
        ws: true, // 代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
        pathRewrite: { // 重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/api': ''
        }
      }
    }
  }

}
