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
  <el-dialog
    v-model="dialogVisible"
    title="选择要转发的联系人"
    width="30%"
    :before-close="handleClose"
  >
    <div class="tabulation-style">
      <div
        v-for="item in conversationList"
        :key="item.toAccount"
        :class="{ tabulationHover: multipleValue?.toAccount == item.toAccount }"
        @click="onClickItem(item)"
      >
        <img :src="item.userProfile?.avatar || squareUrl" alt="" />
        <div>{{ chatName(item) }}</div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setDialogVisible(null)">
          {{ $t("el.datepicker.cancel") }}
        </el-button>
        <el-button type="primary" @click="handleConfirm(dialogType)">
          {{ $t("el.datepicker.confirm") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, h } from "vue";
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
import { createForwardMsg, sendMsg } from "@/api/im-sdk-api/message";
import { showConfirmationBox } from "@/utils/message";
import { deleteMsgList } from "@/api/im-sdk-api";
import { chatName } from "../utils/utils";
import { squareUrl } from "../utils/menu";
import TIM from "@tencentcloud/chat";
import { ElRadio } from "element-plus";
const buttonList = [
  {
    type: "MergeForward",
    value: "合并转发",
    icon: "mergeForward",
    class: "noDrop", // noDrop
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
    class: "",
  },
];

export default defineComponent({
  name: "MultiChoiceBox",
  data() {
    return {
      buttonList,
      dialogVisible: false,
      dialogType: "",
      multipleValue: null,
      squareUrl,
      chatName,
    };
  },
  watch: {
    currentConversation() {
      if (!this.disabled) {
        this.$store.commit("SET_FORWARD_DATA", { type: "clear", payload: null });
      }
    },
  },
  computed: {
    ...mapGetters(["currentType"]),
    ...mapState({
      showMsgBox: (state) => state.conversation.showMsgBox,
      forwardData: (state) => state.conversation.forwardData,
      showCheckbox: (state) => state.conversation.showCheckbox,
      conversationList: (state) => state.conversation.conversationList,
      currentConversation: (state) => state.conversation.currentConversation,
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
          // this.setDialogVisible(true, item.type);
          break;
        case "ForwardItemByItem": // 逐条转发
          this.setDialogVisible(true, item.type);
          break;
        case "removalMsg":
          this.deleteMessage(); // 删除消息
          break;
      }
    },
    handleConfirm(type) {
      switch (type) {
        case "MergeForward": // 合并转发
          this.mergeForward();
          break;
        case "ForwardItemByItem": // 逐条转发
          this.aQuickForward();
          break;
      }
      this.setDialogVisible();
    },
    onClickItem(item) {
      this.setMultipleValue({
        toAccount: item.toAccount,
        type: item.type,
      });
    },
    handleClose(done) {
      this.setDialogVisible();
      done();
    },
    onClose() {
      this.shutdown();
    },
    // 多选删除
    async deleteMessage() {
      const result = await showConfirmationBox({ message: "确定删除?", iconType: "warning" });
      if (result == "cancel") return;
      const forwardData = this.filterate();
      const { code } = await deleteMsgList([...forwardData]);
      if (code !== 0) return;
      const { conversationID, toAccount, to } = this.currentConversation;
      this.$store.commit("SET_HISTORYMESSAGE", {
        type: "DELETE_MESSAGE",
        payload: {
          convId: conversationID,
          message: null,
        },
      });
      this.shutdown();
    },
    // 合并转发
    mergeForward() {
      console.log(this.filterate());
    },
    // 逐条转发
    async aQuickForward() {
      const forwardData = this.filterate();
      if (!this.multipleValue) return;
      const { toAccount, type } = this.multipleValue;
      forwardData.map(async (t) => {
        await this.sendSingleMessage({
          convId: toAccount,
          message: t,
          type,
        });
      });
      this.shutdown();
    },
    async sendSingleMessage({ convId, type, message }) {
      const forwardMsg = await createForwardMsg({
        convId: convId,
        convType: type,
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
      this.setMultipleValue();
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
    setDialogVisible(value = false, type = "") {
      this.dialogVisible = value;
      this.dialogType = type;
      !value && this.setMultipleValue();
    },
    setMultipleValue(value = null) {
      this.multipleValue = value;
    },
  },
});
</script>
<style lang="scss">
.tabulation-style {
  max-height: 200px;
  overflow: auto;
  .tabulationHover {
    background: hsl(220, 20%, 91%);
  }
  img {
    height: 60%;
    border-radius: 5px;
    margin-right: 10px;
  }
  & > div {
    height: 52px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    border-radius: 5px;
  }
  :hover {
    background: hsl(220, 20%, 91%);
  }
}
</style>
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
