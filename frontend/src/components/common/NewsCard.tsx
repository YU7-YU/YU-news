import { useState } from 'react'
import { Heart, Bookmark, Share2, ExternalLink, Languages } from 'lucide-react'
import { useInteractionStore } from '@/store'
import type { NewsItem } from '@/store'
import { cn } from '@/lib/utils'
import { translate } from '@/lib/translate'

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
  const [translatedTitle, setTranslatedTitle] = useState('')
  const [translatedContent, setTranslatedContent] = useState('')
  const [showTrans, setShowTrans] = useState(false)
  const [translating, setTranslating] = useState(false)

  const handleClick = () => {
    addToHistory(item.id)
    if (item.sourceUrl) {
      window.open(item.sourceUrl, '_blank')
    }
  }

  const handleTranslate = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (showTrans) {
      setShowTrans(false)
      return
    }
    // 已有缓存，直接切换
    if (translatedTitle) {
      setShowTrans(true)
      return
    }
    // 首次翻译
    setTranslating(true)
    try {
      const [tTitle, tContent] = await Promise.all([
        translate(item.title),
        translate(item.content),
      ])
      setTranslatedTitle(tTitle)
      setTranslatedContent(tContent)
      setShowTrans(true)
    } catch {
      // 失败时不做任何事
    } finally {
      setTranslating(false)
    }
  }

  const displayTitle = showTrans && translatedTitle ? translatedTitle : item.title
  const displayContent = showTrans && translatedContent ? translatedContent : item.content

  return (
    <div className="group relative">
      {showTimeline ? (
        <div className="flex">
          {/* 时间线 — 桌面端显示 */}
          <div className="hidden sm:flex w-16 shrink-0 pt-4 pr-4 text-right flex-col">
            <div className="text-sm font-mono text-muted-foreground">{item.timestamp}</div>
            <div className="text-xs text-muted-foreground/50">{item.date}</div>
          </div>

          {/* 时间线竖线 — 桌面端 */}
          <div className="hidden sm:block relative mr-4">
            {!isFirst && (
              <div className="absolute top-0 left-[5px] w-px h-full bg-white/10" />
            )}
            <div className={cn(
              'relative z-10 w-2.5 h-2.5 rounded-full mt-5',
              isLiked ? 'bg-emerald-400' : 'bg-white/20 group-hover:bg-emerald-400/60'
            )} />
          </div>

          {/* 卡片内容 */}
          <div className="flex-1 pb-4 min-w-0">
            <CardInner
              item={item}
              displayTitle={displayTitle}
              displayContent={displayContent}
              isLiked={isLiked}
              isFavorited={isFavorited}
              translating={translating}
              showTrans={showTrans}
              onLike={onLike}
              onFavorite={onFavorite}
              onShare={onShare}
              onTranslate={handleTranslate}
              onClick={handleClick}
            />
          </div>
        </div>
      ) : (
        <CardInner
          item={item}
          displayTitle={displayTitle}
          displayContent={displayContent}
          isLiked={isLiked}
          isFavorited={isFavorited}
          translating={translating}
          showTrans={showTrans}
          onLike={onLike}
          onFavorite={onFavorite}
          onShare={onShare}
          onTranslate={handleTranslate}
          onClick={handleClick}
        />
      )}
    </div>
  )
}

function CardInner({
  item, displayTitle, displayContent, isLiked, isFavorited,
  translating, showTrans,
  onLike, onFavorite, onShare, onTranslate, onClick,
}: {
  item: NewsItem
  displayTitle: string
  displayContent: string
  isLiked?: boolean
  isFavorited?: boolean
  translating: boolean
  showTrans: boolean
  onLike: () => void
  onFavorite: () => void
  onShare: () => void
  onTranslate: (e: React.MouseEvent) => void
  onClick: () => void
}) {
  return (
    <div
      className="bg-card rounded-xl border border-white/5 hover:border-white/10 transition-all hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-3 sm:p-4">
        {/* 作者信息 */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs text-emerald-400 font-bold shrink-0">
            {item.author?.[0] || '?'}
          </div>
          <span className="text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-none">{item.author}</span>
          <span className="text-xs text-muted-foreground/50 hidden sm:inline">· {item.timestamp}</span>
          <span className="text-xs text-muted-foreground/50 sm:hidden">· {item.date}</span>
          {item.isPremium && (
            <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">精选</span>
          )}
          {showTrans && (
            <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded ml-auto">中文</span>
          )}
        </div>

        {/* 标题 */}
        <h3 className="text-sm font-medium mb-2 leading-snug group-hover:text-emerald-400 transition-colors">
          {displayTitle}
        </h3>

        {/* 正文 */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-3">
          {displayContent}
        </p>

        {/* 推荐理由 */}
        {item.recommendReason && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 mb-3">
            <div className="text-xs text-emerald-400">
              <span className="font-medium">推荐理由：</span>{item.recommendReason}
            </div>
          </div>
        )}

        {/* 标签 — 横向滚动 */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto scrollbar-none">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-white/5 text-muted-foreground px-2 py-0.5 rounded shrink-0"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-1 sm:gap-4">
            <button
              onClick={(e) => { e.stopPropagation(); onLike() }}
              className={cn(
                'flex items-center gap-1 text-xs transition-colors p-1 sm:p-0',
                isLiked ? 'text-emerald-400' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Heart className={cn('w-3.5 h-3.5', isLiked && 'fill-current')} />
              <span className="hidden sm:inline">{item.likes + (isLiked ? 1 : 0)}</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onFavorite() }}
              className={cn(
                'flex items-center gap-1 text-xs transition-colors p-1 sm:p-0',
                isFavorited ? 'text-emerald-400' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Bookmark className={cn('w-3.5 h-3.5', isFavorited && 'fill-current')} />
              <span className="hidden sm:inline">收藏</span>
            </button>
            <button
              onClick={onTranslate}
              disabled={translating}
              className={cn(
                'flex items-center gap-1 text-xs transition-colors p-1 sm:p-0',
                showTrans
                  ? 'text-blue-400'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Languages className={cn('w-3.5 h-3.5', translating && 'animate-pulse')} />
              <span className="hidden sm:inline">{translating ? '翻译中...' : showTrans ? '原文' : '翻译'}</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onShare() }}
              className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
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
              <span className="hidden sm:inline">原文</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
