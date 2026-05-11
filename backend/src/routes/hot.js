/**
 * 热点资讯 API
 * GET  /api/hot           — 查询热点（支持分页/日期/分类筛选）
 * POST /api/hot/refresh   — 手动触发抓取刷新
 * GET  /api/hot/dates     — 获取有数据的日期列表
 */
import { Router } from 'express'
import { fetchAllNews, queryHotNews, getAvailableDates } from '../services/newsFetcher.js'

const router = Router()

/** 查询热点 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, pageSize = 15, date, date_from, date_to, category, search } = req.query
    const result = queryHotNews({
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
      date,
      date_from,
      date_to,
      category,
      search,
    })
    res.json({ code: 200, data: result })
  } catch (err) {
    res.status(500).json({ code: 500, message: '查询失败', error: err.message })
  }
})

/** 手动刷新 */
router.post('/refresh', async (req, res) => {
  try {
    const count = await fetchAllNews()
    res.json({ code: 200, message: `抓取完成，更新 ${count} 条`, data: { count } })
  } catch (err) {
    res.status(500).json({ code: 500, message: '抓取失败', error: err.message })
  }
})

/** 可用日期列表 */
router.get('/dates', async (req, res) => {
  try {
    const dates = getAvailableDates()
    res.json({ code: 200, data: dates })
  } catch (err) {
    res.status(500).json({ code: 500, message: '查询失败', error: err.message })
  }
})

export default router
