import { defineStore } from "pinia";

type ThemeType = 'light' | 'dark'
type BackgroundType = 0 | 1 | 2 | 3 | 4
type SearchEngine = 'bing' | 'baidu' | 'google' | 'custom'
type TimeStyle = 'one' | 'two' | 'three'
type UrlJumpType = 'open' | 'href'

interface SetState {
  themeType: ThemeType
  backgroundType: BackgroundType
  backgroundCustom: string
  showBackgroundGray: boolean
  backgroundBlur: number
  searchEngine: SearchEngine
  lastSearchEngine: SearchEngine
  customEngineUrl: string
  smallInput: boolean
  showCleanInput: boolean
  autoFocus: boolean
  autoInputBlur: boolean
  timeStyle: TimeStyle
  showLunar: boolean
  showSeconds: boolean
  showZeroTime: boolean
  use12HourFormat: boolean
  showSuggestions: boolean
  urlJumpType: UrlJumpType
}

const useSetDataStore = defineStore("setData", {
  state: (): SetState => {
    return {
      // 主题类别
      themeType: "light",
      // 壁纸类别
      // 0 本地 / 1 必应 / 2 随机风景 / 3 随机动漫 / 4 自定义
      backgroundType: 2,
      backgroundCustom: "",
      // 壁纸遮罩
      showBackgroundGray: true,
      // 壁纸模糊
      backgroundBlur: 0,
      // 搜索引擎
      searchEngine: "bing",
      lastSearchEngine: "bing",
      customEngineUrl: "",
      // 搜索框收起
      smallInput: false,
      // 清空搜索框
      showCleanInput: true,
      // 搜索框自动 focus
      autoFocus: false,
      // 搜索后搜索框自动失焦
      autoInputBlur: true,
      // 时间样式
      timeStyle: "one",
      // 显示农历
      showLunar: false,
      // 是否显秒
      showSeconds: false,
      // 是否显零
      showZeroTime: true,
      // 12 小时制
      use12HourFormat: false,
      // 是否显示搜索建议
      showSuggestions: true,
      // 跳转方式
      // open 新标签页 / href 当前页面
      urlJumpType: "open",
    };
  },
  actions: {
    setSearchEngine(value: SearchEngine | string, custom = false): void {
      // 储存上次
      if (this.searchEngine !== "custom") {
        this.lastSearchEngine = this.searchEngine;
      }
      // 设置新引擎
      if (custom) {
        this.customEngineUrl = value as string;
        this.searchEngine = "custom";
        return;
      }
      this.searchEngine = value as SearchEngine;
    },
    // 恢复数据
    recoverSiteData(data: Partial<SetState>): boolean {
      let isSuccess = false;
      try {
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            const item = data[key as keyof SetState];
            if (item !== undefined) {
              (this as any)[key] = item;
            }
          }
        }
        isSuccess = true;
      } catch (error) {
        console.error("数据恢复失败：", error);
      }
      return isSuccess;
    },
  },
  // 开启数据持久化
  persist: {
    key: "setData",
    storage: window.localStorage,
  },
});

export default useSetDataStore; 