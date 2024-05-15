import { ChatGLMPath, ModelProvider, useAccessStore } from "./constant";
import { ChatGPTApi } from "./openai";

export class ChatZhipuApi extends ChatGPTApi {
  constructor() {
    super();
  }
  accessStore(model = ModelProvider.ChatGLM) {
    return super.accessStore(model);
  }
  path() {
    let openaiUrl = useAccessStore(ModelProvider.ChatGLM).openaiUrl;
    return openaiUrl + ChatGLMPath.ChatPath;
  }
  getHeaders() {
    return super.getHeaders(useAccessStore(ModelProvider.ChatGLM).token);
  }
}
