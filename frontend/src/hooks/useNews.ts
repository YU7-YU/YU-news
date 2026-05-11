import api from '@/lib/api'

/** 资讯 API Hooks */
export function useNewsApi() {
  const getSelected = async () => {
    const res = await api.get('/news/selected')
    return res.data
  }

  const getAll = async (params?: { page?: number; category?: string }) => {
    const res = await api.get('/news/all', { params })
    return res.data
  }

  const getDailyList = async () => {
    const res = await api.get('/daily')
    return res.data
  }

  const getDaily = async (id: number) => {
    const res = await api.get(`/daily/${id}`)
    return res.data
  }

  const toggleLike = async (id: number) => {
    const res = await api.post(`/news/${id}/like`)
    return res.data
  }

  const toggleFavorite = async (id: number) => {
    const res = await api.post(`/news/${id}/favorite`)
    return res.data
  }

  const getFavorites = async () => {
    const res = await api.get('/user/favorites')
    return res.data
  }

  const getLikes = async () => {
    const res = await api.get('/user/likes')
    return res.data
  }

  const getHistory = async () => {
    const res = await api.get('/user/history')
    return res.data
  }

  return {
    getSelected, getAll, getDailyList, getDaily,
    toggleLike, toggleFavorite,
    getFavorites, getLikes, getHistory,
  }
}
