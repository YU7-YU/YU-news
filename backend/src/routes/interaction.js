import { Router } from 'express'
import db from '../db/index.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

/* ---- 获取收藏列表 ---- */
router.get('/favorites', authMiddleware, (req, res) => {
  try {
    const news = db.prepare(
      `SELECT n.* FROM news n
       JOIN favorites f ON n.id = f.news_id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`
    ).all(req.user.id)
    res.json({ code: 200, data: news })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取收藏失败', error: err.message })
  }
})

/* ---- 获取点赞列表 ---- */
router.get('/likes', authMiddleware, (req, res) => {
  try {
    const news = db.prepare(
      `SELECT n.* FROM news n
       JOIN likes l ON n.id = l.news_id
       WHERE l.user_id = ?
       ORDER BY l.created_at DESC`
    ).all(req.user.id)
    res.json({ code: 200, data: news })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取点赞列表失败', error: err.message })
  }
})

/* ---- 获取浏览历史 ---- */
router.get('/history', authMiddleware, (req, res) => {
  try {
    const news = db.prepare(
      `SELECT n.*, h.viewed_at FROM news n
       JOIN (SELECT news_id, MAX(viewed_at) as viewed_at FROM history WHERE user_id = ? GROUP BY news_id) h
       ON n.id = h.news_id
       ORDER BY h.viewed_at DESC`
    ).all(req.user.id)
    res.json({ code: 200, data: news })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取浏览历史失败', error: err.message })
  }
})

export default router
