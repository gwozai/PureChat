<template>
  <el-dialog v-model="dialogVisible" :append-to-body="true" title="上传头像" width="30%" draggable>
    <div>
      <el-button @click="imageClick" type="primary">头像上传</el-button>
    </div>
    <input
      type="file"
      id="imagePicker"
      ref="imagePicker"
      accept=".jpg, .jpeg, .png, .gif, .bmp"
      @change="sendImage"
      hidden
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="dialogVisible = false"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, computed, watch, nextTick } from "vue";
import emitter from "@/utils/mitt-bus";
import { useStore } from "vuex";
import { uploadFiles } from "@/api/node-admin-api/other";
import { updateMyProfile } from "@/api/im-sdk-api/profile";

const { commit } = useStore();
const imagePicker = ref();
const dialogVisible = ref(false);

emitter.on("uploadAvatarDialog", (val) => {
  dialogVisible.value = val;
});

const imageClick = () => {
  let $el = imagePicker.value;
  $el.value = null;
  $el.click();
};

async function sendImage(e) {
  console.log(e);
  const { code, data } = await uploadFiles({ files: e.target.files[0] });
  if (code === 200) {
    await modifyMyProfile(data.file_url);
  } else {
    console.log("上传失败");
  }
}
// 修改头像
async function modifyMyProfile(file_url) {
  const { code, data } = await updateMyProfile({ avatar: file_url });
  if (code === 0) {
    commit("updateCurrentUserProfile", data);
  } else {
    console.log("修改失败");
  }
}

function handleConfirm() {
  dialogVisible.value = false;
}
function handleCancel() {
  dialogVisible.value = false;
}
</script>

<style lang="scss" scoped></style>
