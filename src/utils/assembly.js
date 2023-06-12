const home = () => import(/* webpackChunkName: "Home" */ "@/views/home/index"); //首页
const Welcome = () => import(/* webpackChunkName: "Welcome" */ "@/views/welcome/index");

const views = {
  Home: home, //首页
  // System: home, //系统管理
  Welcome: () => import(/* webpackChunkName: "Welcome" */ "@/views/welcome/index"),
  Menu: () => import(/* webpackChunkName: "Menu" */ `@/views/system/menu/index`), //菜单
  User: () => import(/* webpackChunkName: "User" */ `@/views/system/user/index`), //用户
  Role: () => import(/* webpackChunkName: "Role" */ `@/views/system/role/index`), //角色
  ChatStudio: () => import(/* webpackChunkName: "ChatStudio" */ `@/views/ChatStudio/index`), //角色, // 编辑器
  Personal: () => import(/* webpackChunkName: "Personal" */ `@/views/Personal/index`), // 个人中心
  // Assembly: home, // 组件
  Draggable: () => import(/* webpackChunkName: "Draggable" */ `@/views/assembly/draggable/index`),
  Jigsaw: () => import(/* webpackChunkName: "Jigsaw" */ `@/views/assembly/Jigsaw/index`), //拼图游戏
  Animation: () => import(/* webpackChunkName: "Animation" */ `@/views/assembly/animation/index`), //动画
  About: () => import(/* webpackChunkName: "About" */ `@/views/about/index`), //关于
};

export default views;
