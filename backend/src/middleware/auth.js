import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'aihot-secret-key'

/** JWT 认证中间件：验证 Token 并挂载 user 到 req */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证信息' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ code: 401, message: 'Token 无效或已过期' })
  }
}

/** 生成 JWT Token */
export function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}
