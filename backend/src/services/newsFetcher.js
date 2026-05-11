/**
 * 热点资讯抓取服务
 * 从 GDELT / HackerNews / Reddit / ArXiv / RSS 等多源聚合 AI 热点新闻
 * 所有数据缓存在 SQLite 中，支持增量更新
 */
import db from '../db/index.js'
import Parser from 'rss-parser'

const parser = new Parser()

/* ==================== 数据源配置 ==================== */

/** GDELT 查询关键词 */
const GDELT_QUERIES = [
  'artificial intelligence',
  'AI model release',
  'machine learning',
  'robot humanoid',
  'space launch rocket',
  'large language model',
  'AI agent',
  'embodied AI robot',
  'autonomous driving',
  'AI chip semiconductor',
]

/** NewsAPI（需要申请 key: https://newsapi.org/register） */
const NEWSAPI_KEY = process.env.NEWSAPI_KEY || ''

/** RSS 源（学术 + 科技媒体 + 中文） */
const RSS_FEEDS = [
  // Google News 聚合
  'https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=AI+robot&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=space+launch+rocket&hl=en-US&gl=US&ceid=US:en',

  // 学术 —— ArXiv（最权威的 AI 论文预印本）
  'https://rss.arxiv.org/rss/cs.AI',
  'https://rss.arxiv.org/rss/cs.RO',
  'https://rss.arxiv.org/rss/cs.LG',
  'https://rss.arxiv.org/rss/cs.CV',
  'https://rss.arxiv.org/rss/cs.CL',

  // 英文科技媒体
  'https://venturebeat.com/category/ai/feed/',
  'https://techcrunch.com/feed/',
  'https://www.technologyreview.com/feed/',
  'https://spectrum.ieee.org/feeds/feed.rss',
  'https://hnrss.org/frontpage?count=20',
  'https://www.wired.com/feed/tag/ai/latest/rss',

  // 中文
  'https://www.ithome.com/rss/',
  'https://www.ifanr.com/feed',
  'https://www.36kr.com/feed',
]

/** HackerNews Algolia API */
const HN_API = 'https://hn.algolia.com/api/v1/search'

const CATEGORY_MAP = {
  // 原有映射
  'artificial intelligence': '行业',
  'ai model release': '模型',
  'machine learning': '模型',
  'robot humanoid': '机器人',
  'space launch rocket': '商业航天',
  'large language model': '模型',
  'ai agent': 'Agent',
  'robot': '机器人',
  'space': '商业航天',
  'launch': '商业航天',
  'model': '模型',
  'gpt': '模型',
  'language model': '模型',

  // 机器人 / 自动驾驶
  'autonomous': '机器人',
  'driving': '机器人',
  'self-driving': '机器人',
  'embodied': '机器人',
  'humanoid': '机器人',
  'warehouse': '机器人',
  'industrial robot': '机器人',
  'optimus': '机器人',
  'boston dynamics': '机器人',

  // 商业航天
  'starship': '商业航天',
  'nasa': '商业航天',
  'mars': '商业航天',
  'moon': '商业航天',
  'satellite': '商业航天',
  'rocket': '商业航天',
  'orbit': '商业航天',
  'telescope': '商业航天',
  'spacex': '商业航天',
  'blue origin': '商业航天',
  'rocket lab': '商业航天',
  'space station': '商业航天',

  // 行业 / 芯片
  'semiconductor': '行业',
  'chip': '行业',
  'nvidia': '行业',
  'regulation': '行业',
  'policy': '行业',
  'ethics': '行业',
  'funding': '行业',
  'startup': '行业',
  'investment': '行业',

  // 模型 / 算法
  'deep learning': '模型',
  'neural network': '模型',
  'transformer': '模型',
  'reinforcement learning': '模型',
  'computer vision': '模型',
  'natural language': '模型',
  'llm': '模型',
  'multimodal': '模型',
  'reasoning': '模型',
  'diffusion': '模型',
  'openai': '模型',
  'anthropic': '模型',
  'google deepmind': '模型',
  'meta ai': '模型',
  'claude': '模型',
  'gemini': '模型',
  'deepseek': '模型',

  // Agent
  'agentic': 'Agent',
  'tool use': 'Agent',
  'function calling': 'Agent',
  'computer use': 'Agent',
  'autogpt': 'Agent',
}

/* ==================== 核心函数 ==================== */

/** 根据标题推断分类 */
function inferCategory(title, content) {
  const text = (title + ' ' + content).toLowerCase()
  const categories = new Set()
  Object.entries(CATEGORY_MAP).forEach(([keyword, cat]) => {
    if (text.includes(keyword)) categories.add(cat)
  })
  if (categories.size === 0) categories.add('产品')
  return Array.from(categories)
}

/** 从 GDELT API 抓取 */
async function fetchFromGDELT(query, maxResults = 15) {
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?format=json&maxrecords=${maxResults}&query=${encodeURIComponent(query)}&sort=DateDesc&sourcecount=10`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) return []
    const data = await res.json()
    if (!data.articles) return []
    return data.articles.map((a) => ({
      title: a.title || '',
      content: a.segment || a.title || '',
      author: a.sourcecountry || '',
      source_url: a.url || '',
      source_name: a.domain || a.sourcecountry || 'GDELT',
      category: inferCategory(a.title || '', a.segment || ''),
      published_at: a.seendate
        ? `${a.seendate.slice(0,4)}-${a.seendate.slice(4,6)}-${a.seendate.slice(6,8)}`
        : new Date().toISOString().slice(0, 10),
      score: 60, // GDELT 无真实热度数据，给基准分
    }))
  } catch (e) {
    console.warn(`[GDELT] Fetch failed for "${query}": ${e.message}`)
    return []
  }
}

/** 从 HackerNews 抓取（并行查询） */
async function fetchFromHN() {
  const queries = ['AI', 'artificial intelligence', 'machine learning', 'GPT', 'robot', 'spaceX', 'LLM']
  const results = await Promise.all(queries.map(async (q) => {
    try {
      const url = `${HN_API}?query=${encodeURIComponent(q)}&hitsPerPage=10`
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (!res.ok) return []
      const data = await res.json()
      if (!data.hits) return []
      return data.hits.map((h) => ({
        title: h.title || '',
        content: h.story_text || h.title || '',
        author: h.author || '',
        source_url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
        source_name: 'Hacker News',
        category: inferCategory(h.title || '', ''),
        published_at: h.created_at ? h.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
        score: Math.min(h.points || 50, 200),
      }))
    } catch (e) {
      console.warn(`[HN] "${q}": ${e.message}`)
      return []
    }
  }))
  return results.flat()
}

/** 从 NewsAPI 抓取（需要环境变量 NEWSAPI_KEY） */
async function fetchFromNewsAPI() {
  if (!NEWSAPI_KEY) {
    console.log('[NewsAPI] 未配置 NEWSAPI_KEY，跳过')
    return []
  }
  const queries = [
    'artificial intelligence OR AI OR machine learning OR LLM',
    'robot OR humanoid OR autonomous driving',
    'space OR rocket OR satellite OR starship',
  ]
  const results = await Promise.all(queries.map(async (q) => {
    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${NEWSAPI_KEY}`
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
      if (!res.ok) return []
      const data = await res.json()
      if (!data.articles) return []
      return data.articles.map((a) => ({
        title: a.title || '',
        content: a.description || a.content || a.title || '',
        author: a.author || a.source?.name || '',
        source_url: a.url || '',
        source_name: a.source?.name || 'NewsAPI',
        category: inferCategory(a.title || '', a.description || ''),
        published_at: a.publishedAt ? a.publishedAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
        score: 80,
      }))
    } catch (e) {
      console.warn(`[NewsAPI] Fetch failed for "${q.slice(0, 30)}": ${e.message}`)
      return []
    }
  }))
  return results.flat()
}

/** 从 RSS 源抓取 */
async function fetchFromRSS() {
  const results = []
  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl)
      if (feed.items) {
        feed.items.slice(0, 10).forEach((item) => {
          const author = item.creator || item.author || ''
          // ArXiv 的作者和摘要在一起，尝试提取
          let content = item.contentSnippet || item.content || item.title || ''
          let itemAuthor = author
          if (!itemAuthor && feedUrl.includes('arxiv.org')) {
            const authorMatch = content.match(/^Authors?:\s*(.+?)(?:\n|$)/)
            if (authorMatch) {
              itemAuthor = authorMatch[1].trim().slice(0, 200)
              content = content.replace(/^Authors?:\s*.+?\n/, '')
            }
            content = content.replace(/^Abstract:\s*/, '')
          }
          results.push({
            title: item.title || '',
            content: content,
            author: itemAuthor || feed.title?.replace(/^.*r\//, '') || '',
            source_url: item.link || '',
            source_name: getSourceDisplayName(feedUrl, feed.title),
            category: inferCategory(item.title || '', content),
            published_at: item.isoDate
              ? item.isoDate.slice(0, 10)
              : item.pubDate
                ? new Date(item.pubDate).toISOString().slice(0, 10)
                : new Date().toISOString().slice(0, 10),
            score: getSourceScore(feedUrl),
          })
        })
      }
    } catch (e) {
      console.warn(`[RSS] ${feedUrl}: ${e.message}`)
    }
  }
  return results
}

/** 获取可读的来源名称 */
function getSourceDisplayName(feedUrl, feedTitle) {
  if (feedUrl.includes('arxiv.org')) {
    const cat = feedUrl.match(/cs\.(\w+)/)?.[1]
    const names = { AI: 'ArXiv AI', RO: 'ArXiv 机器人', LG: 'ArXiv ML', CV: 'ArXiv 视觉', CL: 'ArXiv NLP' }
    return names[cat] || `ArXiv ${cat}`
  }
  if (feedUrl.includes('venturebeat.com')) return 'VentureBeat'
  if (feedUrl.includes('techcrunch.com')) return 'TechCrunch'
  if (feedUrl.includes('technologyreview.com')) return 'MIT Tech Review'
  if (feedUrl.includes('spectrum.ieee.org')) return 'IEEE Spectrum'
  if (feedUrl.includes('wired.com')) return 'Wired'
  if (feedUrl.includes('hnrss.org')) return 'Hacker News'
  if (feedUrl.includes('ithome.com')) return 'IT之家'
  if (feedUrl.includes('geekpark.net')) return '极客公园'
  if (feedUrl.includes('ifanr.com')) return '爱范儿'
  if (feedUrl.includes('36kr.com')) return '36氪'
  if (feedUrl.includes('news.google.com')) return 'Google News'
  return feedTitle || 'RSS'
}

/** 根据来源给基准热度分（权威媒体更高） */
function getSourceScore(feedUrl) {
  if (feedUrl.includes('arxiv.org')) return 85         // 学术论文
  if (feedUrl.includes('technologyreview.com')) return 80 // MIT 权威
  if (feedUrl.includes('spectrum.ieee.org')) return 80  // IEEE 权威
  if (feedUrl.includes('venturebeat.com')) return 75    // 专业 AI 媒体
  if (feedUrl.includes('techcrunch.com')) return 70     // 一线科技媒体
  if (feedUrl.includes('wired.com')) return 70          // 一线科技媒体
  if (feedUrl.includes('hnrss.org')) return 60          // HN 已有 points
  if (feedUrl.includes('news.google.com')) return 60    // 新闻聚合
  return 65 // 其他来源
}

/* ==================== 对外接口 ==================== */

/**
 * 执行全量抓取：从所有数据源拉取，去重后写入 hot_news 表
 * @returns {number} 新增/更新条数
 */
export async function fetchAllNews() {
  console.log('[Fetcher] Starting full fetch...')
  const start = Date.now()

  // 并行抓取所有源
  const [gdeltResults, hnResults, rssResults, newsapiResults] = await Promise.all([
    Promise.all(GDELT_QUERIES.map((q) => fetchFromGDELT(q))).then((arrs) => arrs.flat()),
    fetchFromHN(),
    fetchFromRSS(),
    fetchFromNewsAPI(),
  ])

  const allItems = [...gdeltResults, ...hnResults, ...rssResults, ...newsapiResults]
  console.log(`[Fetcher] Fetched ${allItems.length} raw items from all sources`)

  // 去重（按 source_url）
  const seen = new Set()
  const uniqueItems = allItems.filter((item) => {
    const key = item.source_url || item.title
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })

  // 写入数据库（UPSERT）
  const insert = db.prepare(`
    INSERT INTO hot_news (title, content, author, source_url, source_name, category, published_at, score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(source_url) DO UPDATE SET
      score = excluded.score,
      fetched_at = CURRENT_TIMESTAMP
  `)

  const tx = db.transaction(() => {
    let count = 0
    for (const item of uniqueItems) {
      try {
        const categoryStr = JSON.stringify(item.category)
        insert.run(
          item.title?.slice(0, 500) || '',
          item.content?.slice(0, 2000) || '',
          item.author?.slice(0, 100) || '',
          (item.source_url || '').slice(0, 1000),
          (item.source_name || '').slice(0, 200),
          categoryStr,
          item.published_at || '',
          item.score || 50
        )
        count++
      } catch (e) {
        // 跳过重复项
      }
    }
    return count
  })

  const count = tx()
  console.log(`[Fetcher] Inserted/Updated ${count} items in ${Date.now() - start}ms`)

  return count
}

/**
 * 查询缓存的 hot_news
 * @param {Object} options
 * @param {number} options.page - 页码
 * @param {number} options.pageSize - 每页条数
 * @param {string} options.date - 筛选日期 YYYY-MM-DD（兼容单日）
 * @param {string} options.date_from - 起始日期 YYYY-MM-DD
 * @param {string} options.date_to - 结束日期 YYYY-MM-DD
 * @param {string} options.category - 筛选分类
 * @param {string} options.search - 关键词搜索
 */
export function queryHotNews({ page = 1, pageSize = 15, date, date_from, date_to, category, search } = {}) {
  let sql = 'SELECT * FROM hot_news WHERE 1=1'
  const params = []

  if (date) {
    sql += ' AND published_at = ?'
    params.push(date)
  } else {
    if (date_from) {
      sql += ' AND published_at >= ?'
      params.push(date_from)
    }
    if (date_to) {
      sql += ' AND published_at <= ?'
      params.push(date_to)
    }
  }
  if (category && category !== '全部') {
    sql += ' AND category LIKE ?'
    params.push(`%"${category}"%`)
  }
  if (search) {
    sql += ' AND (title LIKE ? OR content LIKE ?)'
    params.push(`%${search}%`, `%${search}%`)
  }

  // 按时间降序（最新在前），同分按热度
  sql += ' ORDER BY published_at DESC, score DESC, fetched_at DESC'

  // 总数
  const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total')
  const total = db.prepare(countSql).get(...params).total

  // 分页
  const offset = (page - 1) * pageSize
  sql += ' LIMIT ? OFFSET ?'
  params.push(pageSize, offset)

  const rows = db.prepare(sql).all(...params)

  // 解析 tags
  const list = rows.map((r) => ({
    ...r,
    tags: typeof r.category === 'string' ? JSON.parse(r.category) : (r.category || []),
  }))

  return { list, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

/** 获取可用日期列表 */
export function getAvailableDates() {
  const rows = db.prepare(
    "SELECT DISTINCT published_at FROM hot_news WHERE published_at != '' ORDER BY published_at DESC"
  ).all()
  return rows.map((r) => r.published_at)
}
