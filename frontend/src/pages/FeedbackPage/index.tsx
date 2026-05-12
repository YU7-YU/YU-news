import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { cn } from '@/lib/utils'

const MAX_CHARS = 500

export default function FeedbackPage() {
  const { isAuthenticated } = useAuthStore()
  const [content, setContent] = useState('')
  const [contact, setContact] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const handleSubmit = async () => {
    if (!content.trim()) return
    setSubmitting(true)
    // 模拟提交
    await new Promise((r) => setTimeout(r, 800))
    setSubmitting(false)
    setSubmitted(true)
    setContent('')
    setContact('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="max-w-2xl mx-auto">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="text-xs text-muted-foreground mb-2 tracking-wider uppercase">Feedback</div>
          <h1 className="text-2xl font-bold mb-2">说说你的想法</h1>
          <p className="text-sm text-muted-foreground">
            写在 Bug，想提的建议，看不顺眼的地方——都可以告诉我。
          </p>
        </div>

        {/* 反馈表单 */}
        <div className="space-y-5">
          {/* 反馈内容 */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              你想说什么？
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="比如..."
              maxLength={MAX_CHARS}
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            <div className="text-xs text-muted-foreground text-right mt-1">
              {content.length} / {MAX_CHARS}
            </div>
          </div>

          {/* 联系方式 */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              联系方式（选填）
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="邮箱 / 微信 / 手机号 — 方便我能联系到你的方式"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          {/* 提交按钮 */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={submitting || !content.trim()}
              className={cn(
                'px-6 py-2.5 rounded-lg text-sm font-medium transition-all',
                submitting || !content.trim()
                  ? 'bg-white/5 text-muted-foreground cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              )}
            >
              {submitting ? '提交中...' : '发送反馈'}
            </button>

            {submitted && (
              <span className="text-sm text-emerald-400 animate-pulse">
                ✓ 反馈已提交，感谢！
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
