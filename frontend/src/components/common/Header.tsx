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
  const searchRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭下拉
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowDropdown(false)
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
    }
  }

  return (
    <header className="h-14 border-b border-white/5 flex items-center px-6 gap-4 shrink-0 bg-background/80 backdrop-blur">
      {/* 搜索框 */}
      <div ref={searchRef} className="relative flex-1 max-w-lg">
        <form onSubmit={handleSearch}>
          <div className="flex items-center bg-white/5 rounded-lg border border-white/10 focus-within:border-emerald-500/50 transition-colors">
            <Search className="w-4 h-4 text-muted-foreground ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              placeholder="搜索 AI 资讯..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
            />
            {searchQuery && (
              <button
                type="submit"
                className="px-3 py-1 mr-1 rounded bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors"
              >
                搜索
              </button>
            )}
          </div>
        </form>

        {/* 搜索历史下拉 */}
        {showDropdown && searchHistory.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a2236] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
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
        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        title={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Moon className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* 用户入口 */}
      {isAuthenticated && user ? (
        <div ref={userRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xs font-bold text-emerald-400">
              {user.nickname?.[0] || user.username?.[0] || 'U'}
            </div>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-[#1a2236] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
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
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm hover:bg-emerald-500/20 transition-colors"
        >
          <User className="w-4 h-4" />
          登录
        </button>
      )}
    </header>
  )
}
