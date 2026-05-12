import { useInteractionStore } from '@/store'
import { mockNews } from '@/mock'
import type { NewsItem } from '@/store'
import NewsCard from '@/components/common/NewsCard'

export default function HistoryPage() {
  const { historyIds, clearHistory } = useInteractionStore()
  const history = historyIds
    .map((id) => mockNews.find((n) => n.id === id))
    .filter((n): n is NewsItem => !!n)

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">浏览历史</h2>
        {historyIds.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-xs text-muted-foreground hover:text-red-400 transition-colors"
          >
            清空历史
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">
          还没有浏览记录
        </div>
      ) : (
        <div className="space-y-1">
          {history.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              isLiked={false}
              onLike={() => {}}
              onFavorite={() => {}}
              onShare={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}
