import tim from "@/utils/im-sdk/tim";

export const getUserProfile = async (userID) => {
  const { code, data } = await tim.getUserProfile({
    userIDList: [userID],
  });
  return { code, data };
};
