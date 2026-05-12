import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store'
import { mockRegister, mockLogin, generateMockToken } from '@/lib/mockAuth'
import { cn } from '@/lib/utils'

const schema = z.object({
  username: z.string().min(2, '用户名至少 2 个字符').max(20, '用户名最多 20 个字符'),
  password: z.string().min(6, '密码至少 6 个字符'),
  confirmPassword: z.string().min(6, '请确认密码'),
  agree: z.boolean().refine((v) => v === true, '请阅读并同意用户协议'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次密码输入不一致',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '', confirmPassword: '', agree: false },
  })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    setError('')
    try {
      // 1. 注册
      const result = mockRegister(data.username, data.password, data.username)
      if (!result.success) {
        throw new Error(result.message)
      }
      // 2. 自动登录
      const loginResult = mockLogin(data.username, data.password)
      if (!loginResult.success || !loginResult.user) {
        throw new Error('注册成功但登录失败，请手动登录')
      }
      const token = generateMockToken(loginResult.user.id)
      login(loginResult.user, token)
      localStorage.setItem('token', token)
      navigate('/')
    } catch (e: any) {
      setError(e.message || '注册失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-lg font-bold mb-1">
            <span className="text-emerald-400">YU</span>
            <span className="text-foreground">-NEWS</span>
          </div>
          <p className="text-xs text-muted-foreground">AI 资讯精选平台</p>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center">注册</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          已有账号？{' '}
          <Link to="/login" className="text-emerald-400 hover:underline">去登录</Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">账号</label>
            <input
              {...register('username')}
              placeholder="请输入用户名"
              autoComplete="username"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            {errors.username && <p className="text-xs text-red-400 mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">密码</label>
            <input
              type="password"
              {...register('password')}
              placeholder="至少 6 个字符"
              autoComplete="new-password"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">确认密码</label>
            <input
              type="password"
              {...register('confirmPassword')}
              placeholder="请再次输入密码"
              autoComplete="new-password"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
            <input type="checkbox" {...register('agree')} className="rounded accent-emerald-500 mt-0.5" />
            <span>我已阅读并同意 <span className="text-emerald-400">用户协议</span> 和 <span className="text-emerald-400">隐私政策</span></span>
          </label>
          {errors.agree && <p className="text-xs text-red-400 -mt-3">{errors.agree.message}</p>}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={cn(
              'w-full py-3 rounded-lg text-sm font-medium transition-all',
              submitting
                ? 'bg-white/5 text-muted-foreground cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            )}
          >
            {submitting ? '注册中...' : '注册'}
          </button>
        </form>
      </div>
    </div>
  )
}
