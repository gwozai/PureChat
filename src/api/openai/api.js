import { ModelProvider } from "./constant";
import { ChatGPTApi } from "./openai";
import { ChatZhipuApi } from "./zhipu";

export class ClientApi {
  constructor(provider = ModelProvider.GPT) {
    switch (provider) {
      case ModelProvider.GPT:
        this.llm = new ChatGPTApi();
        break;
      case ModelProvider.ChatGLM:
        this.llm = new ChatZhipuApi();
        break;
    }
  }

  config() {}

  prompts() {}

  masks() {}

  async share() {}
}
