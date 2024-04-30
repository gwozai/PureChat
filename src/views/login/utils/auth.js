import { openAuthUrl, githubAuth } from "@/api/node-admin-api/index";
import store from "@/store";

// github 授权
export const oauthAuthorize = async (id) => {
  const res = await openAuthUrl(id);
  window.open(res, "_self");
};

// github 授权回调 username userSig
export const authorizedLogin = async (code) => {
  if (!code) return;
  const data = await githubAuth({ code });
  store.dispatch("authorized", data);
};
