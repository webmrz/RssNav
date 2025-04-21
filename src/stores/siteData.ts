import { defineStore } from "pinia";
import defaultShortCut from "@/assets/defaultShortCut";

export interface ShortcutItem {
  title: string
  url: string
  icon?: string
}

interface SiteState {
  shortcutData: ShortcutItem[]
}

const useSiteDataStore = defineStore("siteData", {
  state: (): SiteState => {
    // 尝试从 localStorage 获取数据
    const savedData = localStorage.getItem("siteData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // 确保数据格式正确
        if (parsed && Array.isArray(parsed.shortcutData)) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved site data:", e);
      }
    }
    // 如果没有保存的数据或解析失败，使用默认值
    return {
      shortcutData: defaultShortCut,
    };
  },
  actions: {
    setShortcutData(value: ShortcutItem[]): void {
      this.shortcutData = value;
    },
    // 添加重置方法
    resetToDefault(): void {
      this.shortcutData = defaultShortCut;
    }
  },
  // 开启数据持久化
  persist: {
    key: "siteData",
    storage: window.localStorage,
  },
});

export default useSiteDataStore; 