<template>
  <div class="toolbar">
    <!-- 表情包 -->
    <el-popover
      ref="popoverRef"
      placement="top-start"
      popper-class="style-emo"
      :show-arrow="false"
      :width="200"
      :teleported="false"
      trigger="click"
    >
      <template #reference>
        <span class="emoticon" title="选择表情" ref="buttonRef" v-click-outside="onClickOutside">
          <svg-icon iconClass="iconxiaolian" class="icon-hover" />
        </span>
      </template>
      <div class="emojis">
        <div v-for="item in emojiName" class="emoji" :key="item" @click="SelectEmoticon(item)">
          <img :src="emojiUrl + emojiMap[item]" :title="item" />
        </div>
      </div>
    </el-popover>
    <!-- 图片 -->
    <span class="" title="图片" @click="SendImageClick">
      <svg-icon iconClass="icontupian" class="icon-hover" />
    </span>
    <!-- 文件 -->
    <span class="" title="文件" @click="SendFileClick">
      <svg-icon iconClass="iconwenjianjia" class="icon-hover" />
    </span>
    <!-- 截图 -->
    <span class="" title="截图" @click="clickCscreenshot" v-if="false">
      <svg-icon iconClass="iconjietu" class="icon-hover" />
    </span>
    <!-- 滚动到底部 -->
    <span class="chat_chat-input-action" title="滚动到底部" @click="onTobBottom" v-show="tobottom">
      <el-icon class="svg-left icon-hover">
        <DArrowLeft />
      </el-icon>
    </span>
    <input
      type="file"
      id="imagePicker"
      ref="imagePicker"
      accept=".jpg, .jpeg, .png, .gif, .bmp"
      @change="sendImage"
      hidden
    />
    <input type="file" id="filePicker" ref="filePicker" @change="sendFile" hidden />
    <!-- <input
      type="file"
      id="videoPicker"
      ref="videoPicker"
      @change="sendVideo"
      accept=".mp4"
      hidden
    /> -->
  </div>
</template>

<script setup>
import emitter from "@/utils/mitt-bus";
import { ref, unref, toRefs, defineEmits } from "vue";
import { emojiName, emojiUrl, emojiMap, localemojiUrl } from "@/utils/emoji-map";
import { ClickOutside as vClickOutside } from "element-plus";
import { useStore } from "vuex";

const tobottom = ref();
const buttonRef = ref();
const popoverRef = ref();
const imagePicker = ref();
const filePicker = ref();
const visible = ref(false);
const { state, dispatch, commit } = useStore();
const emit = defineEmits(["setEmoj", "setPicture", "setParsefile"]);

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.();
};
const SelectEmoticon = (item) => {
  let url = emojiUrl + emojiMap[item];
  emit("setToolbar", {
    data: {
      url,
      item,
    },
    key: "setEmoj",
  });
  unref(popoverRef).hide();
};
const SendImageClick = () => {
  let $el = imagePicker.value;
  $el.value = null;
  $el.click();
};
const SendFileClick = () => {
  let $el = filePicker.value;
  $el.click();
};
const clickCscreenshot = () => {};

async function sendImage(e) {
  emit("setToolbar", {
    data: {
      files: e.target.files[0],
    },
    key: "setPicture",
  });
}
async function sendFile(e) {
  emit("setToolbar", {
    data: {
      files: e.target.files[0],
    },
    key: "setParsefile",
  });
}
const onTobBottom = () => {
  commit("updataScroll");
};
emitter.on("onisbot", (state) => {
  tobottom.value = !state;
});
</script>
<style>
.style-emo {
  z-index: 9999 !important;
  width: auto !important;
}
</style>
<style lang="scss" scoped>
.chat_chat-input-action {
  cursor: pointer;
  animation: chat_slide-in 0.3s ease;
}

@keyframes chat_slide-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.toolbar {
  height: 40px;
  padding: 0 5px;
  display: flex;
  & > span {
    width: 42px;
    align-items: center;
    justify-content: center;
    display: flex;
    height: 40px;
    padding: 4px;
    position: relative;
    text-align: center;
    color: #808080;
  }
}
.emojis,
.lately-emoji {
  width: 400px;
  height: 202px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-y: scroll;
  .emoji {
    img {
      width: 30px;
      height: 30px;
    }
  }
}
.lately-emoji {
  width: 125px;
  height: 140px;
}
::-webkit-scrollbar {
  display: none;
}
</style>
