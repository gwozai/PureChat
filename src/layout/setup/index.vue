<template>
  <el-dialog class="setup-modal" v-model="drawer" :show-close="false" width="700" draggable>
    <div class="ui-modal-body">
      <List />
      <ItemGrid />
    </div>
    <ul class="setting w-full" v-if="false">
      <li>
        <span>{{ t("common.theme") }}</span>
        <el-select v-model="themecolor" placeholder="主题颜色">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </li>
      <li>
        <span>{{ t("common.language") }}</span>
        <el-select v-model="language" placeholder="选择语言">
          <el-option
            v-for="item in languages"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </li>
      <li>
        <span>{{ t("common.watermark") }}</span>
        <el-switch
          v-model="mark"
          inline-prompt
          inactive-color="#a6a6a6"
          :active-icon="Check"
          :inactive-icon="Close"
        />
      </li>
      <li>
        <el-button class="logout" @click="logout" type="primary">退出登录</el-button>
      </li>
    </ul>
  </el-dialog>
</template>

<script setup>
import { setTheme } from "@/utils/common";
import { useState } from "@/utils/hooks/useMapper";
import { useWatermark } from "@/utils/hooks/useWatermark";
import { showConfirmationBox } from "@/utils/message";
import { Check, Close } from "@element-plus/icons-vue";
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { languages, options } from "./enums";
import ItemGrid from "./itemGrid.vue";
import List from "./list.vue";

const { locale, t } = useI18n();
const { commit, dispatch } = useStore();
const { setWatermark, clear } = useWatermark();
const { appearance, lang, setswitch, watermark } = useState({
  watermark: (state) => state.settings.watermark,
  appearance: (state) => state.settings.appearance,
  setswitch: (state) => state.settings.setswitch,
  lang: (state) => state.settings.lang,
});

async function logout() {
  const result = await showConfirmationBox({ message: "确定退出登录?", iconType: "warning" });
  if (result === "cancel") return;
  drawer.value = false;
  dispatch("LOG_OUT");
}

onMounted(() => {
  clear();
  watermark.value && setWatermark("PureChat");
});

const drawer = computed({
  get() {
    return setswitch.value;
  },
  set(val) {
    commit("UPDATE_USER_SETUP", {
      key: "setswitch",
      value: false,
    });
  },
});

const themecolor = computed({
  get() {
    return appearance.value;
  },
  set(val) {
    commit("UPDATE_USER_SETUP", {
      key: "appearance",
      value: val,
    });
    setTheme(val);
  },
});

const language = computed({
  get() {
    return lang.value;
  },
  set(val) {
    commit("UPDATE_USER_SETUP", {
      key: "lang",
      value: val,
    });
    locale.value = val;
  },
});

const mark = computed({
  get() {
    return watermark.value;
  },
  set(val) {
    commit("UPDATE_USER_SETUP", {
      key: "watermark",
      value: val,
    });
    if (val) {
      setWatermark("PureChat");
    } else {
      clear();
    }
  },
});
</script>

<style lang="scss" scoped>
:global(body .setup-modal) {
  padding: 0;
}
:global(body .setup-modal .el-dialog__header) {
  display: none;
}

.ui-modal-body {
  height: 500px;
  display: flex;
}
.setting {
  height: 500px;
}
.setting li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;

  .el-select {
    max-width: 180px;
  }
}
.logout {
  margin-left: auto;
}
</style>
