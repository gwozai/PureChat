const routes = [
  { path: "/", redirect: "/chatstudio" },
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: "Login" */ "@/views/login/index"),
    meta: {
      title: "登录",
      icon: "Eleme",
    },
  },
  // {
  //   path: "/",
  //   name: "home",
  //   component: () => import(/* webpackChunkName: "Home" */ "@/views/home/index"),
  //   meta: {
  //     title: "home",
  //     icon: "Eleme",
  //   },
  //   children: [
  //     {
  //       path: "/chatStudio",
  //       name: "chatStudio",
  //       component: () => import(/* webpackChunkName: "ChatStudio" */ "@/views/ChatStudio/index"),
  //       meta: {
  //         title: "聊天工作室",
  //         icon: "ForkSpoon",
  //         keep: true
  //       }
  //     },
  //   ]
  // },
];

export default routes;