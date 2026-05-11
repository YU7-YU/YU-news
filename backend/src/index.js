import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/user.js'
import newsRoutes from './routes/news.js'
import interactionRoutes from './routes/interaction.js'
import feedbackRoutes from './routes/feedback.js'
import hotRoutes from './routes/hot.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

/* ---- 中间件 ---- */
app.use(cors())
app.use(express.json())

/* ---- 路由 ---- */
app.use('/api/user', userRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/interaction', interactionRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/hot', hotRoutes)

/* ---- 健康检查 ---- */
app.get('/api/health', (req, res) => {
  res.json({ code: 200, message: 'OK', timestamp: new Date().toISOString() })
})

/* ---- 统一 404 处理 ---- */
app.use((req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在' })
})

/* ---- 统一错误处理 ---- */
app.use((err, req, res, next) => {
  console.error('[Error]', err)
  res.status(500).json({ code: 500, message: '服务器内部错误' })
})

app.listen(PORT, () => {
  console.log(`[AI HOT Backend] Server running on http://localhost:${PORT}`)
})
