<template>
  <div
    class="image_preview select-none"
    :class="self ? 'is-text-self' : 'is-text-other'"
    @click="geiPic(url)"
  >
    <el-image
      :src="url"
      @load="loadImg"
      :style="imgStyle"
      :preview-src-list="showCheckbox ? null : srcList"
      :hide-on-click-modal="true"
      :initial-index="index"
      :infinite="false"
      fit="cover"
    />
  </div>
</template>

<script setup>
import { toRefs } from "vue";
import { useState, useGetters } from "@/utils/hooks/useMapper";
import { showIMPic, getImageSize } from "../utils/utils";

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
const imgStyle = ref({});
const { message, self } = toRefs(props);
const { imgUrlList } = useGetters(["imgUrlList"]);
const { showCheckbox } = useState({
  showCheckbox: (state) => state.conversation.showCheckbox,
});

const url = message?.value.payload.imageInfoArray[0].url;

const index = imgUrlList.value.findIndex((item) => {
  return item == url;
});
async function initImageSize() {
  try {
    let width = message?.value.payload.imageInfoArray[1].width;
    let height = message?.value.payload.imageInfoArray[1].height;
    if (width > 0 && height > 0) {
      imgStyle.value = {
        width: showIMPic(width, height).width,
        height: showIMPic(width, height).height,
      };
    } else {
      const { width, height } = await getImageSize(url);
      imgStyle.value = {
        width: showIMPic(width, height).width,
        height: showIMPic(width, height).height,
      };
    }
  } catch (error) {
    const { width, height } = await getImageSize(url);
    imgStyle.value = {
      width: width + "px",
      height: height + "px",
    };
  }
}
initImageSize();

const srcList = imgUrlList.value;
const geiPic = async (url) => {
  console.log(message.value);
  console.log(imgStyle);
};
const loadImg = (e) => {
  console.log(e);
};
</script>

<style lang="scss" scoped>
.is-text-self {
  background: var(--self-msg-color);
}
.is-text-other {
  background: var(--other-msg-color);
}
.image_preview {
  width: fit-content;
  padding: 10px 14px;
  box-sizing: border-box;
  border-radius: 3px;
}
</style>
