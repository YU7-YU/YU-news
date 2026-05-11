import { Router } from 'express'
import bcrypt from 'bcrypt'
import db from '../db/index.js'
import { generateToken, authMiddleware } from '../middleware/auth.js'

const router = Router()

/* ---- 注册 ---- */
router.post('/register', async (req, res) => {
  try {
    const { username, password, nickname } = req.body
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '用户名和密码不能为空' })
    }
    if (password.length < 6) {
      return res.status(400).json({ code: 400, message: '密码至少 6 个字符' })
    }

    // 检查用户名是否已存在
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
    if (existing) {
      return res.status(409).json({ code: 409, message: '用户名已存在' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const result = db.prepare(
      'INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)'
    ).run(username, hashedPassword, nickname || username)

    const user = { id: result.lastInsertRowid, username, nickname: nickname || username, avatar: '', bio: '' }
    const token = generateToken(user)

    res.json({ code: 200, message: '注册成功', data: { user, token } })
  } catch (err) {
    res.status(500).json({ code: 500, message: '注册失败', error: err.message })
  }
})

/* ---- 登录 ---- */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '用户名和密码不能为空' })
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
    if (!user) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' })
    }

    const token = generateToken(user)
    const { password: _, ...safeUser } = user

    res.json({ code: 200, message: '登录成功', data: { user: safeUser, token } })
  } catch (err) {
    res.status(500).json({ code: 500, message: '登录失败', error: err.message })
  }
})

/* ---- 获取用户信息 ---- */
router.get('/profile', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT id, username, nickname, avatar, bio, created_at FROM users WHERE id = ?').get(req.user.id)
    if (!user) {
      return res.status(404).json({ code: 404, message: '用户不存在' })
    }
    res.json({ code: 200, data: user })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取用户信息失败', error: err.message })
  }
})

/* ---- 更新用户信息 ---- */
router.put('/profile', authMiddleware, (req, res) => {
  try {
    const { nickname, bio, avatar } = req.body
    db.prepare('UPDATE users SET nickname = ?, bio = ?, avatar = ? WHERE id = ?')
      .run(nickname || '', bio || '', avatar || '', req.user.id)

    const user = db.prepare('SELECT id, username, nickname, avatar, bio FROM users WHERE id = ?').get(req.user.id)
    res.json({ code: 200, message: '更新成功', data: user })
  } catch (err) {
    res.status(500).json({ code: 500, message: '更新失败', error: err.message })
  }
})

/* ---- 退出登录（前端清除 Token 即可，此接口仅作记录） ---- */
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ code: 200, message: '已退出登录' })
})

export default router
