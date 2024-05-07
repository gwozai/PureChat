<template>
  <div class="message_name" v-show="!shouldDisplay">
    <span v-if="isGroup" class="isGroup" @click="handleAt">
      {{ item.nick }}
      <span>@</span>
    </span>
    <span v-else-if="isSystem" class="isSystem">系统</span>
    <span v-else class="isFound">管理员</span>
  </div>
</template>

<script>
import emitter from "@/utils/mitt-bus";
export default {
  props: {
    item: Object,
  },
  computed: {
    from() {
      return this.item.from;
    },
    chatType() {
      return this.item.conversationType;
    },
    isGroup() {
      return this.chatType !== "C2C" && this.from !== "@TLS#NOT_FOUND";
    },
    isSystem() {
      return this.from === "@TIM#SYSTEM";
    },
    isFound() {
      return this.from === "@TLS#NOT_FOUND";
    },
    shouldDisplay() {
      if (this.chatType === "C2C") return true;
      return this.item.isRevoked || this.item.type === "TIMGroupTipElem";
    },
  },
  methods: {
    handleAt() {
      emitter.emit("handleAt", { id: this.from, name: this.item.nick });
    },
  },
};
</script>

<style lang="scss" scoped>
.message_name {
  margin-bottom: 5px;
  color: var(--color-time-divider);
  font-size: 12px;
}
.isGroup {
  cursor: pointer;
  span {
    visibility: hidden;
  }
  &:hover {
    color: rgb(84, 180, 239);
    span {
      visibility: visible;
    }
  }
}
</style>
