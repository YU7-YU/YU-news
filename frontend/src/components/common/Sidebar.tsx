import { Link, useLocation } from 'react-router-dom'
import { useUIStore } from '@/store'
import {
  Home, Globe, Newspaper, Plug, Users, ScrollText, MessageSquare,
  Flame, X, PanelLeftClose, PanelLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { path: '/selected', label: '精选', icon: Home },
  { path: '/hot', label: 'AI热点', icon: Flame },
  { path: '/all', label: '全部AI动态', icon: Globe },
  { path: '/daily', label: 'AI日报', icon: Newspaper },
  { path: '/agent', label: 'Agent接入', icon: Plug },
  { path: '/about', label: '关于', icon: Users },
  { path: '/changelog', label: '更新日志', icon: ScrollText },
  { path: '/feedback', label: '反馈', icon: MessageSquare },
]

interface Props {
  mobile?: boolean
  onClose?: () => void
}

export default function Sidebar({ mobile, onClose }: Props) {
  const location = useLocation()
  const { toggleSidebar } = useUIStore()

  const navContent = (
    <nav className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">
            <span className="text-emerald-400">YU</span>
            <span className="text-foreground">-NEWS</span>
          </span>
          {mobile && (
            <button onClick={onClose} className="ml-auto p-1">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* 导航菜单 */}
      <div className="flex-1 py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => mobile && onClose?.()}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 font-medium'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* 底部 */}
      <div className="px-4 py-3 border-t border-white/5 space-y-1">
        {!mobile && (
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
          >
            <PanelLeftClose className="w-4 h-4" />
            收起侧边栏
          </button>
        )}
        <div className="text-xs text-muted-foreground text-center">© 2026 YU-NEWS</div>
        <div className="text-[10px] text-muted-foreground/60 text-center leading-relaxed">
          合作电话：13030460701<br />
          邮箱：384448010@qq.com
        </div>
      </div>
    </nav>
  )

  if (mobile) {
    return navContent
  }

  return (
    <aside className="w-52 bg-background border-r border-white/5 flex flex-col shrink-0 h-screen overflow-hidden transition-all duration-200">
      {navContent}
    </aside>
  )
}
