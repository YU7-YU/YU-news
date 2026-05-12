import { useState } from 'react'
import { mockDailyReports } from '@/mock'
import { cn } from '@/lib/utils'

/* 月份数据 */
const MONTHS = [
  { label: '2026年5月', days: [
    { day: 11, report: mockDailyReports[0] },
    { day: 10, report: mockDailyReports[1] },
  ]},
  { label: '2026年4月', days: [] },
]

export default function AIDailyPage() {
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [selectedDay, setSelectedDay] = useState(0)

  const month = MONTHS[selectedMonth]
  const day = month?.days[selectedDay]
  const report = day?.report

  return (
    <div className="flex h-full">
      {/* 左侧日期选择 */}
      <div className="w-56 border-r border-white/5 p-4 overflow-y-auto shrink-0">
        {MONTHS.map((m, i) => (
          <div key={m.label} className="mb-4">
            <button
              onClick={() => setSelectedMonth(i)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-all',
                i === selectedMonth
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-muted-foreground hover:bg-white/5'
              )}
            >
              {m.label} <span className="text-xs opacity-50">{m.days.length}</span>
            </button>
            {i === selectedMonth && m.days.map((d, j) => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(j)}
                className={cn(
                  'w-full text-left pl-6 pr-3 py-1.5 rounded text-sm transition-all',
                  j === selectedDay
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-muted-foreground hover:bg-white/5'
                )}
              >
                {d.day} 日 {d.report?.title.split('|')[0]}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* 右侧日报内容 */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {!report ? (
          <div className="text-center text-muted-foreground py-20">暂无日报数据</div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* 日报头部 */}
            <div className="mb-8">
              <div className="text-xs text-muted-foreground mb-2 tracking-wider">
                {report.title.split('|')[0].trim()} · {report.sections.reduce((a, s) => a + s.items.length, 0)} STORIES · YU-NEWS DAILY
              </div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-emerald-400">YU</span>
                <span className="text-white">-NEWS </span>
                <span className="text-white">日报</span>
              </h1>
              <div className="text-sm text-muted-foreground">{report.title.split('|')[1]?.trim()}</div>
            </div>

            {/* 日报分区 */}
            {report.sections.map((section) => (
              <div key={section.id} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-emerald-400">{section.title}</span>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">{section.subtitle}</span>
                  <div className="flex-1" />
                  <span className="text-xs text-emerald-400">{section.items.length} 篇</span>
                </div>
                {section.items.map((item) => (
                  <div key={item.id} className="mb-6 pl-4 border-l-2 border-white/10">
                    <h3 className="text-base font-medium mb-1">{item.title}</h3>
                    <div className="text-xs text-muted-foreground mb-1">{item.author} · {item.source}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
