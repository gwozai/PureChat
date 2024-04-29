import { openAuthUrl, githubAuth } from "@/api/node-admin-api/index";

export const oauthAuthorize = async (id) => {
  const res = await openAuthUrl(id);
  window.open(res, "_self");
};

export const authorizedLogin = async (code) => {
  const res = await githubAuth({ code });
};
