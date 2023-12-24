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
    js: ["https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"],
  },
  css: {
    // css文件名是否可省略module,默认为false.
    // requireModuleExtension: false,
    // 是否使用css分离插件 默认生产环境下是true, 开发环境下是false.
    extract: production,
    // 是否为CSS开启source map.设置为true之后可能会影响构建的性能.
    sourceMap: true,
    // 向CSS相关的loader传递选项(支持:css-loader postcss-loader sass-loader less-loader stylus-loader).
    /* loaderOptions: {
      sass: {
        // 引入全局scss全局样式
        prependData: `@import '~@/assets/sass/element.scss';`
      }
    } */
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
  // 用于配置代码分割（code splitting）。它可以帮助你将打包后的代码拆分成多个块，以优化加载性能。
  optimization: {
    splitChunks: {
      // 'all'：所有块都会被拆分。
      // 'async'：只有异步加载的块会被拆分。
      // 'initial'：只有初始块会被拆分。
      chunks: "all",
      minSize: 30000, // 只有大于 * 的模块才会被拆分。
      maxSize: 50000, // 拆分后的块大小不超过 *。
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      // 定义了不同的缓存组，用于将模块分配到不同的块中
      cacheGroups: {
        // 用于将来自 node_modules 目录下的模块打包到一个单独的块中
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        // 用于将至少被两个模块引用的模块打包到一个单独的块中。
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    usedExports: true,
    minimize: true,
  },
};

module.exports = vueDefaultConfig;
