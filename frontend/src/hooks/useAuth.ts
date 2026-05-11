import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store'

/** 登录态检查 Hook：未登录时执行回调或跳转 */
export function useRequireLogin() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const requireLogin = useCallback((action: () => void) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    action()
  }, [isAuthenticated, navigate])

  return { requireLogin, isAuthenticated }
}
