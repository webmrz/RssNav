import { defineStore } from 'pinia'
import type { ThemeType, BackgroundType, SearchEngine, TimeStyle, UrlJumpType } from '@/types'

export const useSetStore = defineStore('set', {
  state: () => ({
    // Theme settings
    themeType: 'light' as ThemeType,
    
    // Background settings
    backgroundType: 0 as BackgroundType,
    backgroundBlur: 0,
    showBackgroundGray: false,
    backgroundCustom: '',
    
    // Search settings
    searchEngine: 'baidu' as SearchEngine,
    lastSearchEngine: 'baidu' as SearchEngine,
    customEngineUrl: '',
    smallInput: false,
    showCleanInput: true,
    autoFocus: false,
    autoInputBlur: false,
    showSuggestions: true,
    urlJumpType: 'href' as UrlJumpType,
    
    // Time settings
    timeStyle: 'one' as TimeStyle,
    showLunar: false,
    showSeconds: false,
    showZeroTime: true,
    use12HourFormat: false,
    showYear: true,
  }),
  
  actions: {
    setThemeType(type: ThemeType) {
      this.themeType = type;
    },
    
    setBackgroundType(type: BackgroundType) {
      this.backgroundType = type;
    },
    
    setBackgroundBlur(blur: number) {
      this.backgroundBlur = blur;
    },
    
    setShowBackgroundGray(show: boolean) {
      this.showBackgroundGray = show;
    },
    
    setBackgroundCustom(url: string) {
      this.backgroundCustom = url;
    },
    
    setSearchEngine(engine: SearchEngine, isCustom = false) {
      if (isCustom) {
        this.lastSearchEngine = this.searchEngine;
        this.searchEngine = 'custom';
        this.customEngineUrl = engine;
      } else {
        this.searchEngine = engine;
      }
    },
    
    setSmallInput(small: boolean) {
      this.smallInput = small;
    },
    
    setAutoFocus(auto: boolean) {
      this.autoFocus = auto;
    },
    
    setAutoInputBlur(auto: boolean) {
      this.autoInputBlur = auto;
    },
    
    setShowSuggestions(show: boolean) {
      this.showSuggestions = show;
    },
    
    setUrlJumpType(type: UrlJumpType) {
      this.urlJumpType = type;
    },
    
    setTimeStyle(style: TimeStyle) {
      this.timeStyle = style;
    },
    
    setShowLunar(show: boolean) {
      this.showLunar = show;
    },
    
    setShowSeconds(show: boolean) {
      this.showSeconds = show;
    },
    
    setShowZeroTime(show: boolean) {
      this.showZeroTime = show;
    },
    
    setUse12HourFormat(use: boolean) {
      this.use12HourFormat = use;
    },
    
    setShowYear(show: boolean) {
      this.showYear = show;
    },
  },
  
  persist: {
    key: 'set-store',
    storage: localStorage,
  },
})

export const setStore = () => useSetStore() 