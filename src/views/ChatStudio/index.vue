<template>
  <div class="h-full w-full flex">
    <!-- 侧边栏 -->
    <Sidebar />
    <component v-if="Component[outside]" :is="Component[outside]" />
  </div>
</template>

<script setup>
import { useState, useGetters } from "@/utils/hooks/useMapper";

import Sidebar from "./Sidebar.vue";
import application from "./application.vue";
import document from "./document.vue";
import mailList from "./mailList.vue";
import news from "./news.vue";
import test from "./test.vue";

const Component = {
  news: news, // 消息
  application: application, // 应用
  Document: document, //文档
  mail_list: mailList, //同通讯录
  test: test, // 测试
};
const { outside } = useState({
  outside: (state) => state.conversation.outside,
});
</script>

<style lang="scss" scoped></style>
