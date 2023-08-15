import { reactive } from "vue";
import store from "@/store/index";
import storage from "storejs";

const { username, password, keep } = storage.get('ACCOUNT') || {}

// 账号
export const user = reactive({
  username: username || "",
  password: password || "123456",
  keep: keep || false,
  verifyCode: "",
});

// 表单校验
export const rules = reactive({
  username: [
    {
      required: true,
      message: "用户名是必须的",
      trigger: "change",
    },
  ],
  password: [
    {
      required: true,
      message: "密码是必须的",
      trigger: "blur",
    },
  ],
  verifyCode: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入验证码"));
        } else if (store.state.data.verifyCode !== value) {
          callback(new Error("请输入正确的验证码"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
});
