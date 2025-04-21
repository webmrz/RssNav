import { defineStore } from 'pinia'

type SiteStatus = 'normal' | 'focus' | 'set' | 'box'

export const useStatusStore = defineStore('status', {
  state: () => ({
    siteStatus: 'normal' as SiteStatus,
    imgLoadStatus: false,
    mainBoxBig: false,
    searchInputValue: '',
    engineChangeStatus: false,
  }),
  actions: {
    setImgLoadStatus(status: boolean) {
      this.imgLoadStatus = status
    },
    setSiteStatus(status: SiteStatus) {
      this.siteStatus = status
    },
    setMainBoxBig(status: boolean) {
      this.mainBoxBig = status
    },
    setSearchInputValue(value: string) {
      this.searchInputValue = value
    },
    setEngineChangeStatus(status: boolean) {
      this.engineChangeStatus = status
    },
  },
})

export const statusStore = () => useStatusStore() 