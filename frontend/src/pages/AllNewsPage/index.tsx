import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useInteractionStore } from '@/store'
import { mockNews } from '@/mock'
import { useRequireLogin } from '@/hooks/useAuth'
import NewsCard from '@/components/common/NewsCard'
import { cn } from '@/lib/utils'

const CATEGORIES = ['全部', '一手信源', '模型', '产品', '行业', '论文', '技巧', 'Agent', '机器人', '商业航天']
const SUB_FILTERS = ['全部', '一手信源', '资讯', '推文']
const PAGE_SIZE = 8

export default function AllNewsPage() {
  const [searchParams] = useSearchParams()
  const { likedIds, toggleLike, toggleFavorite } = useInteractionStore()
  const { requireLogin } = useRequireLogin()

  const [activeCategory, setActiveCategory] = useState(searchParams.get('q') ? '全部' : '全部')
  const [activeSub, setActiveSub] = useState('全部')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [page, setPage] = useState(1)

  // 同步 URL 搜索参数
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setSearchQuery(q)
  }, [searchParams])

  const filteredNews = mockNews.filter((item) => {
    if (activeSub !== '全部') {
      if (activeSub === '一手信源' && !item.tags.includes('一手信源')) return false
      if (activeSub === '资讯' && item.tags.includes('一手信源')) return false
    }
    if (activeCategory !== '全部' && !item.tags.includes(activeCategory)) return false
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.content.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const pagedNews = filteredNews.slice(0, page * PAGE_SIZE)
  const hasMore = pagedNews.length < filteredNews.length

  return (
    <div className="flex flex-col h-full">
      {/* 顶部筛选栏 */}
      <div className="px-6 pt-4 pb-2 border-b border-white/5">
        <h2 className="text-lg font-semibold mb-3">全部 AI 动态</h2>
        <div className="flex items-center gap-2 flex-wrap">
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
        <div className="flex items-center gap-2 mt-3">
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
      </div>

      {/* 资讯列表 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl mx-auto space-y-1">
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

        {/* 加载更多 */}
        {hasMore && (
          <div className="text-center py-6">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-muted-foreground transition-colors"
            >
              加载更多
            </button>
          </div>
        )}

        {filteredNews.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            没有找到匹配的资讯
          </div>
        )}
      </div>
    </div>
  )
}
