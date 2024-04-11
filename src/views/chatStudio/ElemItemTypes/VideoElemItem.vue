<template>
  <div class="message-view_video">
    <div ref="artRef" :style="style"></div>
  </div>
</template>

<script>
import Artplayer from "artplayer";
import state from "../icons/state";
import indicator from "../icons/indicator";

export default {
  data() {
    return {
      art: null,
      option: {
        url: "",
      },
      style: {
        width: "240px",
        height: "135px",
      },
    };
  },
  props: {
    message: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.initArt();
    this.art.on("ready", () => {
      // this.art.mini = true;
    });
  },
  methods: {
    initArt() {
      this.option.url = this.message.payload.videoUrl;
      Artplayer.CONTEXTMENU = false;
      this.art = new Artplayer({
        ...this.option,
        contextmenu: [],
        container: this.$refs.artRef,
        lang: "zh-cn",
        theme: "#23ade5",
        fullscreen: true,

        icons: {
          state,
          // loading,
          indicator,
        },
      });
    },
  },
  beforeUnmount() {
    if (this.art && this.art.destroy) {
      this.art.destroy(false);
    }
  },
};
</script>
<style lang="scss">
.art-state {
  svg {
    width: 50px;
  }
}
.art-control-volume {
  display: none !important;
}
.message-view_video {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
}
</style>
