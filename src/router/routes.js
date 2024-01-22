import { $t } from "@/plugins/i18n";

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
  //       path: "/welcome",
  //       name: "welcome",
  //       component: () => import(/* webpackChunkName: "Welcome" */ "@/views/welcome/index"),
  //       meta: {
  //         title: $t('route.welcome'),
  //         icon: "Eleme",
  //       }
  //     },
  //     {
  //       path: "/chatStudio",
  //       name: "chatStudio",
  //       component: () => import(/* webpackChunkName: "ChatStudio" */ "@/views/chatStudio/index"),
  //       meta: {
  //         title: $t('route.chatStudio'),
  //         icon: "ForkSpoon",
  //         keep: true
  //       }
  //     },
  //     {
  //       path: "/personal",
  //       name: "personal",
  //       component: () => import(/* webpackChunkName: "Personal" */ "@/views/personal/index"),
  //       meta: {
  //         title: $t('route.personal'),
  //         icon: "User",
  //       }
  //     },
  //     {
  //       path: "/about",
  //       name: "about",
  //       component: () => import(/* webpackChunkName: "About" */ "@/views/about/index"),
  //       meta: {
  //         title: $t('route.about'),
  //         icon: "Warning",
  //       }
  //     }
  //   ]
  // },
];

export default routes;