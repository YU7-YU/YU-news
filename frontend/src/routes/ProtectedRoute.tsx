import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store'

/** 路由守卫：未登录跳转登录页 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}
