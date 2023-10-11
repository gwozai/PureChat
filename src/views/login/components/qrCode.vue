<template>
  <Motion>
    <div class="flex justify-center">
      <!-- <QrCode /> -->
      <Character />
    </div>
  </Motion>
  <Motion :delay="100">
    <el-divider>
      <p class="m-0">{{ $t("login.tip") }}</p>
    </el-divider>
  </Motion>
  <Motion :delay="150">
    <el-button class="w-full mt-4" @click="commit('SET_CURRENTPAGE', 0)">
      {{ $t("login.back") }}
    </el-button>
  </Motion>
</template>

<script setup>
import { ref, reactive, toRefs, computed, watch, nextTick } from "vue";
import Motion from "@/utils/motion";
import { useStore } from "vuex";
import Character from "./Character.vue";
const { state, dispatch, commit } = useStore();
</script>

<style lang="scss" scoped></style>
