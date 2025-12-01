import axios from "./axios.js";

export const getSettings = async () => {
  try {
    const res = await axios.get("/settings");
    return res.data;
  } catch {
    return null;
  }
};

export const updateSettings = async (data) => {
  try {
    await axios.put("/settings", data);
    return true;
  } catch {
    return false;
  }
};
