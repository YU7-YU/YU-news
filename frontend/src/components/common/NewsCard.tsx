import { Heart, Bookmark, Share2, ExternalLink } from 'lucide-react'
import { useInteractionStore } from '@/store'
import type { NewsItem } from '@/store'
import { cn } from '@/lib/utils'

interface Props {
  item: NewsItem
  showTimeline?: boolean
  isFirst?: boolean
  isLiked?: boolean
  isFavorited?: boolean
  onLike: () => void
  onFavorite: () => void
  onShare: () => void
}

export default function NewsCard({
  item,
  showTimeline,
  isFirst,
  isLiked,
  isFavorited,
  onLike,
  onFavorite,
  onShare,
}: Props) {
  const { addToHistory } = useInteractionStore()

  const handleClick = () => {
    addToHistory(item.id)
    if (item.sourceUrl) {
      window.open(item.sourceUrl, '_blank')
    }
  }

  return (
    <div className="group relative">
      {showTimeline && (
        <div className="flex">
          {/* 时间线 */}
          <div className="w-16 shrink-0 pt-4 pr-4 text-right">
            <div className="text-sm font-mono text-muted-foreground">{item.timestamp}</div>
            <div className="text-xs text-muted-foreground/50">{item.date}</div>
          </div>

          {/* 时间线竖线 */}
          <div className="relative mr-4">
            {!isFirst && (
              <div className="absolute top-0 left-[5px] w-px h-full bg-white/10" />
            )}
            <div className={cn(
              'relative z-10 w-2.5 h-2.5 rounded-full mt-5',
              isLiked ? 'bg-emerald-400' : 'bg-white/20 group-hover:bg-emerald-400/60'
            )} />
          </div>

          {/* 卡片内容 */}
          <div className="flex-1 pb-4">
            <CardInner
              item={item} isLiked={isLiked} isFavorited={isFavorited}
              onLike={onLike} onFavorite={onFavorite} onShare={onShare}
              onClick={handleClick}
            />
          </div>
        </div>
      )}

      {!showTimeline && (
        <CardInner
          item={item} isLiked={isLiked} isFavorited={isFavorited}
          onLike={onLike} onFavorite={onFavorite} onShare={onShare}
          onClick={handleClick}
        />
      )}
    </div>
  )
}

function CardInner({
  item, isLiked, isFavorited, onLike, onFavorite, onShare, onClick
}: {
  item: NewsItem
  isLiked?: boolean
  isFavorited?: boolean
  onLike: () => void
  onFavorite: () => void
  onShare: () => void
  onClick: () => void
}) {
  return (
    <div className="bg-card rounded-xl border border-white/5 hover:border-white/10 transition-all hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer" onClick={onClick}>
      <div className="p-4">
        {/* 作者信息 */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs text-emerald-400 font-bold">
            {item.author?.[0] || '?'}
          </div>
          <span className="text-xs text-muted-foreground">{item.author}</span>
          <span className="text-xs text-muted-foreground/50">· {item.timestamp}</span>
          {item.isPremium && (
            <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">精选</span>
          )}
        </div>

        {/* 标题 */}
        <h3 className="text-sm font-medium mb-2 leading-snug group-hover:text-emerald-400 transition-colors">
          {item.title}
        </h3>

        {/* 正文 */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-3">
          {item.content}
        </p>

        {/* 推荐理由 */}
        {item.recommendReason && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 mb-3">
            <div className="text-xs text-emerald-400">
              <span className="font-medium">推荐理由：</span>{item.recommendReason}
            </div>
          </div>
        )}

        {/* 标签 */}
        <div className="flex items-center gap-2 mb-3">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-white/5 text-muted-foreground px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => { e.stopPropagation(); onLike() }}
              className={cn(
                'flex items-center gap-1 text-xs transition-colors',
                isLiked ? 'text-emerald-400' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Heart className={cn('w-3.5 h-3.5', isLiked && 'fill-current')} />
              {item.likes + (isLiked ? 1 : 0)}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onFavorite() }}
              className={cn(
                'flex items-center gap-1 text-xs transition-colors',
                isFavorited ? 'text-emerald-400' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Bookmark className={cn('w-3.5 h-3.5', isFavorited && 'fill-current')} />
              收藏
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onShare() }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              分享
            </button>
          </div>
          {item.sourceUrl && (
            <button
              onClick={(e) => { e.stopPropagation(); window.open(item.sourceUrl, '_blank') }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-emerald-400 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              原文
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
