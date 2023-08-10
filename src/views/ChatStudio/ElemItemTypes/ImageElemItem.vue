<template>
  <div class="image_preview" @click="geiPic(url)">
    <el-image
      :src="url"
      :preview-src-list="showCheckbox ? null : srcList"
      :hide-on-click-modal="true"
      :initial-index="index"
      fit="cover"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useState } from "@/utils/hooks/useMapper";

const props = defineProps({
  message: {
    type: Object,
    default: null,
  },
});
const { message } = props;
const { showCheckbox } = useState({
  showCheckbox: (state) => state.conversation.showCheckbox,
});

const index = ref(0);
const url = message.payload.imageInfoArray[0].url;
const srcList = [];
srcList.push(url);

const geiPic = async (url) => {
  console.log(url);
};
</script>

<style lang="scss" scoped>
.image_preview {
  width: fit-content;
  max-width: 140px;
  padding: 10px 14px;
  box-sizing: border-box;
  border-radius: 3px;
}
</style>
