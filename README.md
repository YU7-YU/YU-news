# YU-news - AI 资讯精选平台

> 每天扒 AI 圈的最新动静，用 AI 帮我筛掉噪音，把真正值得看的东西留下来。

## 技术栈

**前端**：React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Lucide React + React Router v6 + Zustand + React Hook Form + Zod + Axios

**后端**：Node.js + Express + SQLite + JWT + bcrypt

**主题**：默认深色科技风，支持一键明暗主题切换

**适配**：桌面端 + 移动端全响应式

## 项目结构

```
├── backend/                    # 后端服务
│   ├── src/
│   │   ├── db/index.js         # SQLite 数据库初始化
│   │   ├── middleware/auth.js  # JWT 认证中间件
│   │   ├── routes/
│   │   │   ├── user.js         # 用户接口（注册/登录/信息）
│   │   │   ├── news.js         # 资讯接口（精选/全部/点赞/收藏）
│   │   │   ├── interaction.js  # 互动接口（收藏列表/点赞列表/历史）
│   │   │   └── feedback.js     # 反馈接口
│   │   └── index.js            # Express 入口
│   ├── .env
│   └── package.json
│
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx      # 全局布局（侧边栏+头部+主内容）
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── common/
│   │   │       ├── Sidebar.tsx     # 侧边栏导航
│   │   │       ├── Header.tsx      # 顶部搜索+主题切换+用户入口
│   │   │       ├── NewsCard.tsx    # 资讯卡片（含时间线）
│   │   │       └── LoginDialog.tsx # 登录弹窗
│   │   ├── hooks/
│   │   │   ├── useAuth.ts      # 登录态检查 Hook
│   │   │   └── useNews.ts      # 资讯 API Hook
│   │   ├── lib/
│   │   │   ├── api.ts          # Axios 实例（拦截器+Token）
│   │   │   └── utils.ts        # 工具函数
│   │   ├── mock/
│   │   │   └── index.ts        # Mock 数据（资讯/日报/日志/用户）
│   │   ├── pages/              # 所有页面
│   │   │   ├── SelectedPage/       # 精选首页
│   │   │   ├── AllNewsPage/        # 全部AI动态
│   │   │   ├── AIDailyPage/        # AI日报
│   │   │   ├── AgentPage/          # Agent接入
│   │   │   ├── AboutPage/          # 关于我们
│   │   │   ├── ChangelogPage/      # 更新日志
│   │   │   ├── FeedbackPage/       # 反馈
│   │   │   ├── LoginPage/          # 登录
│   │   │   ├── RegisterPage/       # 注册
│   │   │   ├── ProfilePage/        # 个人中心
│   │   │   ├── FavoritesPage/      # 我的收藏
│   │   │   ├── LikesPage/          # 我的点赞
│   │   │   └── HistoryPage/        # 浏览历史
│   │   ├── routes/
│   │   │   ├── index.tsx       # 路由配置
│   │   │   └── ProtectedRoute.tsx  # 路由守卫
│   │   ├── store/
│   │   │   └── index.ts        # Zustand 状态管理
│   │   ├── index.css           # 全局样式（含 CSS Variables）
│   │   └── main.tsx            # 入口文件
│   ├── .env
│   ├── index.html
│   └── package.json
│
└── README.md
```

## 快速开始

### 前置要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 启动项目

```bash
# 终端1：启动后端（端口 3001）
cd backend
npm run dev

# 终端2：启动前端（端口 5173）
cd frontend
npm run dev
```

前端会自动通过 Vite proxy 将 `/api` 请求转发到后端。

### 单独启动前端（Mock 模式）

```bash
cd frontend
# .env 中 VITE_USE_MOCK=true 时，前端使用 Mock 数据独立运行
npm run dev
```

### 构建生产版本

```bash
cd frontend
npm run build
npm run preview
```

## 页面清单

| 页面 | 路径 | 说明 |
|------|------|------|
| 精选首页 | `/selected` | 分类标签筛选 + 时间线资讯流 |
| 全部AI动态 | `/all` | 多维度筛选 + 分页加载 |
| AI日报 | `/daily` | 日期选择器 + 结构化日报内容 |
| Agent接入 | `/agent` | Skill/RSS/REST API 三标签 + 代码高亮 |
| 关于我们 | `/about` | 项目介绍 + 二维码 |
| 更新日志 | `/changelog` | 时间倒序版本列表 + 标签 |
| 反馈 | `/feedback` | 登录后可提交反馈（路由守卫） |
| 登录 | `/login` | 账号密码登录 + 记住登录态 |
| 注册 | `/register` | 表单校验 + 协议勾选 |
| 个人中心 | `/profile` | 头像/昵称/简介/账号信息 |
| 我的收藏 | `/profile/favorites` | 收藏的资讯列表 |
| 我的点赞 | `/profile/likes` | 点赞的资讯列表 |
| 浏览历史 | `/profile/history` | 浏览记录（可清空） |

## API 接口

### 用户接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/user/register` | 注册 | 否 |
| POST | `/api/user/login` | 登录 | 否 |
| GET | `/api/user/profile` | 获取用户信息 | 是 |
| PUT | `/api/user/profile` | 更新用户信息 | 是 |
| POST | `/api/user/logout` | 退出登录 | 是 |

### 资讯接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/news/selected` | 获取精选资讯 | 否 |
| GET | `/api/news/all` | 获取全部资讯（支持筛选） | 否 |
| POST | `/api/news/:id/like` | 点赞/取消点赞 | 是 |
| POST | `/api/news/:id/favorite` | 收藏/取消收藏 | 是 |
| POST | `/api/news/:id/view` | 记录浏览 | 是 |

### 互动接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/interaction/favorites` | 获取收藏列表 | 是 |
| GET | `/api/interaction/likes` | 获取点赞列表 | 是 |
| GET | `/api/interaction/history` | 获取浏览历史 | 是 |

### 反馈接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/feedback` | 提交反馈 | 是 |
| GET | `/api/feedback` | 获取反馈列表 | 是 |

## 统一返回格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

## 环境变量

### 后端 (.env)

```
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=development
```

### 前端 (.env)

```
VITE_API_URL=http://localhost:3001/api
VITE_USE_MOCK=true
```

## 功能特性

- **深色/浅色主题切换**：一键全局切换，所有页面样式同步变化
- **响应式布局**：桌面端固定侧边栏，移动端抽屉式导航
- **JWT 认证**：登录态持久化，请求拦截器自动带 Token
- **路由守卫**：未登录访问受保护页面自动跳转登录页
- **Mock 模式**：前端可独立运行，对接后端后无缝切换
- **时间线设计**：CSS 原生绘制时间线，左侧竖线+圆点
- **表单校验**：登录/注册/反馈全表单校验，实时错误提示
- **搜索功能**：全局关键词搜索，搜索历史记录
- **筛选记忆**：筛选条件保持，重置筛选按钮
- **浏览历史**：自动记录浏览过的资讯，支持清空
