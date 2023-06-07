<template>
  <div class="reply-box" v-show="currentReplyMsg">
    <el-icon class="close" @click="onClose"><CircleCloseFilled /></el-icon>
    <div class="reply-box-content">
      <div>{{ currentReplyMsg.nick }} :</div>
      <div>
        {{ currentReplyMsg.payload.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, computed, watch, nextTick } from "vue";
import { useState, useGetters } from "@/utils/hooks/useMapper";
import { useStore } from "vuex";

const { state, dispatch, commit } = useStore();
const { currentReplyMsg } = useState({
  currentReplyMsg: (state) => state.conversation.currentReplyMsg,
});
const onClose = () => {
  commit("setReplyMsg", null);
};
</script>

<style lang="scss" scoped>
.reply-box {
  height: 60px;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  .reply-box-content {
    border-left: 3px solid #ccc;
    padding-left: 10px;
    color: #666;
    margin-bottom: 10px;
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
</style>
