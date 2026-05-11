import { Router } from 'express'
import db from '../db/index.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

/* ---- 提交反馈 ---- */
router.post('/', authMiddleware, (req, res) => {
  try {
    const { content, contact } = req.body
    if (!content || !content.trim()) {
      return res.status(400).json({ code: 400, message: '反馈内容不能为空' })
    }

    db.prepare('INSERT INTO feedback (user_id, content, contact) VALUES (?, ?, ?)')
      .run(req.user.id, content, contact || '')

    res.json({ code: 200, message: '反馈已提交，感谢！' })
  } catch (err) {
    res.status(500).json({ code: 500, message: '提交失败', error: err.message })
  }
})

/* ---- 获取反馈列表（管理员） ---- */
router.get('/', authMiddleware, (req, res) => {
  try {
    const feedback = db.prepare(
      `SELECT f.*, u.username, u.nickname FROM feedback f
       JOIN users u ON f.user_id = u.id
       ORDER BY f.created_at DESC`
    ).all()
    res.json({ code: 200, data: feedback })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取反馈失败', error: err.message })
  }
})

export default router
