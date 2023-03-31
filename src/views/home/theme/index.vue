<template>
  <div :class="['app-wrapper', sidebar ? '' : 'style-wrapper']" :style="fnStyle(isActive)">
    <!-- v-resize -->
    <Header />
    <main class="app-main">
      <div class="continer-theme">
        <!-- :include="['editor']" name="Welcome" route-->
        <router-view v-slot="{ Component, route }" :key="$route.fullPath">
          <!-- {{ fn(Component, route) }} -->
          <transition name="fade-transform" mode="out-in">
            <keep-alive v-if="$route.meta.keep" max="3">
              <component v-if="Component" :is="Component" :key="route.path" />
              <component v-else :is="fn(route)" />
            </keep-alive>
            <template v-else>
              <component v-if="Component" :is="Component" :key="route.path" />
              <component v-else :is="fn(route)" />
            </template>
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, reactive, defineAsyncComponent } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useState } from "@/utils/hooks/useMapper";
import Header from "./Header.vue";
import elementResizeDetectorMaker from "element-resize-detector";
import emitter from "@/utils/mitt-bus";
import Welcome from "@/views/welcome/index";
import ChatStudio from "@/views/ChatStudio/index";
import About from "@/views/about/index";

const route = useRoute();
const router = useRouter();
const { state, dispatch, commit } = useStore();

const { isActive, sidebar } = useState({
  isActive: (state) => state.settings.isCollapse,
  sidebar: (state) => state.settings.sidebar,
});
const erd = elementResizeDetectorMaker({
  strategy: "scroll",
});
const compMap = {
  home: Welcome,
  chatStudio: ChatStudio,
  about: About,
};
const fn = (route) => {
  console.log(route);
  console.log(route.name);
  if (route?.name) return compMap[route.name];
};
const VResize = {
  mounted(el, binding, vnode) {
    erd.listenTo(el, (elem) => {
      const width = elem.offsetWidth;
      const height = elem.offsetHeight;
      if (binding?.instance) {
        emitter.emit("resize", { detail: { width, height } });
      } else {
        vnode.el.dispatchEvent(new CustomEvent("resize", { detail: { width, height } }));
      }
    });
  },
  unmounted(el) {
    erd.uninstall(el);
  },
};
emitter.on("resize", ({ detail }) => {
  const { width } = detail;
  /** width app-wrapper类容器宽度
   * 0 < width <= 760 隐藏侧边栏
   * 760 < width <= 990 折叠侧边栏
   * width > 990 展开侧边栏
   */
  console.log(detail);
  if (width > 0 && width <= 760) {
    // toggle("mobile", false);
  } else if (width > 760 && width <= 990) {
    // toggle("desktop", false);
  } else if (width > 990) {
    // toggle("desktop", true);
    // commit("updateSettings", {
    //   key: "sidebar",
    //   value: true,
    // });
  }
});

const fnStyle = (off) => {
  return `margin-left:${off ? "64px" : "200px"}`;
};
</script>
<style lang="scss" scoped>
.style-wrapper {
  margin: 0 !important;
}
.app-wrapper {
  width: 100%;
}
.continer-theme {
  height: 100%;
  background: var(--color-body-bg);
}
.app-main {
  // padding-top: 86px;
  // height: 100vh;
  height: calc(100vh - 86px);
  // margin-top: 86px;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  background: #f0f2f5;
  box-sizing: border-box;
}
</style>
