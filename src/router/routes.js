/* eslint-disable prettier/prettier */
import { defineAsyncComponent } from "vue";
/**
 *
 * keepAlive 需要被缓存的组件
 * requiresAuth
 */
const Login = () => import(/* webpackChunkName: "Login" */ "@/views/login/index");
const Home = () => import(/* webpackChunkName: "Home" */ "@/views/home/index");
const Welcome = () => import(/* webpackChunkName: "Welcome" */ "@/views/welcome/index");
const ChatStudio = () => import(/* webpackChunkName: "ChatStudio" */ "@/views/ChatStudio/index");
const Menu = () => import(/* webpackChunkName: "Menu" */ "@/views/system/menu/index");
const User = () => import(/* webpackChunkName: "User" */ "@/views/system/user/index");
const Role = () => import(/* webpackChunkName: "Role" */ "@/views/system/role/index");
const Personal = () => import(/* webpackChunkName: "Personal" */ "@/views/Personal/index");
const About = () => import(/* webpackChunkName: "About" */ "@/views/about/index");

const routes = [
  { path: "/", redirect: "/chatstudio" },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "登录",
      icon: "Eleme",
    },
  },
];

export default routes;
