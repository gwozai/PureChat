<template>
  <div
    v-show="!isMobile"
    class="full"
    @click="toggle"
    :title="isFullscreen ? $t('common.exitfullScreen') : $t('common.openFullScreen')"
  >
    <FontIcon iconName="FullScreen" class="icon-hover" />
  </div>
</template>

<script setup>
import { isMobile } from "@/utils/common";
import { useFullscreen } from "@vueuse/core";
const { isFullscreen, toggle } = useFullscreen();
</script>

<style lang="scss" scoped>
.full {
  width: 30px;
  cursor: pointer;
  @include flex-center;
}
</style>
