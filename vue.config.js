'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port
const isProd = process.env.NODE_ENV === 'production' // 判断是否是生产环境
let cdn = { css: [], js: [] }
let externals = {}
if (isProd) {
  // 只有生产环境才需要进行性能处理
  cdn = {
    css: [
      // element-ui css
      'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.13/theme-chalk/index.min.css' // 样式表
    ],
    js: [
      // vue must at first!
      'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/2.6.14/vue.min.js', // vuejs
      // element-ui js
      'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.13/index.min.js', // elementUI
      'https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/jszip.min.js',
      'https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/xlsx.full.min.js'
    ]
  }
  externals = {
    'vue': 'Vue',
    'element-ui': 'ELEMENT',
    'xlsx': 'XLSX'
  } // 要排除打包的对象
}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
     * You will need to set publicPath if you plan to deploy your site under a sub path,
     * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then publicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     * Detail: https://cli.vuejs.org/config/#publicpath
     */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    // 配置代理属性的信息 什么条件下 代理到哪个服务器
    // 石涵博 => (接头暗号)代理 => 美国 => 改头换名 博石涵 => 美国不认识  石涵博
    proxy: {
      // 代理属性
      // key是请求的前缀
      // /api/a/b/c => http://www.baidu.com/api/a/b/c  => http://www.baidu.com/a/b/c
      // /api/sys/login => http://ihrm.itheima.net/api/sys/login
      '/api': {
        // target: 'http://localhost:3000', // 要代理的服务器
        target: 'https://ihrm.itheima.net',
        changeOrigin: true // 表示确信要跨域
        // pathRewrite: {
        //   // 路径重写  有需要的时候才需要写
        //   '^/api': '' // 假设我们想把 localhost:8888/api/login 变成www.baidu.com/login 就需要这么做
        // }
      }
    },
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
    // before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    externals: externals,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  // webpack打包执行时触发的链条函数
  chainWebpack(config) {
    config.plugin('html').tap(args => {
      args[0].cdn = cdn // 将cdn文件列表给了页面中的一个变量
      return args
    })
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [{
      rel: 'preload',
      // to ignore runtime.js
      // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
      fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
      include: 'initial'
    }])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
