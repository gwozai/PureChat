<template>
  <div class="checkbox-style" id="svgDown" v-if="showCheckbox">
    <el-icon class="close" @click="onClose"><CircleCloseFilled /></el-icon>
    <div v-for="item in buttonList" :key="item.icon">
      <div class="icon" @click="onClock(item)">
        <svg-icon :iconClass="item.icon" />
      </div>
      <span class="text">
        {{ item.value }}
      </span>
    </div>
  </div>
</template>

<script>
import { defineComponent, toRefs, reactive, onMounted, onBeforeUnmount } from "vue";
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
export default defineComponent({
  name: "MultiChoiceBox",
  data() {
    return {
      buttonList: [
        {
          type: "MergeForward",
          value: "合并转发",
          icon: "mergeForward",
        },
        {
          type: "ForwardItemByItem",
          value: "逐条转发",
          icon: "aQuickForward",
        },
        {
          type: "removalMsg",
          value: "删除消息",
          icon: "delete",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      showMsgBox: (state) => state.conversation.showMsgBox,
      forwardData: (state) => state.conversation.forwardData,
      showCheckbox: (state) => state.conversation.showCheckbox,
    }),
  },
  methods: {
    ...mapMutations(["SET_CHEC_BOX"]),
    onClock(item) {
      switch (item.type) {
        case "MergeForward":
          console.log("MergeForward");
          break;
        case "ForwardItemByItem":
          console.log("ForwardItemByItem");
          break;
        case "removalMsg":
          console.log("removalMsg");
          break;
      }
    },
    onClose() {
      this.shutdown();
    },
    // this.shutdown();
    mergeForward() {
      console.log(this.forwardData);
    },
    aQuickForward() {
      console.log(this.forwardData);
    },
    shutdown() {
      this.SET_CHEC_BOX(false);
      const el = document.getElementsByClassName("check-btn");
      for (let i = 0; i < el.length; i++) {
        el[i].checked = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.checkbox-style {
  position: relative;
  z-index: 1;
  background: #fff;
  height: 206px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  .close {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 22px;
    color: rgb(140, 140, 140);
  }
  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.icon {
  width: 56px;
  height: 56px;
  background: #e5e6eb;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  .svg-icon {
    font-size: 22px;
  }
}
.text {
  margin-top: 8px;
}
</style>
