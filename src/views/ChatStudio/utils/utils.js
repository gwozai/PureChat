import store from "@/store/index";
import { match } from "pinyin-pro";
import { useClipboard } from "@vueuse/core";
import { fileImgToBase64Url, dataURLtoFile, urlToBase64 } from "@/utils/chat/index";
import {
  createTextMsg,
  createTextAtMsg,
  createFiletMsg,
  createImgtMsg,
} from "@/api/im-sdk-api/index";

export const dragControllerDiv = (node) => {
  let svgResize = document.getElementById("svgResize"); //滑块
  let svgTop = document.getElementById("svgTop"); //聊天框
  let svgDown = document.getElementById("svgDown"); //编辑器
  let svgBox = document.getElementById("svgBox"); //整个盒子
  // 按下鼠标执行
  svgResize.onmousedown = (e) => {
    let startY = e.clientY; //鼠标按下 起始Y
    svgResize.top = svgResize.offsetTop;
    // 事件会在鼠标指针移到指定的对象时发生。
    document.onmousemove = (e) => {
      let endY = e.clientY; //鼠标移动 结束得y
      //移动距离 = 原来高度+（结束y-开始y）
      let moveLen = svgResize.top + (endY - startY);
      // 最大移动距离 = 整个盒子高度 - 现在高度
      let maxT = svgBox.clientHeight - svgResize.offsetHeight;
      // 控制移动最小
      if (moveLen < 200) moveLen = 200;
      // 控制移动最大
      if (moveLen > maxT - 200) moveLen = maxT - 200;
      svgResize.style.top = moveLen;
      svgTop.style.height = moveLen - 60 + "px";
      svgDown.style.height = svgBox.clientHeight - moveLen - 5 + "px";
    };
    // 鼠标按键被松开时执行
    document.onmouseup = (evt) => {
      document.onmousemove = null;
      document.onmouseup = null;
      svgResize.releaseCapture && svgResize.releaseCapture();
      // 手动更新滚动条高度
      node.updateScrollbar();
    };
    svgResize.setCapture && svgResize.setCapture();
    return false;
  };
};

export const validatelastMessage = (msglist) => {
  return (
    msglist
      .slice()
      .reverse()
      .find((msg) => msg.ID) || null
  );
};

// 复制
export const handleCopyMsg = async (data) => {
  const { elements } = data;
  const { content, type } = elements[0];
  // 文本
  if (type === "TIMTextElem") {
    const { text, copy, copied, isSupported } = useClipboard({ source: content.text });
    copy(content.text);
  }
};

export const GroupSystemNotice = (message) => {
  const groupName = message.payload.groupProfile.name || message.payload.groupProfile.groupID;
  switch (message.payload.operationType) {
    case 1:
      return `${message.payload.operatorID} 申请加入群组：${groupName}`;
    case 2:
      return `成功加入群组：${groupName}`;
    case 3:
      return `申请加入群组：${groupName}被拒绝`;
    case 4:
      return `你被管理员${message.payload.operatorID}踢出群组：${groupName}`;
    case 5:
      return `群：${groupName} 已被${message.payload.operatorID}解散`;
    case 6:
      return `${message.payload.operatorID}创建群：${groupName}`;
    case 7:
      return `${message.payload.operatorID}邀请你加群：${groupName}`;
    case 8:
      return `你退出群组：${groupName}`;
    case 9:
      return `你被${message.payload.operatorID}设置为群：${groupName}的管理员`;
    case 10:
      return `你被${message.payload.operatorID}撤销群：${groupName}的管理员身份`;
    case 12:
      return `${message.payload.operatorID}邀请你加群：${groupName}`;
    case 13:
      return `${message.payload.operatorID}同意加群：${groupName}`;
    case 14:
      return `${message.payload.operatorID}拒接加群：${groupName}`;
    case 255:
      return "自定义群系统通知: " + message.payload.userDefinedField;
    default:
      return "待开发";
  }
};

export const renderFileIcon = (fileType = "") => {
  let type;
  if (fileType == "xlsx" || fileType == "xls") {
    type = "表格";
  } else if (fileType == "doc" || fileType == "docx") {
    type = "文档";
  } else if (fileType == "pptx" || fileType == "ppt") {
    type = "ppt";
  } else if (fileType == "rar" || fileType == "zip") {
    type = "压缩包";
  } else if (fileType == "txt") {
    type = "txt";
  } else if (fileType == "pdf") {
    type = "pdf";
  } else {
    type = "通用";
  }
  return require(`@/assets/message/${type}.png`);
};

// 动态class
export const Megtype = (elem_type) => {
  let resp = "";
  switch (elem_type) {
    case "TIMTextElem":
      resp = "message-view__text"; // 文本
      break;
    case "TIMGroupTipElem":
      resp = "message-view__tips-elem"; // 群消息提示
      break;
    case "TIMImageElem":
      resp = "message-view__img"; // 图片消息
      break;
    case "TIMFileElem":
      resp = "message-view__file"; // 文件消息
      break;
    case "TIMGroupSystemNoticeElem":
      resp = "message-view__system"; // 系统通知
      break;
    case "TIMCustomElem":
      resp = "message-view__text message-view__custom"; // 自定义消息
      break;
    default:
      resp = "";
      break;
  }
  return resp;
};

export const msgOne = (item) => {
  const { isRevoked, type } = item;
  if (isRevoked) {
    return "message-view__tips-elem";
  } else if (type == "TIMGroupTipElem") {
    return "message-view__tips-elem";
  } else {
    return "message-view__item--index";
  }
};

/**
 * 将字符串中的特殊字符进行 HTML 转义
 * @param {string} str - 待转义的字符串
 * @returns {string} - 转义后的字符串
 */
export const html2Escape = (str) => {
  // 使用对象映射，避免多个 if/else 分支
  const map = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
  };
  return str.replace(/[<>&"]/g, function (c) {
    return map[c];
  });
};

/**
 * 发送聊天消息
 * @param {string} convId - 会话ID
 * @param {string} convType - 会话类型（单聊/群聊）
 * @param {Object} options - 消息选项
 * @param {string} [options.textMsg] - 文本消息内容（可选）
 * @param {string[]} [options.aitlist] - 艾特用户列表（可选）
 * @param {Object[]} [options.files] - 文件（可选）
 * @param {string} [options.files.fileName] - 文件名（可选）
 * @param {string} [options.files.src] - 文件数据URL（可选）
 * @param {Object[]} [options.image] - 图片（可选）
 * @param {string} [options.image.src] - 图片数据URL（可选）
 * @returns {Promise<Object>} - 返回聊天消息对象
 *
 */
export async function sendChatMessage(options) {
  let TextMsg;
  let flag = true;
  const { convId, convType, textMsg, aitStr, aitlist, files, image, reply } = options;
  console.log(options);
  // 如果包含文件，则创建相应的文件消息
  if (files) {
    const { fileName, src } = files;
    let file = dataURLtoFile(src, fileName);
    TextMsg = await createFiletMsg({
      convId: convId,
      convType: convType,
      files: file,
    });
    flag = false;
  }
  // 如果包含图片，则创建相应的图片消息
  if (image) {
    let file = dataURLtoFile(image[0].src);
    TextMsg = await createImgtMsg({
      convId: convId,
      convType: convType,
      image: file,
    });
    flag = false;
  }
  // 如果包含艾特，则创建相应的艾特消息
  if (aitStr) {
    TextMsg = await createTextAtMsg({
      convId: convId,
      convType: convType,
      textMsg: aitStr,
      atUserList: aitlist,
      reply,
    });
  }
  // 否则创建文本消息
  else if (flag) {
    TextMsg = await createTextMsg({
      convId: convId,
      convType: convType,
      textMsg: textMsg,
      reply,
    });
  }
  TextMsg.status = "unSend";
  return TextMsg;
}

export const customAlert = (s, t) => {
  console.log(s, t);
  switch (t) {
    case "success":
      console.log("success");
      break;
    case "info":
      console.log("info");
      break;
    case "warning":
      console.log("warning");
      break;
    case "error":
      console.log("error");
      break;
    default:
      console.log("default");
      break;
  }
};

export const chatName = (item) => {
  switch (item.type) {
    case "C2C":
      return item.userProfile.nick || item.userProfile.userID;
    case "GROUP":
      return item.groupProfile.name;
    case "@TIM#SYSTEM":
      return "系统通知";
    default:
      return "";
  }
};
// 是否全员群
export const isallStaff = (item, field = "all_staff") => {
  return item?.groupProfile?.groupCustomField?.[0]?.value == field;
};
/**
 * 将给定的 HTML 字符串解析为 数组
 * @param {string} html - 要解析的 HTML 字符串
 * @returns {Array} - 解析后的 数组
 */
export function parseHTMLToArr(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const elements = Array.from(doc.body.children[0].childNodes);
  const arr = elements.map((element) => {
    const obj = {};
    if (element.tagName === "IMG") {
      obj.elem_type = 1;
      obj.image_path = element.getAttribute("src");
    } else {
      obj.elem_type = 0;
      obj.text_content = element.textContent.trim();
    }
    return obj;
  });
  return arr;
}

/**
 * 从 HTML 中提取文件信息
 * @param {string} html - 包含文件信息的 HTML 字符串
 * @returns {Object} - 包含文件名和链接的对象
 */
export const extractFilesInfo = (html) => {
  const matchStr = html.match(/data-link="([^"]*)"/);
  const matchStrName = html.match(/data-fileName="([^"]*)"/);
  const fileName = matchStrName?.[1];
  const link = matchStr?.[1];
  return { fileName, link };
};

/**
 * 比较两个用户的 userID，用于排序
 * @param {Object} a - 第一个用户对象
 * @param {Object} b - 第二个用户对象
 * @returns {number} - 返回比较结果，-1 表示 a 在 b 前面，1 表示 b 在 a 前面，0 表示相等
 */
export const compareUserID = (a, b) => {
  const aHasRBT = a.userID.includes("@RBT#");
  const bHasRBT = b.userID.includes("@RBT#");
  return aHasRBT && !bHasRBT ? -1 : bHasRBT && !aHasRBT ? 1 : 0;
};

/**
 * 根据拼音搜索成员列表中的匹配项
 * @param {string} str - 要搜索的拼音字符串
 * @returns {Array} - 匹配项的数组
 */
export function searchByPinyin(str) {
  const indices = [];
  const list = store.state?.groupinfo?.currentMemberList;
  console.log(list);
  if (!list) {
    store.commit("EMITTER_EMIT",
      {
        key: "setMentionModal",
        value: {
          content: [],
          type: "empty",
          searchValue: str,
          searchlength: str.length + 1
        }
      });
    return
  }
  list.forEach((item) => {
    const nickPinyin = match(item.nick, str);
    if (nickPinyin?.length > 0) indices.push(item);
  });
  if (indices.length === 0) {
    store.commit("EMITTER_EMIT", {
      key: "setMentionModal", value: {
        type: "empty",
      }
    });
  } else {
    console.log(indices);
    store.commit("EMITTER_EMIT", {
      key: "setMentionModal", value: {
        content: indices,
        type: "success",
        searchValue: str,
        searchlength: str.length + 1
      }
    });
  }
  return indices;
}

export function FilterMentionList(str) {
  if (str === "") {
    store.commit("SET_MENTION_MODAL", false);
    return;
  }
  if (str === "@") {
    store.commit("EMITTER_EMIT", {
      key: "setMentionModal", value: {
        type: "all",
        searchValue: str,
      }
    });
    return
  }
  const selection = window.getSelection() //光标当前位置
  const focusOffset = selection.focusOffset
  const range = selection.getRangeAt(0)
  console.log(range)
  const rangeAncestor = range.commonAncestorContainer.data
  if (!rangeAncestor) return
  const text = rangeAncestor.substring(0, focusOffset)
  const lastAtIndex = text.lastIndexOf('@') //@最后一次出现的索引位置 
  if (lastAtIndex === -1) {
    store.commit("SET_MENTION_MODAL", false);
    return
  }
  const searchValue = text.substring(lastAtIndex + 1, focusOffset) //从@出现的索引位置截取到输入位置
  console.log("searchValue:", searchValue)
  if (!searchValue) return
  searchByPinyin(searchValue)
}