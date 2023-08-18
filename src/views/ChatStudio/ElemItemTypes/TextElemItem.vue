<template>
  <div class="message-view__item--text" @click="onClick(message)">
    <template v-if="message.conversationType == 'GROUP' || 'C2C'">
      <!-- 回复消息 -->
      <ReplyElem
        v-if="message.cloudCustomData"
        :originalMsg="message.cloudCustomData && JSON.parse(message.cloudCustomData)"
      />
      <template v-for="item in decodeText(message.payload.text)" :key="item">
        <!-- // linkUrl: verifyLink(item.text) -->
        <!-- <span v-if="item.name === 'text'" class="text-erase">
          <analysis-url :text="item.text" />
        </span> -->
        <!-- 文本擦除效果 -->
        <div v-if="item.name === 'text'" class="text-erase">
          <analysis-url :text="item.text" />
          <p class="eraser" v-if="!self && isRobot">
            <span class="text"><analysis-url :text="item.text" /></span>
          </p>
        </div>
        <img v-else-if="item.name === 'img'" class="emoji" :src="item.src" alt="表情包" />
      </template>
    </template>
  </div>
</template>

<script setup>
import { decodeText } from "@/utils/decodeText";
import { toRefs, h } from "vue";
import ReplyElem from "./ReplyElem.vue";
import AnalysisUrl from "../components/AnalysisUrl.vue";
const props = defineProps({
  message: {
    type: Object,
    default: null,
  },
  self: {
    type: Boolean,
    default: false,
  },
});
const { message, self } = toRefs(props);

const isRobot = message.value.from == "R00001";

const onClick = (data) => {
  console.log(data);
};
</script>

<style lang="scss" scoped>
.message-view__item--text {
  width: fit-content;
  padding: 10px 14px;
  max-width: 360px;
  padding: 10px 14px;
  box-sizing: border-box;
  border-radius: 3px;
  word-break: break-all;
  white-space: pre-wrap;
}
.text-erase {
  position: relative;
  display: inline-block;
  p {
    margin: 0;
  }
  .eraser {
    position: absolute;
    left: 0;
    top: 0;
    .text {
      --p: 5%;
      background: linear-gradient(to right, #0000 var(--p), #f0f2f5 calc(var(--p) + 100px));
      color: transparent;
      animation: erase 5s forwards;
    }
  }
}
@property --p {
  syntax: "<percentage>";
  initial-value: 5%;
  inherits: false;
}

@keyframes erase {
  to {
    --p: 100%;
  }
}
.emoji {
  width: 24px;
  vertical-align: bottom;
}
</style>
