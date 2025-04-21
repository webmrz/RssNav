import { defineStore } from 'pinia'
import defaultShortCut from '@/assets/defaultShortCut'

interface ShortcutItem {
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

export interface TodoItem {
  id: number
  title: string
  content: string
  completed: boolean
  createTime: number
}

export interface NoteItem {
  id: number
  title: string
  content: string
  createTime: number
}

interface SiteState {
  shortcutData: ShortcutItem[]
  lastUsedShortcutId: number | null
  shortcutCategories: string[]
  todoData: TodoItem[]
  noteData: NoteItem[]
}

export const useSiteStore = defineStore('site', {
  state: (): SiteState => {
    // 将 defaultShortCut 转换为 ShortcutItem 格式
    const initialShortcuts = defaultShortCut.map((item, index) => ({
      id: index + 1,
      name: item.title,
      url: item.url,
      icon: item.icon,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      category: '常用'
    }))

    return {
      shortcutData: initialShortcuts,
      lastUsedShortcutId: null,
      shortcutCategories: ['常用', '工作', '学习', '娱乐'],
      todoData: [],
      noteData: [],
    }
  },
  
  getters: {
    getShortcutById: (state) => (id: number) => 
      state.shortcutData.find(item => item.id === id),
      
    getShortcutsByCategory: (state) => (category: string) => 
      state.shortcutData.filter(item => item.category === category),
      
    getRecentShortcuts: (state) => (limit = 5) => 
      [...state.shortcutData]
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, limit),
  },
  
  actions: {
    setShortcutData(data: ShortcutItem[]) {
      this.shortcutData = data.map(item => ({
        ...item,
        createdAt: item.createdAt || Date.now(),
        updatedAt: Date.now()
      }))
    },
    
    addShortcut(shortcut: ShortcutItem) {
      this.shortcutData.push(shortcut)
      this.lastUsedShortcutId = shortcut.id
    },
    
    updateShortcut(shortcut: ShortcutItem): void {
      const index = this.shortcutData.findIndex((item) => item.id === shortcut.id)
      if (index !== -1) {
        this.shortcutData[index] = shortcut
      }
    },
    
    deleteShortcut(id: number) {
      const index = this.shortcutData.findIndex(i => i.id === id)
      if (index !== -1) {
        this.shortcutData.splice(index, 1)
        if (this.lastUsedShortcutId === id) {
          this.lastUsedShortcutId = null
        }
      }
    },
    
    delTodo(id: number) {
      const index = this.todoData.findIndex(item => item.id === id)
      if (index !== -1) {
        this.todoData.splice(index, 1)
      }
    },
    
    reorderShortcuts(newOrder: number[]) {
      const orderedData = newOrder.map(id => 
        this.shortcutData.find(item => item.id === id)
      ).filter(Boolean) as ShortcutItem[]
      
      if (orderedData.length === this.shortcutData.length) {
        this.shortcutData = orderedData
      }
    },
    
    addNote(note: NoteItem) {
      this.noteData.push(note);
    },
    
    updateNote(note: NoteItem) {
      const index = this.noteData.findIndex(item => item.id === note.id);
      if (index !== -1) {
        this.noteData[index] = note;
      }
    },
    
    delNote(id: number) {
      const index = this.noteData.findIndex(item => item.id === id);
      if (index !== -1) {
        this.noteData.splice(index, 1);
      }
    },
    
    addTodo(todo: TodoItem) {
      this.todoData.push(todo);
    },
    
    updateTodo(todo: TodoItem) {
      const index = this.todoData.findIndex(item => item.id === todo.id);
      if (index !== -1) {
        this.todoData[index] = todo;
      }
    },
  },
  
  persist: {
    key: 'site-store',
    paths: ['shortcutData', 'lastUsedShortcutId', 'noteData', 'todoData'],
    storage: localStorage,
  },
})

export const siteStore = () => useSiteStore() 