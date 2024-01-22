<template>
  <div class="manView">
    <div class="flex h-full w-full view">
      <!-- 侧边栏 -->
      <SideBar />
      <!-- 主体 -->
      <Theme />
      <!-- 设置 -->
      <Setup />
    </div>
  </div>
</template>

<script setup>
import Theme from "./theme/index.vue";
import SideBar from "./SideBar/index.vue";
import Setup from "./setup/index.vue";
</script>
<style lang="scss" scoped>
.manView {
  width: 100%;
  // height: 100%;
  .view {
    position: relative;
  }
}
</style>
