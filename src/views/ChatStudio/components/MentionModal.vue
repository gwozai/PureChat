<template>
  <div class="mention-modal" :style="{ top: top, left: left }">
    <ul class="mention-list" ref="listRef">
      <el-scrollbar>
        <li
          v-for="item in searchedList"
          :key="item.joinTime"
          :class="{ active: isActive(item) }"
          @click="insertMentionHandler(item.userID, item.nick)"
        >
          <img v-if="item.avatar" :src="item.avatar" class="avatar" alt="头像" />
          <UserAvatar v-else words="3" className="mention" shape="square" nickName="@" />
          <span class="nick">{{ item.nick }}</span>
        </li>
      </el-scrollbar>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
import emitter from "@/utils/mitt-bus";
import TIM from "@/utils/IM/chat/index";
import { onClickOutside } from "@vueuse/core";
import { useEventListener } from "@vueuse/core";
import { extractContentAfterLastAtSymbol } from "@/views/ChatStudio/utils/utils";

const compareUserID = (a, b) => {
  const aHasRBT = a.userID.includes("@RBT#");
  const bHasRBT = b.userID.includes("@RBT#");
  return aHasRBT && !bHasRBT ? -1 : bHasRBT && !aHasRBT ? 1 : 0;
};
export default {
  name: "MentionModal",
  props: {
    // 群主
    isOwner: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      currentUserProfile: (state) => state.user.currentUserProfile,
      currentMemberList: (state) => state.groupinfo.currentMemberList,
    }),
    // 根据 <input> value 筛选 list
    searchedList() {
      const searchVal = this.searchVal.trim().toLowerCase();
      return this.list.filter((item) => {
        const name = item.nick.toLowerCase();
        if (name.indexOf(searchVal) >= 0) {
          this.tabIndex = 0;
          return true;
        }
        return false;
      });
    },
  },
  data() {
    return {
      top: "",
      left: "",
      list: [],
      memberlist: [],
      tabIndex: 0,
      searchVal: "",
    };
  },
  methods: {
    initList() {
      this.list = [
        {
          joinTime: 0,
          userID: TIM.TYPES.MSG_AT_ALL,
          nick: "全体成员",
        },
        ...this.filterList(),
      ];
    },
    filterList() {
      if (this.memberlist.length) {
        return this.memberlist
          .filter((t) => t.userID !== this.currentUserProfile.userID)
          .sort(compareUserID);
      } else {
        return this.currentMemberList
          .filter((t) => t.userID !== this.currentUserProfile.userID)
          .sort(compareUserID);
      }
    },
    updateMention() {
      // 获取光标位置，定位 modal
      const domSelection = document.getSelection();
      const domRange = domSelection.getRangeAt(0);
      if (domRange == null) return;
      const selectionRect = domRange.getBoundingClientRect();
      // 获取编辑区域 DOM 节点的位置，以辅助定位
      // const containerRect = editor.getEditableContainer().getBoundingClientRect();
      const height = this.$refs.listRef?.clientHeight;
      // 定位 modal
      this.top = `${selectionRect.top - height - 15}px`;
      this.left = `${selectionRect.left + 5}px`;
    },
    initMention() {
      // 仅群主支持@全员
      if (!this.isOwner) this.list.shift();
      this.updateMention();
      onClickOutside(this.$refs.listRef, (event) => {
        this.SetMentionStatus();
      });
    },
    SetMentionStatus(status = false) {
      this.$store.commit("SET_MENTION_MODAL", status);
    },
    inputKeyupHandler(event) {
      if (event.key === "Enter") {
        const firstOne = this.searchedList[this.tabIndex];
        if (!firstOne) return;
        const { userID, nick } = firstOne;
        this.insertMentionHandler(userID, nick);
      }
    },
    insertMentionHandler(id, name) {
      this.$emit("insertMention", id, name);
      this.SetMentionStatus(); // 隐藏 modal
    },
    onKeydown(event) {
      switch (event.keyCode) {
        case 38: // 上
          if (this.tabIndex > 0) {
            this.tabIndex--;
            this.scrollToSelectedItem();
          }
          break;
        case 40: //下
          if (this.tabIndex < this.searchedList?.length - 1) {
            this.tabIndex++;
            this.scrollToSelectedItem();
          }
          break;
      }
    },
    isActive(item) {
      if (!item) return;
      if (this.tabIndex > -1) {
        return item?.userID == this.searchedList[this.tabIndex]?.userID;
      } else {
        return false;
      }
    },
    scrollToSelectedItem() {
      const element = document.querySelector(".active");
      if (!element) return;
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    },
  },
  created() {
    this.initList();
  },
  mounted() {
    this.initMention();
    useEventListener(document, "keydown", (e) => {
      this.onKeydown(e);
    });
    emitter.on("setMentionModal", (data) => {
      this.memberlist = data;
      console.log(this.memberlist);
      this.initList();
      this.updateMention();
      console.log(data, "setMentionModal");
    });
  },
  beforeUnmount() {
    this.SetMentionStatus(); // 隐藏 modal
  },
};
</script>

<style lang="scss" scoped>
.mention-modal {
  position: fixed;
  width: 150px;
  // border: 1px solid #ccc;
  background-color: var(--color-body-bg);
  padding: 5px;
  border-radius: 5px;
  box-shadow: var(--el-box-shadow-lighter);
}
.mention-input {
  border: 1px solid #60626652;
  border-radius: 3px;
  width: 100px;
  outline: none;
}
.mention-list {
  height: 95px;
  overflow: hidden;
  .avatar {
    width: 18px;
    height: 18px;
    border-radius: 4px;
  }
  .nick {
    margin-left: 5px;
  }
  li {
    cursor: pointer;
    padding: 3px 3px;
    text-align: left;
    height: 24px;
    border-radius: 4px;
    display: flex;
  }
}

.mention-modal ul li:hover {
  text-decoration: underline;
}
.active {
  background: var(--color-mention-active);
}
</style>
