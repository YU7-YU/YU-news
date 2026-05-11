import axios from 'axios'
import { useAuthStore } from '@/store'

/** Axios 实例：基础 URL + 自动携带 Token + 统一错误处理 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
})

// 请求拦截：自动带上 JWT Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截：401 自动清除登录态
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

/* ==================== 热点资讯 API ==================== */
export const hotApi = {
  getList: (params?: {
    page?: number
    pageSize?: number
    date?: string
    date_from?: string
    date_to?: string
    category?: string
    search?: string
  }) => api.get('/hot', { params }),

  /** 刷新使用 60s 超时（抓取多源数据耗时较长） */
  refresh: () => api.post('/hot/refresh', {}, { timeout: 60000 }),

  getDates: () => api.get('/hot/dates'),
}

export default api
