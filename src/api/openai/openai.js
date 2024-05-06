import { EventStreamContentType, fetchEventSource } from "@fortaine/fetch-event-source";
import { REQUEST_TIMEOUT_MS, OpenaiPath, modelConfig, useAccessStore } from "./constant";

export function prettyObject(msg) {
  const obj = msg;
  if (typeof msg !== "string") {
    msg = JSON.stringify(msg, null, "  ");
  }
  if (msg === "{}") {
    return obj.toString();
  }
  if (msg.startsWith("```json")) {
    return msg;
  }
  return ["```json", msg, "```"].join("\n");
}

export function getHeaders() {
  let headers = {
    "Content-Type": "application/json",
    "x-requested-with": "XMLHttpRequest",
  };
  const makeBearer = (token) => `Bearer ${token.trim()}`;
  headers.Authorization = makeBearer(useAccessStore().token);
  return headers;
}

export class ChatGPTApi {
  path(path) {
    let openaiUrl = useAccessStore().openaiUrl;
    if (!openaiUrl) {
      openaiUrl = modelConfig.openaiUrl;
    }
    return openaiUrl + path;
  }
  extractMessage(res) {
    return res.choices?.at(0)?.message?.content ?? "";
  }
  generateRequestPayload(messages, modelConfig, options) {
    return {
      messages: messages.slice(-Number(modelConfig.historyMessageCount)), // 上下文
      stream: options.stream, // 流式传输
      model: modelConfig.model, // 模型
      // max_tokens: modelConfig.max_tokens, // 单次回复限制
      temperature: Number(modelConfig.temperature), // 随机性
      presence_penalty: modelConfig.presence_penalty, //话题新鲜度
      frequency_penalty: modelConfig.frequency_penalty, // 频率惩罚度
      top_p: modelConfig.top_p, // 核采样
    };
  }
  // 生成聊天消息
  async chat(options) {
    const messages = options.messages.map((v) => ({
      role: v.role,
      content: v.content,
    }));

    const modelConfig = {
      ...useAccessStore(),
      ...{
        model: options.config.model,
      },
    };

    const requestPayload = this.generateRequestPayload(messages, modelConfig, options.config);

    console.log("[Request] openai payload: ", requestPayload);

    const shouldStream = !!options.config.stream;
    const controller = new AbortController();
    options.onController?.(controller);

    try {
      const chatPath = this.path(OpenaiPath.ChatPath);
      const chatPayload = {
        method: "POST",
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
        headers: getHeaders(),
      };

      const requestTimeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      // 流式输出
      if (shouldStream) {
        let responseText = "";
        let remainText = "";
        let finished = false; // 是否已完成。

        // 通过逐步添加文本的方式，以一种动画效果显示响应文本
        function animateResponseText() {
          if (finished || controller.signal.aborted) {
            responseText += remainText;
            console.log("[Response Animation] finished");
            return;
          }

          if (remainText.length > 0) {
            const fetchCount = Math.max(1, Math.round(remainText.length / 60));
            const fetchText = remainText.slice(0, fetchCount);
            responseText += fetchText;
            remainText = remainText.slice(fetchCount);
            options.onUpdate?.(responseText, fetchText);
          }

          requestAnimationFrame(animateResponseText);
        }

        // start animaion
        animateResponseText();

        const finish = () => {
          if (!finished) {
            finished = true;
            options.onFinish(responseText + remainText);
          }
        };

        controller.signal.onabort = finish;

        fetchEventSource(chatPath, {
          ...chatPayload,
          // 建立连接的回调
          async onopen(res) {
            clearTimeout(requestTimeoutId);
            const contentType = res.headers.get("content-type");
            console.log("[OpenAI] request response content type: ", contentType);

            if (contentType?.startsWith("text/plain")) {
              responseText = await res.clone().text();
              return finish();
            }
            const stream = !contentType?.startsWith(EventStreamContentType);
            const isRequestError = !res.ok || stream || res.status !== 200;
            if (isRequestError) {
              const responseTexts = [responseText];
              let extraInfo = await res.clone().text();
              try {
                const resJson = await res.clone().json();
                extraInfo = prettyObject(resJson);
              } catch (e) {
                console.log("[resJson]", e);
              }

              if (res.status === 401) {
                options.onError?.(extraInfo);
              }

              if (extraInfo) {
                responseTexts.push(extraInfo);
              }

              responseText = responseTexts.join("\n\n");

              return finish();
            } else {
              console.log(res);
            }
          },
          // 接收一次数据段时回调流式返回
          onmessage(msg) {
            if (msg.data === "[DONE]" || finished) {
              return finish();
            }
            const text = msg.data;
            try {
              const json = JSON.parse(text);
              const delta = json.choices[0].delta.content;
              if (delta) {
                remainText += delta;
              }
            } catch (e) {
              console.error("[Request] parse error", text, msg);
            }
          },
          // 正常结束的回调
          onclose() {
            finish();
          },
          // 连接出现异常回调
          onerror(e) {
            options.onError?.(e);
            throw e;
          },
          openWhenHidden: true,
        });
      } else {
        const res = await fetch(chatPath, chatPayload);
        clearTimeout(requestTimeoutId);

        const resJson = await res.json();
        const message = this.extractMessage(resJson);
        options.onFinish(message);
      }
    } catch (e) {
      console.log("[Request] failed to make a chat reqeust", e);
      options.onError?.(e);
    }
  }
  // 列出模型
  async models() {
    const url = this.path(OpenaiPath.ListModelPath);
    const res = await fetch(url, { method: "GET", headers: { ...getHeaders() } });
    const resJson = await res.json();
    const chatModels = resJson.data.filter((m) => m.id.startsWith("gpt-"));
    // console.log("[Models]", chatModels);
    const formattedModels = chatModels.map((m) => ({
      name: m.id,
      available: true,
    }));
    // console.log("[formattedModels]", formattedModels);
    return formattedModels;
  }
}
