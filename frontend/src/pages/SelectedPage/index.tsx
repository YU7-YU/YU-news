import { useState } from 'react'
import { useInteractionStore } from '@/store'
import { mockNews } from '@/mock'
import { useRequireLogin } from '@/hooks/useAuth'
import NewsCard from '@/components/common/NewsCard'
import { cn } from '@/lib/utils'

/* ==================== 分类配置 ==================== */
const CATEGORIES = ['全部', '模型', '产品', '行业', '论文', '技巧', 'Agent', '机器人', '商业航天']
const SUB_FILTERS = ['全部', '一手信源', '资讯', '推文']

export default function SelectedPage() {
  const { likedIds, toggleLike, toggleFavorite } = useInteractionStore()
  const { requireLogin } = useRequireLogin()

  // 筛选状态
  const [activeCategory, setActiveCategory] = useState('全部')
  const [activeSub, setActiveSub] = useState('全部')

  // 筛选后的资讯
  const filteredNews = mockNews.filter((item) => {
    if (activeCategory !== '全部' && !item.tags.includes(activeCategory)) return false
    if (activeSub === '一手信源' && !item.tags.includes('一手信源')) return false
    if (activeSub === '资讯' && item.tags.includes('一手信源')) return false
    return true
  })

  return (
    <div className="flex flex-col h-full">
      {/* 顶部筛选栏 */}
      <div className="px-6 pt-4 pb-2 border-b border-white/5">
        <div className="flex items-center gap-3 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
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
        {/* 二级筛选 */}
        <div className="flex items-center gap-2 mt-3">
          {SUB_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveSub(f)}
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

      {/* 时间线资讯流 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl mx-auto space-y-1">
          {filteredNews.map((item, idx) => (
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
        {filteredNews.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            没有找到匹配的资讯
          </div>
        )}
      </div>
    </div>
  )
}
