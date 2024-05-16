import { ModelProvider, OpenaiPath, useAccessStore } from "./constant";
import { ChatGPTApi } from "./openai";

export class ChatYiApi extends ChatGPTApi {
  constructor() {
    super();
    this.model = ModelProvider.ZeroOne;
  }
  accessStore(model = this.model) {
    return super.accessStore(model);
  }
  path() {
    let openaiUrl = useAccessStore(this.model).openaiUrl;
    return openaiUrl + OpenaiPath.ChatPath;
  }
  getHeaders() {
    return super.getHeaders(useAccessStore(this.model).token);
  }
}
