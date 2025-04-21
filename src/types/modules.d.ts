declare module '@/assets/defaultShortCut' {
  interface ShortcutItem {
    title: string
    url: string
    icon?: string
  }
  const defaultShortCut: ShortcutItem[]
  export default defaultShortCut
} 