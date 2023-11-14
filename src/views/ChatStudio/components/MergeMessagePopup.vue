<template>
  <el-dialog
    v-model="dialogVisible"
    :title="mergValue?.payload?.title"
    width="680px"
    align-center
    :before-close="handleClose"
  >
    <el-scrollbar always>
      <div class="merg-dialog">
        <div v-for="item in mergValue.payload.messageList" :key="item.ID">
          <NameComponent :item="item" />
          {{ formatTime(item.clientTime * 1000) }}
          <div :class="Megtype(item.messageBody[0].type)">
            <component
              :key="mergValue.ID"
              :is="loadMsgModule(item)"
              :msgType="mergValue.conversationType"
              :message="item.messageBody[0]"
            >
            </component>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel()">
          {{ $t("el.datepicker.cancel") }}
        </el-button>
        <el-button type="primary" @click="handleConfirm()">
          {{ $t("el.datepicker.confirm") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, computed, watch, nextTick } from "vue";
import emitter from "@/utils/mitt-bus";
import { useBoolean } from "@/utils/hooks/index";
import { formatTime } from "@/utils/common";
import NameComponent from "../components/NameComponent.vue";
import { Megtype, msgOne } from "../utils/utils";

import TextElemItem from "../ElemItemTypes/TextElemItem.vue";
import RelayElemItem from "../ElemItemTypes/RelayElemItem.vue";
import ImageElemItem from "../ElemItemTypes/ImageElemItem.vue";
import FileElemItem from "../ElemItemTypes/FileElemItem.vue";
import CustomElemItem from "../ElemItemTypes/CustomElemItem.vue";

const [dialogVisible, setDialogVisible] = useBoolean();
const mergValue = ref({});

const loadMsgModule = (item) => {
  try {
    const type = item.messageBody[0].type;
    const CompMap = {
      TIMTextElem: TextElemItem, //文本消息
      TIMRelayElem: RelayElemItem, // 合并转发消息
      TIMImageElem: ImageElemItem, // 图片消息
      TIMFileElem: FileElemItem, // 文件消息
      TIMCustomElem: CustomElemItem, // 自定义消息
    };
    return CompMap[type] || null;
  } catch (error) {
    console.error("[loadMsg] error", error);
    return null;
  }
};

function handleClose(done) {
  setDialogVisible(false);
  done();
}
function handleCancel() {
  setDialogVisible(false);
}
function handleConfirm() {
  setDialogVisible(false);
}
emitter.on("openMergePopup", (data) => {
  // payload
  mergValue.value = data;
  setDialogVisible(true);
});
</script>

<style lang="scss" scoped>
.merg-dialog {
  height: 400px;
}
</style>
