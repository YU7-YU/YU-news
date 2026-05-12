export default function AboutPage() {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="max-w-3xl mx-auto">
        {/* 头部介绍 */}
        <div className="mb-10">
          <div className="text-xs text-muted-foreground mb-2 tracking-wider uppercase">关于 YU-NEWS</div>
          <h1 className="text-2xl font-bold mb-4">
            嗨，我是 <span className="text-emerald-400">余江的AI世界</span>
          </h1>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>这个站是纯免费的，免费给大家用。</p>
            <p>每天扒 AI 圈的最新动静。</p>
            <p>用 AI 帮我筛掉噪音。</p>
            <p>把真正值得看的东西留下来。</p>
          </div>
        </div>

        {/* 二维码卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 微信公众号 */}
          <div className="bg-card rounded-xl border border-white/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm font-medium">微信公众号</span>
            </div>
            <div className="bg-white/5 rounded-lg p-4 aspect-square flex items-center justify-center mb-3">
              <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black text-xs font-bold">QR CODE</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">余江的AI世界</div>
              <div className="text-xs text-muted-foreground mt-1">关注我，获取每日 AI 精选资讯</div>
            </div>
          </div>

          {/* AI 群 */}
          <div className="bg-card rounded-xl border border-white/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-sm font-medium">AI 群</span>
            </div>
            <div className="bg-white/5 rounded-lg p-4 aspect-square flex items-center justify-center mb-3">
              <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black text-xs font-bold">QR CODE</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">YU-NEWS 精选交流群</div>
              <div className="text-xs text-muted-foreground mt-1">加入群聊，与 AI 爱好者们交流讨论</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
