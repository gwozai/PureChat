const { production } = require("@/config/vue.custom.config");
const sidebar = {
  state: {
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
        icon: "github",
        title: "github",
      },
      {
        icon: "test",
        title: "测试",
        show: production,
      },
      // {
      //   icon: "Switch",
      //   title: "排序",
      //   type: 'el-icon'
      // },
      {
        icon: "icondiandiandian",
        title: "更多",
      },
    ],
  },
  getters: {},
  mutations: {},
  actions: {},
};

export default sidebar;
