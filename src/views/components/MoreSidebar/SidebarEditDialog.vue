<template>
  <el-dialog
    ref="editRef"
    :modal="false"
    v-model="showdialog"
    :append-to-body="true"
    title="导航栏编辑"
    width="450px"
  >
    <div class="draggable">
      <div class="container" v-for="(item, index) in list" :key="item.title">
        <p class="text left-text">{{ item.title }}</p>
        <div class="edit-area" :class="item.class">
          <draggable
            class="dragArea list-group w-full"
            :list="outsideList"
            tag="transition-group"
            @change="log"
          >
            <template v-for="element in outsideList" :key="element.icon">
              <div class="list-group-item" :class="element?.class">
                <el-icon><RemoveFilled /></el-icon>
                {{ element.title }}
                <el-icon><Rank /></el-icon>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel"> 取消 </el-button>
        <el-button type="primary" @click="handleConfirm"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  ref,
  defineComponent,
  reactive,
  toRefs,
  defineProps,
  computed,
  watch,
  nextTick,
} from "vue";
import emitter from "@/utils/mitt-bus";
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
import { VueDraggableNext } from "vue-draggable-next";
export default defineComponent({
  components: {
    draggable: VueDraggableNext,
  },
  data() {
    return {
      list: [
        {
          class: "left-edit-area",
          title: "显示在导航栏上",
        },
        {
          class: "right-edit-area",
          title: "更多",
        },
      ],
      showdialog: false,
      enabled: true,
      dragging: false,
    };
  },
  computed: {
    ...mapState({
      outsideList: (state) => state.sidebar.outsideList,
    }),
    myList: {
      get() {
        return this.outsideList;
      },
      set(value) {
        console.log(value);
        // this.$store.dispatch("updateOutsideList", value);
      },
    },
  },
  mounted() {
    emitter.on("SidebarEditDialog", (val) => {
      this.showdialog = val;
    });
  },
  methods: {
    handleConfirm() {
      this.showdialog = false;
    },
    handleCancel() {
      this.showdialog = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.draggable {
  display: flex;
  justify-content: space-between;
  .container {
    border-radius: 4px;
    width: 195px;
  }
  .edit-area {
    background-color: #f5f5f5;
  }
  .fixed {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .list-group-item {
    margin: 0 20px;
    display: flex;
    height: 45px;
    align-items: center;
    .el-icon {
      font-size: 17px;
      margin-right: 5px;
    }
  }
}
</style>
