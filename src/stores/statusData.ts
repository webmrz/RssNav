import { defineStore } from "pinia";

type SiteStatus = 'normal' | 'focus' | 'box' | 'set'

interface StatusState {
  imgLoadStatus: boolean
  siteStatus: SiteStatus
  engineChangeStatus: boolean
  searchInputValue: string
  mainBoxBig: boolean
}

const useStatusDataStore = defineStore("statusData", {
  state: (): StatusState => {
    return {
      // 壁纸状态
      imgLoadStatus: false,
      // 站点状态
      // normal 正常 / focus 搜索 / box 盒子 / set 设置
      siteStatus: "normal",
      // 切换搜索引擎
      engineChangeStatus: false,
      // 搜索框文本
      searchInputValue: "",
      // 盒子大小
      mainBoxBig: false,
    };
  },
  getters: {},
  actions: {
    setImgLoadStatus(value: boolean): void {
      this.imgLoadStatus = value;
    },
    setSiteStatus(value: SiteStatus, alsoChange = true): void {
      this.siteStatus = value;
      if (value !== "focus") this.searchInputValue = "";
      if (alsoChange) this.engineChangeStatus = false;
    },
    setEngineChangeStatus(value: boolean): void {
      this.engineChangeStatus = value;
    },
    setSearchInputValue(value: string): void {
      this.searchInputValue = value;
    },
    setMainBoxBig(value: boolean): void {
      this.mainBoxBig = value;
    },
  },
  // 开启数据持久化
  persist: {
    key: "statusData",
    storage: window.localStorage,
    paths: ["mainBoxBig"],
  },
});

export default useStatusDataStore; 