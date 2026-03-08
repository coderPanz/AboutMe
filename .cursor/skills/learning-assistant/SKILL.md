---
name: learning-assistant
description: 帮助开发者学习新技术，访问官方文档并生成结构化学习笔记。当用户需要学习新技术、理解官方文档或请求技术教程时使用。
---

# 学习助手

## 核心目标

帮助开发者高效学习新技术，通过访问官方文档 MCP 服务或者用户提供的链接，理解并重新组织知识内容，生成适合学习的技术笔记。

## 工作流程

### 1. 接收学习任务

当用户提出学习请求时：
- 确认要学习的技术主题
- **检查是否提供了官方文档链接**
- **检查可用的 MCP 服务**（查看 MCP 配置）
- 了解用户的学习目标（快速上手、深入理解、解决特定问题）

**决策流程（优化版）**：
```
有文档链接？
├─ 是 → 有 MCP fetch_doc？→ 是：用 MCP 访问链接
│                  └─ 否：用 WebFetch 直接访问
└─ 否 → 有 MCP search_docs？→ 是：先搜索，再用 WebFetch 获取具体内容
                    └─ 否：用 WebFetch 访问已知官方文档 URL
                             └─ 失败：引导用户提供链接或基于已有知识讲解
```

**重要发现**（来自 LangChain MCP 调试经验）：
- MCP 搜索可能返回不精准的结果（如搜索 "LangChain introduction" 返回 CLI 工具文档）
- 最佳实践：**MCP 搜索发现链接 + WebFetch 获取完整内容**
- 对于知名框架（LangChain、React、Vue 等），优先使用已知官方文档 URL

### 2. 访问官方文档（优化策略）

#### 方式 A：用户提供了具体文档链接（首选）

**优先级顺序**：
1. 如果有 MCP fetch_doc 工具 → 使用 MCP 访问
2. 否则 → 使用 WebFetch 直接访问

**WebFetch 使用示例**：
```
调用 WebFetch，参数：url="用户提供的 URL"
```

#### 方式 B：用户未提供链接，但有 MCP 服务

**优化后的搜索策略**（基于 LangChain MCP 调试经验）：

**步骤 1：使用 MCP 搜索发现链接**
```
调用 可用文档 MCP:search_docs，参数：query="技术名称 + 具体功能 + 关键词"
```

**关键：使用精准的搜索查询**
```typescript
// ✅ 推荐：包含具体功能和技术栈
"langchain agents tools typescript examples"
"langchain chains prompt templates tutorial"
"react useEffect hook state management"

// ❌ 避免：太宽泛
"LangChain"
"what is LangChain"
"LangChain introduction"
```

**步骤 2：从搜索结果提取有用链接**
- 识别与学习目标最相关的链接
- 优先选择包含 "docs"、"tutorial"、"guide"、"introduction" 的链接

**步骤 3：使用 WebFetch 获取完整内容**
```
调用 WebFetch，参数：url="从搜索结果中提取的链接"
```

#### 方式 C：无 MCP 服务或 MCP 搜索不准确

**使用已知官方文档 URL**（推荐）：

对于常见技术，直接使用官方文档 URL：
```typescript
// LangChain.js
"https://js.langchain.com/docs/introduction/"
"https://js.langchain.com/docs/quickstart/"
"https://js.langchain.com/docs/agents/"

// React
"https://react.dev/reference/react"

// Vue
"https://vuejs.org/guide/introduction.html"

// Next.js
"https://nextjs.org/docs"
```

**调用 WebFetch 获取内容**：
```
调用 WebFetch，参数：url="官方文档 URL"
```

#### 方式 D：完全无文档来源

如果以上方式都不可用：
- 告知用户："当前无法访问官方文档，请提供具体文档链接"
- 基于已有知识提供入门指导
- 建议用户补充官方文档链接

### 3. 内容理解与重构

**不要**：
- 逐字翻译官方文档
- 逐段复述文档内容
- 照搬官方示例代码

**要**：
- 理解文档核心概念后重新组织
- 用清晰的中文解释技术术语
- 设计更简单、适合学习的示例
- 提炼核心知识，去除冗余信息

### 4. 输出结构

#### 4.1 笔记头信息（必需）

所有学习笔记必须包含以下头信息结构：

```markdown
---
title: [技术名称] [主题] 学习笔记
excerpt: [1-2 句话简要概述笔记内容]
date: YYYY-MM-DD
tags:
  - [技术名称]
  - [相关领域]
category: 技术
readTime: [预计阅读时间，分钟]
pinned: false
---
```

**头信息字段说明**：

| 字段 | 说明 | 示例 |
|------|------|------|
| `title` | 笔记标题，格式：`[技术名称] [主题] 学习笔记` | `LangChain 使用指南学习笔记` |
| `excerpt` | 1-2 句话简要概述 | `探索 LangChain 核心概念，快速入门 Agent 开发` |
| `date` | 当前日期，格式：`YYYY-MM-DD` | `2025-03-08` |
| `tags` | 标签数组，至少包含技术名称和相关领域 | `["LangChain", "AI", "Agent"]` |
| `category` | 固定为 `技术` | `技术` |
| `readTime` | 预计阅读时间（分钟），根据内容长度估算 | `10` |
| `pinned` | 是否置顶，默认 `false` | `false` |

#### 4.2 笔记正文结构

**不要强制使用固定模板**，根据文档内容动态组织最合理的知识结构。

**可参考的模块**（仅在必要时使用）：
- 技术背景 / 解决的问题
- 核心概念 / 术语解释
- 工作原理 / 核心机制
- API 说明 / 参数说明
- 示例代码
- 实际开发场景 / 使用方式
- 知识总结 / 学习建议

#### 4.3 技术图表生成（重要）

当遇到以下场景时，**必须生成独立的 HTML 图表文件**：

**适用场景**：
- 技术架构图（如 LangChain 生态定位）
- 流程图（如数据处理流程、请求生命周期）
- 层级结构图（如组件树、继承关系）
- 时序图（如请求响应流程、状态变化）
- 对比图表（如技术选型对比、版本差异）
- 数据流图（如数据流向、依赖关系）

**生成规范**：

1. **文件命名**：`[技术名称]-[图表类型]-diagram.html`
   - 示例：`langchain-ecosystem-diagram.html`、`react-lifecycle-flowchart.html`

2. **存储位置**：与笔记文件同一目录下

3. **设计风格**（必须遵循）：
   - **配色**：低饱和度中性色（浅灰 `#f8f9fa`、浅蓝 `#e7f1ff`、浅绿 `#e6f6e6`）
   - **布局**：简洁卡片式设计，去除渐变和阴影
   - **图标**：线性或扁平化 SVG 图标
   - **字体**：无衬线字体（-apple-system, Segoe UI, Roboto）
   - **整体感觉**：专业、现代、干净，适合技术文档

4. **功能要求**：
   - 支持在浏览器中打开查看
   - **必须包含下载按钮**，点击可下载为 PNG 图片
   - 使用 html2canvas 或 Canvas 绘制高质量图片
   - 图片尺寸建议：900x600 或根据内容自适应

5. **HTML 结构模板**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>[图表标题]</title>
  <style>
    /* 低饱和度配色，专业简洁风格 */
  </style>
</head>
<body>
  <div class="container">
    <h1>[标题]</h1>
    <div class="diagram">[图表内容]</div>
    <button onclick="downloadDiagram()">下载图表</button>
  </div>
  <canvas id="canvas"></canvas>
  <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
  <script>
    function downloadDiagram() {
      // Canvas 绘制逻辑
    }
  </script>
</body>
</html>
```

6. **在笔记中引用**：
   - 生成 HTML 后，在笔记中使用 Markdown 图片语法引用
   - 示例：`![架构图](./langchain-ecosystem-diagram.png)`
   - 提示用户："打开 HTML 文件并点击下载按钮生成图片"

**设计原则**：
- ✅ 信息层级分明：标题醒目、正文易读
- ✅ 色彩统一克制：整体色调统一，避免花哨
- ✅ 专业现代：适合技术文档和正式展示
- ✅ 易于理解：图表结构清晰，逻辑一目了然
- ❌ 避免：鲜艳渐变色、复杂阴影、卡通风格、emoji 图标

**根据技术类型选择结构**：

```markdown
概念型技术（如设计模式、架构理念）：
背景 → 核心概念 → 原理 → 总结

API 类技术（如函数、方法、钩子）：
功能 → 参数说明 → 示例代码 → 使用建议

框架模块（如中间件、插件系统）：
模块作用 → 核心机制 → 示例 → 实际开发用法

工具库（如工具函数、辅助库）：
使用场景 → API 说明 → 示例 → 注意事项
```

#### 4.4 图表生成示例

当笔记中包含架构图、流程图等视觉内容时，参考以下完整流程：

**步骤 1：识别图表需求**
```markdown
在笔记中遇到以下描述时，应生成图表：
- "X 包含三个层次：A、B、C"
- "流程如下：第一步 → 第二步 → 第三步"
- "组件结构如图所示"
- "数据流向：Source → Transform → Target"
```

**步骤 2：生成 HTML 图表文件**
```
文件名：[技术名]-[图表类型]-diagram.html
位置：与笔记同目录
内容：完整的 HTML + CSS + Canvas 下载功能
```

**步骤 3：在笔记中引用**
```markdown
![架构图](./[技术名]-[图表类型]-diagram.png)

> 提示：打开 HTML 文件并点击下载按钮生成图片
```

**步骤 4：用户操作指引**
```markdown
在笔记开头或图表下方添加说明：
"本章包含可视化架构图，请打开 `xxx-diagram.html` 文件查看并下载图片"
```

**最终目标**：输出像开发者真实的学习笔记，而不是模板化文档。结构应该自然流畅，符合人类学习该技术的认知顺序。

## 内容指南

### 示例代码设计原则

1. **渐进式复杂度**：从最简单的"Hello World"开始，逐步增加复杂度
2. **注释清晰**：关键步骤必须有中文注释
3. **可运行**：确保示例代码可以独立运行
4. **场景化**：示例应贴近实际使用场景

### 技术解释风格

- 使用类比和比喻帮助理解抽象概念
- 避免生硬的机器翻译腔调
- 重要概念首次出现时提供英文原文
- 用开发者熟悉的术语和场景
- **不输出 emoji 表情**：保持专业的技术文档风格

### 伪代码使用

当官方代码过于复杂时，使用伪代码解释核心原理：

```python
# 示例：解释异步加载的核心流程
数据加载 = 发起请求 ()
如果 数据加载 成功:
    解析数据 ()
    渲染界面 ()
否则:
    显示错误 ()
```

## 质量检查清单

在输出学习笔记前，自我检查：

- [ ] 是否避免了逐字翻译
- [ ] 核心概念是否用中文清晰解释
- [ ] 示例代码是否比官方更简单易懂
- [ ] 结构是否自然流畅（而非模板化）
- [ ] 技术术语是否提供了必要的英文原文
- [ ] 是否提炼了核心知识而非复述文档
- [ ] **是否避免了 emoji 表情**（保持专业风格）
- [ ] 输出是否像开发者的真实学习笔记

## 特殊情况处理

### 没有官方文档链接

如果用户未提供文档链接：
1. 询问用户具体想学习的技术点
2. 建议用户提供官方文档链接
3. 或基于已有知识提供入门指导

### 文档为英文

处理英文文档时：
1. 理解段落核心意思
2. 用自然的中文重新表达
3. 保留关键术语的英文原文
4. 必要时添加文化背景说明

### 文档内容过于复杂

当官方文档信息密度过高时：
1. 拆分为多个学习阶段（入门、进阶、深入）
2. 优先讲解核心概念和常用场景
3. 将高级特性放到"进阶学习"部分
4. 提供学习路径建议

## 示例输出

### 用户请求
"帮我学习 React 的 useEffect hook，文档链接：https://react.dev/reference/react/useEffect"

### 输出示例（动态组织结构）

```markdown
---
title: React useEffect Hook 学习笔记
excerpt: 深入理解 React useEffect Hook 的工作原理、使用场景和最佳实践
date: 2025-03-08
tags:
  - React
  - Frontend
  - Hooks
category: 技术
readTime: 8
pinned: false
---

# React useEffect Hook 学习笔记

## 核心功能

useEffect 用于在 React 函数组件中处理"副作用"（side effects），包括：
- 数据获取
- 订阅管理
- 手动 DOM 操作
- 日志记录

它替代了 class 组件的生命周期方法（componentDidMount、componentDidUpdate、componentWillUnmount）。

## 核心概念

**副作用 (Side Effect)**：组件渲染之外的操作，会影响组件外部的世界。

**依赖数组**：控制 effect 何时重新执行
- 无依赖数组：每次渲染后执行
- 空数组 `[]`：仅挂载时执行一次
- 有依赖 `[dep]`：依赖变化时执行

**清理函数**：组件卸载或下次 effect 执行前的清理操作，防止内存泄漏。

## 工作原理

useEffect 在组件渲染后**异步**执行，不会阻塞屏幕更新：

```
1. 组件渲染完成
2. 浏览器绘制屏幕
3. useEffect 回调执行
```

## 使用模式与示例

### 基础用法 - 无依赖

```jsx
useEffect(() => {
  console.log('每次渲染后都会执行');
});
```

### 常用模式 - 仅首次渲染

```jsx
useEffect(() => {
  console.log('仅在组件挂载时执行一次');
}, []); // 空依赖数组
```

### 实际场景 - 数据获取

```jsx
useEffect(() => {
  let cancelled = false;
  
  async function fetchData() {
    const response = await fetch('/api/data');
    const data = await response.json();
    if (!cancelled) setData(data);
  }
  
  fetchData();
  
  // 清理函数：组件卸载时取消请求
  return () => { cancelled = true; };
}, []);
```

## 开发中的典型用法

- **数据获取**：组件挂载时从 API 加载数据
- **订阅管理**：订阅事件源，卸载时取消订阅
- **手动 DOM 操作**：如焦点设置、动画触发
- **日志记录**：记录页面访问、性能指标

## 关键要点

✓ useEffect 在渲染后执行，不阻塞屏幕更新
✓ 依赖数组控制执行时机
✓ 清理函数防止内存泄漏
✓ 避免在 effect 中创建循环依赖
```

## MCP 工具使用（增强版）

### 多工具协同策略

**核心发现**（来自 LangChain MCP 实际调试）：
- MCP 搜索可能不精准（搜索 "LangChain introduction" 返回 CLI 工具文档而非核心概念）
- 最佳方案：**MCP 搜索发现链接 + WebFetch 获取完整内容**

### 可用工具类型

#### 1. MCP 工具

**检查 MCP 服务器和工具**：
```bash
# 查看 MCP 配置
.cursor/.mcp.json

# 查看 MCP 服务器提供的工具
~/.cursor/projects/<project>/mcps/<server>/tools/
```

**MCP 工具调用规范**：
```markdown
✅ 正确：user-Docs by LangChain:SearchDocsByLangChain
❌ 错误：SearchDocsByLangChain（缺少服务器前缀）
❌ 错误：Docs by LangChain:search_docs（工具名称不匹配）
```

**MCP 搜索查询优化**：
```typescript
// ✅ 推荐：具体、包含技术栈和功能
"langchain agents tools typescript examples"
"langchain chains prompt templates tutorial"
"langchain retrievers vectorstores how to"

// ❌ 避免：太宽泛、容易混淆
"LangChain"              // 可能返回 CLI 文档
"what is LangChain"      // 可能返回 LangSmith 文档
"LangChain introduction" // 可能返回 Deep Agents 文档
```

#### 2. WebFetch 工具（重要补充）

**使用场景**：
- MCP 只有搜索工具，没有 fetch_doc 工具
- MCP 搜索结果不精准
- 已知官方文档 URL，直接获取内容

**调用方式**：
```
调用 WebFetch，参数：url="官方文档 URL"
```

**支持的 URL**：
- 官方文档网站（如 js.langchain.com、react.dev）
- GitHub 仓库文档
- 技术博客和教程

### 常见技术官方文档 URL 映射

**LangChain 生态**：
```typescript
{
  // LangChain.js (核心框架)
  "langchain-intro": "https://js.langchain.com/docs/introduction/",
  "langchain-quickstart": "https://js.langchain.com/docs/quickstart/",
  "langchain-models": "https://js.langchain.com/docs/models/",
  "langchain-prompts": "https://js.langchain.com/docs/prompts/",
  "langchain-chains": "https://js.langchain.com/docs/chains/",
  "langchain-agents": "https://js.langchain.com/docs/agents/",
  "langchain-retrievers": "https://js.langchain.com/docs/retrievers/",
  "langchain-embeddings": "https://js.langchain.com/docs/embeddings/",
  
  // LangGraph (代理编排)
  "langgraph-overview": "https://js.langchain.com/docs/langgraph/overview/",
  "langgraph-quickstart": "https://js.langchain.com/docs/langgraph/quickstart/",
  
  // Deep Agents (完整代理框架)
  "deepagents-overview": "https://js.langchain.com/docs/deepagents/overview/",
  
  // LangSmith (监控调试)
  "langsmith-home": "https://js.langchain.com/docs/langsmith/home/"
}
```

**其他常见技术**：
```typescript
{
  // React
  "react-docs": "https://react.dev/",
  "react-useeffect": "https://react.dev/reference/react/useEffect",
  
  // Vue
  "vue-docs": "https://vuejs.org/guide/introduction.html",
  
  // Next.js
  "nextjs-docs": "https://nextjs.org/docs",
  
  // TypeScript
  "ts-docs": "https://www.typescriptlang.org/docs/"
}
```

### 工具选择决策树

```
用户请求学习技术
│
├─ 有 MCP 配置？
│  ├─ 是 → MCP 搜索（使用精准查询）
│  │       │
│  │       └─ 搜索结果满意？
│  │           ├─ 是 → WebFetch 获取具体内容
│  │           └─ 否 → 使用已知官方文档 URL
│  │
│  └─ 否 → 使用已知官方文档 URL
│
└─ 有官方文档 URL？
   ├─ 是 → WebFetch 直接访问
   └─ 否 → 基于已有知识讲解 + 建议用户提供链接
```

### 实际调用示例

#### 示例 1：学习 LangChain Agents

```typescript
// 步骤 1: MCP 搜索（精准查询）
const searchResults = await CallMcpTool({
  server: "user-Docs by LangChain",
  toolName: "SearchDocsByLangChain",
  arguments: {
    query: "langchain agents createReactAgent tools typescript"
  }
});

// 步骤 2: 评估搜索结果
// 如果不满意，使用已知 URL

// 步骤 3: WebFetch 获取内容
const content = await WebFetch({
  url: "https://js.langchain.com/docs/agents/"
});

// 步骤 4: 生成学习笔记
generateLearningNote(content);
```

#### 示例 2：学习 React useEffect

```typescript
// 直接使用已知 URL（更高效）
const content = await WebFetch({
  url: "https://react.dev/reference/react/useEffect"
});

generateLearningNote(content);
```

### 错误处理与降级策略

**优先级顺序**：
```
1. MCP fetch_doc（如果有）
2. MCP search + WebFetch（推荐组合）
3. 已知官方文档 URL + WebFetch（最可靠）
4. 用户提供链接 + WebFetch
5. 基于已有知识讲解（最后手段）
```

**常见问题处理**：

| 问题 | 解决方案 |
|------|----------|
| MCP 搜索返回不相关内容 | 使用更精准的查询词，或直接用 WebFetch 访问已知 URL |
| WebFetch 无法访问 | 检查 URL 是否正确，尝试其他镜像或 CDN |
| 文档为英文 | 理解核心意思后用中文重新表达，保留关键术语英文 |
| 文档内容过于复杂 | 拆分学习阶段，优先讲解核心概念 |
| 多个 MCP 可用 | 优先使用与学习技术最相关的 MCP |

### 调试技巧

**检查 MCP 工具**：
```bash
# 查看 MCP 服务器目录
ls ~/.cursor/projects/<project>/mcps/

# 查看具体工具定义
cat ~/.cursor/projects/<project>/mcps/<server>/tools/*.json
```

**测试 MCP 调用**：
```typescript
// 先测试简单查询
CallMcpTool({
  server: "user-Docs by LangChain",
  toolName: "SearchDocsByLangChain",
  arguments: { query: "quickstart typescript" }
});

// 根据结果调整查询词
```

**验证 WebFetch**：
```typescript
// 测试 URL 是否可访问
WebFetch({ url: "https://js.langchain.com/docs/introduction/" });
```

### 实战案例：LangChain 学习笔记生成

#### 案例背景

用户请求："我是 langchain 初学者，创建一篇学习笔记让我认识 langchain"

#### 传统方式（仅用 MCP）❌

```typescript
// 问题：搜索结果不精准
CallMcpTool({
  server: "user-Docs by LangChain",
  toolName: "SearchDocsByLangChain",
  arguments: { query: "LangChain introduction" }
});

// 返回结果：主要是 Deep Agents CLI 和 LangSmith API 文档
// 缺少 LangChain.js 核心概念介绍
```

#### 改进方式（MCP + WebFetch 组合）✅

```typescript
// 步骤 1: MCP 搜索（使用精准查询）
const searchResults = await CallMcpTool({
  server: "user-Docs by LangChain",
  toolName: "SearchDocsByLangChain",
  arguments: { 
    query: "langchainjs typescript agents chains tutorial" 
  }
});

// 步骤 2: 评估搜索结果
// 发现主要返回 CLI 文档，不够基础

// 步骤 3: 使用已知官方文档 URL
const introContent = await WebFetch({
  url: "https://js.langchain.com/docs/introduction/"
});

// 步骤 4: 补充更多核心概念
const agentsContent = await WebFetch({
  url: "https://js.langchain.com/docs/agents/"
});

const modelsContent = await WebFetch({
  url: "https://js.langchain.com/docs/models/"
});

// 步骤 5: 整合内容生成笔记
// 基于真实文档内容，重新组织结构
```

#### 效果对比

| 维度 | 传统方式 | 改进方式 |
|------|----------|----------|
| 文档准确性 | ⚠️ 主要返回 CLI 文档 | ✅ 核心框架文档 |
| 内容完整性 | ❌ 缺少基础概念 | ✅ 完整的知识体系 |
| 学习效率 | ⚠️ 需要筛选大量不相关内容 | ✅ 直接获取核心内容 |
| 笔记质量 | ⚠️ 基于不准确内容 | ✅ 基于官方文档 |

### 经验总结

**关键改进点**：

1. **不依赖单一 MCP 搜索** - MCP 搜索可能不精准，特别是对于复杂的技术生态
2. **WebFetch 作为核心工具** - 直接访问官方文档，获取最准确内容
3. **建立 URL 映射库** - 积累常见技术的官方文档 URL，提高效率
4. **精准搜索查询** - 使用具体、包含技术栈的查询词

**最佳实践工作流**：
```
MCP 搜索（发现链接） → 评估结果 → WebFetch（获取内容） → 整合输出
        ↓                        ↓
    精准查询词            不满意则用已知 URL
```

**工具使用原则**：
- MCP 搜索：用于发现新文档、查找特定 API
- WebFetch：用于获取完整、准确的文档内容
- 已知 URL：最可靠、最高效的方式（优先使用）

## 技术图表生成实战

### 场景识别

当笔记中出现以下内容时，需要生成技术图表：

| 场景类型 | 触发词 | 图表类型 | 示例 |
|----------|--------|----------|------|
| 架构分层 | "层次"、"层级"、"架构" | 层级图 | LangChain 生态定位 |
| 流程描述 | "流程"、"步骤"、"顺序" | 流程图 | React 生命周期 |
| 组件关系 | "组成"、"包含"、"结构" | 结构图 | Vue 组件树 |
| 数据流向 | "流向"、"传递"、"输入输出" | 数据流图 | Redux 数据流 |
| 对比分析 | "对比"、"差异"、"vs" | 对比表 | React vs Vue |
| 时间顺序 | "时序"、"先后"、"生命周期" | 时序图 | HTTP 请求响应流程 |

### 生成流程

**步骤 1：分析图表需求**
```markdown
原文："LangChain 生态包含三个层次：Deep Agents、LangChain、LangGraph"

分析：
- 类型：架构分层
- 图表：垂直层级图
- 内容：3 个层级，每层包含名称和特性列表
```

**步骤 2：设计图表结构**
```html
结构规划：
- 标题 + 副标题
- 垂直排列的 3 个卡片
- 卡片间用箭头连接
- 每个卡片包含：图标 + 标题 + 特性列表
- 底部下载按钮
```

**步骤 3：实现 HTML 图表**
```html
1. 使用低饱和度配色（浅灰、浅蓝、浅绿）
2. 简洁卡片式设计（边框、无渐变）
3. 线性 SVG 图标
4. Canvas 绘制下载功能
5. 图片尺寸：900x600
```

**步骤 4：在笔记中引用**
```markdown
在笔记中添加：

![LangChain 生态定位图](./langchain-ecosystem-diagram.png)

> 提示：打开 `langchain-ecosystem-diagram.html` 文件，点击"下载架构图"按钮生成图片
```

### 图表设计规范

#### 配色方案（必须遵循）

**背景色**：
```css
body: #f8f9fa (浅灰背景)
container: white (白色卡片)
card: #f8f9fa (浅灰卡片)
```

**文字色**：
```css
标题：#212529 (深灰)
副标题：#6c757d (中灰)
正文：#495057 (中深灰)
```

**边框和强调色**：
```css
边框：#dee2e6 (浅灰)
箭头：#adb5bd (灰)
强调：#6c757d (深灰)
```

**层级区分色（可选）**：
```css
第一层：#e7f1ff (浅蓝)
第二层：#f8f9fa (浅灰)
第三层：#e6f6e6 (浅绿)
```

#### 布局规范

```
┌─────────────────────────────────────┐
│           标    题                   │
│         副 标 题                     │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │  图标 + 标题                 │   │
│  │  • 特性 1                    │   │
│  │  • 特性 2                    │   │
│  └─────────────────────────────┘   │
│                ↓                    │
│  ┌─────────────────────────────┐   │
│  │  图标 + 标题                 │   │
│  │  • 特性 1                    │   │
│  │  • 特性 2                    │   │
│  └─────────────────────────────┘   │
│                ↓                    │
│  ┌─────────────────────────────┐   │
│  │  图标 + 标题                 │   │
│  │  • 特性 1                    │   │
│  │  • 特性 2                    │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│      [下载图表按钮]                  │
└─────────────────────────────────────┘
```

#### 图标使用规范

使用线性 SVG 图标（来自 Feather Icons 或类似风格）：

```html
<!-- 层级/架构图标 -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
  <polyline points="2 17 12 22 22 17"></polyline>
  <polyline points="2 12 12 17 22 12"></polyline>
</svg>

<!-- 快速/闪电图标 -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
</svg>

<!-- 设置/工具图标 -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="3"></circle>
  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
</svg>
```

### 质量检查清单

生成图表后，自我检查：

- [ ] 配色是否为低饱和度中性色
- [ ] 是否去除了渐变和阴影
- [ ] 图标是否为线性/扁平化风格
- [ ] 字体是否为无衬线字体
- [ ] 信息层级是否分明
- [ ] 是否包含下载按钮
- [ ] 下载功能是否正常工作
- [ ] 图片尺寸是否合适（900x600 左右）
- [ ] 整体感觉是否专业、现代、干净
- [ ] 是否避免了 emoji 和卡通元素

### 常见图表类型模板

#### 1. 层级架构图

适用：技术栈分层、生态定位、组件层级

```
标题
副标题
┌─────────────┐
│  Layer 1    │
│  • 特性     │
└─────────────┘
       ↓
┌─────────────┐
│  Layer 2    │
│  • 特性     │
└─────────────┘
       ↓
┌─────────────┐
│  Layer 3    │
│  • 特性     │
└─────────────┘
[下载按钮]
```

#### 2. 流程图

适用：生命周期、工作流程、数据流转

```
标题
副标题
[开始] → [步骤 1] → [步骤 2] → [结束]
           ↓            ↓
        [分支 1]     [分支 2]
[下载按钮]
```

#### 3. 对比表

适用：技术对比、版本差异、方案选择

```
标题
副标题
┌──────────┬──────────┬──────────┐
│  特性    │  方案 A   │  方案 B   │
├──────────┼──────────┼──────────┤
│  性能    │  ✓       │  ✗       │
│  易用性  │  ✓       │  ✓       │
└──────────┴──────────┴──────────┘
[下载按钮]
```

### 实战案例

**案例 1：LangChain 生态定位图**

需求：展示 LangChain 三个层次的架构关系

解决步骤：
1. 创建 `langchain-ecosystem-diagram.html`
2. 设计垂直层级布局
3. 使用浅灰、浅蓝、浅绿区分层级
4. 添加线性图标
5. 实现 Canvas 下载功能
6. 在笔记中引用：`![架构图](./langchain-ecosystem-diagram.png)`

效果：
- 专业、现代的视觉呈现
- 一键下载高质量 PNG 图片
- 完美融入技术文档

**案例 2：React 生命周期流程图**

需求：展示组件从创建到销毁的完整流程

解决步骤：
1. 创建 `react-lifecycle-flowchart.html`
2. 设计水平流程图布局
3. 使用圆角矩形表示各个阶段
4. 使用箭头连接各阶段
5. 添加关键生命周期方法标注
6. 实现下载功能

**案例 3：Redux 数据流图**

需求：展示 Redux 的数据流动过程

解决步骤：
1. 创建 `redux-dataflow-diagram.html`
2. 设计环形数据流布局
3. 中心放置 Store
4. 周围放置 Action、Reducer、View
5. 使用箭头表示数据流向
6. 实现下载功能
