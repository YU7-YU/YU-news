/**
 * 翻译服务 — 基于 LibreTranslate（免费，无需 API Key）
 * 支持 EN → ZH 翻译，带内存缓存
 */

/** LibreTranslate 公共实例列表，按优先级排序 */
const API_ENDPOINTS = [
  'https://libretranslate.de/translate',
  'https://translate.terraprint.co/translate',
]

/** 请求超时（毫秒） */
const TIMEOUT = 8000

/** 内存缓存：原文 → 译文 */
const cache = new Map<string, string>()

/** 判断文本是否主要为英文 */
function isEnglish(text: string): boolean {
  const latin = (text.match(/[a-zA-Z]/g) || []).length
  const total = text.replace(/\s+/g, '').length
  return total > 0 && latin / total > 0.6
}

/** 单个请求 */
async function doTranslate(text: string, endpoint: string): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT)

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: 'zh',
        format: 'text',
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status}: ${body.slice(0, 100)}`)
    }

    const data = await res.json()
    return data.translatedText || ''
  } finally {
    clearTimeout(timer)
  }
}

/**
 * 翻译文本（带缓存 + 多实例故障转移）
 * @param text 要翻译的文本
 * @returns 翻译后的文本，失败时返回原文
 */
export async function translate(text: string): Promise<string> {
  if (!text || !isEnglish(text)) return text

  // 缓存命中
  const cached = cache.get(text)
  if (cached !== undefined) return cached

  // 遍历端点
  let lastError: Error | null = null
  for (const endpoint of API_ENDPOINTS) {
    try {
      const result = await doTranslate(text, endpoint)
      if (result) {
        cache.set(text, result)
        return result
      }
    } catch (e: any) {
      lastError = e
      console.warn(`[translate] ${endpoint} 失败:`, e.message)
    }
  }

  // 全部失败，返回原文
  console.warn('[translate] 所有翻译端点均失败:', lastError?.message)
  return text
}

/** 批量翻译（逐条调用，避免并发限制） */
export async function translateBatch(texts: string[]): Promise<string[]> {
  const results: string[] = []
  for (const text of texts) {
    results.push(await translate(text))
    // 简易限流
    if (texts.length > 5) {
      await new Promise((r) => setTimeout(r, 200))
    }
  }
  return results
}
