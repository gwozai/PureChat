<template>
  <span :class="['label', labelClass()]">
    <!-- <span class="all" v-show="props.isall">全员</span> -->
    <svg-icon iconClass="robot" v-show="/^R\d{5}$/.test(userID)" />
  </span>
</template>

<script setup>
import { deepClone } from "@/utils/clone";
import { ref, toRefs, onMounted } from "vue";

// eslint-disable-next-line no-undef
const props = defineProps({
  userID: {
    type: String,
    default: "",
  },
  isall: {
    type: Boolean,
    default: true,
  },
});

const { userID, isall } = toRefs(props);
const labelClass = (data) => {
  return "";
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";
.label {
  padding: 0px 2.5px;
  margin: 1px 0 0 4px;
  text-align: center;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 400;
  // position: absolute;
  svg {
    stroke: unset;
  }
  .all {
    @include ellipsisBasic(1);
  }
}
</style>
