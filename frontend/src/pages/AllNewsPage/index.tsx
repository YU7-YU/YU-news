import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useInteractionStore } from '@/store'
import { useNewsData, isPrimarySource } from '@/hooks/useNewsData'
import { useRequireLogin } from '@/hooks/useAuth'
import NewsCard from '@/components/common/NewsCard'
import { RefreshCw, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = ['全部', '一手信源', '模型', '产品', '行业', '论文', '技巧', 'Agent', '机器人', '商业航天']
const SUB_FILTERS = ['全部', '一手信源', '资讯', '推文']
const PAGE_SIZE = 8

export default function AllNewsPage() {
  const [searchParams] = useSearchParams()
  const { likedIds, toggleLike, toggleFavorite } = useInteractionStore()
  const { requireLogin } = useRequireLogin()
  const { allNews, loading, refresh } = useNewsData()

  const [activeCategory, setActiveCategory] = useState('全部')
  const [activeSub, setActiveSub] = useState('全部')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [page, setPage] = useState(1)

  // 同步 URL 搜索参数
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setSearchQuery(q)
  }, [searchParams])

  const filteredNews = allNews.filter((item) => {
    if (activeSub === '一手信源') {
      const isPrimary = item.tags.includes('一手信源') || isPrimarySource(item.sourceName)
      if (!isPrimary) return false
    }
    if (activeSub === '推文') return false
    if (activeCategory === '一手信源') {
      const isPrimary = item.tags.includes('一手信源') || isPrimarySource(item.sourceName)
      if (!isPrimary) return false
    } else if (activeCategory !== '全部' && !item.tags.includes(activeCategory)) {
      return false
    }
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.content.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const pagedNews = filteredNews.slice(0, page * PAGE_SIZE)
  const hasMore = pagedNews.length < filteredNews.length

  const handleRefresh = () => {
    setPage(1)
    refresh()
  }

  return (
    <div className="flex flex-col h-full">
      {/* 顶部筛选栏 */}
      <div className="px-3 sm:px-6 pt-4 pb-2 border-b border-white/5 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">全部 AI 动态</h2>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all',
              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
              'hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <RefreshCw className={cn('w-3 h-3', loading && 'animate-spin')} />
            {loading ? '加载中...' : '刷新'}
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-nowrap pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setPage(1) }}
              className={cn(
                'px-3 py-1 rounded-full text-sm transition-all',
                activeCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 border border-transparent'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-none flex-nowrap pb-1">
          {SUB_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => { setActiveSub(f); setPage(1) }}
              className={cn(
                'px-2.5 py-0.5 rounded text-xs transition-all',
                activeSub === f
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 搜索框 */}
        <div className="mt-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
            placeholder="搜索标题、内容..."
            className="w-full sm:max-w-xs px-4 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
      </div>

      {/* 资讯列表 */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <span className="text-sm">加载中...</span>
            </div>
          )}

          {!loading && (
            <div className="space-y-1">
              {pagedNews.map((item, idx) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  showTimeline
                  isFirst={idx === 0}
                  isLiked={likedIds.includes(item.id)}
                  onLike={() => requireLogin(() => toggleLike(item.id))}
                  onFavorite={() => requireLogin(() => toggleFavorite(item.id))}
                  onShare={() => {}}
                />
              ))}
            </div>
          )}

          {/* 加载更多 */}
          {!loading && hasMore && (
            <div className="text-center py-6">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-muted-foreground transition-colors"
              >
                加载更多
              </button>
            </div>
          )}

          {!loading && filteredNews.length === 0 && (
            <div className="text-center text-muted-foreground py-20">
              没有找到匹配的资讯
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
