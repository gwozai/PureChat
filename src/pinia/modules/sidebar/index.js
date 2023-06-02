import { nextTick } from "vue";
import { defineStore } from "pinia";
const { production } = require("@/config/vue.custom.config");

export const useSidebarStore = defineStore("sidebar-store", {
  state: () => ({
    outsideList: [
      {
        icon: "news",
        title: "消息",
        class: "fixed",
        if_fixed: 1,
      },
      {
        icon: "mail_list",
        title: "通讯录",
      },
      {
        icon: "application",
        title: "应用",
      },
      {
        icon: "test",
        title: "测试",
        show: production,
      },
      {
        icon: "icondiandiandian",
        title: "更多",
      },
    ],
  }),
  getters: {},
  actions: {},
});
