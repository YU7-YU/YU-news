import { useInteractionStore } from '@/store'
import { mockNews } from '@/mock'
import NewsCard from '@/components/common/NewsCard'

export default function LikesPage() {
  const { likedIds, toggleLike } = useInteractionStore()
  const likes = mockNews.filter((n) => likedIds.includes(n.id))

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold mb-6">我的点赞</h2>
      {likes.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">
          还没有点赞过任何资讯
        </div>
      ) : (
        <div className="space-y-1">
          {likes.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              isLiked
              onLike={() => toggleLike(item.id)}
              onFavorite={() => {}}
              onShare={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}
