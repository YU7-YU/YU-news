import type { NewsItem, DailyReport, ChangelogEntry, User } from '@/store'

/* ==================== Mock 用户 ==================== */
export const mockUsers: User[] = [
  { id: 1, username: 'demo', nickname: '余江的AI世界', avatar: '', bio: '每天扒 AI 圈的最新动静' },
  { id: 2, username: 'test', nickname: '测试用户', avatar: '', bio: '' },
]

/* ==================== Mock 资讯 ==================== */
export const mockNews: NewsItem[] = [
  {
    id: 1, timestamp: '17:20', date: '2026-05-11', author: 'Suki', authorAvatar: '',
    title: 'Suki 推出自主智能体 Suki Agent，Meta 计划将其整合进 Instagram',
    content: 'Suki 最近发布了自主智能体 Suki Agent，具备自主操作能力。Meta 正在与 Suki 合作，计划将 Suki Agent 整合进 Instagram 等平台。Suki Agent 可以自主浏览网页、填写表单、执行多步操作，标志着 AI Agent 从"工具"向"自主工作者"的转变。',
    sourceUrl: 'https://suki.ai', sourceName: 'Suki AI',
    tags: ['产品', 'Agent'], recommendReason: 'AI Agent 自主化趋势的重要一步', likes: 128,
  },
  {
    id: 2, timestamp: '16:55', date: '2026-05-11', author: 'AI前沿', authorAvatar: '',
    title: 'DeepSeek 发布最新模型，推理能力大幅提升',
    content: 'DeepSeek 发布了新一代推理模型，在数学推理、代码生成等任务上表现突出。模型支持 128K 上下文窗口，推理速度比上一代提升 3 倍，同时保持了较低的 API 调用成本。',
    sourceUrl: '', sourceName: 'DeepSeek',
    tags: ['模型'], likes: 95,
  },
  {
    id: 3, timestamp: '16:30', date: '2026-05-11', author: 'AI日报', authorAvatar: '',
    title: 'OpenAI 宣布 GPT-5 将于本月发布，多模态能力全面升级',
    content: 'OpenAI 正式宣布 GPT-5 将在本月内发布。GPT-5 将在多模态理解、长上下文处理、工具调用等方面实现重大突破，同时推理能力相比 GPT-4o 提升显著。',
    sourceUrl: 'https://openai.com', sourceName: 'OpenAI',
    tags: ['模型', '一手信源'], likes: 342,
  },
  {
    id: 4, timestamp: '15:42', date: '2026-05-11', author: 'TechDaily', authorAvatar: '',
    title: 'Google DeepMind 发布 Gemini 2.5，多模态能力再创新高',
    content: 'Google DeepMind 发布了 Gemini 2.5 系列模型，在多模态理解、数学推理和代码生成任务上取得了显著进步。Gemini 2.5 Pro 在多项基准测试中超越了 GPT-4o。',
    sourceUrl: 'https://deepmind.google', sourceName: 'Google DeepMind',
    tags: ['模型'], recommendReason: '多模态 AI 的最新标杆', likes: 216,
  },
  {
    id: 5, timestamp: '14:18', date: '2026-05-11', author: 'AI前沿', authorAvatar: '',
    title: 'Anthropic Claude 3.7 发布，思考模式全面升级',
    content: 'Anthropic 发布了 Claude 3.7 系列模型，新版引入了增强的"思考模式"，可以在复杂任务中进行多步骤推理。Claude 3.7 Sonnet 在编程和数学任务上表现尤为出色。',
    sourceUrl: 'https://anthropic.com', sourceName: 'Anthropic',
    tags: ['模型', '一手信源'], likes: 189,
  },
  {
    id: 6, timestamp: '13:34', date: '2026-05-11', author: 'AI日报', authorAvatar: '',
    title: '中国团队开源大模型评测基准 C-Eval，国际竞争力持续提升',
    content: '中国 AI 研究团队发布了新一代大模型评测基准 C-Eval，涵盖中文理解、逻辑推理、专业知识等多个维度。该基准已成为评估中文大模型能力的重要标准，推动了中文 AI 生态的发展。',
    sourceUrl: '', sourceName: 'C-Eval',
    tags: ['论文', '行业'], likes: 67,
  },
  {
    id: 7, timestamp: '12:50', date: '2026-05-11', author: 'AI资讯站', authorAvatar: '',
    title: 'xAI 发布 Grok 3，实时搜索能力全面增强',
    content: 'xAI 发布了 Grok 3 模型，新版引入了实时网络搜索能力，可以直接获取最新资讯并回答时效性问题。Grok 3 还支持多模态输入输出，可以理解和生成图像。',
    sourceUrl: 'https://x.ai', sourceName: 'xAI',
    tags: ['模型'], likes: 153,
  },
  {
    id: 8, timestamp: '11:25', date: '2026-05-11', author: 'AI前沿', authorAvatar: '',
    title: '苹果发布 Apple Intelligence 2.0，Siri 全面 AI 化',
    content: '苹果在 WWDC 上发布了 Apple Intelligence 2.0，全新 Siri 基于大型语言模型，可以理解上下文、执行多步操作。新功能包括屏幕感知、应用内操作、个性化记忆等。',
    sourceUrl: 'https://apple.com', sourceName: 'Apple',
    tags: ['产品', '行业'], recommendReason: '苹果生态 AI 化的重要里程碑', likes: 278,
  },
  {
    id: 9, timestamp: '10:40', date: '2026-05-11', author: 'AI日报', authorAvatar: '',
    title: '开源社区发布 MiniCPM-V 4.0，端侧多模态性能突破',
    content: '开源团队面壁智能发布了 MiniCPM-V 4.0，在端侧设备上实现了接近云端模型的多模态理解能力。该模型可以在手机上运行，支持图像理解、文档解析等功能。',
    sourceUrl: '', sourceName: '面壁智能',
    tags: ['模型', '行业'], likes: 84,
  },
  {
    id: 10, timestamp: '09:55', date: '2026-05-11', author: 'TechDaily', authorAvatar: '',
    title: 'AWS 推出 Bedrock Agent 新能力，企业级 AI Agent 平台升级',
    content: 'AWS 宣布 Bedrock Agent 服务新增多项能力，包括多 Agent 协作、自定义工具注册、知识库增强检索等。企业可以更便捷地构建和部署 AI Agent 应用。',
    sourceUrl: 'https://aws.amazon.com', sourceName: 'AWS',
    tags: ['产品', 'Agent'], likes: 91,
  },
  {
    id: 11, timestamp: '09:20', date: '2026-05-10', author: 'Suki', authorAvatar: '',
    title: 'Cursor 发布 AI 编程助手 2.0，代码生成质量大幅提升',
    content: 'Cursor 发布了新一代 AI 编程助手，代码生成准确率和上下文理解能力大幅提升。新版本支持多文件编辑、智能重构建议、自动测试生成等功能。',
    sourceUrl: 'https://cursor.sh', sourceName: 'Cursor',
    tags: ['产品'], likes: 167,
  },
  {
    id: 12, timestamp: '08:45', date: '2026-05-10', author: 'AI前沿', authorAvatar: '',
    title: 'Midjourney v7 发布，图像生成质量实现质的飞跃',
    content: 'Midjourney 发布了 v7 版本，图像生成质量大幅提升，特别是在人物肖像、复杂场景和风格一致性方面。新版本还支持视频生成预览功能。',
    sourceUrl: 'https://midjourney.com', sourceName: 'Midjourney',
    tags: ['产品'], likes: 203,
  },
  {
    id: 13, timestamp: '16:10', date: '2026-05-09', author: 'AI资讯站', authorAvatar: '',
    title: '清华团队发布 ChatGLM-5，中文对话能力再次突破',
    content: '清华智谱团队发布了 ChatGLM-5 系列模型，在中文对话、知识问答、代码生成等任务上表现优异。ChatGLM-5 采用了新的训练策略，大幅提升了模型的安全性和对齐水平。',
    sourceUrl: '', sourceName: '智谱AI',
    tags: ['模型', '行业'], likes: 145,
  },
  {
    id: 14, timestamp: '14:30', date: '2026-05-09', author: 'AI日报', authorAvatar: '',
    title: 'AI 辅助药物研发新突破：AlphaFold 3 预测蛋白质结构精度达原子级',
    content: 'DeepMind 发布了 AlphaFold 3，在蛋白质结构预测精度上达到原子级别。该模型可以预测蛋白质与配体、DNA、RNA 的相互作用，为药物研发提供了强大工具。',
    sourceUrl: 'https://deepmind.google', sourceName: 'Google DeepMind',
    tags: ['模型', '论文'], recommendReason: 'AI 制药领域的里程碑式进展', likes: 198,
  },
  {
    id: 15, timestamp: '11:20', date: '2026-05-09', author: 'TechDaily', authorAvatar: '',
    title: 'LangChain 发布 LangGraph 2.0，AI Agent 编排框架升级',
    content: 'LangChain 团队发布了 LangGraph 2.0，全新的 AI Agent 编排框架支持更复杂的多 Agent 协作模式。新版本引入了可视化工作流编辑器，降低了 Agent 开发门槛。',
    sourceUrl: 'https://langchain.com', sourceName: 'LangChain',
    tags: ['产品', 'Agent'], likes: 76,
  },
  {
    id: 16, timestamp: '09:40', date: '2026-05-08', author: 'AI前沿', authorAvatar: '',
    title: 'NVIDIA 发布 Blackwell Ultra GPU，AI 训练性能翻倍',
    content: 'NVIDIA 发布了 Blackwell Ultra GPU，AI 训练性能相比上一代翻倍，支持更大的模型参数量和更长的上下文窗口。新 GPU 已开始在各大云平台上部署。',
    sourceUrl: 'https://nvidia.com', sourceName: 'NVIDIA',
    tags: ['产品', '行业'], likes: 132,
  },
  {
    id: 17, timestamp: '15:55', date: '2026-05-08', author: 'AI资讯站', authorAvatar: '',
    title: '分享 5 个提升 AI 提示词效果的实用技巧',
    content: '本文总结了 5 个经过验证的提示词工程技巧：1) 使用角色设定 2) 提供示例 3) 分步引导 4) 设定输出格式 5) 迭代优化。这些技巧可以显著提升大模型的输出质量。',
    sourceUrl: '', sourceName: 'AI技巧分享',
    tags: ['技巧'], likes: 256,
  },
  {
    id: 18, timestamp: '13:20', date: '2026-05-08', author: 'AI日报', authorAvatar: '',
    title: 'Stability AI 发布 Stable Diffusion 4，图像生成速度提升 10 倍',
    content: 'Stability AI 发布了 Stable Diffusion 4，采用全新的架构设计，图像生成速度提升了 10 倍，同时图像质量和细节表现也有显著提升。新版本支持更高分辨率的图像生成。',
    sourceUrl: 'https://stability.ai', sourceName: 'Stability AI',
    tags: ['模型', '产品'], likes: 178,
  },
  {
    id: 19, timestamp: '10:15', date: '2026-05-07', author: 'TechDaily', authorAvatar: '',
    title: 'Hugging Face 推出 Spaces 2.0，AI 应用部署平台全面升级',
    content: 'Hugging Face 发布了 Spaces 2.0，全新的 AI 应用部署平台支持更多框架和硬件加速选项。新版本引入了团队协作功能和私有空间，更适合企业级使用。',
    sourceUrl: 'https://huggingface.co', sourceName: 'Hugging Face',
    tags: ['产品'], likes: 89,
  },
  {
    id: 20, timestamp: '08:30', date: '2026-05-07', author: 'AI前沿', authorAvatar: '',
    title: 'Perplexity 发布 Sonar Pro，实时搜索 AI 能力大幅增强',
    content: 'Perplexity AI 发布了 Sonar Pro 模型，在实时网络搜索和引用准确性上表现优异。Sonar Pro 可以实时检索最新资讯，并提供可验证的引用来源。',
    sourceUrl: 'https://perplexity.ai', sourceName: 'Perplexity',
    tags: ['模型', '产品'], likes: 112,
  },
  // ========= 机器人 =========
  {
    id: 21, timestamp: '16:00', date: '2026-05-11', author: '机器人前沿', authorAvatar: '',
    title: '特斯拉 Optimus 机器人实现自主工厂作业，量产提速',
    content: '特斯拉 Optimus 人形机器人在最新演示中展示了自主工厂作业能力，包括零部件搬运、组装等任务。马斯克表示明年计划量产 1000 台以上，单台目标售价低于 2 万美元。',
    sourceUrl: 'https://tesla.com/optimus', sourceName: 'Tesla',
    tags: ['机器人'], recommendReason: '人形机器人产业化关键进展', likes: 312,
  },
  {
    id: 22, timestamp: '14:20', date: '2026-05-11', author: '机器之心', authorAvatar: '',
    title: '宇树科技发布通用人形机器人 H2，运动能力超预期',
    content: '宇树科技发布了新一代通用人形机器人 H2，在运动控制、平衡能力和任务执行方面实现重大突破。H2 可以完成跳跃、奔跑、上下楼梯等高难度动作，并能自主适应复杂地形。',
    sourceUrl: '', sourceName: '宇树科技',
    tags: ['机器人'], likes: 245,
  },
  {
    id: 23, timestamp: '11:10', date: '2026-05-10', author: '机器人前沿', authorAvatar: '',
    title: '波士顿动力发布 Spot 4.0，工业巡检场景全面升级',
    content: '波士顿动力发布了 Spot 机器人 4.0 版本，新增了自主导航、异常检测、远程操控等能力。Spot 4.0 在石油化工、电力巡检等工业场景中得到了广泛应用。',
    sourceUrl: 'https://bostondynamics.com', sourceName: 'Boston Dynamics',
    tags: ['机器人', '产品'], likes: 178,
  },
  {
    id: 24, timestamp: '09:35', date: '2026-05-10', author: 'AI资讯站', authorAvatar: '',
    title: 'Figure AI 发布 Figure 03，人形机器人商业落地加速',
    content: 'Figure AI 发布了 Figure 03 人形机器人，首次在物流仓储场景中实现商业化部署。Figure 03 具备自主决策、多模态感知和人机协作能力，已与多家物流公司签订采购协议。',
    sourceUrl: 'https://figure.ai', sourceName: 'Figure AI',
    tags: ['机器人', '行业'], recommendReason: '人形机器人商业化的标志性事件', likes: 195,
  },
  {
    id: 25, timestamp: '15:50', date: '2026-05-09', author: '机器之心', authorAvatar: '',
    title: 'OpenAI 投资的人形机器人公司 1X 发布 NEO 原型机',
    content: 'OpenAI 投资的挪威人形机器人公司 1X 发布了 NEO 原型机，采用全新的柔性驱动技术，在安全性和能耗方面取得突破。NEO 专为家庭场景设计，可以在复杂居家环境中自主移动和执行任务。',
    sourceUrl: 'https://1x.tech', sourceName: '1X Technologies',
    tags: ['机器人', '模型'], likes: 234,
  },
  // ========= 商业航天 =========
  {
    id: 26, timestamp: '17:45', date: '2026-05-11', author: '太空探索', authorAvatar: '',
    title: 'SpaceX Starship 成功完成第 8 次轨道级测试飞行',
    content: 'SpaceX Starship 成功完成了第 8 次轨道级测试飞行，实现了助推器回收、轨道运行和受控再入的全流程验证。此次测试标志着 Starship 距离商业运营又近了一步。',
    sourceUrl: 'https://spacex.com', sourceName: 'SpaceX',
    tags: ['商业航天'], recommendReason: '太空探索里程碑事件', likes: 456,
  },
  {
    id: 27, timestamp: '15:30', date: '2026-05-11', author: '航天动态', authorAvatar: '',
    title: '中国民营火箭公司星河动力成功发射一箭五星',
    content: '星河动力航天成功完成了"一箭五星"商业发射任务，将 5 颗商业遥感卫星送入预定轨道。这是该公司今年第 6 次商业发射，创造了中国民营火箭发射频率新纪录。',
    sourceUrl: '', sourceName: '星河动力',
    tags: ['商业航天'], likes: 267,
  },
  {
    id: 28, timestamp: '13:15', date: '2026-05-10', author: '太空探索', authorAvatar: '',
    title: 'NASA 与蓝色起源合作推进月球着陆器开发',
    content: 'NASA 宣布与蓝色起源签署价值 34 亿美元的合同，推进 Blue Moon 月球着陆器的开发。该着陆器计划在 2028 年前实现载人登月任务，是 Artemis 计划的重要组成部分。',
    sourceUrl: 'https://nasa.gov', sourceName: 'NASA',
    tags: ['商业航天', '行业'], likes: 189,
  },
  {
    id: 29, timestamp: '10:50', date: '2026-05-10', author: '航天动态', authorAvatar: '',
    title: '蓝箭航天朱雀三号可重复使用火箭完成垂直起降试验',
    content: '蓝箭航天完成了朱雀三号可重复使用火箭的 10 公里级垂直起降试验，成功实现了高空回收。朱雀三号是中国首款采用不锈钢箭体结构的中大型可重复使用运载火箭。',
    sourceUrl: '', sourceName: '蓝箭航天',
    tags: ['商业航天'], recommendReason: '中国可重复使用火箭技术的重大突破', likes: 312,
  },
  {
    id: 30, timestamp: '08:20', date: '2026-05-09', author: '太空探索', authorAvatar: '',
    title: 'Rocket Lab 发布 Neutron 火箭，挑战中型载荷市场',
    content: 'Rocket Lab 发布了 Neutron 中型运载火箭，目标是将 8 吨载荷送入近地轨道。Neutron 采用碳纤维结构和可复用第一级，单次发射成本预计低于 3000 万美元。',
    sourceUrl: 'https://rocketlab.com', sourceName: 'Rocket Lab',
    tags: ['商业航天', '产品'], likes: 145,
  },
  {
    id: 31, timestamp: '16:40', date: '2026-05-08', author: '航天动态', authorAvatar: '',
    title: '星际荣耀双曲线三号火箭完成全箭合练，近期首飞',
    content: '星际荣耀双曲线三号中型运载火箭在酒泉卫星发射中心完成了全箭合练，计划近期执行首次轨道发射任务。双曲线三号采用液氧甲烷发动机，具备可重复使用能力。',
    sourceUrl: '', sourceName: '星际荣耀',
    tags: ['商业航天', '行业'], likes: 98,
  },
  {
    id: 32, timestamp: '09:00', date: '2026-05-07', author: '太空探索', authorAvatar: '',
    title: '中国空间站问天实验舱完成多项空间科学实验',
    content: '中国空间站问天实验舱在轨运行期间完成了多项空间科学实验，包括微重力材料制备、空间生命科学等前沿研究。新一阶段将开展更多国际合作项目。',
    sourceUrl: '', sourceName: '中国载人航天',
    tags: ['商业航天'], likes: 156,
  },
]
export const mockDailyReports: DailyReport[] = [
  {
    id: 1, date: '2026-05-11', title: 'AI日报 | 2026年5月11日 星期一',
    sections: [
      {
        id: 1, title: '01', subtitle: '模型发布/更新',
        items: [
          { id: 1, title: 'OpenAI 宣布 GPT-5 将于本月发布，多模态能力全面升级', author: 'OpenAI', source: 'openai.com', content: 'OpenAI 正式宣布 GPT-5 将在本月内发布。GPT-5 将在多模态理解、长上下文处理、工具调用等方面实现重大突破。' },
          { id: 2, title: 'Google DeepMind 发布 Gemini 2.5，多模态能力再创新高', author: 'Google DeepMind', source: 'deepmind.google', content: 'Gemini 2.5 Pro 在多项基准测试中超越了 GPT-4o。' },
        ],
      },
      {
        id: 2, title: '02', subtitle: '产品发布/更新',
        items: [
          { id: 3, title: '苹果发布 Apple Intelligence 2.0，Siri 全面 AI 化', author: 'Apple', source: 'apple.com', content: '全新 Siri 基于大型语言模型，可以理解上下文、执行多步操作。' },
        ],
      },
      {
        id: 3, title: '03', subtitle: '行业动态',
        items: [
          { id: 4, title: '中国团队开源大模型评测基准 C-Eval', author: 'C-Eval', source: 'c-eval.org', content: '涵盖中文理解、逻辑推理、专业知识等多个维度。' },
          { id: 5, title: 'NVIDIA 发布 Blackwell Ultra GPU，AI 训练性能翻倍', author: 'NVIDIA', source: 'nvidia.com', content: 'AI 训练性能相比上一代翻倍。' },
        ],
      },
    ],
  },
  {
    id: 2, date: '2026-05-10', title: 'AI日报 | 2026年5月10日 星期日',
    sections: [
      {
        id: 1, title: '01', subtitle: '模型发布/更新',
        items: [
          { id: 1, title: 'Anthropic Claude 3.7 发布，思考模式全面升级', author: 'Anthropic', source: 'anthropic.com', content: 'Claude 3.7 Sonnet 在编程和数学任务上表现尤为出色。' },
        ],
      },
      {
        id: 2, title: '02', subtitle: '产品发布/更新',
        items: [
          { id: 2, title: 'Midjourney v7 发布，图像生成质量实现质的飞跃', author: 'Midjourney', source: 'midjourney.com', content: '支持视频生成预览功能。' },
          { id: 3, title: 'Cursor 发布 AI 编程助手 2.0', author: 'Cursor', source: 'cursor.sh', content: '代码生成准确率和上下文理解能力大幅提升。' },
        ],
      },
    ],
  },
]

/* ==================== Mock 更新日志 ==================== */
export const mockChangelogs: ChangelogEntry[] = [
  {
    id: 1, date: '2026年5月9日', time: '09:25', tag: '新增',
    title: '手机端阅读功能上线',
    items: [
      '全面优化移动端阅读体验，针对手机浏览器进行了深度适配',
      '新增底部导航栏，首页、AI日报、Agent接入等核心功能一键直达',
      '优化卡片展示，文字、图片、链接在移动端都有更好的展示效果',
      '新增左滑/右滑操作，手机上也能快速浏览和切换资讯',
    ],
  },
  {
    id: 2, date: '2026年5月8日', time: '15:30', tag: '优化',
    title: '更新日志页面上线',
    items: [
      '新增更新日志页面，记录 YU-NEWS 的每一次更新和改进',
      '优化了页面加载速度，资讯列表加载时间减少 30%',
      '修复了部分页面在深色模式下的显示问题',
    ],
  },
  {
    id: 3, date: '2026年5月5日', time: '10:00', tag: '新增',
    title: 'Agent接入页面上线',
    items: [
      '新增 Agent 接入页面，支持 Skill、RSS、REST API 三种接入方式',
      '提供了详细的接入文档和代码示例',
      '支持一键复制接入代码',
    ],
  },
  {
    id: 4, date: '2026年5月1日', time: '08:00', tag: '修复',
    title: '修复若干已知问题',
    items: [
      '修复了搜索功能在特定条件下不生效的问题',
      '修复了点赞计数不准确的问题',
      '优化了页面加载性能',
    ],
  },
]

/* 是否使用 Mock 模式 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
