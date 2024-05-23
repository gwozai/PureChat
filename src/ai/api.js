import { ModelProvider } from "@/ai/constant";
import { ChatGPTApi } from "@/ai/platforms/openai/index";
import { ChatYiApi } from "@/ai/platforms/zeroone/index";
import { ChatZhipuApi } from "@/ai/platforms/zhipu/index";
import { useAccessStore } from "@/ai/utils";

const API_PROVIDERS = {
  [ModelProvider.ChatGLM]: ChatZhipuApi,
  [ModelProvider.ZeroOne]: ChatYiApi,
  [ModelProvider.GPT]: ChatGPTApi,
};

export class ClientApi {
  constructor(provider = ModelProvider.GPT) {
    this._config = useAccessStore(provider);
    this.llm = this.createLLM(provider);
  }
  createLLM(provider) {
    const ApiClass = API_PROVIDERS[provider] || ChatGPTApi;
    return new ApiClass(provider);
  }
  config() {
    return this._config;
  }
  prompts() {}
  masks() {}
  async share() {}
}
