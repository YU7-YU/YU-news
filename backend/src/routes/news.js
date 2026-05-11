import { Router } from 'express'
import db from '../db/index.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

/* ---- 获取精选资讯 ---- */
router.get('/selected', (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query
    const offset = (page - 1) * pageSize
    const news = db.prepare(
      `SELECT *, json(tags) as tags FROM news ORDER BY created_at DESC LIMIT ? OFFSET ?`
    ).all(pageSize, offset)
    const total = db.prepare('SELECT COUNT(*) as count FROM news').get().count

    res.json({ code: 200, data: { list: news, total, page: Number(page) } })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取资讯失败', error: err.message })
  }
})

/* ---- 获取全部资讯（支持筛选） ---- */
router.get('/all', (req, res) => {
  try {
    const { page = 1, pageSize = 20, category, sourceType } = req.query
    let sql = 'SELECT * FROM news WHERE 1=1'
    const params = []

    if (category && category !== '全部') {
      sql += ' AND json_extract(tags, "$[*]") LIKE ?'
      params.push(`%${category}%`)
    }
    if (sourceType === '一手信源') {
      sql += ' AND json_extract(tags, "$[*]") LIKE ?'
      params.push('%一手信源%')
    }

    const offset = (page - 1) * pageSize
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(Number(pageSize), offset)

    const news = db.prepare(sql).all(...params)
    const countSql = sql.replace(/SELECT \* FROM/, 'SELECT COUNT(*) as count FROM')
      .replace(/LIMIT.*$/, '')
    const total = db.prepare(countSql).get(...params.slice(0, -2)).count

    res.json({ code: 200, data: { list: news, total, page: Number(page) } })
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取资讯失败', error: err.message })
  }
})

/* ---- 资讯点赞 ---- */
router.post('/:id/like', authMiddleware, (req, res) => {
  try {
    const newsId = Number(req.params.id)
    const userId = req.user.id

    const existing = db.prepare('SELECT id FROM likes WHERE user_id = ? AND news_id = ?').get(userId, newsId)
    if (existing) {
      // 取消点赞
      db.prepare('DELETE FROM likes WHERE user_id = ? AND news_id = ?').run(userId, newsId)
      db.prepare('UPDATE news SET likes = likes - 1 WHERE id = ?').run(newsId)
      res.json({ code: 200, message: '已取消点赞', data: { liked: false } })
    } else {
      // 点赞
      db.prepare('INSERT INTO likes (user_id, news_id) VALUES (?, ?)').run(userId, newsId)
      db.prepare('UPDATE news SET likes = likes + 1 WHERE id = ?').run(newsId)
      res.json({ code: 200, message: '点赞成功', data: { liked: true } })
    }
  } catch (err) {
    res.status(500).json({ code: 500, message: '操作失败', error: err.message })
  }
})

/* ---- 资讯收藏 ---- */
router.post('/:id/favorite', authMiddleware, (req, res) => {
  try {
    const newsId = Number(req.params.id)
    const userId = req.user.id

    const existing = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND news_id = ?').get(userId, newsId)
    if (existing) {
      db.prepare('DELETE FROM favorites WHERE user_id = ? AND news_id = ?').run(userId, newsId)
      res.json({ code: 200, message: '已取消收藏', data: { favorited: false } })
    } else {
      db.prepare('INSERT INTO favorites (user_id, news_id) VALUES (?, ?)').run(userId, newsId)
      res.json({ code: 200, message: '收藏成功', data: { favorited: true } })
    }
  } catch (err) {
    res.status(500).json({ code: 500, message: '操作失败', error: err.message })
  }
})

/* ---- 浏览记录 ---- */
router.post('/:id/view', authMiddleware, (req, res) => {
  try {
    db.prepare('INSERT INTO history (user_id, news_id) VALUES (?, ?)').run(req.user.id, Number(req.params.id))
    res.json({ code: 200, message: '记录成功' })
  } catch (err) {
    res.status(500).json({ code: 500, message: '记录失败', error: err.message })
  }
})

export default router
