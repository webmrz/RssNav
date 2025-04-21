export type ThemeType = 'light' | 'dark'
export type BackgroundType = 0 | 1 | 2 | 3 | 4
export type SearchEngine = 'baidu' | 'google' | 'bing' | 'custom'
export type TimeStyle = 'one' | 'two'
export type UrlJumpType = 'href' | 'open'

export interface NoteItem {
  id: number
  title: string
  content: string
  createTime: number
}

export interface TodoItem {
  id: number
  title: string
  content: string
  completed: boolean
  createTime: number
}

export interface ShortcutItem {
  id: number
  name: string
  url: string
  icon?: string
  color?: string
  description?: string
  category?: string
  createdAt: number
  updatedAt: number
} 