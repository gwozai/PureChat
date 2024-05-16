import { ModelProvider } from "./constant";
import { ChatGPTApi } from "./openai";
import { ChatYiApi } from "./zeroone";
import { ChatZhipuApi } from "./zhipu";

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
