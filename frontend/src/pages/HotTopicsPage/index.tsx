import { useState, useEffect, useCallback } from 'react'
import { useInteractionStore, type NewsItem } from '@/store'
import { mockNews } from '@/mock'
import { hotApi } from '@/lib/api'
import { useRequireLogin } from '@/hooks/useAuth'
import NewsCard from '@/components/common/NewsCard'
import {
  Flame, RefreshCw, ChevronLeft, ChevronRight,
  CalendarDays, Search, X, Loader2, AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const HOT_CATEGORIES = ['全部', '模型', '产品', '行业', '机器人', '商业航天', 'Agent', '论文', '技巧']

/** 快捷日期范围 */
const QUICK_RANGES = [
  { label: '近7天', days: 7 },
  { label: '近30天', days: 30 },
  { label: '近90天', days: 90 },
  { label: '近1年', days: 365 },
]

function today() {
  return new Date().toISOString().slice(0, 10)
}

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

/** 将后端数据映射为 NewsItem 格式 */
function mapHotItem(item: any): NewsItem {
  let tags: string[] = []
  try {
    tags = typeof item.category === 'string' ? JSON.parse(item.category) : item.category || []
  } catch {
    tags = item.category ? [item.category] : ['AI']
  }
  return {
    id: item.id,
    timestamp: item.fetched_at ? item.fetched_at.slice(11, 16) : '00:00',
    date: item.published_at || '',
    author: item.author || '未知',
    authorAvatar: '',
    title: item.title || '',
    content: item.content || '',
    sourceUrl: item.source_url || '',
    sourceName: item.source_name || '',
    tags,
    likes: item.score || 0,
    isPremium: (item.score || 0) > 80,
  }
}

export default function HotTopicsPage() {
  const { likedIds, toggleLike, toggleFavorite } = useInteractionStore()
  const { requireLogin } = useRequireLogin()

  // 筛选状态
  const [category, setCategory] = useState('全部')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [activeRange, setActiveRange] = useState<number | null>(7) // 默认近7天
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // 数据状态
  const [items, setItems] = useState<NewsItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useMock, setUseMock] = useState(false)

  // 每次刷新时递增，强制重新拉取
  const [loadKey, setLoadKey] = useState(0)

  /** 应用快捷范围 */
  const applyRange = useCallback((days: number | null) => {
    setActiveRange(days)
    if (days === null) {
      setDateFrom('')
      setDateTo('')
    } else {
      setDateFrom(daysAgo(days))
      setDateTo(today())
    }
    setPage(1)
  }, [])

  // 初始化默认范围
  useEffect(() => {
    applyRange(7)
  }, [])

  // ========== 从 API 拉取数据 ==========
  useEffect(() => {
    if (useMock) return
    let cancelled = false

    setLoading(true)
    setError(null)

    const params: Record<string, any> = { page, pageSize: 15 }
    if (dateFrom) params.date_from = dateFrom
    if (dateTo) params.date_to = dateTo
    if (category && category !== '全部') params.category = category
    if (search) params.search = search

    hotApi.getList(params)
      .then((res) => {
        if (cancelled) return
        if (res.data?.code === 200 && res.data?.data) {
          const { list, total: t, totalPages: tp } = res.data.data
          setItems((list || []).map(mapHotItem))
          setTotal(t || 0)
          setTotalPages(tp || 0)
        } else {
          throw new Error('数据格式异常')
        }
      })
      .catch((e: Error) => {
        if (cancelled) return
        console.warn('[HotTopics] API 请求失败，降级到 mock:', e.message)
        setUseMock(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [page, dateFrom, dateTo, category, search, loadKey])

  // ========== mock 降级模式 ==========
  useEffect(() => {
    if (!useMock) return
    let filtered = [...mockNews]
    if (category !== '全部') {
      filtered = filtered.filter((item) => item.tags.includes(category))
    }
    if (dateFrom) {
      filtered = filtered.filter((item) => item.date >= dateFrom)
    }
    if (dateTo) {
      filtered = filtered.filter((item) => item.date <= dateTo)
    }
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q)
      )
    }
    filtered.sort((a, b) => b.likes - a.likes)

    const pageSize = 15
    const tp = Math.ceil(filtered.length / pageSize) || 1
    const start = (page - 1) * pageSize
    setItems(filtered.slice(start, start + pageSize))
    setTotal(filtered.length)
    setTotalPages(tp)
  }, [useMock, page, dateFrom, dateTo, category, search])

  // ========== 手动刷新 ==========
  async function handleRefresh() {
    if (refreshing) return
    setRefreshing(true)
    setError(null)
    try {
      await hotApi.refresh()
      setPage(1)
      setLoadKey((k) => k + 1)
    } catch (e: any) {
      console.warn('[HotTopics] Refresh failed:', e.message)
      setError('刷新失败，请稍后重试')
    } finally {
      setRefreshing(false)
    }
  }

  function getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push('...')
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i)
      }
      if (page < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  const hasDateFilter = dateFrom || dateTo

  return (
    <div className="flex flex-col h-full">
      {/* 顶部区域 */}
      <div className="px-6 pt-4 pb-3 border-b border-white/5 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-semibold">AI 热点</h2>
            {useMock && (
              <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                离线模式
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              共 {total} 条热点
            </span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all',
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
                'hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <RefreshCw className={cn('w-3 h-3', refreshing && 'animate-spin')} />
              {refreshing ? '刷新中...' : '刷新'}
            </button>
          </div>
        </div>

        {/* 分类标签 */}
        <div className="flex items-center gap-2 flex-wrap">
          {HOT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1) }}
              className={cn(
                'px-3 py-1 rounded-full text-sm transition-all',
                category === cat
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 border border-transparent'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 搜索框 */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="搜索标题、内容..."
              className="w-full pl-8 pr-8 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setPage(1) }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* 日期筛选 */}
        <div className="mt-3 space-y-2">
          {/* 快捷范围 */}
          <div className="flex items-center gap-2 flex-wrap">
            {QUICK_RANGES.map((r) => (
              <button
                key={r.days}
                onClick={() => applyRange(r.days)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs transition-all border',
                  activeRange === r.days
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-white/5 text-muted-foreground hover:text-foreground border-transparent'
                )}
              >
                {r.label}
              </button>
            ))}
            <button
              onClick={() => applyRange(null)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs transition-all border',
                !activeRange && !hasDateFilter
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-white/5 text-muted-foreground hover:text-foreground border-transparent'
              )}
            >
              全部
            </button>
          </div>

          {/* 自定义日期范围 */}
          <div className="flex items-center gap-2 flex-wrap">
            <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setActiveRange(null); setPage(1) }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10',
                'text-foreground focus:outline-none focus:border-emerald-500/50',
                'appearance-none [&::-webkit-calendar-picker-indicator]:invert'
              )}
              title="开始日期"
            />
            <span className="text-xs text-muted-foreground">至</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setActiveRange(null); setPage(1) }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10',
                'text-foreground focus:outline-none focus:border-emerald-500/50',
                'appearance-none [&::-webkit-calendar-picker-indicator]:invert'
              )}
              title="结束日期"
            />
            {hasDateFilter && (
              <button
                onClick={() => { setDateFrom(''); setDateTo(''); setActiveRange(null); setPage(1) }}
                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
              >
                清除
              </button>
            )}
            {error && (
              <span className="text-xs text-red-400 flex items-center gap-1 ml-2">
                <AlertCircle className="w-3 h-3" />
                {error}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 热点列表 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl mx-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <span className="text-sm">加载中...</span>
            </div>
          )}

          {!loading && !useMock && error && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <AlertCircle className="w-10 h-10 mb-3 text-red-400" />
              <span className="text-sm mb-2">数据加载失败</span>
              <button
                onClick={() => setLoadKey((k) => k + 1)}
                className="text-xs text-emerald-400 hover:text-emerald-300 underline"
              >
                点击重试
              </button>
            </div>
          )}

          {!loading && items.length === 0 && !error && (
            <div className="text-center text-muted-foreground py-20">
              {hasDateFilter || search ? (
                <div>
                  <p className="mb-2">
                    {search ? `未找到"${search}"相关结果` : '该时间范围内暂无热点数据'}
                  </p>
                  <button
                    onClick={() => { setDateFrom(''); setDateTo(''); setActiveRange(null); setSearch(''); setPage(1) }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 underline"
                  >
                    清除所有筛选
                  </button>
                </div>
              ) : (
                <p>暂无热点数据，点击右上角刷新获取最新资讯</p>
              )}
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="space-y-3">
              {items.map((item, idx) => {
                const rank = (page - 1) * 15 + idx + 1
                return (
                  <div key={item.id} className="flex gap-3 items-start group">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 mt-2',
                      rank === 1 ? 'bg-orange-500/20 text-orange-400' :
                      rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                      rank === 3 ? 'bg-amber-600/20 text-amber-600' :
                      'bg-white/5 text-muted-foreground'
                    )}>
                      {rank}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                        <span className="text-xs text-orange-400">🔥 {item.likes} 热度</span>
                        {item.sourceName && (
                          <span className="text-xs text-muted-foreground/50">· {item.sourceName}</span>
                        )}
                      </div>
                      <NewsCard
                        item={item}
                        isLiked={likedIds.includes(item.id)}
                        onLike={() => requireLogin(() => toggleLike(item.id))}
                        onFavorite={() => requireLogin(() => toggleFavorite(item.id))}
                        onShare={() => {}}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6 pb-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all',
                  'text-muted-foreground hover:text-foreground hover:bg-white/5',
                  'disabled:opacity-30 disabled:cursor-not-allowed'
                )}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                上一页
              </button>

              {getPageNumbers().map((p, i) =>
                typeof p === 'string' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-xs text-muted-foreground">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-xs font-medium transition-all',
                      page === p
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'
                    )}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all',
                  'text-muted-foreground hover:text-foreground hover:bg-white/5',
                  'disabled:opacity-30 disabled:cursor-not-allowed'
                )}
              >
                下一页
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
