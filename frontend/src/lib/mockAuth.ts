/**
 * Mock 认证服务 — 用户持久化到 localStorage
 * 使得注册的用户在页面刷新后依然可以登录
 */

export interface MockUser {
  id: number
  username: string
  password: string          // 明文存储（仅 mock 模式，生产环境必须后端加密）
  nickname: string
  avatar: string
  bio: string
}

const STORAGE_KEY = 'yu-news-users'

/** 获取所有注册用户 */
function getAllUsers(): MockUser[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

/** 保存用户列表 */
function saveUsers(users: MockUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

/** 预置内置用户（登录时也会检查这些） */
const BUILTIN_USERS: MockUser[] = [
  { id: 1, username: 'demo', password: 'demo123456', nickname: '余江的AI世界', avatar: '', bio: '每天扒 AI 圈的最新动静' },
  { id: 2, username: 'test', password: 'test123456', nickname: '测试用户', avatar: '', bio: '' },
]

/** 注册新用户 */
export function mockRegister(username: string, password: string, nickname: string): { success: boolean; message: string } {
  // 检查内置用户
  if (BUILTIN_USERS.find(u => u.username === username)) {
    return { success: false, message: '用户名已存在' }
  }
  const users = getAllUsers()
  if (users.find(u => u.username === username)) {
    return { success: false, message: '用户名已存在' }
  }
  const newUser: MockUser = {
    id: Date.now(),
    username,
    password,
    nickname: nickname || username,
    avatar: '',
    bio: '',
  }
  users.push(newUser)
  saveUsers(users)
  return { success: true, message: '注册成功' }
}

/** 登录验证 */
export function mockLogin(username: string, password: string): { success: boolean; message: string; user?: Omit<MockUser, 'password'> } {
  // 先查内置用户
  let found = BUILTIN_USERS.find(u => u.username === username)
  // 再查注册用户
  if (!found) {
    const users = getAllUsers()
    found = users.find(u => u.username === username)
  }
  if (!found) {
    return { success: false, message: '用户名或密码错误' }
  }
  if (found.password !== password) {
    return { success: false, message: '用户名或密码错误' }
  }
  const { password: _, ...safeUser } = found
  return { success: true, message: '登录成功', user: safeUser }
}

/** 生成 Mock Token */
export function generateMockToken(userId: number): string {
  return 'mock-jwt-token-' + userId + '-' + Date.now()
}
