---
title: LangChain 智能体 Agents 学习笔记
excerpt: 深入理解 LangChain Agent 核心概念，掌握模型、工具、系统提示词配置，学习动态工具选择和 ReAct 模式
date: 2026-03-08
tags:
  - LangChain
  - AI
  - Agent
  - LLM
category: 技术
readTime: 20
pinned: false
---

# LangChain 智能体 Agents 学习笔记

## 一、Agent 核心概念

### 什么是 Agent

Agent（智能体）是将语言模型与工具结合的系统，能够：
- **推理任务**：分析用户需求，制定执行策略
- **决策工具**：选择合适的工具执行操作
- **迭代求解**：循环执行直到达成目标

核心公式：**Agent = LLM + Tools + ReAct Loop**

```
┌─────────┐
│  Input  │
└────┬────┘
     ↓
┌─────────┐     action      ┌─────────┐
│   LLM   │ ──────────────→ │  Tools  │
└────┬────┘                 └────┬────┘
     ↑                           │
     └───────── observation ─────┘
     ↓
┌─────────┐
│  Output │
└─────────┘
```

### Agent 工作流程

Agent 遵循 **ReAct 模式**（Reasoning + Acting）：

```
1. 接收输入 → 2. 模型推理 → 3. 决定行动 → 4. 执行工具 → 5. 观察结果 → 重复 2-5 直到完成
```

**终止条件**：
- 模型输出最终答案
- 达到迭代次数限制

### createAgent() 核心方法

LangChain 提供生产级的 Agent 实现：

```typescript
import { createAgent } from "langchain";

const agent = createAgent({
  model: "gpt-4.1",      // 语言模型
  tools: [],             // 工具列表
  systemPrompt: "",      // 系统提示词
});
```

---

## 二、核心组件详解

### 2.1 模型配置（Model）

模型是 Agent 的推理引擎，支持静态和动态配置。

#### 静态模型

**方式 1：使用模型标识符字符串**

```typescript
const agent = createAgent({
  model: "openai:gpt-4.1",  // 格式：provider:model
  tools: []
});
```

**方式 2：使用模型实例（推荐）**

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4.1",
  temperature: 0.1,
  maxTokens: 1000,
  timeout: 30
});

const agent = createAgent({
  model,
  tools: []
});
```

**使用场景对比**：

| 方式 | 适用场景 | 优点 |
|------|----------|------|
| 字符串标识符 | 快速原型开发 | 简单直接 |
| 模型实例 | 生产环境 | 完全控制配置参数 |

#### 动态模型

根据运行时状态动态选择模型：

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { createAgent, createMiddleware } from "langchain";

const basicModel = new ChatOpenAI({ model: "gpt-4.1-mini" });
const advancedModel = new ChatOpenAI({ model: "gpt-4.1" });

const dynamicModelSelection = createMiddleware({
  name: "DynamicModelSelection",
  wrapModelCall: (request, handler) => {
    // 根据对话复杂度选择模型
    const messageCount = request.messages.length;
    
    return handler({
      ...request,
      model: messageCount > 10 ? advancedModel : basicModel,
    });
  },
});

const agent = createAgent({
  model: "gpt-4.1-mini",  // 默认模型
  tools,
  middleware: [dynamicModelSelection],
});
```

**动态选择场景**：
- 对话复杂度增加时升级模型
- 成本敏感场景按需选择
- 特定任务使用专用模型

### 2.2 工具配置（Tools）

工具赋予 Agent 执行操作的能力。

#### 静态工具

```typescript
import * as z from "zod";
import { createAgent, tool } from "langchain";

const search = tool(
  ({ query }) => `Results for: ${query}`,
  {
    name: "search",
    description: "Search for information",
    schema: z.object({
      query: z.string().describe("The query to search for"),
    }),
  }
);

const getWeather = tool(
  ({ location }) => `Weather in ${location}: Sunny, 72°F`,
  {
    name: "get_weather",
    description: "Get weather information for a location",
    schema: z.object({
      location: z.string().describe("The location to get weather for"),
    }),
  }
);

const agent = createAgent({
  model: "gpt-4.1",
  tools: [search, getWeather],
});
```

#### 动态工具选择

**场景 1：基于状态过滤工具**

```typescript
const stateBasedTools = createMiddleware({
  name: "StateBasedTools",
  wrapModelCall: (request, handler) => {
    const state = request.state as { authenticated?: boolean };
    const isAuthenticated = state.authenticated ?? false;
    
    let filteredTools = request.tools;
    
    // 未认证用户只能访问公开工具
    if (!isAuthenticated) {
      filteredTools = request.tools.filter(
        (t) => t.name.startsWith("public_")
      );
    }
    
    return handler({ ...request, tools: filteredTools });
  },
});
```

**场景 2：基于运行时上下文过滤**

```typescript
const contextBasedTools = createMiddleware({
  name: "ContextBasedTools",
  contextSchema: z.object({ userRole: z.string() }),
  wrapModelCall: (request, handler) => {
    const userRole = request.runtime.context.userRole;
    
    let filteredTools = request.tools;
    
    if (userRole === "admin") {
      // 管理员可访问所有工具
    } else if (userRole === "editor") {
      filteredTools = request.tools.filter(t => t.name !== "delete_data");
    } else {
      // 普通用户只能读取
      filteredTools = request.tools.filter(t => t.name.startsWith("read_"));
    }
    
    return handler({ ...request, tools: filteredTools });
  },
});
```

**场景 3：运行时注册工具**

```typescript
const calculateTip = tool(
  ({ billAmount, tipPercentage = 20 }) => {
    const tip = billAmount * (tipPercentage / 100);
    return `Tip: $${tip.toFixed(2)}, Total: $${(billAmount + tip).toFixed(2)}`;
  },
  {
    name: "calculate_tip",
    description: "Calculate the tip amount for a bill",
    schema: z.object({
      billAmount: z.number(),
      tipPercentage: z.number().default(20),
    }),
  }
);

const dynamicToolMiddleware = createMiddleware({
  name: "DynamicToolMiddleware",
  wrapModelCall: (request, handler) => {
    // 动态添加工具
    return handler({
      ...request,
      tools: [...request.tools, calculateTip],
    });
  },
  wrapToolCall: (request, handler) => {
    // 处理动态工具执行
    if (request.toolCall.name === "calculate_tip") {
      return handler({ ...request, tool: calculateTip });
    }
    return handler(request);
  },
});
```

### 2.3 系统提示词（System Prompt）

系统提示词定义 Agent 的行为准则。

#### 静态提示词

```typescript
const agent = createAgent({
  model,
  tools,
  systemPrompt: "You are a helpful assistant. Be concise and accurate.",
});
```

#### 使用 SystemMessage（高级）

适用于需要提示词缓存的场景：

```typescript
import { SystemMessage } from "@langchain/core/messages";

const literaryAgent = createAgent({
  model: "anthropic:claude-sonnet-4-5",
  systemPrompt: new SystemMessage({
    content: [
      {
        type: "text",
        text: "You are an AI assistant tasked with analyzing literary works.",
      },
      {
        type: "text",
        text: "<the entire contents of 'Pride and Prejudice'>",
        cache_control: { type: "ephemeral" }  // Anthropic 提示词缓存
      }
    ]
  })
});
```

#### 动态提示词

根据上下文动态生成提示词：

```typescript
import { dynamicSystemPromptMiddleware } from "langchain";

const contextSchema = z.object({
  userRole: z.enum(["expert", "beginner"]),
});

const agent = createAgent({
  model: "gpt-4.1",
  tools: [],
  contextSchema,
  middleware: [
    dynamicSystemPromptMiddleware((state, runtime) => {
      const userRole = runtime.context.userRole || "user";
      const basePrompt = "You are a helpful assistant.";
      
      if (userRole === "expert") {
        return `${basePrompt} Provide detailed technical responses.`;
      } else if (userRole === "beginner") {
        return `${basePrompt} Explain concepts simply and avoid jargon.`;
      }
      return basePrompt;
    }),
  ],
});

// 调用时传入上下文
const result = await agent.invoke(
  { messages: [{ role: "user", content: "Explain machine learning" }] },
  { context: { userRole: "expert" } }
);
```

---

## 三、ReAct 循环详解

### 工作原理

ReAct 模式交替进行推理（Reasoning）和行动（Acting）：

```
┌──────────────────────────────────────────────────┐
│                  ReAct 循环                       │
│                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ Reasoning │ →  │ Acting   │ →  │Observing │  │
│  │  推理     │    │  行动    │    │  观察    │  │
│  └──────────┘    └──────────┘    └──────────┘  │
│       ↑                                │        │
│       └────────────────────────────────┘        │
└──────────────────────────────────────────────────┘
```

### 实例演示

**任务**：查找当前最受欢迎的无线耳机并检查库存。

**步骤 1：推理 + 行动**
```
用户：Find the most popular wireless headphones right now and check if they're in stock

推理：Popularity is time-sensitive, I need to use the provided search tool.
行动：Call search_products("wireless headphones")
```

**步骤 2：观察**
```
ToolMessage：Found 5 products matching "wireless headphones". Top result: WH-1000XM5
```

**步骤 3：推理 + 行动**
```
推理：I need to confirm availability for the top-ranked item.
行动：Call check_inventory("WH-1000XM5")
```

**步骤 4：观察**
```
ToolMessage：Product WH-1000XM5: 10 units in stock
```

**步骤 5：最终答案**
```
AI：I found wireless headphones (model WH-1000XM5) with 10 units in stock...
```

---

## 四、高级特性

### 4.1 结构化输出

强制 Agent 返回特定格式的数据：

```typescript
import * as z from "zod";

const ContactInfo = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
});

const agent = createAgent({
  model: "gpt-4.1",
  responseFormat: ContactInfo,
});

const result = await agent.invoke({
  messages: [
    { role: "user", content: "Extract contact info from: John Doe, john@example.com, (555) 123-4567" }
  ],
});

console.log(result.structuredResponse);
// { name: 'John Doe', email: 'john@example.com', phone: '(555) 123-4567' }
```

### 4.2 短期记忆

Agent 自动维护对话历史，也可自定义状态：

```typescript
import { StateSchema, MessagesValue } from "@langchain/langgraph";

const CustomAgentState = new StateSchema({
  messages: MessagesValue,
  userPreferences: z.record(z.string(), z.string()),
});

const customAgent = createAgent({
  model: "gpt-4.1",
  tools: [],
  stateSchema: CustomAgentState,
});
```

### 4.3 流式输出

获取 Agent 执行过程的实时反馈：

```typescript
const stream = await agent.stream(
  { messages: [{ role: "user", content: "Search for AI news and summarize" }] },
  { streamMode: "values" }
);

for await (const chunk of stream) {
  const latestMessage = chunk.messages.at(-1);
  if (latestMessage?.content) {
    console.log(`Agent: ${latestMessage.content}`);
  } else if (latestMessage?.tool_calls) {
    const toolCallNames = latestMessage.tool_calls.map((tc) => tc.name);
    console.log(`Calling tools: ${toolCallNames.join(", ")}`);
  }
}
```

### 4.4 中间件（Middleware）

中间件用于扩展 Agent 行为：

```typescript
import { createMiddleware } from "langchain";

const handleToolErrors = createMiddleware({
  name: "HandleToolErrors",
  wrapToolCall: async (request, handler) => {
    try {
      return await handler(request);
    } catch (error) {
      return new ToolMessage({
        content: `Tool error: Please check your input and try again. (${error})`,
        tool_call_id: request.toolCall.id!,
      });
    }
  },
});

const agent = createAgent({
  model: "gpt-4.1",
  tools: [/* ... */],
  middleware: [handleToolErrors],
});
```

**中间件应用场景**：
- 自定义日志和监控
- 动态模型选择
- 工具错误处理
- 内容过滤和验证
- 消息修剪和上下文注入

---

## 五、最佳实践

### 命名规范

**工具和 Agent 名称使用 snake_case**：

```typescript
// ✅ 推荐
const agent = createAgent({
  name: "research_assistant",
  tools: [
    tool(/* ... */, { name: "search_database" }),
    tool(/* ... */, { name: "get_user_info" }),
  ],
});

// ❌ 避免
const agent = createAgent({
  name: "Research Assistant",  // 包含空格
  tools: [
    tool(/* ... */, { name: "Search Database" }),  // 包含空格
  ],
});
```

**原因**：某些模型提供商会拒绝包含空格或特殊字符的名称。

### 工具设计原则

1. **清晰的描述**：工具描述决定模型何时使用
2. **明确的参数**：使用 Zod 提供详细的参数说明
3. **合理的数量**：避免工具过多导致模型困惑

```typescript
const search = tool(
  ({ query }) => `Results for: ${query}`,
  {
    name: "search",
    description: "Search for information in the database. Use this when the user asks about specific data.",  // 明确使用场景
    schema: z.object({
      query: z.string().describe("The search query. Use specific keywords for better results."),  // 详细参数说明
    }),
  }
);
```

### 错误处理策略

```typescript
const robustAgent = createAgent({
  model: "gpt-4.1",
  tools: [/* ... */],
  middleware: [
    // 工具错误处理
    createMiddleware({
      name: "ToolErrorHandler",
      wrapToolCall: async (request, handler) => {
        try {
          return await handler(request);
        } catch (error) {
          return new ToolMessage({
            content: `Error occurred. Please try a different approach.`,
            tool_call_id: request.toolCall.id!,
          });
        }
      },
    }),
  ],
});
```

---

## 六、完整示例

### 示例：研究助手 Agent

```typescript
import * as z from "zod";
import { createAgent, tool, createMiddleware } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";

// 1. 定义工具
const searchWeb = tool(
  async ({ query }) => {
    // 实际实现会调用搜索 API
    return `Search results for: ${query}`;
  },
  {
    name: "search_web",
    description: "Search the web for information",
    schema: z.object({
      query: z.string().describe("The search query"),
    }),
  }
);

const summarizeContent = tool(
  async ({ content }) => {
    // 实际实现会调用 LLM 进行摘要
    return `Summary: ${content.slice(0, 100)}...`;
  },
  {
    name: "summarize_content",
    description: "Summarize long content",
    schema: z.object({
      content: z.string().describe("The content to summarize"),
    }),
  }
);

// 2. 配置模型
const model = new ChatOpenAI({
  model: "gpt-4.1",
  temperature: 0,
});

// 3. 配置记忆
const checkpointer = new MemorySaver();

// 4. 创建 Agent
const researchAgent = createAgent({
  name: "research_assistant",
  model,
  tools: [searchWeb, summarizeContent],
  systemPrompt: `You are a research assistant. 
    Use the search_web tool to find information.
    Use the summarize_content tool for long texts.
    Be thorough but concise.`,
  checkpointer,
});

// 5. 运行 Agent
const config = { configurable: { thread_id: "research-1" } };

const result = await researchAgent.invoke(
  { messages: [{ role: "user", content: "Research the latest AI breakthroughs" }] },
  config
);

console.log(result.messages.at(-1)?.content);
```

---

## 七、学习路径

### 核心概念优先级

| 优先级 | 概念 | 说明 |
|--------|------|------|
| 高 | 模型配置 | 理解静态和动态模型选择 |
| 高 | 工具定义 | 掌握工具创建和动态选择 |
| 高 | 系统提示词 | 定义 Agent 行为准则 |
| 中 | ReAct 循环 | 理解推理-行动模式 |
| 中 | 结构化输出 | 强制返回特定格式 |
| 低 | 中间件 | 高级行为扩展 |

### 下一步学习

1. **深入理解工具**：[工具 Tools 学习笔记](./core-tools.md)
2. **消息格式详解**：[消息 Messages 学习笔记](./core-messages.md)
3. **记忆管理**：[短期记忆学习笔记](./core-short-term-memory.md)
4. **流式输出**：[流概述学习笔记](./core-streaming.md)

---

## 总结

本笔记涵盖了 LangChain Agent 的核心概念：

**核心要点**：
- Agent = LLM + Tools + ReAct Loop
- 静态配置适合快速开发，动态配置适合生产环境
- 系统提示词定义 Agent 行为准则
- ReAct 模式实现推理-行动循环
- 中间件提供强大的扩展能力

**关键能力**：
- 动态模型选择降低成本
- 动态工具选择实现权限控制
- 结构化输出确保数据格式
- 流式输出提升用户体验