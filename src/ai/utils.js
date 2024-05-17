import {
  CHATGLM_ROBOT,
  CHATGPT_ROBOT,
  CHATYI_ROBOT,
  ModelProvider,
  StoreKey,
  modelConfig,
} from "@/ai/constant";
import { isRobot } from "@/utils/chat/index";
import storage from "@/utils/localforage/index";

export const useAccessStore = (model = ModelProvider.GPT) => {
  try {
    return storage.get(StoreKey.Access)?.[model] || modelConfig[model];
  } catch (error) {
    storage.remove(StoreKey.Access);
    return {};
  }
};

export function getModelType(modelId) {
  if (!isRobot(modelId)) return null;
  const modelMapping = {
    [CHATGPT_ROBOT]: [ModelProvider.GPT],
    [CHATGLM_ROBOT]: [ModelProvider.ChatGLM],
    [CHATYI_ROBOT]: [ModelProvider.ZeroOne],
  };
  return modelMapping[modelId] || null;
}

export function prefixRobotIDs(robotIDs) {
  return robotIDs.map((id) => "C2C" + id);
}
