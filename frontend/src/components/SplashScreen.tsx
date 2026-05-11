import { useState, useEffect } from 'react'

interface Props {
  onEnter: () => void
}

export default function SplashScreen({ onEnter }: Props) {
  const [fading, setFading] = useState(false)
  const [show, setShow] = useState(true)
  const [hintVisible, setHintVisible] = useState(false)

  useEffect(() => {
    // 延迟显示提示文字
    const timer = setTimeout(() => setHintVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleClick = () => {
    setFading(true)
    setTimeout(() => {
      setShow(false)
      onEnter()
    }, 800)
  }

  if (!show) return null

  return (
    <div
      onClick={handleClick}
      className={`
        fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer select-none
        bg-[#0a0e1a] transition-opacity duration-800 overflow-hidden
        ${fading ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* 背景粒子网格 */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(52, 211, 153, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52, 211, 153, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* 机械太阳组件 */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* 外层大齿轮轨道 - 逆时针旋转 */}
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/15 animate-[spin_20s_linear_infinite]" />

        {/* 齿轮轨道2 - 顺时针旋转 */}
        <div className="absolute inset-3 rounded-full border border-emerald-400/20 animate-[spin-reverse_15s_linear_infinite]" />

        {/* 齿轮轨道3 - 逆时针 */}
        <div className="absolute inset-6 rounded-full border border-dashed border-emerald-400/30 animate-[spin_12s_linear_infinite]" />

        {/* 齿轮齿 外层 */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-1.5 bg-emerald-500/20 rounded-full"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-124px)`,
              transformOrigin: 'center center',
              animation: `pulse 2s ${i * 0.17}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* 齿轮齿 中层 */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i + 100}
            className="absolute w-2 h-1 bg-emerald-400/15 rounded-full"
            style={{
              transform: `rotate(${i * 45 + 15}deg) translateY(-96px)`,
              transformOrigin: 'center center',
              animation: `pulse 2.5s ${i * 0.3}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* 射线 - 从中心发散 */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i + 200}
            className="absolute w-0.5 bg-gradient-to-t from-emerald-400/0 via-emerald-400/40 to-emerald-400/0 rounded-full"
            style={{
              height: '80px',
              transform: `rotate(${i * 45}deg) translateY(-70px)`,
              transformOrigin: 'center center',
              animation: `ray-pulse 3s ${i * 0.4}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* 中心光晕 */}
        <div className="absolute w-40 h-40 rounded-full bg-emerald-500/5 animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute w-28 h-28 rounded-full bg-emerald-400/10 animate-pulse" style={{ animationDuration: '2.5s' }} />
        <div className="absolute w-16 h-16 rounded-full bg-emerald-500/20 animate-pulse" style={{ animationDuration: '2s' }} />

        {/* 中心核心 */}
        <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-700 flex items-center justify-center shadow-[0_0_40px_rgba(52,211,153,0.3)] animate-[pulse_2s_ease-in-out_infinite]">
          <span className="text-white font-bold text-lg tracking-wider">YU</span>
        </div>
      </div>

      {/* YU-NEWS 标题 */}
      <div className="mt-8 text-center">
        <h1 className="text-3xl font-bold tracking-[0.3em]">
          <span className="text-emerald-400">YU</span>
          <span className="text-white">-NEWS</span>
        </h1>
        <div className="h-px w-32 mx-auto mt-3 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
        <p className="text-xs text-muted-foreground mt-3 tracking-widest">
          每天扒 AI 圈的最新动静
        </p>
      </div>

      {/* 点击进入提示 */}
      <div
        className={`mt-10 transition-all duration-700 ${hintVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="flex items-center gap-2 text-emerald-400/60 text-xs animate-bounce">
          <span className="w-3 h-px bg-emerald-400/40" />
          点击进入
          <span className="w-3 h-px bg-emerald-400/40" />
        </div>
      </div>

      {/* 版本号 */}
      <div className="absolute bottom-6 text-[10px] text-muted-foreground/30 tracking-wider">
        v1.0.0
      </div>

      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes ray-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
