import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import { ACCESS_TOKEN } from "@/constants/index";
import { setPageTitle } from "@/utils/common";
import NProgress from "@/utils/progress";
import { scrollBehavior } from "./utils";
import storage from "@/utils/localforage/index";
import remainingRouter from "./modules/remaining";

const routes = [];
const files = require.context("./modules/", false, /\.js$/);
files.keys().forEach((key) => {
  if (key === "./remaining.js") return;
  routes.push(...files(key).default);
});
routes.unshift(...remainingRouter);

let isF = false;
const historyMode = {
  history: createWebHistory(),
  hash: createWebHashHistory(),
};

const router = createRouter({
  history: historyMode[process.env.VUE_APP_ROUTER_HISTORY],
  routes,
  scrollBehavior,
});

router.beforeEach((to, from, next) => {
  if (from.path === to.path) return;
  setPageTitle(to.meta.title);
  const token = storage.get(ACCESS_TOKEN);
  if (token) {
    NProgress.start();
    if (isF) {
      next();
    } else {
      isF = true;
      next({ ...to, replace: true });
    }
  } else {
    if (to.path !== "/login") {
      next({ path: "/login" });
    } else {
      next();
    }
  }
});

router.afterEach((to, from, next) => {
  NProgress.done();
});

/** setup vue router. - [安装vue路由] */
export async function setupRouter(app) {
  app.use(router);
  await router.isReady();
}

export default router;
