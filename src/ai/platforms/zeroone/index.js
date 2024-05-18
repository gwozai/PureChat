import { ModelProvider, ZeroOnePath } from "@/ai/constant";
import { ChatGPTApi } from "@/ai/platforms/openai/index";
import { useAccessStore } from "@/ai/utils";

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
    return openaiUrl + ZeroOnePath.ChatPath;
  }
  getHeaders() {
    return super.getHeaders(useAccessStore(this.model).token);
  }
}
