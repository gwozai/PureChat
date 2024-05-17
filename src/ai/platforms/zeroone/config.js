export const YiConfig = {
  model: "yi-large",
  temperature: 0.6,
  top_p: 1,
  max_tokens: 1024,
  presence_penalty: 0,
  frequency_penalty: 0,
  token: process.env.VUE_APP_ZEROONE_API_KEY,
  openaiUrl: process.env.VUE_APP_ZEROONE_BASE_URL,
  historyMessageCount: 10,
};
