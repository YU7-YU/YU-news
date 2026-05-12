import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'skill', label: 'Skill' },
  { key: 'rss', label: 'RSS' },
  { key: 'rest', label: 'REST API' },
]

const SKILL_CODE = `# 在支持 Skill 的 Agent 中配置
# Claude Code / Cursor / GitHub Copilot / Windsurf 等

# 安装 Skill（AI HOT）
npx -y @aihot/skill

# 或者在 agent 配置中添加
skills:
  - name: yu-news
    url: https://aihot.virxact.com/api/skill
`

const RSS_CODE = `# RSS 订阅地址
# 订阅 YU-NEWS 的 RSS 源获取最新 AI 资讯

精选资讯: https://aihot.virxact.com/rss/selected
全部动态: https://aihot.virxact.com/rss/all
AI日报: https://aihot.virxact.com/rss/daily
`

const REST_CODE = `# REST API 接入示例
# 获取精选资讯
curl https://aihot.virxact.com/api/news/selected

# 获取全部资讯
curl https://aihot.virxact.com/api/news/all

# 获取日报列表
curl https://aihot.virxact.com/api/daily

# 需要认证的接口
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  https://aihot.virxact.com/api/user/profile
`

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <pre className="bg-black/30 rounded-lg p-4 text-sm font-mono text-muted-foreground overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  )
}

export default function AgentPage() {
  const [activeTab, setActiveTab] = useState('skill')

  const contentMap: Record<string, { title: string; desc: string; code: string; tips?: string[] }> = {
    skill: {
      title: '一份 Skill，任何 Agent 都能用',
      desc: '通过 Skill 机制将 YU-NEWS 接入 Claude Code、Cursor、GitHub Copilot、Windsurf 等任意 Agent 平台，随时获取最新的 AI 动态。无需 API Key，无需搭建 MCP Server。',
      code: SKILL_CODE,
      tips: ['在任何 Agent 里面发送这句话，Agent 会自己读到 YU-NEWS 资讯', '每条 Skill 指令都会返回 YU-NEWS 最新的 K 条资讯', '支持通过参数 /max=k 控制返回条数'],
    },
    rss: {
      title: 'RSS 订阅，零配置接入',
      desc: '通过 RSS 订阅 YU-NEWS 的精选资讯、全部动态和 AI 日报，支持任意 RSS 阅读器。',
      code: RSS_CODE,
      tips: ['支持标准 RSS 2.0 格式', '每日自动更新', '可在 RSS 阅读器中设置推送通知'],
    },
    rest: {
      title: 'REST API，灵活集成',
      desc: '通过 REST API 接入 YU-NEWS 数据，支持查询精选资讯、全部动态、日报列表等。部分接口需要登录认证。',
      code: REST_CODE,
      tips: ['返回标准 JSON 格式', '支持分页和筛选参数', '认证接口需要 JWT Token'],
    },
  }

  const content = contentMap[activeTab]

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="max-w-3xl mx-auto">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="text-xs text-muted-foreground mb-2 tracking-wider uppercase">Agent 接入</div>
          <h1 className="text-2xl font-bold mb-3">
            把 <span className="text-emerald-400">YU-NEWS</span> 接入你的工作流
            <span className="text-xs text-muted-foreground ml-2 font-normal">（测试版）</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{content.desc}</p>
        </div>

        {/* 标签切换 */}
        <div className="flex gap-1 bg-white/5 rounded-lg p-1 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                activeTab === tab.key
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-emerald-400">{content.title}</h3>
            <CodeBlock code={content.code} />
          </div>

          {content.tips && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2 text-emerald-400">使用说明</h4>
              <ul className="space-y-2">
                {content.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
