import { OpenaiConfig } from "@/ai/platforms/openai/config";
import { openaiModelValue } from "@/ai/platforms/openai/modelValue";
import { YiConfig } from "@/ai/platforms/zeroone/config";
import { yiModelValue } from "@/ai/platforms/zeroone/modelValue";
import { ZhiPuConfig } from "@/ai/platforms/zhipu/config";
import { zhipuModelValue } from "@/ai/platforms/zhipu/modelValue";
import { prefixRobotIDs } from "./utils";

// chatgpt机器人id
export const CHATGPT_ROBOT = "@RBT#001";
// 智谱机器人id
export const CHATGLM_ROBOT = "@RBT#002";
// 零一万物机器人id
export const CHATYI_ROBOT = "@RBT#003";

export const ROBOT_COLLECT = [CHATGPT_ROBOT, CHATGLM_ROBOT, CHATYI_ROBOT];

export const C2C_ROBOT_COLLECT = prefixRobotIDs(ROBOT_COLLECT);

export const REQUEST_TIMEOUT_MS = 6000;

export const StoreKey = {
  Access: "access-control",
};

export const ModelProvider = {
  GPT: "GPT", // chatgpt
  ChatGLM: "ChatGLM", // 智谱
  ZeroOne: "ZeroOne", // 零一万物
};

export const OpenaiPath = {
  ChatPath: "v1/chat/completions", // chatgpt 聊天接口
  // UsagePath: "v1/dashboard/billing/usage", // 用量查询，数据单位为 token
  // SubsPath: "v1/dashboard/billing/subscription", // 总量查询，数据单位为 token
  // ListModelPath: "v1/models", // 查询可用模型
  // EmbeddingPath: "v1/embeddings", // 文本向量化
};

export const ChatGLMPath = {
  ChatPath: "chat/completions",
};

const openaiModels = [
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-0301",
  "gpt-3.5-turbo-0613",
  // "gpt-3.5-turbo-1106",
  // "gpt-3.5-turbo-0125",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo-16k-0613",
  "gpt-4",
  // "gpt-4-0613",
  // "gpt-4-32k",
  // "gpt-4-32k-0613",
  // "gpt-4-turbo",
  // "gpt-4-turbo-preview",
  // "gpt-4-vision-preview",
  // "gpt-4-turbo-2024-04-09",
];

const zhipuModels = ["glm-4", "glm-4v", "glm-3-turbo"];

const yiModels = ["yi-large"];

export const DEFAULT_MODELS = [
  ...openaiModels.map((name) => ({
    name,
    available: true,
    provider: {
      id: "openai",
      convId: CHATGPT_ROBOT,
      providerName: "OpenAI",
      providerType: "openai",
    },
  })),
  ...zhipuModels.map((name) => ({
    name,
    available: true,
    provider: {
      id: "zhipu",
      convId: CHATGLM_ROBOT,
      providerName: "ZhiPu",
      providerType: "zhipu",
    },
  })),
  ...yiModels.map((name) => ({
    name,
    available: true,
    provider: {
      id: "zeroone",
      convId: CHATYI_ROBOT,
      providerName: "ZeroOne",
      providerType: "zeroone",
    },
  })),
];

// 默认配置
export const modelConfig = {
  [ModelProvider.GPT]: { ...OpenaiConfig },
  [ModelProvider.ChatGLM]: { ...ZhiPuConfig },
  [ModelProvider.ZeroOne]: { ...YiConfig },
};

export const modelValue = {
  [ModelProvider.GPT]: openaiModelValue(DEFAULT_MODELS),
  [ModelProvider.ChatGLM]: zhipuModelValue(DEFAULT_MODELS),
  [ModelProvider.ZeroOne]: yiModelValue(DEFAULT_MODELS),
};