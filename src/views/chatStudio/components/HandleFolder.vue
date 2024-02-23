<template>
  <template>
    <!-- <FontIcon @click.stop="handleDownload" class="download" iconName="Download" /> -->
    <!-- <FontIcon @click.stop="handleOpenFolder" class="opened" iconName="FolderOpened" /> -->
  </template>
</template>

<script setup>
function handleDownload() {
  console.log("download");
}
function handleOpenFolder() {
  console.log("openFolder");
}
</script>

<style lang="scss" scoped>
.opened,
.download {
  position: absolute;
  right: 0;
  bottom: 0;
  opacity: 0.7;
}
</style>
