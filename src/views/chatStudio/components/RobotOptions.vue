<template>
  <el-dialog v-model="state" width="750px" align-center :before-close="handleClose">
    <div>
      <ul class="container">
        <li class="list-item" v-for="(item, index) in modelData" :key="item.ID">
          <div>
            <div class="title">{{ item.Title }}</div>
            <div class="subTitle">{{ item.SubTitle }}</div>
          </div>
          <!-- 模型 -->
          <el-select v-if="item.options" v-model="item.defaultValue" placeholder="Select">
            <el-option
              v-for="item in item.options"
              v-show="item.available && item.provider.convId == toAccount"
              :key="item.name"
              :label="item.name + `(${item.provider.providerName})`"
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
import { StoreKey, modelValue, useAccessStore } from "@/api/openai/constant";
import { getModelType } from "@/utils/chat/index";
import { useBoolean } from "@/utils/hooks/index";
import { useGetters } from "@/utils/hooks/useMapper";
import storage from "@/utils/localforage/index";
import emitter from "@/utils/mitt-bus";
import { cloneDeep } from "lodash-es";
import { ref } from "vue";
import { useStore } from "vuex";

const { commit } = useStore();
const [state, setState] = useBoolean();
const modelData = ref(null);

const { toAccount } = useGetters(["toAccount"]);

function initModel() {
  const model = getModelType(toAccount.value);
  const value = cloneDeep(modelValue[model]);
  Object.values(value).map((v) => {
    return (v.defaultValue = useAccessStore(model)[v.ID]);
  });
  modelData.value = value;
}
function handleClose(done) {
  done();
}
function storeRobotModel(model) {
  const access = storage.get(StoreKey.Access);
  const account = getModelType(toAccount.value);
  if (access) {
    storage.set(StoreKey.Access, { ...access, [account]: { ...model } });
  } else {
    storage.set(StoreKey.Access, { [account]: { ...model } });
  }
  commit("setRobotModel", model.model);
}
// 重置
function handleCancel() {
  storage.remove(StoreKey.Access);
  setState(false);
}
// 保存
function handleConfirm() {
  setState(false);
  const model = {};
  Object.values(modelData.value).map((t) => {
    model[t.ID] = t.defaultValue;
  });
  storeRobotModel(model);
}
emitter.on("onRobotBox", (state) => {
  initModel();
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
    color: var(--color-text-default);
    justify-content: space-between;
    min-height: 40px;
    border-bottom: 1px solid #dedede;
    padding: 10px 20px;
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
    .el-select {
      max-width: 197px;
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
}
input[type="range"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: var(--color-range);
  color: #303030;
  margin: 2px;
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
