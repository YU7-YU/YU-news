import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
}

export default function LoginDialog({ open, onClose }: Props) {
  const navigate = useNavigate()
  const [animating, setAnimating] = useState(false)

  if (!open) return null

  const handleClose = () => {
    setAnimating(true)
    setTimeout(() => {
      setAnimating(false)
      onClose()
    }, 200)
  }

  const handleLogin = () => {
    navigate('/login')
    onClose()
  }

  const handleRegister = () => {
    navigate('/register')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩 */}
      <div
        className={cn(
          'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity',
          animating ? 'opacity-0' : 'opacity-100'
        )}
        onClick={handleClose}
      />

      {/* 弹窗 */}
      <div className={cn(
        'relative bg-[#1a2236] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm mx-4 transition-all',
        animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      )}>
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="p-6">
          <h3 className="text-lg font-bold mb-2 text-center">需要登录</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            请先登录或注册账号，以使用此功能
          </p>

          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
            >
              登录
            </button>
            <button
              onClick={handleRegister}
              className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
            >
              注册新账号
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
