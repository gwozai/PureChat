import { ChatGLMPath, ModelProvider, useAccessStore } from "./constant";
import { ChatGPTApi } from "./openai";

export class ChatZhipuApi extends ChatGPTApi {
  constructor() {
    super();
    this.model = ModelProvider.ChatGLM;
  }
  accessStore(model = this.model) {
    return super.accessStore(model);
  }
  path() {
    let openaiUrl = useAccessStore(this.model).openaiUrl;
    return openaiUrl + ChatGLMPath.ChatPath;
  }
  getHeaders() {
    return super.getHeaders(useAccessStore(this.model).token);
  }
}
