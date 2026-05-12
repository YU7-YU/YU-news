import { mockChangelogs } from '@/mock'
import { cn } from '@/lib/utils'

const TAG_COLORS: Record<string, string> = {
  '新增': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  '优化': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  '修复': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
}

export default function ChangelogPage() {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="max-w-3xl mx-auto">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="text-xs text-muted-foreground mb-2 tracking-wider uppercase">Changelog</div>
          <h1 className="text-2xl font-bold mb-2">更新日志</h1>
          <p className="text-sm text-muted-foreground">通过这里了解 YU-NEWS 的每一次改进、新增、下线，都可以找到。</p>
        </div>

        {/* 时间线 */}
        <div className="space-y-10">
          {mockChangelogs.map((entry, idx) => (
            <div key={entry.id} className="relative pl-8">
              {/* 时间线竖线 */}
              {idx < mockChangelogs.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-[-40px] w-px bg-white/10" />
              )}
              {/* 时间线圆点 */}
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>

              {/* 日期 */}
              <div className="text-sm font-semibold mb-1">{entry.date}</div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-muted-foreground">{entry.time}</span>
                <span className={cn('px-2 py-0.5 rounded text-xs border', TAG_COLORS[entry.tag])}>
                  {entry.tag}
                </span>
              </div>

              {/* 标题 */}
              <h3 className="text-base font-medium mb-3">{entry.title}</h3>

              {/* 详情列表 */}
              <ul className="space-y-2">
                {entry.items.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
