/*
 * @Description: webpack 打包配置
 */
const production = process.env.NODE_ENV === "production";
const proxy = {
  "/proxy": {
    // 目标代理服务器地址.
    target: "http://localhost:8888",
    // 是否允许跨域.
    changeOrigin: true,
    secure: true,
    pathRewrite: {
      "^/proxy": "/",
    },
  },
};
const vueDefaultConfig = {
  production, // 环境配置
  title: "Pure Admin", // 标题
  // pwa 渐进式网页应用
  pwa: {
    name: "PureAdmin",
    iconPaths: {
      favicon32: "img/icons/favicon-32x32.png",
    },
    themeColor: "#ffffff00",
    manifestOptions: {
      background_color: "#335eea",
    },
  },
  devServer: {
    client: {
      progress: true,
      overlay: false,
    },
    // 是否自动打开浏览器.
    // open: false,
    // 局域网和本地访问.
    // host: "0.0.0.0",
    // 端口.
    port: process.env.VUE_APP_PORT || 8080,
    // 代理.
    proxy: process.env.VUE_APP_PROXY === "false" ? null : proxy,
  },
  cdn: {
    css: [],
    js: [
      "https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      // "https://cdn.jsdelivr.net/npm/pinyin-pro@3.18.5/dist/index.js"
    ],
  },
  css: {
    // css文件名是否可省略module,默认为false.
    // requireModuleExtension: false,
    // 是否使用css分离插件 默认生产环境下是true, 开发环境下是false.
    extract: production,
    // 是否为CSS开启source map.设置为true之后可能会影响构建的性能.
    sourceMap: false,
    // 向CSS相关的loader传递选项(支持:css-loader postcss-loader sass-loader less-loader stylus-loader).
    loaderOptions: {
      sass: {
        // 引入全局scss全局样式
        prependData: `@import '@/styles/mixin.scss';`,
      },
    },
  },
  // 打包忽略项
  externals: {},
  // 用于配置如何展示性能提示，以及如何限制资源体积，从而优化网站性能。
  performance: {
    // 提示类型 error
    hints: "warning",
    // 限制入口文件（即webpack.config.js中配置的entry属性）的体积不超过100KB。
    maxEntrypointSize: 102400 * 1,
    // 限制单个资源（如js文件、css文件等）的体积不超过100KB。
    maxAssetSize: 102400 * 1,
  },
  // 用于配置代码分割
  optimization: {
    realContentHash: true,
  },
};

module.exports = vueDefaultConfig;
