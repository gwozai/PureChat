import tim from "@/utils/im-sdk/tim";
import { HISTORY_MESSAGE_COUNT } from "@/store/mutation-types";
/**
 * 获取未读消息总数
 * @returns {Promise<number>} 未读消息总数
 */
export const getUnreadMsg = async () => {
  return await tim.getTotalUnreadMessageCount();
};

/**
 * 获取消息列表
 * @param {Object} params - 参数对象
 * @param {string} params.conversationID - 会话ID
 * @param {number} [params.count] - 消息数量，默认为 HISTORY_MESSAGE_COUNT
 * @param {string} [params.nextReqMessageID] - 下一次请求的消息ID
 * @returns {Promise<Object>} 消息列表数据对象，若出错则返回空对象
 */
export const getMsgList = async (params) => {
  try {
    const { conversationID, count, nextReqMessageID } = params;
    const { code, data } = await tim.getMessageList({
      conversationID,
      count: count || HISTORY_MESSAGE_COUNT,
      nextReqMessageID: nextReqMessageID || ""
    });
    if (code === 0) {
      return data;
    } else {
      throw new Error("Failed to get message list");
    }
  } catch (error) {
    console.error("Error in getMsgList:", error);
    return {};
  }
};