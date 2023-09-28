import dayjs from "dayjs";
import { customRef } from "vue";
const { title } = require("@/config/vue.custom.config");

/**
 * 切换主题风格
 * @param {string}  appearance light || dark
 */
export function changeAppearance(appearance = "light") {
  if (appearance === "auto") {
    // 查询系统主题色
    const media = window.matchMedia("(prefers-color-scheme: light)");
    media.onchange = autotaggTheme;
    appearance = media.matches ? "light" : "dark";
  }
  // 设置element主题色
  if (appearance == "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  // 自定义主题设色
  document.body.setAttribute("data-theme", appearance);
}

/**
 * 根据系统主题颜色自动切换
 * @param {event}
 */
export function autotaggTheme(e) {
  if (e.matches) {
    document.body.setAttribute("data-theme", "light");
    document.documentElement.classList.remove("dark");
  } else {
    document.body.setAttribute("data-theme", "dark");
    document.documentElement.classList.add("dark");
  }
}

export function setPageTitle(routerTitle) {
  document.title = routerTitle ? `${routerTitle} | ${title}` || title : title;
}

export function generateUUID() {
  let result = "";
  const code = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
  result = code.replace(/[xy]/gu, (item) => {
    const random = (Math.random() * 16) | 0;
    const value = item === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
  return result;
}

export function useDebouncedRef(value, delay = 200) {
  let timer;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(val) {
        if (timer) return;
        timer = setTimeout(() => {
          timer = null;
          value = val;
          trigger();
        }, delay);
      },
    };
  });
}

export function randomNum(min = 0, max = 100) {
  return Math.floor(Math.random() * (min - max) + max);
}

/**
 * 判断是否为空
 */
export function empty(value) {
  switch (typeof value) {
    case "undefined":
      return true;
    case "string":
      if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, "").length == 0) return true;
      break;
    case "boolean":
      if (!value) return true;
      break;
    case "number":
      if (value === 0 || isNaN(value)) return true;
      break;
    case "object":
      if (value === null || value.length === 0) return true;
      for (var i in value) {
        return false;
      }
      return true;
  }
  return false;
}

/**
 * 判断数据类型
 * 示例 typOf({}) === "object";
 */
export function typeOf(operand) {
  const toString = Object.prototype.toString;
  let type = toString.call(operand).split(" ")[1];
  type = type.substring(0, type.length - 1).toLowerCase();
  return type;
}

export function formatTime(data) {
  return dayjs(data).format("YYYY-MM-DD HH:mm:ss"); // 2022-5-7 9:17:56
}
