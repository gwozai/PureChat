import { ModelProvider } from "@/ai/constant";
import { ChatGPTApi } from "@/ai/platforms/openai/index";
import { ChatYiApi } from "@/ai/platforms/zeroone/index";
import { ChatZhipuApi } from "@/ai/platforms/zhipu/index";

export class ClientApi {
  constructor(provider = ModelProvider.GPT) {
    switch (provider) {
      case ModelProvider.ChatGLM:
        this.llm = new ChatZhipuApi();
        break;
      case ModelProvider.ZeroOne:
        this.llm = new ChatYiApi();
        break;
      default:
        this.llm = new ChatGPTApi();
    }
  }

  config() {}

  prompts() {}

  masks() {}

  async share() {}
}
