<template>
  <span :class="['label', getLabel(data).className]" v-show="getLabel(data).show">
    <!-- {{ getLabel(data).label }} -->
    <svg-icon iconClass="robot" />
  </span>
</template>

<script setup>
import { toRefs } from "vue";

// eslint-disable-next-line no-undef
const props = defineProps({
  data: {
    type: String,
    default: "",
  },
});
const { data } = toRefs(props);

const reg = /^R\d{5}$/;

const getLabel = (data) => {
  let show = false;
  let label = "";
  let className = "";
  // 大写R开头 后五位是数字
  if (reg.test(data)) {
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
  border-radius: 2px;
  font-size: 10px;
  font-weight: 400;
  svg {
    stroke: unset;
  }
}
// .all {}

.robot {
  // color: rgb(84, 180, 239);
  // border: 0.64px solid #c6e2ff;
}
</style>
