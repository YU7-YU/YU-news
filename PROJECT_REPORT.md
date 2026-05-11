# YU-NEWS 项目简介报告

## 项目概述

**YU-NEWS** （原 AI HOT）是一个 AI 资讯精选平台，提供每日 AI 领域最新动态的聚合、筛选和展示服务。项目采用前后端分离架构，支持深色/浅色主题切换、用户认证、资讯互动等功能。

**作者**：余江的AI世界

---

## 开发环境

| 项目 | 版本 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite 5 |
| 样式方案 | Tailwind CSS 3 + CSS Variables |
| 路由方案 | React Router v6 |
| 状态管理 | Zustand |
| 表单方案 | React Hook Form + Zod |
| HTTP 客户端 | Axios |
| 后端框架 | Node.js + Express |
| 数据库 | SQLite (better-sqlite3) |
| 认证方案 | JWT + bcrypt |
| 主题 | 深色/浅色双主题 |

---

## 功能清单

### 1. 引导启动页
- 炫酷机械太阳动态特效（CSS 纯动画实现）
- 3层齿轮轨道（正反交替旋转）+ 12道射线脉冲 + 核心光晕
- 背景科技网格 + 粒子感
- 点击后淡出进入主站，sessionStorage 记忆不重复显示

### 2. 布局外壳
- 左侧固定侧边栏（YU-NEWS Logo + 导航菜单 + 联系方式）
- 右侧主内容区 + 顶部 Header（搜索框 + 主题切换 + 用户入口）
- 移动端响应式：侧边栏转为抽屉弹出式

### 3. 业务页面
- **精选首页** `/selected`：分类标签筛选 + 时间线资讯卡片流
- **AI热点** `/hot`：🔥 按点赞数降序排列 + 时间范围筛选（今日/近3天/近7天/全部）+ 热度排行
- **全部AI动态** `/all`：多维度筛选 + 分页加载 + URL 搜索同步
- **AI日报** `/daily`：左侧日期选择器 + 右侧结构化日报内容
- **Agent接入** `/agent`：Skill / RSS / REST API 三标签 + 代码块高亮 + 一键复制
- **关于我们** `/about`：项目介绍 + 微信公众号 / 交流群二维码
- **更新日志** `/changelog`：时间倒序版本更新列表 + 标签标注（新增/优化/修复）

### 4. 用户体系
- **注册** `/register`：账号密码 + 确认密码 + 协议勾选 + 完整表单校验
- **登录** `/login`：账号密码 + 记住登录态 + 错误提示 + 测试账号提示
- **个人中心** `/profile`：头像 / 昵称 / 简介 / 账号信息
- **我的收藏** `/profile/favorites`：联动收藏状态
- **我的点赞** `/profile/likes`：联动点赞状态
- **浏览历史** `/profile/history`：路径缓存 + 清空功能
- **反馈** `/feedback`：路由守卫 + 字数限制 + 联系方式

### 5. 数据覆盖范围
- **AI模型类**：GPT-5、Claude 3.7、Gemini 2.5、DeepSeek、Grok 3、ChatGLM-5、MiniCPM-V 等
- **AI产品类**：Apple Intelligence、Cursor、Midjourney、Stable Diffusion、Bedrock Agent 等
- **机器人**：特斯拉 Optimus、宇树 H2、波士顿动力 Spot 4.0、Figure 03、1X NEO
- **商业航天**：SpaceX Starship、星河动力、蓝色起源、蓝箭航天朱雀三号、Rocket Lab Neutron
- **行业动态**：NVIDIA Blackwell Ultra、C-Eval 基准、AlphaFold 3、LangGraph 2.0

### 6. 核心交互
- 资讯卡片：点赞 / 收藏 / 分享 / 浏览原文
- 时间线样式：CSS 原生绘制竖线 + 圆点 + 自适应高度
- 搜索功能：全局关键词搜索 + 搜索历史记录
- 多级筛选：10 个分类标签 + 二级筛选 + 时间范围筛选
- 路由守卫：所有受保护页面未登录自动跳转登录页

### 7. 后端 API
- 注册/登录/信息查询/退出（JWT + bcrypt）
- 精选/全部资讯列表（支持分类/源类型筛选 + 分页）
- 点赞/取消点赞 + 收藏/取消收藏 + 浏览记录
- 反馈提交/列表查询
- 统一错误处理 + 统一返回格式

---

## 修复问题清单

| 问题 | 修复方式 |
|------|---------|
| 注册后第二次登录失败（Mock用户未持久化） | 新增 `mockAuth.ts` 将用户存入 localStorage |
| 密码始终验证通过（安全漏洞） | 新增密码匹配校验，注册时保存密码 |
| postcss ESM 兼容问题 | 重命名为 `.cjs` |
| FeedbackPage 渲染时调用 navigate | 改为 `<Navigate>` 组件 |
| useAuth 用 `window.location.href` | 改为 react-router `useNavigate` |
| 资讯分类过少 | 扩展至 9 个分类，新增 12 条数据 |
| 无时间范围筛选 | 新增今日/近3天/近7天/全部 时间筛选 |
| 无热点聚合页 | 新增 `/hot` 路由 + 榜单式展示 |
| 登录/注册页无品牌标识 | 页面增加 YU-NEWS Logo 品牌展示 |

---

## API 接口清单

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/user/register` | 注册 | - |
| POST | `/api/user/login` | 登录 | - |
| GET | `/api/user/profile` | 个人信息 | 是 |
| POST | `/api/user/logout` | 退出 | 是 |
| GET | `/api/news/selected` | 精选资讯 | - |
| GET | `/api/news/all` | 全部资讯 | - |
| POST | `/api/news/:id/like` | 点赞/取消 | 是 |
| POST | `/api/news/:id/favorite` | 收藏/取消 | 是 |
| GET | `/api/interaction/favorites` | 收藏列表 | 是 |
| GET | `/api/interaction/likes` | 点赞列表 | 是 |
| GET | `/api/interaction/history` | 浏览历史 | 是 |
| POST | `/api/feedback` | 提交反馈 | 是 |

---

## 测试结果

| 测试项 | 结果 |
|--------|------|
| 前端生产构建 | ✅ 通过（1569 modules, 4.7s） |
| 所有 13 个路由 | ✅ HTTP 200 |
| 后端启动 | ✅ 正常（端口 3001） |
| 健康检查接口 | ✅ 200 OK |
| 前后端 API 代理 | ✅ 正常 |
| Mock 模式独立运行 | ✅ 正常 |
| 深色/浅色主题切换 | ✅ 正常 |
| 注册 → 登录 → 二次登录 | ✅ 正常 |
| 密码校验 | ✅ 正常 |
| 用户持久化（刷新后登录） | ✅ 正常 |
| 路由守卫 | ✅ 正常 |
| 资讯筛选与搜索 | ✅ 正常 |
| 机械太阳启动动画 | ✅ 正常 |

---

## 项目结构（前端核心文件）

```
frontend/src/
├── components/
│   ├── Layout.tsx              # 全局布局
│   ├── SplashScreen.tsx        # 机械太阳启动动画
│   ├── ThemeProvider.tsx        # 主题同步
│   └── common/
│       ├── Sidebar.tsx         # 侧边栏（导航+联系方式）
│       ├── Header.tsx          # 头部（搜索+主题+用户）
│       └── NewsCard.tsx        # 资讯卡片（含时间线）
├── pages/
│   ├── SelectedPage/           # 精选首页
│   ├── HotTopicsPage/          # AI热点（新增）
│   ├── AllNewsPage/            # 全部AI动态
│   ├── AIDailyPage/            # AI日报
│   ├── AgentPage/              # Agent接入
│   ├── AboutPage/              # 关于我们
│   ├── ChangelogPage/          # 更新日志
│   ├── FeedbackPage/           # 反馈
│   ├── LoginPage/              # 登录
│   ├── RegisterPage/           # 注册
│   └── ProfilePage/            # 个人中心（含子路由）
├── lib/
│   ├── api.ts                  # Axios 实例
│   ├── mockAuth.ts             # Mock 认证服务（新增）
│   └── utils.ts                # 工具函数
├── mock/index.ts               # Mock 数据（32条资讯）
├── store/index.ts              # Zustand 状态管理
├── routes/index.tsx            # 路由配置
└── main.tsx                    # 入口（含SplashScreen）
```

---

## 启动说明

```bash
# 后端
cd D:/zhibo/backend
npm install
npm run dev          # → http://localhost:3001

# 前端
cd D:/zhibo/frontend
npm install
npm run dev          # → http://localhost:5173
```

前端自动代理 `/api` 到后端，也可设置 `.env` 中 `VITE_USE_MOCK=true` 独立运行前端展示。

---

## Mock 测试账号

| 用户名 | 密码 | 说明 |
|--------|------|------|
| demo | demo123456 | 管理员账号（"余江的AI世界"） |
| test | test123456 | 测试账号 |
| （注册） | 自设（≥6位） | 注册后持久化到 localStorage |

---

## 联系方式

- **项目负责人**：余江
- **合作电话**：13030460701
- **邮箱**：384448010@qq.com

---

*报告生成日期：2026-05-11 | 版本：v2.0*
