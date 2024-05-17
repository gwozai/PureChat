export const ZhiPuConfig = {
  model: "glm-3-turbo",
  historyMessageCount: 5,
  temperature: 0.95,
  top_p: 0.7,
  max_tokens: 1024,
  token: process.env.VUE_APP_ZHIPU_API_KEY,
  openaiUrl: process.env.VUE_APP_ZHIPU_BASE_URL,
};
