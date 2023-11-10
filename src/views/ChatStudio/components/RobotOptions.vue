<template>
  <el-dialog v-model="state" width="750px" :before-close="handleClose">
    <div>
      <ul class="container">
        <li class="list-item" v-for="(item, index) in Settings" :key="index">
          <div>
            <div class="title">{{ item.Title }}</div>
            <div class="subTitle">{{ item.SubTitle }}</div>
          </div>
          <el-select v-if="item.options" v-model="item.defaultValue" placeholder="Select">
            <el-option
              v-for="item in item.options"
              v-show="item.available"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
          <div class="range" v-if="item.Range">
            {{ item.defaultValue }}
            <input
              v-model="item.defaultValue"
              :min="item.min"
              :max="item.max"
              :step="item.step"
              type="range"
            />
          </div>
          <div class="number" v-else-if="item.Number">
            <input v-model="item.defaultValue" :min="item.min" :max="item.max" type="number" />
          </div>
          <div class="password-input" v-else-if="item.password">
            <input v-model="item.defaultValue" :placeholder="item.Placeholder" type="text" />
          </div>
        </li>
      </ul>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel()"> 重置 </el-button>
        <el-button type="primary" @click="handleConfirm()"> 保存 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, computed, watch, nextTick } from "vue";
import { useBoolean } from "@/utils/hooks/index";
import emitter from "@/utils/mitt-bus";
import storage from "storejs";
const [state, setState] = useBoolean();

const StoreKey = {
  Access: "access-control",
};

const DEFAULT_MODELS = [
  {
    name: "gpt-4",
    available: true,
  },
  {
    name: "gpt-4-0314",
    available: true,
  },
  {
    name: "gpt-4-0613",
    available: true,
  },
  {
    name: "gpt-4-32k",
    available: true,
  },
  {
    name: "gpt-4-32k-0314",
    available: true,
  },
  {
    name: "gpt-4-32k-0613",
    available: true,
  },
  {
    name: "gpt-3.5-turbo",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0301",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0613",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k-0613",
    available: true,
  },
  {
    name: "qwen-v1", // 通义千问
    available: false,
  },
  {
    name: "ernie", // 文心一言
    available: false,
  },
  {
    name: "spark", // 讯飞星火
    available: false,
  },
  {
    name: "llama", // llama
    available: false,
  },
  {
    name: "chatglm", // chatglm-6b
    available: false,
  },
];
const Settings = reactive({
  // Usage: {
  //   Title: "余额查询",
  //   SubTitle(used, total) {
  //     return `本月已使用 $${used}，订阅总额 $${total}`;
  //   },
  //   IsChecking: "正在检查…",
  //   Check: "重新检查",
  //   NoAccess: "输入 API Key 或访问密码查看余额",
  // },
  // AccessCode: {
  //   Title: "访问密码",
  //   SubTitle: "管理员已开启加密访问",
  //   Placeholder: "请输入访问密码",
  // },
  // Endpoint: {
  //   Title: "接口地址",
  //   SubTitle: "除默认地址外，必须包含 http(s)://",
  // },
  Model: {
    ID: "model",
    Title: "模型 (model)",
    SubTitle: "",
    defaultValue: "gpt-3.5-turbo",
    options: DEFAULT_MODELS,
  },
  Token: {
    ID: "token",
    Title: "API Key",
    SubTitle: "使用自己的 OpenAI API Key",
    Placeholder: "OpenAI API Key",
    defaultValue: process.env.VUE_APP_OPENAI_API_KEY || "",
    password: true,
  },
  Temperature: {
    ID: "temperature",
    Title: "随机性 (temperature)",
    SubTitle: "值越大，回复越随机",
    defaultValue: 0.6,
    Range: true,
    step: 0.1,
    min: 0,
    max: 1,
  },
  TopP: {
    ID: "top_p",
    Title: "核采样 (top_p)",
    SubTitle: "与随机性类似，但不要和随机性一起更改",
    defaultValue: 0.6,
    Range: true,
    step: 0.1,
    min: 0,
    max: 1,
  },
  MaxTokens: {
    ID: "max_tokens",
    Title: "单次回复限制 (max_tokens)",
    SubTitle: "单次交互所用的最大 Token 数",
    defaultValue: 1024,
    Number: true,
    min: 1024,
    max: 512000,
  },
  PresencePenalty: {
    ID: "presence_penalty",
    Title: "话题新鲜度 (presence_penalty)",
    SubTitle: "值越大，越有可能扩展到新话题",
    defaultValue: 0.6,
    Range: true,
    step: 0.1,
    min: 0,
    max: 2,
  },
  FrequencyPenalty: {
    ID: "frequency_penalty",
    Title: "频率惩罚度 (frequency_penalty)",
    SubTitle: "值越大，越有可能降低重复字词",
    defaultValue: 0.6,
    Range: true,
    step: 0.1,
    min: 0,
    max: 2,
  },
  HistoryCount: {
    ID: "history_count",
    Title: "附带历史消息数",
    SubTitle: "每次请求携带的历史消息数",
    defaultValue: 6,
    Range: true,
    step: 1,
    min: 0,
    max: 64,
  },
});
function handleClose(done) {
  done();
}
function handleCancel() {
  setState(false);
}
function handleConfirm() {
  setState(false);
  console.log(Settings);
  // console.log(Object.values(Settings));
  // storage.set(StoreKey.Access,)
  const data = Object.values(Settings).map((value) => {
    return { [value.ID]: value.defaultValue };
  });
  storage.set(StoreKey.Access, data);
  console.log(data);
}
emitter.on("onRobotBox", (state) => {
  setState(state);
});
</script>

<style lang="scss" scoped>
@mixin thumb() {
  appearance: none;
  height: 8px;
  width: 20px;
  background-color: rgb(29, 147, 171);
  border-radius: 10px;
  cursor: pointer;
  transition: all ease 0.3s;
  margin-left: 5px;
  border: none;
}
@mixin thumbHover() {
  transform: scaleY(1.2);
  width: 24px;
}
input[type="range"]::-webkit-slider-thumb {
  @include thumb();
}
input[type="range"]::-moz-range-thumb {
  @include thumb();
}
input[type="range"]::-ms-thumb {
  @include thumb();
}
input[type="range"]::-webkit-slider-thumb:hover {
  @include thumbHover();
}
input[type="range"]::-moz-range-thumb:hover {
  @include thumbHover();
}
input[type="range"]::-ms-thumb:hover {
  @include thumbHover();
}

.container {
  .list-item {
    color-scheme: light;
    user-select: none;
    color: #442c2c;
    justify-content: space-between;
    min-height: 40px;
    border-bottom: 1px solid #dedede;
    padding: 10px 20px;
    // animation: ui-lib_slide-in__1VMXW 0.6s ease;
    display: flex;
    align-items: center;
    .title {
      font-size: 14px;
      font-weight: bolder;
    }
    .subTitle {
      font-size: 12px;
      font-weight: 400;
    }
  }
}
.range {
  border: 1px solid #dedede;
  max-width: 40%;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    color: #303030;
    margin: 2px;
  }
}

input[type="number"],
input[type="text"],
input[type="password"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 10px;
  border: 1px solid #dedede;
  min-height: 36px;
  box-sizing: border-box;
  background: #fff;
  color: #303030;
  padding: 0 10px;
  max-width: 100%;
  font-family: inherit;
}
</style>
