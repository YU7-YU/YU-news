import { useEffect } from 'react'
import { useUIStore } from '@/store'

/** 主题同步：根据 store 中的 theme 更新 document className */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return <>{children}</>
}
