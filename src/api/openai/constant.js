import storage from "@/utils/localforage/index";
export const REQUEST_TIMEOUT_MS = 6000;

export const StoreKey = {
  Access: "access-control",
};

export const ModelProvider = {
  GPT: "GPT",
  // GeminiPro: "GeminiPro",
  // Claude: "Claude",
  ChatGLM: "ChatGLM",
};

export const OpenaiPath = {
  ChatPath: "v1/chat/completions", // chatgpt 聊天接口
  // UsagePath: "v1/dashboard/billing/usage", // 用量查询，数据单位为 token
  // SubsPath: "v1/dashboard/billing/subscription", // 总量查询，数据单位为 token
  // ListModelPath: "v1/models", // 查询可用模型
  // EmbeddingPath: "v1/embeddings", // 文本向量化
};

export const ChatGLMPath = {
  // https://open.bigmodel.cn/api/paas/v4/
  ChatPath: "chat/completions",
};
// 默认配置
export const modelConfig = {
  model: "gpt-3.5-turbo",
  /**
   * 生成文本的随机度量，用于控制文本的创造性和多样性
   * @default 0.6
   */
  temperature: 0.6,
  /**
   * 控制生成文本中最高概率的单个 token
   * @default 1
   */
  top_p: 1,
  /**
   * 生成文本的最大长度
   */
  max_tokens: 1024,
  /**
   * 控制生成文本中的惩罚系数，用于减少主题的变化
   * @default 0
   */
  presence_penalty: 0,
  /**
   * 控制生成文本中的惩罚系数，用于减少重复性
   * @default 0
   */
  frequency_penalty: 0,
  token: process.env.VUE_APP_OPENAI_API_KEY,
  openaiUrl: process.env.VUE_APP_BASE_URL,
  historyMessageCount: 1,
  compressMessageLengthThreshold: 1000,
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

export function useAccessStore() {
  return storage.get(StoreKey.Access) || modelConfig;
}

export const DEFAULT_MODELS = [
  ...openaiModels.map((name) => ({
    name,
    available: true,
    provider: {
      id: "openai",
      providerName: "OpenAI",
      providerType: "openai",
    },
  })),
  // ...zhipuModels.map((name) => ({
  //   name,
  //   available: true,
  //   provider: {
  //     id: "zhipu",
  //     providerName: "ZhiPu",
  //     providerType: "zhipu",
  //   },
  // })),
  // {
  //   name: "qwen-v1", // 通义千问
  //   available: false,
  // },
  // {
  //   name: "ernie", // 文心一言
  //   available: false,
  // },
];

export const modelValue = {
  Model: {
    ID: "model",
    Title: "模型 (model)",
    SubTitle: "",
    defaultValue: "",
    options: DEFAULT_MODELS,
  },
  OpenaiUrl: {
    ID: "openaiUrl",
    Title: "接口地址",
    SubTitle: "除默认地址外，必须包含 http(s)://",
    Placeholder: "https://api.openai.com",
    defaultValue: "",
    password: true,
  },
  Token: {
    ID: "token",
    Title: "API Key",
    SubTitle: "使用自己的 OpenAI API Key",
    Placeholder: "OpenAI API Key",
    defaultValue: "",
    password: true,
  },
  Temperature: {
    ID: "temperature",
    Title: "随机性 (temperature)",
    SubTitle: "值越大，回复越随机",
    defaultValue: "",
    Range: true,
    step: 0.1,
    min: 0,
    max: 1,
  },
  TopP: {
    ID: "top_p",
    Title: "核采样 (top_p)",
    SubTitle: "与随机性类似，但不要和随机性一起更改",
    defaultValue: "",
    Range: true,
    step: 0.1,
    min: 0,
    max: 1,
  },
  // MaxTokens: {
  //   ID: "max_tokens",
  //   Title: "单次回复限制 (max_tokens)",
  //   SubTitle: "单次交互所用的最大 Token 数",
  //   defaultValue: "",
  //   Number: true,
  //   min: 1024,
  //   max: 512000,
  // },
  PresencePenalty: {
    ID: "presence_penalty",
    Title: "话题新鲜度 (presence_penalty)",
    SubTitle: "值越大，越有可能扩展到新话题",
    defaultValue: "",
    Range: true,
    step: 0.1,
    min: 0,
    max: 2,
  },
  FrequencyPenalty: {
    ID: "frequency_penalty",
    Title: "频率惩罚度 (frequency_penalty)",
    SubTitle: "值越大，越有可能降低重复字词",
    defaultValue: "",
    Range: true,
    step: 0.1,
    min: 0,
    max: 2,
  },
  historyMessageCount: {
    ID: "historyMessageCount",
    Title: "附带历史消息数",
    SubTitle: "每次请求携带的历史消息数",
    defaultValue: "",
    Range: true,
    step: 1,
    min: 1,
    max: 24,
  },
};
