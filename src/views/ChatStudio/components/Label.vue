<template>
  <span :class="['label', getLabel(data).className]" v-if="getLabel(data).show">
    {{ getLabel(data).label }}
  </span>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const { data } = toRefs(props);
console.log(data.value);

const getLabel = (data) => {
  let show = false;
  let label = "";
  let className = "";
  const id = data;

  if (id == "R00001") {
    show = true;
    label = "机器人";
    className = "robot";
  }
  return { show, label, className };
};
</script>

<style lang="scss" scoped>
.label {
  padding: 0px 2.5px;
  margin: 1px 0 0 4px;
  text-align: center;
  height: 17px;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 400;
  width: fit-content;
  font-family: MicrosoftYaHei;
  line-height: 17px;
}
.all {
  color: #faad14;
  border: 0.64px solid #ffe58f;
  background: #fffbe6;
}
.robot {
  color: #ffa39e;
  border: 0.64px solid rgba(255, 163, 158, 1);
  background: #fff1f0;
}
</style>
