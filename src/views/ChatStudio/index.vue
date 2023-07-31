<template>
  <div class="h-full w-full flex">
    <!-- 侧边栏 -->
    <Sidebar />
    <component v-if="Component[outside]" :is="Component[outside]" />
  </div>
</template>

<script setup>
import {
  ref,
  onActivated,
  onDeactivated,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  watch,
  nextTick,
} from "vue";
import { useState, useGetters } from "@/utils/hooks/useMapper";
import { useStore } from "vuex";

import Sidebar from "./Sidebar.vue";
import application from "./application.vue";
import document from "./document.vue";
import mailList from "./mailList.vue";
import news from "./news.vue";
import test from "./test.vue";

const { state, dispatch, commit } = useStore();
const Component = {
  test: test,
  news: news,
  application: application,
  Document: document,
  mail_list: mailList,
};
const { networkStatus, conver, outside, groupDrawer, showMsgBox, conversationList } = useState({
  outside: (state) => state.conversation.outside,
  networkStatus: (state) => state.conversation.networkStatus,
  conver: (state) => state.conversation.currentConversation,
  showMsgBox: (state) => state.conversation.showMsgBox,
  groupDrawer: (state) => state.groupinfo.groupDrawer,
  conversationList: (state) => state.conversation.conversationList,
});
</script>

<style lang="scss" scoped></style>
