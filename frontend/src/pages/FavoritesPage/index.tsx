import { useInteractionStore } from '@/store'
import { mockNews } from '@/mock'
import NewsCard from '@/components/common/NewsCard'

export default function FavoritesPage() {
  const { favoriteIds, toggleFavorite } = useInteractionStore()
  const favorites = mockNews.filter((n) => favoriteIds.includes(n.id))

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold mb-6">我的收藏</h2>
      {favorites.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">
          还没有收藏任何资讯
        </div>
      ) : (
        <div className="space-y-1">
          {favorites.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              isLiked={false}
              isFavorited
              onLike={() => {}}
              onFavorite={() => toggleFavorite(item.id)}
              onShare={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}
