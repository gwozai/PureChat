import { SET_UP } from "@/store/constants";
import { createI18n } from "vue-i18n";
import storage from "@/utils/localforage/index";
// User defined lang
import enLocale from "../../locales/en";
import zhLocale from "../../locales/zh-CN";

const localesConfigs = {
  en: {
    ...enLocale,
  },
  "zh-CN": {
    ...zhLocale,
  },
};
const lang = storage.get(SET_UP)?.lang || "zh-CN";

/**
 * 国际化转换工具函数（自动读取根目录locales文件夹下文件进行国际化匹配）
 * @param message message
 * @returns 转化后的message
 */
export function transformI18n(message) {
  if (!message) {
    return "";
  }

  if (typeof message === "object") {
    const locale = i18n.global.locale;
    return message[locale?.value];
  }

  const key = message.match(/(\S*)\./)?.[1];
  if (key && Object.keys(zhLocale).includes(key)) {
    return i18n.global.t.call(i18n.global.locale, message);
  } else if (!key && Object.keys(zhLocale).includes(message)) {
    return i18n.global.t.call(i18n.global.locale, message);
  } else {
    return message;
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: lang,
  fallbackLocale: "en",
  messages: localesConfigs,
});
console.log("[locales]:", localesConfigs);
/**
 * app.config.globalProperties.$t = i18n.global.t;
 * 可以在全局模版语法直接使用
 * $t("common.setup")
 * $t("el.messagebox.confirm")
 */
export function useI18n(app) {
  app.config.globalProperties.$t = i18n.global.t;
  app.use(i18n);
}

export const $t = (key) => i18n.global.t(key);
