/**
 * CI 环境下的新闻抓取 + 导出脚本
 * 用于 GitHub Actions 定时更新静态数据
 * 用法: node ci-update.js
 */
import './src/db/index.js'
import { fetchAllNews } from './src/services/newsFetcher.js'
import { writeFileSync } from 'fs'
import Database from 'better-sqlite3'

async function main() {
  console.log('[CI] Fetching news from all sources...')
  const start = Date.now()
  const count = await fetchAllNews()
  console.log(`[CI] Fetched ${count} new items in ${Date.now() - start}ms`)

  // 导出为 JSON
  const db = new Database('./data/aihot.db')
  const rows = db.prepare(
    "SELECT * FROM hot_news WHERE published_at IS NOT NULL AND published_at != '' ORDER BY published_at DESC, score DESC"
  ).all()

  const news = rows.map(r => ({
    id: r.id,
    timestamp: r.fetched_at ? r.fetched_at.slice(11, 16) : '00:00',
    date: r.published_at || '',
    author: r.author || '未知',
    authorAvatar: '',
    title: r.title || '',
    content: r.content || '',
    sourceUrl: r.source_url || '',
    sourceName: r.source_name || '',
    tags: (() => {
      try { return JSON.parse(r.category) }
      catch { return r.category ? [r.category] : ['AI'] }
    })(),
    likes: r.score || 0,
  }))

  writeFileSync('../frontend/public/data/news.json', JSON.stringify(news, null, 2))
  console.log(`[CI] Exported ${news.length} items to frontend/public/data/news.json`)

  // 打印日期范围
  const dates = [...new Set(news.map(n => n.date))].filter(Boolean).sort().reverse()
  console.log(`[CI] Date range: ${dates[dates.length - 1]} ~ ${dates[0]} (${dates.length} days)`)

  db.close()
}

main().catch(e => {
  console.error('[CI] Failed:', e.message)
  process.exit(1)
})
