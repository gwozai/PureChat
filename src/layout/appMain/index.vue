<template>
  <div :class="['app-wrapper']">
    <main class="app-main">
      <div class="continer-theme">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-slide" :appear="true" mode="out-in">
            <keep-alive v-if="route.meta.keep" max="1">
              <component v-if="Component" :is="Component" :key="route.path" />
            </keep-alive>
            <template v-else>
              <component v-if="Component" :is="Component" :key="route.path" />
            </template>
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup></script>
<style lang="scss" scoped>
.app-wrapper {
  width: 100%;
  transition-duration: 300ms;
}
.continer-theme {
  height: 100%;
  background: var(--color-body-bg);
}
.app-main {
  height: 100vh;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  background: #f0f2f5;
  box-sizing: border-box;
}
</style>
