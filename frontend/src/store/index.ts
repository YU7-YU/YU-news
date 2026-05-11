import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/* ==================== 类型定义 ==================== */

export interface User {
  id: number
  username: string
  nickname: string
  avatar: string
  bio: string
}

export interface NewsItem {
  id: number
  timestamp: string        // 例 "14:32"
  date: string             // 例 "2026-05-11"
  author: string
  authorAvatar: string
  title: string
  content: string
  sourceUrl: string
  sourceName: string
  tags: string[]
  recommendReason?: string
  likes: number
  images?: string[]
  isPremium?: boolean
}

export interface DailyReport {
  id: number
  date: string
  title: string
  sections: ReportSection[]
}

export interface ReportSection {
  id: number
  title: string
  subtitle: string
  items: ReportItem[]
}

export interface ReportItem {
  id: number
  title: string
  author: string
  source: string
  content: string
}

export interface ChangelogEntry {
  id: number
  date: string
  time: string
  tag: '新增' | '优化' | '修复'
  title: string
  items: string[]
}

/* ==================== Auth Store ==================== */

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'aihot-auth' }
  )
)

/* ==================== UI Store ==================== */

interface UIState {
  theme: 'dark' | 'light'
  sidebarOpen: boolean
  setTheme: (theme: 'dark' | 'light') => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  theme: (localStorage.getItem('aihot-theme') as 'dark' | 'light') || 'dark',
  sidebarOpen: true,
  setTheme: (theme) => {
    localStorage.setItem('aihot-theme', theme)
    set({ theme })
    document.documentElement.classList.toggle('dark', theme === 'dark')
  },
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))

/* ==================== Interaction Store ==================== */

interface InteractionState {
  likedIds: number[]
  favoriteIds: number[]
  historyIds: number[]
  searchHistory: string[]
  toggleLike: (id: number) => void
  toggleFavorite: (id: number) => void
  addToHistory: (id: number) => void
  addSearchHistory: (keyword: string) => void
  clearHistory: () => void
}

export const useInteractionStore = create<InteractionState>()(
  persist(
    (set) => ({
      likedIds: [],
      favoriteIds: [],
      historyIds: [],
      searchHistory: [],
      toggleLike: (id) =>
        set((s) => ({
          likedIds: s.likedIds.includes(id)
            ? s.likedIds.filter((i) => i !== id)
            : [...s.likedIds, id],
        })),
      toggleFavorite: (id) =>
        set((s) => ({
          favoriteIds: s.favoriteIds.includes(id)
            ? s.favoriteIds.filter((i) => i !== id)
            : [...s.favoriteIds, id],
        })),
      addToHistory: (id) =>
        set((s) => ({
          historyIds: [id, ...s.historyIds.filter((i) => i !== id)].slice(0, 50),
        })),
      addSearchHistory: (keyword) =>
        set((s) => ({
          searchHistory: [keyword, ...s.searchHistory.filter((w) => w !== keyword)].slice(0, 10),
        })),
      clearHistory: () => set({ historyIds: [] }),
    }),
    { name: 'aihot-interaction' }
  )
)
