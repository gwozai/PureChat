import { Boot } from "@wangeditor/editor";
import ctrlEnterModule from "@wangeditor/plugin-ctrl-enter";
import mentionModule from "@wangeditor/plugin-mention";
import fileModule from "@/utils/plugin-file/index";

// 注册插件
Boot.registerModule(fileModule); // 文件
Boot.registerModule(mentionModule); // @提及
Boot.registerModule(ctrlEnterModule); // ctrl+Enter 换行
