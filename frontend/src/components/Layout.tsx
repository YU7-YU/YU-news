import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu, PanelLeft, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store'
import Sidebar from './common/Sidebar'
import Header from './common/Header'

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const location = useLocation()

  // 登录/注册页面不需要侧边栏和头部
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  if (isAuthPage) {
    return (
      <div className="h-screen bg-background text-foreground flex flex-col">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden">
      {/* 桌面端侧边栏 */}
      <div className={cn(
        'hidden lg:flex transition-all duration-200 shrink-0',
        sidebarOpen ? 'w-52' : 'w-0 overflow-hidden'
      )}>
        <Sidebar />
      </div>

      {/* 侧边栏折叠后展开按钮 — 桌面端 */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex fixed left-3 top-1/2 -translate-y-1/2 z-40 p-2 rounded-lg bg-card border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all shadow-lg"
          title="展开侧边栏"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
      )}

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 移动端顶部栏 */}
        <div className="lg:hidden h-12 border-b border-white/5 flex items-center px-3 bg-background shrink-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-2 text-sm font-bold">
            <span className="text-emerald-400">YU</span>
            <span className="text-foreground">-NEWS</span>
          </span>
          <div className="flex-1" />
          {/* 移动端快速搜索入口 */}
          <button
            onClick={() => {
              // 聚焦到 Header 的搜索框
              document.querySelector<HTMLInputElement>('header input[type="text"]')?.focus()
            }}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <Header />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>

      {/* 移动端抽屉侧边栏 */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-background animate-in slide-in-from-left">
            <Sidebar mobile onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
