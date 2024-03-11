<template>
  <div class="select-none" :class="['fixed-header', sidebar ? 'style-fixed' : '']">
    <div class="navbar">
      <div class="flex">
        <div
          class="container"
          :title="isActive ? '点击展开' : '点击折叠'"
          @click="toggleClick(isActive)"
        >
          <FontIcon class="icon-hover" :iconName="isActive ? 'Expand' : 'Fold'" />
        </div>
        <el-breadcrumb>
          <el-breadcrumb-item v-for="item in breadcrumbItems" :key="item.title">
            {{ item.locale ? $t(`route.${item.locale}`) : item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="arrow-setup">
        <Fullscreen />
        <div class="user">
          <el-dropdown>
            <span class="el-dropdown-link">
              <UserAvatar type="self" :size="28" />
              <p>{{ userProfile.nick }}</p>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="topersonal">
                  <FontIcon iconName="user" />
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item @click="Logout">
                  <FontIcon iconName="switch-button" />
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="setup" @click="opensetup(setswitch)">
          <FontIcon class="icon-hover" iconName="setting" />
        </div>
      </div>
    </div>
    <Tags />
    <el-drawer v-model="drawer" :direction="'ltr'" size="200px" :with-header="false">
      <SideBar :vislbile="true" />
    </el-drawer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SideBar from "../sideBar/index.vue";
import { showConfirmationBox } from "@/utils/message";
import Fullscreen from "./Fullscreen.vue";
import Tags from "./Tags.vue";

export default {
  name: "Header",
  components: {
    Fullscreen,
    SideBar,
    Tags,
  },
  computed: {
    ...mapState({
      userProfile: (state) => state.user.currentUserProfile,
      tags: (state) => state.data.elTag,
      sidebar: (state) => !state.settings.sidebar,
      isActive: (state) => state.settings.isCollapse,
      setswitch: (state) => state.settings.setswitch,
    }),
    breadcrumbItems() {
      return this.$route.matched.map((t) => t.meta);
    },
  },
  data() {
    return {
      drawer: false,
    };
  },
  watch: {
    $route: {
      handler(val) {
        this.getBreadcrumb(val.path);
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  methods: {
    getBreadcrumb(value) {
      const { name, meta } = this.$route;
      const { title, locale } = meta;
      const label = this.tags;
      let index = -1;
      if (label) {
        index = label.findIndex((t) => {
          return t?.title === title;
        });
      }
      const tag = label
        ? [{ title, path: value, name, locale }, ...label]
        : [{ title, path: value, name }];
      if (index === -1) {
        console.log(this.tags);
        this.$store.commit("UPDATE_USER_INFO", { key: "elTag", value: tag });
      }
    },
    toggleClick(val) {
      if (this.sidebar) this.drawer = true;
      commit("UPDATE_USER_SETUP", {
        key: "isCollapse",
        value: this.sidebar ? false : !val,
      });
    },
    async Logout() {
      const message = { message: "确定退出登录?", iconType: "warning" };
      const result = await showConfirmationBox(message);
      if (result == "cancel") return;
      this.$store.dispatch("LOG_OUT");
    },
    opensetup() {
      this.$store.commit("UPDATE_USER_SETUP", {
        key: "setswitch",
        value: true,
      });
    },
    topersonal() {
      this.$router.push({ name: "personal" });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  padding: 0 15px;
  line-height: 48px;
  height: 100%;
  display: flex;
  align-items: center;
}
.style-fixed {
  width: 100% !important;
}
.fixed-header {
  z-index: 10;
  position: relative;
  transition: width 0.1s;
  background: var(--color-body-bg);
}
.cursor-w {
  cursor: w-resize;
}

.navbar {
  display: flex;
  height: 48px;

  .arrow-setup {
    flex: 1;
    color: #00000073;
    display: flex;
    justify-content: right;
    align-items: center;

    .setup {
      width: 40px;
      text-align: center;
      border-left: 1px solid #ccc;
    }
    .user :deep(.el-dropdown-link) {
      display: flex;
      align-items: center;
      padding: 0 10px;
      cursor: pointer;
      .el-avatar {
        margin-right: 10px;
      }
    }
  }
}

.el-breadcrumb {
  font-size: 14px;
  line-height: 48px;
  height: 100%;
  overflow: hidden;
  min-width: 130px;
  .breadcrumb__item {
    display: flex;
    align-items: center;
  }
}
</style>
