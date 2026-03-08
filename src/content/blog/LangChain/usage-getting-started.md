---
title: LangChain 使用指南学习笔记
excerpt: 探索 LangChain 核心概念，快速入门 Agent 开发，涵盖安装、快速入门和设计哲学
date: 2026-03-08
tags:
  - LangChain
  - AI
  - Agent
category: 技术
readTime: 15
pinned: false
---

# LangChain 学习笔记：使用指南

## 一、LangChain 概述

### 什么是 LangChain

LangChain 是一个开源框架，提供预构建的 Agent 架构和集成，帮助开发者快速构建由大语言模型（LLM）驱动的智能应用。它的核心目标是：**让开发者能够以最少的代码量（不到 10 行）开始构建完全自定义的 Agent 和应用**。

### LangChain 生态定位

LangChain 生态系统包含三个层次，根据需求复杂度选择：

```
┌─────────────────────────────────────────┐
│  Deep Agents（推荐起点）                 │
│  - 开箱即用的完整 Agent 框架              │
│  - 自动压缩长对话、虚拟文件系统           │
│  - 支持子 Agent 生成和上下文隔离          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  LangChain（本框架）                     │
│  - 快速构建 Agent 和自主应用              │
│  - 灵活的上下文工程能力                 │
│  - 基于 LangGraph 构建                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  LangGraph（底层编排框架）               │
│  - 低级别 Agent 编排和运行时              │
│  - 支持确定性和 Agent 工作流混合          │
│  - 需要深度定制时使用                     │
└─────────────────────────────────────────┘
```

**选择建议**：
- 快速构建 Agent → 使用 LangChain
- 需要现代功能（自动压缩对话、子 Agent） → 使用 Deep Agents
- 高级定制需求 → 使用 LangGraph

### 核心优势

#### 1. 标准化的模型接口

不同 LLM 提供商（OpenAI、Anthropic、Google 等）有不同的 API 格式。LangChain 标准化了模型交互接口，实现：
- 无缝切换提供商
- 避免供应商锁定
- 统一的调用方式

#### 2. 易用且灵活的 Agent

- **低门槛**：10 行代码即可创建简单 Agent
- **高灵活性**：支持深度上下文工程定制
- **内置能力**：基于 LangGraph，自动获得持久化执行、流式输出、人机交互等能力

#### 3. LangSmith 调试支持

LangSmith 提供：
- Agent 执行路径可视化
- 状态转换追踪
- 详细运行时指标
- 调试和评估工具

---

## 二、安装 LangChain

### 基础安装

LangChain 需要 **Node.js 20+** 环境。

```bash
# 使用 npm
npm install langchain @langchain/core

# 使用 pnpm
pnpm add langchain @langchain/core

# 使用 yarn
yarn add langchain @langchain/core

# 使用 bun
bun add langchain @langchain/core
```

**核心包说明**：
- `langchain`：主框架，提供 Agent 创建、工具定义等核心功能
- `@langchain/core`：核心抽象和接口

### 安装模型集成

LangChain 提供数百个 LLM 集成，每个集成是独立的包：

```bash
# 安装 OpenAI 集成
npm install @langchain/openai

# 安装 Anthropic 集成
npm install @langchain/anthropic
```

**常见模型集成包**：
- `@langchain/openai` - OpenAI GPT 系列
- `@langchain/anthropic` - Anthropic Claude 系列
- `@langchain/google-genai` - Google Gemini 系列
- `@langchain/mistralai` - Mistral AI 系列

> 完整集成列表查看：[LangChain Integrations](https://docs.langchain.com/oss/javascript/integrations/providers/overview)

---

## 三、快速入门

### 前置要求

1. 设置环境变量（以 Anthropic 为例）：
```bash
export ANTHROPIC_API_KEY="your-api-key"
```

2. 安装 LangChain（见上文）

3. 准备模型 API 密钥（Claude、OpenAI 等）

> **提示**：如果使用 AI 编程助手（如 Cursor、Claude Code），建议安装 [LangChain Docs MCP 服务器](https://docs.langchain.com/use-these-docs)，可实时获取最新文档和示例。

### 示例 1：创建基础 Agent

最简单的 Agent 只需 3 个组件：**模型**、**工具**、**提示词**。

```typescript
import { createAgent, tool } from "langchain";
import * as z from "zod";

// 1. 定义工具：天气查询
const getWeather = tool(
  (input) => `It's always sunny in ${input.city}!`,
  {
    name: "get_weather",
    description: "Get the weather for a given city",
    schema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
  }
);

// 2. 创建 Agent
const agent = createAgent({
  model: "claude-sonnet-4-6",
  tools: [getWeather],
});

// 3. 调用 Agent
const response = await agent.invoke({
  messages: [{ role: "user", content: "What's the weather in Tokyo?" }],
});

console.log(response);
```

**输出示例**：
```
Based on the weather data I retrieved, it's always sunny in Tokyo!
```

**核心概念解析**：

1. **工具（Tool）**：Agent 可调用的函数，需要定义：
   - 函数实现
   - 名称和描述（Agent 用它理解工具用途）
   - 输入 Schema（使用 Zod 验证）

2. **模型（Model）**：使用字符串名称指定，如 `"claude-sonnet-4-6"`

3. **消息格式**：标准化为 `{ role, content }` 格式

### 示例 2：真实场景 Agent

构建一个完整的天气预报 Agent，包含：
- 系统提示词定义角色
- 多个工具协作
- 结构化输出
- 对话记忆
- 模型配置

#### 步骤 1：定义系统提示词

```typescript
const systemPrompt = `You are an expert weather forecaster, who speaks in puns.

You have access to two tools:

- get_weather_for_location: use this to get the weather for a specific location
- get_user_location: use this to get the user's location

If a user asks you for the weather, make sure you know the location. If you can tell from the question that they mean wherever they are, use the get_user_location tool to find their location.`;
```

**提示词设计原则**：
- 明确角色定位（"expert weather forecaster"）
- 列出可用工具
- 说明工具使用规则
- 定义行为风格（"speaks in puns"）

#### 步骤 2：创建工具

```typescript
import { tool, type ToolRuntime } from "langchain";
import * as z from "zod";

// 工具 1：天气查询
const getWeather = tool(
  ({ city }) => `It's always sunny in ${city}!`,
  {
    name: "get_weather_for_location",
    description: "Get the weather for a given city",
    schema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
  }
);

// 工具 2：获取用户位置（需要运行时上下文）
type AgentRuntime = ToolRuntime<unknown, { user_id: string }>;

const getUserLocation = tool(
  (_, config: AgentRuntime) => {
    const { user_id } = config.context;
    return user_id === "1" ? "Florida" : "SF";
  },
  {
    name: "get_user_location",
    description: "Retrieve user information based on user ID",
    schema: z.object({}),
  }
);
```

**工具类型对比**：

| 类型 | 参数 | 使用场景 |
|------|------|----------|
| 简单工具 | `(input) => result` | 纯函数，无外部依赖 |
| 上下文工具 | `(_, config) => result` | 需要访问用户信息、数据库连接等 |

**Schema 定义方式**：

```typescript
// 方式 1：使用 Zod（推荐，支持运行时验证）
schema: z.object({
  city: z.string().describe("描述"),
})

// 方式 2：使用 JSON Schema（仅类型提示，无运行时验证）
schema: {
  type: "object",
  properties: {
    city: { type: "string", description: "描述" }
  },
  required: ["city"]
}
```

#### 步骤 3：配置模型

```typescript
import { initChatModel } from "langchain";

const model = await initChatModel(
  "claude-sonnet-4-6",
  { temperature: 0.5, timeout: 10, maxTokens: 1000 }
);
```

**常用配置参数**：
- `temperature`：创造性（0=确定性，1=高度随机）
- `timeout`：超时时间（毫秒）
- `maxTokens`：最大输出 token 数

#### 步骤 4：定义响应格式

```typescript
const responseFormat = z.object({
  punny_response: z.string(),
  weather_conditions: z.string().optional(),
});
```

结构化输出确保响应格式一致，便于前端解析和展示。

#### 步骤 5：添加记忆

```typescript
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();
```

**记忆的作用**：
- 跨轮次对话保持上下文
- 记住用户偏好和历史

> **生产环境建议**：使用持久化 Checkpointer（如数据库）替代内存中的 `MemorySaver`。

#### 步骤 6：组装并运行 Agent

```typescript
const agent = createAgent({
  model,
  systemPrompt: systemPrompt,
  tools: [getUserLocation, getWeather],
  responseFormat,
  checkpointer,
});

// 配置：线程 ID 和上下文
const config = {
  configurable: { thread_id: "1" },  // 对话唯一标识
  context: { user_id: "1" },         // 用户上下文
};

// 第一次调用
const response = await agent.invoke(
  { messages: [{ role: "user", content: "what is the weather outside?" }] },
  config
);

console.log(response.structuredResponse);
// {
//   punny_response: "Florida is still having a 'sun-derful' day...",
//   weather_conditions: "It's always sunny in Florida!"
// }

// 继续对话（使用相同 thread_id）
const thankYouResponse = await agent.invoke(
  { messages: [{ role: "user", content: "thank you!" }] },
  config
);

console.log(thankYouResponse.structuredResponse);
// {
//   punny_response: "You're 'thund-erfully' welcome!...",
//   weather_conditions: undefined
// }
```

**关键配置说明**：

| 配置项 | 作用 | 示例 |
|--------|------|------|
| `configurable.thread_id` | 对话唯一标识 | `"1"` |
| `context.user_id` | 用户上下文 | `"1"` |

---

## 四、设计哲学

### LangChain 的核心信念

1. **Agent 可靠性挑战**
   - 构建原型容易，但生产级可靠性难
   - 行业仍处于早期阶段

2. **应用范式转变**
   - 未来的应用将越来越"Agent 化"
   - LLM 结合外部数据效果更佳

3. **两大核心目标**

   **目标 1：支持最佳模型**
   ```
   标准化输入输出 → 避免供应商锁定 → 轻松切换到最新模型
   ```

   **目标 2：编排复杂工作流**
   ```
   模型不只是文本生成 → 协调数据和计算 → 动态调用工具
   ```

### LangChain 演进历史

```
2022.11          2023              2023              2024              2025
  │               │                 │                 │                 │
  ▼               ▼                 ▼                 ▼                 ▼
┌─────────┐   ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│ Chains  │ → │ ReAct   │ →    │ Function│ →    │ LangGraph│ →   │ 1.0     │
│ + LLM   │   │ Agents  │      │ Calling │      │ 发布     │      │ 重构    │
└─────────┘   └─────────┘      └─────────┘      └─────────┘      └─────────┘
    │              │                 │                 │                 │
  预定义步骤     通用 Agent        原生工具调用      低级别编排        统一抽象
  检索→生成      JSON 解析          结构化输出        流式/持久化        仅保留
                                                                       Agent
```

**关键里程碑**：

| 时间 | 事件 | 影响 |
|------|------|------|
| 2022.11 | LangChain Python 发布 | 推出 Chains 概念 |
| 2023.03 | ReAct Agent | 首个通用 Agent |
| 2023.06 | Chat Completions API | 支持消息列表格式 |
| 2023.09 | LangChain.js 发布 | JavaScript 支持 |
| 2023.10 | Function Calling | 原生工具调用支持 |
| 2024.01 | LangGraph 发布 | 低级别编排层 |
| 2025.01 | LangChain 1.0 | 统一为单一 Agent 抽象 |

### 为什么选择 LangChain

**适合场景**：
- ✅ 快速原型开发
- ✅ 需要灵活切换模型
- ✅ 构建多工具协作的 Agent
- ✅ 需要生产级可靠性（LangSmith + LangGraph）

**不适合场景**：
- ❌ 单一 LLM 调用即可解决的问题
- ❌ 需要完全确定性控制（直接用 LangGraph）
- ❌ 简单文本生成任务

---

## 五、完整代码示例

将快速入门的完整代码整合：

```typescript
import { createAgent, tool, initChatModel, type ToolRuntime } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import * as z from "zod";

// ========== 1. 定义系统提示词 ==========
const systemPrompt = `You are an expert weather forecaster, who speaks in puns.

You have access to two tools:

- get_weather_for_location: use this to get the weather for a specific location
- get_user_location: use this to get the user's location

If a user asks you for the weather, make sure you know the location. If you can tell from the question that they mean wherever they are, use the get_user_location tool to find their location.`;

// ========== 2. 定义工具 ==========
const getWeather = tool(
  ({ city }) => `It's always sunny in ${city}!`,
  {
    name: "get_weather_for_location",
    description: "Get the weather for a given city",
    schema: z.object({
      city: z.string(),
    }),
  }
);

type AgentRuntime = ToolRuntime<unknown, { user_id: string }>;

const getUserLocation = tool(
  (_, config: AgentRuntime) => {
    const { user_id } = config.context;
    return user_id === "1" ? "Florida" : "SF";
  },
  {
    name: "get_user_location",
    description: "Retrieve user information based on user ID",
    schema: z.object({}),
  }
);

// ========== 3. 配置模型 ==========
const model = await initChatModel(
  "claude-sonnet-4-6",
  { temperature: 0 }
);

// ========== 4. 定义响应格式 ==========
const responseFormat = z.object({
  punny_response: z.string(),
  weather_conditions: z.string().optional(),
});

// ========== 5. 设置记忆 ==========
const checkpointer = new MemorySaver();

// ========== 6. 创建 Agent ==========
const agent = createAgent({
  model,
  systemPrompt,
  responseFormat,
  checkpointer,
  tools: [getUserLocation, getWeather],
});

// ========== 7. 运行 Agent ==========
const config = {
  configurable: { thread_id: "1" },
  context: { user_id: "1" },
};

const response = await agent.invoke(
  { messages: [{ role: "user", content: "what is the weather outside?" }] },
  config
);

console.log(response.structuredResponse);
// {
//   punny_response: "Florida is still having a 'sun-derful' day!...",
//   weather_conditions: "It's always sunny in Florida!"
// }
```

---

## 六、学习建议

### 初学者路径

```
1. 安装 LangChain
   ↓
2. 运行基础 Agent 示例（10 行代码）
   ↓
3. 理解工具定义和调用
   ↓
4. 学习消息格式和对话管理
   ↓
5. 探索 LangSmith 调试
   ↓
6. 进阶：LangGraph 编排
```

### 关键概念优先级

| 优先级 | 概念 | 学习资源 |
|--------|------|----------|
| 🔴 高 | 工具定义 | [Tools 文档](https://docs.langchain.com/oss/javascript/langchain/tools) |
| 🔴 高 | 消息格式 | [Messages 文档](https://docs.langchain.com/oss/javascript/langchain/messages) |
| 🔴 高 | Agent 创建 | [Agents 文档](https://docs.langchain.com/oss/javascript/langchain/agents) |
| 🟡 中 | 结构化输出 | [Structured Output 文档](https://docs.langchain.com/oss/javascript/langchain/structured-output) |
| 🟡 中 | 短期记忆 | [Short-term Memory 文档](https://docs.langchain.com/oss/javascript/langchain/short-term-memory) |
| 🟢 低 | 中间件 | [Middleware 文档](https://docs.langchain.com/oss/javascript/langchain/middleware/overview) |

### 下一步学习

完成本部分后，建议继续学习：

1. **核心模块**：
   - [智能体 Agents](./agents.md)
   - [模型 Models](./models.md)
   - [消息 Messages](./messages.md)
   - [工具 Tools](./tools.md)

2. **进阶主题**：
   - [流式输出](./streaming-overview.md)
   - [结构化输出](./structured-output.md)
   - [Guardrails](./guardrails.md)

---

## 总结

本部分涵盖了 LangChain 的核心使用知识：

✅ **理解 LangChain 定位**：快速构建 Agent 的开发生态  
✅ **掌握安装流程**：核心包 + 模型集成包  
✅ **能够创建基础 Agent**：10 行代码即可开始  
✅ **理解完整 Agent 架构**：提示词、工具、模型、记忆、结构化输出  
✅ **了解设计哲学**：标准化、灵活性、生产就绪  

**关键要点**：
- LangChain 让 Agent 开发门槛降到最低
- 基于 LangGraph 构建，自动获得生产级能力
- 标准化接口避免供应商锁定
- 配合 LangSmith 实现可观测性和调试
