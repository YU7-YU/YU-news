import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Sun, Moon, User, ChevronDown } from 'lucide-react'
import { useUIStore, useAuthStore, useInteractionStore } from '@/store'
import { cn } from '@/lib/utils'

export default function Header() {
  const navigate = useNavigate()
  const { theme, setTheme } = useUIStore()
  const { user, isAuthenticated } = useAuthStore()
  const { searchHistory, addSearchHistory } = useInteractionStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭下拉
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
        setSearchFocused(false)
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      addSearchHistory(searchQuery.trim())
      navigate(`/all?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchFocused(false)
    }
  }

  return (
    <header className="h-12 lg:h-14 border-b border-white/5 flex items-center px-3 lg:px-6 gap-2 lg:gap-4 shrink-0 bg-background/80 backdrop-blur">
      {/* 搜索框 — 移动端可展开 */}
      <div ref={searchRef} className={cn(
        'relative transition-all duration-200',
        searchFocused ? 'flex-1' : 'w-auto lg:flex-1 lg:max-w-lg'
      )}>
        <form onSubmit={handleSearch}>
          <div className={cn(
            'flex items-center bg-white/5 rounded-lg border border-white/10 focus-within:border-emerald-500/50 transition-colors',
            searchFocused ? 'w-full' : 'w-8 lg:w-full'
          )}>
            <Search
              className="w-4 h-4 text-muted-foreground ml-2 shrink-0 cursor-pointer"
              onClick={() => setSearchFocused(true)}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { setShowDropdown(true); setSearchFocused(true) }}
              onBlur={() => !searchQuery && setSearchFocused(false)}
              placeholder="搜索 AI 资讯..."
              className={cn(
                'bg-transparent px-2 py-1.5 lg:py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none',
                searchFocused ? 'w-full' : 'w-0 lg:w-full'
              )}
            />
            {searchQuery && (
              <button
                type="submit"
                className="px-2 py-0.5 mr-1 rounded bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors shrink-0"
              >
                搜索
              </button>
            )}
          </div>
        </form>

        {/* 搜索历史下拉 */}
        {showDropdown && searchHistory.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="px-3 py-2 text-xs text-muted-foreground border-b border-white/5">搜索历史</div>
            {searchHistory.slice(0, 5).map((kw, i) => (
              <button
                key={i}
                onClick={() => {
                  setSearchQuery(kw)
                  setShowDropdown(false)
                  navigate(`/all?q=${encodeURIComponent(kw)}`)
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 主题切换 */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-lg hover:bg-white/5 transition-colors shrink-0"
        title={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
        ) : (
          <Moon className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
        )}
      </button>

      {/* 用户入口 */}
      {isAuthenticated && user ? (
        <div ref={userRef} className="relative shrink-0">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-1 lg:gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xs font-bold text-emerald-400">
              {user.nickname?.[0] || user.username?.[0] || 'U'}
            </div>
            <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
              <button
                onClick={() => { navigate('/profile'); setShowUserMenu(false) }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" /> 个人中心
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs lg:text-sm hover:bg-emerald-500/20 transition-colors shrink-0"
        >
          <User className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
          <span className="hidden sm:inline">登录</span>
        </button>
      )}
    </header>
  )
}
