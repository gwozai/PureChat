import storage from "storejs";
import router from "@/router";
import views from "@/utils/assembly.js";
import { ToTree, flatToTree, tree } from "@/utils/ToTree";
import { USER_DATA, SET_UP } from "@/store/mutation-types";

const actions = {
  // 更新路由
  updateRoute({ commit, state }, route) {
    const root = route.find((t) => (t.path = "/root"));
    tree(route);
    ToTree(root, route);
    root.children.map((item) => {
      router.addRoute(item);
    });
    commit("UPDATE_USER_INFO", { key: "Routingtable", value: root.children });
  },
  // 页面刷新重新加载路由
  reloadRoute({ commit, state }, route) {
    try {
      const routing = state.data.Routingtable;
      if (!routing) return;
      tree(routing);
      routing.map((item) => {
        router.addRoute(item);
      });
    } catch (error) {
      console.error(error);
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
};

export default actions;
