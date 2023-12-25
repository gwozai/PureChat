import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import { ACCESS_TOKEN } from "@/store/constants";
import { setPageTitle } from "@/utils/common";
import NProgress from "@/utils/progress";
import storage from "storejs";
import routes from "./routes";

// hack router push callback
const originalPush = createRouter.prototype.push;
createRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

// 登录验证白名单
let isF = false;
const whiteList = ["login", "home"];
const loginRoutePath = "/login";
const defaultRoutePath = "/home";
console.log("[routes]", routes);

const historyMode = {
  history: createWebHistory(),
  hash: createWebHashHistory(),
};

const router = createRouter({
  history: historyMode[process.env.VUE_APP_ROUTER_HISTORY],
  routes,
});

router.beforeEach(async (to, from, next) => {
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
    if (to.path !== loginRoutePath) {
      next({ path: loginRoutePath });
    } else {
      next();
    }
  }
});

router.afterEach(async (to, from, next) => {
  NProgress.done();
});

export default router;
