<template>
  <div class="checkbox-style" id="svgDown" v-if="showCheckbox">
    <el-icon class="close" @click="onClose"><CircleCloseFilled /></el-icon>
    <div v-for="item in buttonList" :key="item.icon">
      <div class="icon" :class="disabled ? 'disabled' : ''" @click="onClock(item)">
        <svg-icon :class="item.class" :iconClass="item.icon" />
      </div>
      <span class="text select-none">
        {{ item.value }}
      </span>
    </div>
  </div>
</template>

<script>
import { defineComponent, toRefs, reactive, onMounted, onBeforeUnmount } from "vue";
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
import { deleteMsgList, createForwardMsg, sendMsg } from "@/api/im-sdk-api";
import { showConfirmationBox } from "@/utils/message";
import TIM from "tim-js-sdk";
export default defineComponent({
  name: "MultiChoiceBox",
  data() {
    return {
      buttonList: [
        {
          type: "MergeForward",
          value: "合并转发",
          icon: "mergeForward",
          class: "noDrop",
        },
        {
          type: "ForwardItemByItem",
          value: "逐条转发",
          icon: "aQuickForward",
          class: "",
        },
        {
          type: "removalMsg",
          value: "删除消息",
          icon: "delete",
          class: "noDrop",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["currentType"]),
    ...mapState({
      showMsgBox: (state) => state.conversation.showMsgBox,
      forwardData: (state) => state.conversation.forwardData,
      showCheckbox: (state) => state.conversation.showCheckbox,
    }),
    disabled() {
      return this.forwardData.size == 0;
    },
  },
  methods: {
    ...mapMutations(["SET_CHEC_BOX"]),
    onClock(item) {
      switch (item.type) {
        case "MergeForward": // 合并转发
          this.mergeForward();
          break;
        case "ForwardItemByItem": // 逐条转发
          this.aQuickForward();
          break;
        case "removalMsg":
          this.deleteMessage(); // 删除消息
          break;
      }
    },
    onClose() {
      this.shutdown();
    },
    async deleteMessage() {
      // const { code } = await deleteMsgList(obj);
      // if (code !== 0) return;
      // const { conversationID, toAccount, to } = data;
      // this.$store.commit("SET_HISTORYMESSAGE", {
      //   type: "DELETE_MESSAGE",
      //   payload: {
      //     convId: conversationID,
      //     message: data,
      //   },
      // });
    },
    // 合并转发
    mergeForward() {
      console.log(this.filterate());
    },
    // 逐条转发
    async aQuickForward() {
      const forwardData = this.filterate();
      const message = { message: "请选择转发人员", inputValue: "" };
      const result = await showConfirmationBox(message, "prompt");
      if (result == "cancel") return;
      const { value, action } = result;
      forwardData.map(async (t) => {
        await this.sendSingleMessage({
          convId: value,
          message: t,
        });
      });
      this.shutdown();
    },
    async sendSingleMessage({ convId, type, message }) {
      const forwardMsg = await createForwardMsg({
        convId: convId,
        convType: type || TIM.TYPES.CONV_C2C, // this.currentType,
        message: message,
      });
      const { code, message: data } = await sendMsg(forwardMsg);
      if (code == 0) {
        const { conversationID } = data || "";
        this.$store.commit("SET_HISTORYMESSAGE", {
          type: "UPDATE_CACHE",
          payload: {
            convId: conversationID,
            message: [data],
          },
        });
      }
    },
    filterate() {
      let myObj = Object.fromEntries(this.forwardData);
      const obj = Object.values(myObj).map((item) => item);
      return obj;
    },
    shutdown() {
      // 清空多选数据
      this.$store.commit("SET_FORWARD_DATA", {
        type: "clear",
        payload: null,
      });
      // 关闭多选框
      this.SET_CHEC_BOX(false);
      this.closedState();
    },
    closedState() {
      const checkBoxElements = Array.from(document.querySelectorAll(".check-btn"));
      const messageElement = document.querySelector(".message-view");
      const childElements = Array.from(messageElement.children);
      checkBoxElements.forEach((element) => {
        element.checked = false;
      });
      childElements.forEach((element) => {
        element.classList.remove("style-select");
      });
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
    cursor: pointer;
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
.disabled {
  cursor: not-allowed !important;
  opacity: 0.25;
  pointer-events: none;
}
.noDrop {
  cursor: no-drop;
}
.text {
  margin-top: 8px;
}
</style>
