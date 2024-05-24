export default [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "Layout" */ "@/layout/index.vue"),
    meta: {
      title: "home",
      icon: "Eleme",
    },
    children: [
      {
        path: "/chatStudio",
        name: "chatStudio",
        component: () => import(/* webpackChunkName: "ChatStudio" */ "@/views/chatStudio/index"),
        meta: {
          title: "聊天工作室",
          locale: "chatStudio",
          icon: "ForkSpoon",
          keep: true,
        },
      },
    ],
  },
];
