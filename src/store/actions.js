import storage from "storejs";
import { nextTick } from "vue";
import router from "@/router";
import views from "@/utils/assembly.js";
import { ToTree, flatToTree } from "@/utils/ToTree";
import { login, logout } from "@/api/user";
import { getMenu } from "@/api/menu";
import { verification } from "@/utils/message/index";
import emitter from "@/utils/mitt-bus";
import { tree } from "@/utils/ToTree";
import { USER_DATA, SET_UP } from "@/store/mutation-types";

const actions = {
  // 更新路由
  updateRoute({ commit, state }, route) {
    route.map((t) => {
      if (t.componentName) {
        t.component = views[t.componentName];
      }
    });
    let root = route.find((t) => (t.path = "/"));
    ToTree(root, route);
    // 动态添加路由
    root.children.forEach((item) => {
      router.addRoute(item);
    });
    commit("updateData", { key: "Routingtable", value: root.children });
  },
  // 页面刷新重新加载路由
  reloadRoute({ commit, state }, route) {
    try {
      const routing = storage.get(USER_DATA)?.Routingtable;
      if (!routing) return;
      tree(routing);
      routing.forEach((item) => {
        router.addRoute(item);
      });
    } catch (error) {
      console.log(error);
    }
  },
  // 设置验证码
  SET_VERIFYCODE({ state }, verifyCode) {
    state.data.verifyCode = verifyCode;
  },
  // 清除 eltag 标签
  CLEAR_EL_TAG({ state }) {
    state.data.elTag = [];
  },
  // 菜单列表
  async GET_MENU({ dispatch }) {
    let menu = await getMenu();
    dispatch("updateRoute", menu);
  },
  // 登录
  async LOG_IN({ state, commit, dispatch }, data) {
    const { username, password } = data;
    const { code, msg, result } = await login({ username, password });
    console.log({ code, msg, result }, "登录信息");
    if (code == 200) {
      window.TIMProxy.init();
      dispatch("TIM_LOG_IN", {
        userID: username,
        userSig: result.userSig,
      });
      dispatch("GET_MENU");
      setTimeout(() => {
        commit("updateData", { key: "user", value: result });
        commit("showMessage", { message: msg });
        router.push("/home");
      }, 500);
    } else {
      verification(code, msg);
    }
  },
  // 退出登录
  LOG_OUT({ state, commit, dispatch }) {
    dispatch("TIM_LOG_OUT");
    emitter.all.clear();
    logout();
    router.push("/login");
  },
};

export default actions;
