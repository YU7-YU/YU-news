import { useState } from 'react'
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore, useInteractionStore } from '@/store'
import { Heart, Bookmark, Clock, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { key: '', label: '个人信息', icon: User },
  { key: 'favorites', label: '我的收藏', icon: Bookmark },
  { key: 'likes', label: '我的点赞', icon: Heart },
  { key: 'history', label: '浏览历史', icon: Clock },
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { favoriteIds } = useInteractionStore()
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname.replace('/profile', '')
    return path.replace('/', '') || ''
  })

  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="flex h-full">
      {/* 左侧 Tabs */}
      <div className="w-48 border-r border-white/5 p-4 shrink-0">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center text-2xl font-bold text-emerald-400">
            {user.nickname?.[0] || user.username?.[0] || 'U'}
          </div>
          <div className="text-sm font-medium mt-2">{user.nickname || user.username}</div>
          <div className="text-xs text-muted-foreground">@{user.username}</div>
        </div>

        <nav className="space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <Link
                key={tab.key}
                to={tab.key ? `/profile/${tab.key}` : '/profile'}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.key === 'favorites' && favoriteIds.length > 0 && (
                  <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                    {favoriteIds.length}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 w-full mt-4 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <Outlet />
        {!location.pathname.includes('/favorites') && !location.pathname.includes('/likes') && !location.pathname.includes('/history') && (
          <div className="max-w-lg">
            <h2 className="text-xl font-bold mb-6">个人信息</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl font-bold text-emerald-400">
                  {user.nickname?.[0] || user.username?.[0] || 'U'}
                </div>
                <div>
                  <div className="text-lg font-semibold">{user.nickname || user.username}</div>
                  <div className="text-sm text-muted-foreground">@{user.username}</div>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">个人简介</div>
                <div className="text-sm">{user.bio || '这个人很懒，什么都没有留下'}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">账号信息</div>
                <div className="text-sm">用户名: {user.username}</div>
                <div className="text-sm">用户ID: {user.id}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
