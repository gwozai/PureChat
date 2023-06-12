import storage from "storejs";
import router from "@/router";
import views from "@/utils/assembly.js";
import { ToTree, flatToTree } from "@/utils/ToTree";
import { tree } from "@/utils/ToTree";
import { USER_DATA, SET_UP } from "@/store/mutation-types";

// function flatToTree(flatData, parentId = null) {
//   console.log(flatData);
//   return flatData.reduce((tree, item) => {
//     if (item.parentId === parentId) {
//       const children = flatToTree(flatData, item.id);
//       if (children.length > 0) {
//         item.children = children;
//       }
//       tree.push(item);
//     }
//     return tree;
//   }, []);
// }
// function buildTree(data, parentId = null) {
//   const tree = [];
//   for (const item of data) {
//     if (item.path === parentId) {
//       const children = buildTree(data, item.id);
//       if (children.length > 0) {
//         item.children = children;
//       }
//       tree.push(item);
//     }
//   }
//   return tree;
// }

const actions = {
  // 更新路由
  updateRoute({ commit, state }, route) {
    // route.map((t) => {
    //   if (t.componentName) {
    //     t.component = views[t.componentName];
    //   }
    // });
    const root = route.find((t) => (t.path = "/"));
    tree(route);
    ToTree(root, route);
    root.children.map((item) => {
      router.addRoute(item);
    });
    console.log(root.children, "123");
    commit("updateData", { key: "Routingtable", value: root.children });
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
