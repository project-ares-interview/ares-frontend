import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const storage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      // On web, we use HttpOnly cookies, so no local storage is needed for tokens.
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return null;
    }
    return await SecureStore.getItemAsync(key);
  },

  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
