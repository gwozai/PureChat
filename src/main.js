import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import AppLoading from "./views/components/AppLoading/index.vue";

import { getServerConfig } from "./config";

import "@/styles/index.scss";
import "./registerServiceWorker";

import { setupDirectives } from './directives/index';
import { setupPlugins } from "./plugins/index";
import { loadAllassembly } from "./components/index";
import { registerSvgIcon } from "./assets/icons/index";

async function setupApp() {
  // app loading
  const appLoading = createApp(AppLoading);
  appLoading.mount("#appLoading");
  const app = createApp(App);
  // vue custom directives
  setupDirectives(app);
  loadAllassembly(app);
  registerSvgIcon(app);
  setupPlugins(app);
  // 获取全局配置
  await getServerConfig(app);
  app.use(router);
  app.use(store);
  appLoading.unmount();
  app.mount("#app");
}
setupApp();
