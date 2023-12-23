const { defineConfig } = require("@vue/cli-service");
const { ProgressPlugin } = require("webpack"); // 进度条
const pkg = require("./package.json");
const dayjs = require("dayjs");
const {
  cdn,
  css,
  title,
  externals,
  devServer,
  production,
  optimization,
  performance,
} = require("./src/config/vue.custom.config");

const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack"); // 组件按需引入
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer"); // 打包文件分析工具

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
};

const path = require("path");
const resolve = (dir) => {
  return path.join(__dirname, dir);
};

module.exports = defineConfig({
  // 是否开启 eslint 校验
  lintOnSave: false,
  // 开发以及生产环境的路径配置
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  // 打包时输出的文件目录
  outputDir: "dist",
  //是否为生产环境构建生成 source map?
  productionSourceMap: false,
  // 加快编译速度 在多核机器下会默认开启
  parallel: require("os").cpus().length > 1,
  // 配置 webpack-dev-server
  devServer,
  // css相关配置.
  css,
  // 对内部的webpack配置(比如修改、增加Loader选项)(链式操作).
  chainWebpack(config) {
    // svg-sprite-loader 配置
    config.module.rules.delete("svg");
    config.module
      .rule("svg-sprite-loader")
      .test(/\.svg$/)
      .include.add(path.join(__dirname, "./src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({ symbolId: "icon-[name]" });
    // 根路径
    config.resolve.alias.set("@", resolve("src"));

    // 删除预加载
    // config.plugins.delete('preload');
    // config.plugins.delete('prefetch');
    config.plugin("html").tap((args) => {
      args[0].title = title; // 修改标题
      args[0].cdn = cdn; // CDN外链
      args[0].__APP_INFO__ = JSON.stringify(__APP_INFO__);
      return args;
    });
  },
  // webpack配置
  configureWebpack: {
    // externals,
    plugins: [
      // 自动按需引入 vue\vue-router\vuex 等的 api
      AutoImport({
        imports: ["vue"],
        resolvers: [ElementPlusResolver()],
      }),
      // 按需引入Element-plus
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      // new BundleAnalyzerPlugin(),
    ],
    // 配置代码分割
    // optimization,
    // 性能提示
    // performance,
  },
});
