import http from "@/utils/http/index";
import axios from "axios";
import qs from "qs";

export const createForData = ({ name, type, size, fileName, uploadedSize = 0, file }) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("type", type);
  formData.append("size", size);
  formData.append("fileName", fileName);
  formData.append("uploadedSize", uploadedSize);
  formData.append("file", file);
  return formData;
};
// 文件上传
export const uploadFiles = async (params) => {
  const { files } = params || {};
  if (!files) return;
  let uploadedSize = 0;
  let uploadedResult = null;
  const { name, type, size } = files || {};
  const fileName = new Date().getTime() + "_" + name;

  const formData = createForData({
    name,
    type,
    size,
    fileName,
    uploadedSize,
    file: files,
  });
  try {
    uploadedResult = await http({
      url: "/upload_files",
      method: "post",
      data: formData, // body参数
      onUploadProgress: (progressEvent) => {
        let persent = ((progressEvent.loaded / progressEvent.total) * 100) | 0; //上传进度百分比
        console.log(persent + "%");
      },
    });
    console.log(uploadedResult);
  } catch (error) {
    console.log(error);
  }
};

// im消息回调
export const imCallback = (params) => {
  const { Text, From, To, type } = params;
  if (To !== 'R00001') return
  const data = {
    MsgBody: [
      {
        MsgType: type,
        MsgContent: {
          Text: Text,
        },
      },
    ],
    CallbackCommand: "C2C.CallbackAfterSendMsg",
    From_Account: From,
    To_Account: To,
    MsgRandom: 707438945,
    MsgSeq: 350821200,
    MsgTime: 1686709194,
    SupportMessageExtension: 0,
    MsgKey: "350821200_707438945_1686709194",
    OnlineOnlyFlag: 0,
    SendMsgResult: 0,
    ErrorInfo: "send msg succeed",
    UnreadMsgNum: 1,
  };
  return http({
    url: "/imCallback",
    method: "post",
    data: data,
  });
};
