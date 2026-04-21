import axios from "axios";

export const checkService = async (url: string): Promise<string> => {
  try {
    await axios.get(url);
    return "running";
  } catch {
    return "down";
  }
};