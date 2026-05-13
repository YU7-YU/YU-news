import { useState, useEffect, useCallback } from 'react'
import type { NewsItem } from '@/store'
import { mockNews } from '@/mock'

/** JSON 数据路径（自动适配 GitHub Pages 子路径） */
const DATA_URL = import.meta.env.BASE_URL + 'data/news.json'

/** 官方一手信源列表 */
const OFFICIAL_SOURCES = [
  'openai', 'google', 'deepmind', 'anthropic', 'meta', 'microsoft',
  'apple', 'nvidia', 'deepseek', 'xai', 'stability ai', 'midjourney',
  'spacex', 'nasa', 'tesla', 'boston dynamics',
]

/**
 * 判断是否为"一手信源"
 */
export function isPrimarySource(sourceName: string): boolean {
  if (!sourceName) return false
  const name = sourceName.toLowerCase()
  return OFFICIAL_SOURCES.some((s) => name.includes(s))
}

/**
 * 共享 Hook：从静态 JSON 加载新闻数据，支持刷新
 */
export function useNewsData() {
  const [allNews, setAllNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadKey, setLoadKey] = useState(0)

  const refresh = useCallback(() => {
    setLoadKey((k) => k + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(DATA_URL + '?t=' + Date.now())
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status)
        return res.json()
      })
      .then((data: NewsItem[]) => {
        if (cancelled) return
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('数据为空')
        }
        setAllNews(data)
        setUsingMock(false)
      })
      .catch((e: Error) => {
        if (cancelled) return
        console.warn('[useNewsData] JSON 加载失败，降级到 mock:', e.message)
        setAllNews(mockNews as NewsItem[])
        setUsingMock(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [loadKey])

  return { allNews, loading, usingMock, error, refresh }
}
