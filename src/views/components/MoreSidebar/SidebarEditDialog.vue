<template>
  <el-dialog
    ref="editRef"
    :modal="true"
    v-model="showdialog"
    :append-to-body="true"
    title="导航栏编辑"
    width="450px"
  >
    <div class="draggable flex">
      <div class="container" v-for="item in list" :key="item.title">
        <p class="text left-text">{{ item.title }}</p>
        <div class="edit-area" :class="item.class">
          <!-- v-show="item.class == 'left-edit-area'" -->
          <draggable
            class="dragArea list-group w-full"
            :list="outsideList"
            tag="transition-group"
            filter=".fixed"
            :move="onMove"
            @remove="onRemove"
            @start="onStart"
            @end="onEnd"
            :group="fnSelect(item.group)"
            ghostClass="ghost"
            dragClass="chosen"
            animation="300"
          >
            <template v-for="element in fnSelect(item.type)" :key="element.only">
              <div class="list-group-item" :class="element?.class">
                <!-- 删除 -->
                <FontIcon iconName="RemoveFilled" class="reduce" @click="reduce(element)" />
                <!-- 添加 -->
                <FontIcon iconName="CirclePlusFilled" class="add" @click="increase(element)" />
                <FontIcon
                  v-if="element?.type == 'el-icon'"
                  :iconName="element.icon"
                  class="style-svg"
                />
                <svg-icon v-else :iconClass="element.icon" class="style-svg" />
                <span>{{ element.title }}</span>
                <FontIcon iconName="Rank" class="rank" />
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
import { defineComponent } from "vue";
import emitter from "@/utils/mitt-bus";
import { mapState } from "vuex";
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
          button: "reduce",
          type: "leftEdit",
          group: "outsideGroup", // 用于分组，同一组的不同list可以相互拖动
        },
        {
          class: "right-edit-area",
          title: "更多",
          button: "add",
          type: "rightEdit",
          group: "insideGroup",
        },
      ],
      outsideGroup: {
        name: "draggable",
        put: true,
        pull: true,
      },
      insideGroup: {
        name: "draggable",
        put: true,
        pull: (e) => {
          if (e.el.id == "right") return;
          console.log(e);
          return true;
        },
      },
      showdialog: false,
      enabled: true,
      dragging: false,
    };
  },
  computed: {
    ...mapState({
      outsideList: (state) => state.sidebar.outsideList,
      moreList: (state) => state.sidebar.moreList,
    }),
    leftEdit() {
      return this.outsideList.filter((t) => t.only !== "more");
    },
    rightEdit() {
      return this.moreList;
    },
  },
  mounted() {
    emitter.on("SidebarEditDialog", (val) => {
      this.setDialog(val);
    });
  },
  methods: {
    onRemove(e) {
      console.log(e);
    },
    onStart() {},
    onEnd() {
      console.log(this.outsideList);
      console.log(this.moreList);
    },
    fnSelect(type) {
      return this[type];
    },
    reduce(item) {
      console.log(item);
    },
    increase(item) {
      console.log(item);
    },
    onMove(e) {
      if (e.relatedContext.element.if_fixed == 1) return false;
      return true;
    },
    handleConfirm() {
      this.showdialog = false;
    },
    handleCancel() {
      this.showdialog = false;
    },
    setDialog(flg) {
      this.showdialog = flg;
    },
  },
});
</script>

<style lang="scss" scoped>
.left-edit-area {
  .add {
    display: none;
  }
  .reduce {
    color: #f44336;
  }
}
.right-edit-area {
  .reduce {
    display: none;
  }
  .add {
    color: #1890ff;
  }
}
.style-svg {
  margin-right: 10px;
}
.draggable {
  justify-content: space-between;
  .container {
    border-radius: 4px;
    width: 195px;
  }
  .edit-area {
    background-color: #f5f5f5;
    .chosen {
      background-color: white;
      color: black;
    }
    .ghost {
      opacity: 0 !important;
    }
  }
  .fixed {
    opacity: 0.5;
    cursor: not-allowed !important;
    .svg-icon {
      cursor: not-allowed;
    }
  }
  .list-group-item {
    padding: 0 20px;
    display: flex;
    height: 45px;
    align-items: center;
    cursor: pointer;
    .el-icon {
      font-size: 17px;
      margin-right: 5px;
    }
    .rank {
      margin-left: auto;
    }
  }
}
</style>
