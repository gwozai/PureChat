import { ClientApi } from "@/ai/api";
import { CHATGLM_ROBOT, CHATYI_ROBOT, ModelProvider } from "@/ai/constant";
import { getModelType, useAccessStore } from "@/ai/utils";
import { createCustomMsg } from "@/api/im-sdk-api/index";
import { restApi } from "@/api/node-admin-api/rest";
import store from "@/store";
import emitter from "@/utils/mitt-bus";
import { cloneDeep } from "lodash-es";

const restSendMsg = async (params, message) => {
  return await restApi({
    params: {
      To_Account: params.from,
      From_Account: params.to,
      Text: message || "loading...",
    },
    funName: "restSendMsg",
  });
};

const updataMessage = (msg, message = "") => {
  if (!msg) return;
  msg.payload.text = message;
  store.commit("SET_HISTORYMESSAGE", {
    type: "UPDATE_MESSAGES",
    payload: { convId: `C2C${msg.from}`, message: cloneDeep(msg) },
  });
};

const robotAvatar = {
  [ModelProvider.GPT]: "open-ai-icon.png",
  [ModelProvider.ChatGLM]: "chatglm.svg",
  [ModelProvider.ZeroOne]: "ZeroOne.svg",
};

const avatar = (id) => {
  const suffix = robotAvatar[getModelType(id)] || "";
  return `https://ljx-1307934606.cos.ap-beijing.myqcloud.com/${suffix}`;
};

const fnCreateLodMsg = (params) => {
  const { to, from } = params;
  const msg = createCustomMsg({ convId: from, customType: "loading" });
  msg.conversationID = `C2C${from}`;
  msg.avatar = avatar(to);
  msg.flow = "in";
  msg.to = from;
  msg.from = to;
  msg.nick = "";
  msg.status = "success";
  updataMessage(msg);
  msg.type = "TIMTextElem";
  return msg;
};

export const chatService = async (params) => {
  const { messages, chat } = params;
  let api;
  if (chat.to.startsWith(CHATGLM_ROBOT)) {
    api = new ClientApi(ModelProvider.ChatGLM);
  } else if (chat.to.startsWith(CHATYI_ROBOT)) {
    api = new ClientApi(ModelProvider.ZeroOne);
  } else {
    api = new ClientApi();
  }
  const mode = getModelType(chat.to);
  const msg = fnCreateLodMsg(chat);
  if (!api.config().token) {
    setTimeout(() => {
      updataMessage(msg, "API Key 不正确或为空，请检查 API Key 后重试");
    }, 1000);
    return;
  }
  await api.llm.chat({
    messages,
    config: { model: useAccessStore(mode).model, stream: true },
    onUpdate(message) {
      // console.log("[chat] onUpdate:", message);
      emitter.emit("updataScroll", "instantly");
      updataMessage(msg, message);
    },
    async onFinish(message) {
      console.log("[chat] onFinish:", message);
      emitter.emit("updataScroll", "instantly");
      if (message) {
        updataMessage(msg, message);
        await restSendMsg(chat, message);
      } else {
        await restSendMsg(chat, "网络异常请稍后再试");
      }
    },
    onError(error) {
      console.error("[chat] failed:", error);
    },
    onController(controller) {
      console.log("[chat] onController:", controller);
    },
  });
};
