---
title: LangChain 短期记忆学习笔记
excerpt: 深入理解 LangChain Agent 记忆系统，掌握对话历史管理、消息修剪和摘要策略
date: 2026-03-08
tags:
  - LangChain
  - AI
  - Memory
  - Agent
category: 技术
readTime: 14
pinned: false
---

# LangChain 短期记忆学习笔记

## 一、记忆概述

### 什么是记忆

记忆是一个记住先前交互信息的系统。对于 AI Agent，记忆至关重要：
- 记住先前交互
- 从反馈中学习
- 适应用户偏好

### 记忆类型

| 类型 | 说明 | 持续时间 |
|------|------|----------|
| 短期记忆 | 单个会话/线程内的记忆 | 会话期间 |
| 长期记忆 | 跨会话的持久化记忆 | 永久 |

本笔记聚焦于**短期记忆**。

### 核心挑战

长对话对 LLM 构成挑战：
- 完整历史可能超出上下文窗口
- LLM 在长上下文上表现不佳（容易被无关内容分散注意力）
- 响应变慢，成本增加

---

## 二、基本使用

### 启用短期记忆

使用 `checkpointer` 添加短期记忆：

```typescript
import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();

const agent = createAgent({
  model: "claude-sonnet-4-6",
  tools: [],
  checkpointer,
});

// 第一次调用
await agent.invoke(
  { messages: [{ role: "user", content: "hi! i am Bob" }] },
  { configurable: { thread_id: "1" } }
);

// 第二次调用（记住之前的信息）
await agent.invoke(
  { messages: [{ role: "user", content: "what's my name?" }] },
  { configurable: { thread_id: "1" } }
);
// 输出: "Your name is Bob"
```

### 生产环境配置

使用数据库支持的 Checkpointer：

```typescript
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

const DB_URI = "postgresql://postgres:postgres@localhost:5442/postgres?sslmode=disable";
const checkpointer = PostgresSaver.fromConnString(DB_URI);
```

**可用的 Checkpointer**：
- `MemorySaver` - 内存存储（开发测试）
- `SqliteSaver` - SQLite 数据库
- `PostgresSaver` - PostgreSQL 数据库
- `AzureCosmosDBSaver` - Azure Cosmos DB

---

## 三、自定义 Agent 记忆

### 扩展状态 Schema

```typescript
import { createAgent, createMiddleware } from "langchain";
import { StateSchema, MemorySaver } from "@langchain/langgraph";
import * as z from "zod";

const CustomState = new StateSchema({
  userId: z.string(),
  preferences: z.record(z.string(), z.any()),
});

const stateExtensionMiddleware = createMiddleware({
  name: "StateExtension",
  stateSchema: CustomState,
});

const checkpointer = new MemorySaver();
const agent = createAgent({
  model: "gpt-4.1",
  tools: [],
  middleware: [stateExtensionMiddleware],
  checkpointer,
});

// 传入自定义状态
const result = await agent.invoke({
  messages: [{ role: "user", content: "Hello" }],
  userId: "user_123",
  preferences: { theme: "dark" },
});
```

---

## 四、常见模式

### 4.1 修剪消息（Trim Messages）

在调用模型前移除部分消息：

```typescript
import { RemoveMessage } from "@langchain/core/messages";
import { createAgent, createMiddleware } from "langchain";
import { MemorySaver, REMOVE_ALL_MESSAGES } from "@langchain/langgraph";

const trimMessages = createMiddleware({
  name: "TrimMessages",
  beforeModel: (state) => {
    const messages = state.messages;

    if (messages.length <= 3) {
      return; // 无需修改
    }

    const firstMsg = messages[0];
    const recentMessages = messages.length % 2 === 0 
      ? messages.slice(-3) 
      : messages.slice(-4);
    const newMessages = [firstMsg, ...recentMessages];

    return {
      messages: [
        new RemoveMessage({ id: REMOVE_ALL_MESSAGES }),
        ...newMessages,
      ],
    };
  },
});

const checkpointer = new MemorySaver();
const agent = createAgent({
  model: "gpt-4.1",
  tools: [],
  middleware: [trimMessages],
  checkpointer,
});
```

### 4.2 删除消息（Delete Messages）

永久删除特定消息：

```typescript
import { RemoveMessage } from "@langchain/core/messages";
import { createAgent, createMiddleware } from "langchain";
import { MemorySaver } from "@langchain/langgraph";

const deleteOldMessages = createMiddleware({
  name: "DeleteOldMessages",
  afterModel: (state) => {
    const messages = state.messages;
    if (messages.length > 2) {
      // 删除最早的两条消息
      return {
        messages: messages
          .slice(0, 2)
          .map((m) => new RemoveMessage({ id: m.id! })),
      };
    }
    return;
  },
});

const agent = createAgent({
  model: "gpt-4.1",
  tools: [],
  middleware: [deleteOldMessages],
  checkpointer: new MemorySaver(),
});
```

### 4.3 摘要消息（Summarize Messages）

使用模型生成历史摘要：

```typescript
import { createAgent, summarizationMiddleware } from "langchain";
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();

const agent = createAgent({
  model: "gpt-4.1",
  tools: [],
  middleware: [
    summarizationMiddleware({
      model: "gpt-4.1-mini",
      trigger: { tokens: 4000 },  // 超过 4000 tokens 时触发
      keep: { messages: 20 },      // 保留最近 20 条消息
    }),
  ],
  checkpointer,
});
```

### 模式对比

| 模式 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| 修剪消息 | 简单高效 | 可能丢失信息 | 固定窗口大小 |
| 删除消息 | 完全控制 | 信息永久丢失 | 隐私敏感场景 |
| 摘要消息 | 保留关键信息 | 需要额外 LLM 调用 | 长对话场景 |

---

## 五、访问记忆

### 5.1 在工具中访问

```typescript
import { createAgent, tool, type ToolRuntime } from "langchain";
import { StateSchema } from "@langchain/langgraph";
import * as z from "zod";

const CustomState = new StateSchema({
  userId: z.string(),
});

const getUserInfo = tool(
  async (_, config: ToolRuntime<typeof CustomState.State>) => {
    const userId = config.state.userId;
    return userId === "user_123" ? "John Doe" : "Unknown User";
  },
  {
    name: "get_user_info",
    description: "Get user info",
    schema: z.object({}),
  }
);

const agent = createAgent({
  model: "gpt-4.1",
  tools: [getUserInfo],
  stateSchema: CustomState,
});

const result = await agent.invoke({
  messages: [{ role: "user", content: "what's my name?" }],
  userId: "user_123",
});
```

### 5.2 在工具中写入

```typescript
import { tool, createAgent, ToolMessage, type ToolRuntime } from "langchain";
import { Command, StateSchema } from "@langchain/langgraph";
import * as z from "zod";

const CustomState = new StateSchema({
  userId: z.string().optional(),
  userName: z.string().optional(),
});

const updateUserInfo = tool(
  async (_, config: ToolRuntime<typeof CustomState.State>) => {
    const userId = config.state.userId;
    const name = userId === "user_123" ? "John Smith" : "Unknown user";
    
    return new Command({
      update: {
        userName: name,
        messages: [
          new ToolMessage({
            content: "Successfully looked up user information",
            tool_call_id: config.toolCall?.id ?? "",
          }),
        ],
      },
    });
  },
  {
    name: "update_user_info",
    description: "Look up and update user info.",
    schema: z.object({}),
  }
);
```

### 5.3 在提示词中访问

```typescript
import * as z from "zod";
import { createAgent, tool, dynamicSystemPromptMiddleware } from "langchain";

const contextSchema = z.object({
  userName: z.string(),
});
type ContextSchema = z.infer<typeof contextSchema>;

const agent = createAgent({
  model: "gpt-4.1",
  tools: [],
  contextSchema,
  middleware: [
    dynamicSystemPromptMiddleware<ContextSchema>((_, config) => {
      return `You are a helpful assistant. Address the user as ${config.context?.userName}.`;
    }),
  ],
});

const result = await agent.invoke(
  { messages: [{ role: "user", content: "What is the weather in SF?" }] },
  { context: { userName: "John Smith" } }
);
```

---

## 六、中间件钩子

### beforeModel（模型调用前）

在模型调用前处理状态：

```typescript
import { RemoveMessage } from "@langchain/core/messages";
import { createAgent, createMiddleware, trimMessages } from "langchain";
import { MemorySaver, REMOVE_ALL_MESSAGES } from "@langchain/langgraph";

const trimMessageHistory = createMiddleware({
  name: "TrimMessages",
  beforeModel: async (state) => {
    const trimmed = await trimMessages(state.messages, {
      maxTokens: 384,
      strategy: "last",
      startOn: "human",
      endOn: ["human", "tool"],
      tokenCounter: (msgs) => msgs.length,
    });
    return {
      messages: [new RemoveMessage({ id: REMOVE_ALL_MESSAGES }), ...trimmed],
    };
  },
});
```

### afterModel（模型调用后）

在模型调用后验证响应：

```typescript
import { RemoveMessage } from "@langchain/core/messages";
import { createAgent, createMiddleware } from "langchain";
import { REMOVE_ALL_MESSAGES } from "@langchain/langgraph";

const validateResponse = createMiddleware({
  name: "ValidateResponse",
  afterModel: (state) => {
    const lastMessage = state.messages.at(-1)?.content;
    if (
      typeof lastMessage === "string" &&
      lastMessage.toLowerCase().includes("confidential")
    ) {
      return {
        messages: [
          new RemoveMessage({ id: REMOVE_ALL_MESSAGES }),
        ],
      };
    }
    return;
  },
});
```

---

## 七、最佳实践

### Checkpointer 选择

| 环境 | 推荐 | 原因 |
|------|------|------|
| 开发/测试 | MemorySaver | 简单，无需配置 |
| 生产环境 | PostgresSaver | 可扩展，持久化 |
| 边缘部署 | SqliteSaver | 轻量级 |

### Thread ID 设计

```typescript
// ✅ 推荐：使用有意义的 thread_id
const threadId = `user_${userId}_conversation_${conversationId}`;

// ❌ 避免：硬编码的 thread_id
const threadId = "1";
```

### 消息修剪策略

```typescript
// 保留系统消息 + 最近 N 条消息
const smartTrim = createMiddleware({
  name: "SmartTrim",
  beforeModel: (state) => {
    const messages = state.messages;
    const systemMessages = messages.filter(m => m._getType() === "system");
    const recentMessages = messages.slice(-10);
    
    return {
      messages: [
        new RemoveMessage({ id: REMOVE_ALL_MESSAGES }),
        ...systemMessages,
        ...recentMessages.filter(m => m._getType() !== "system")
      ],
    };
  },
});
```

---

## 八、完整示例

### 示例：带记忆的客服 Agent

```typescript
import * as z from "zod";
import { createAgent, createMiddleware, tool } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver, StateSchema } from "@langchain/langgraph";
import { summarizationMiddleware } from "langchain";

// 自定义状态
const ConversationState = new StateSchema({
  userName: z.string().optional(),
  issueType: z.enum(["billing", "technical", "general"]).optional(),
  resolved: z.boolean().default(false),
});

// 记忆管理中间件
const conversationMemory = createMiddleware({
  name: "ConversationMemory",
  stateSchema: ConversationState,
});

// 创建 Agent
const agent = createAgent({
  model: new ChatOpenAI({ model: "gpt-4.1" }),
  tools: [],
  systemPrompt: "You are a helpful customer service agent.",
  middleware: [
    conversationMemory,
    summarizationMiddleware({
      model: "gpt-4.1-mini",
      trigger: { tokens: 3000 },
      keep: { messages: 10 },
    }),
  ],
  checkpointer: new MemorySaver(),
});

// 使用
const config = { configurable: { thread_id: "support_ticket_123" } };

// 第一轮对话
await agent.invoke(
  { 
    messages: [{ role: "user", content: "I have a billing issue" }],
    issueType: "billing"
  },
  config
);

// 后续对话（记住之前的信息）
await agent.invoke(
  { messages: [{ role: "user", content: "My account number is 12345" }] },
  config
);
```

---

## 九、学习路径

### 核心概念优先级

| 优先级 | 概念 | 说明 |
|--------|------|------|
| 高 | 启用记忆 | 使用 checkpointer |
| 高 | Thread ID | 会话标识 |
| 中 | 消息修剪 | 控制上下文窗口 |
| 中 | 摘要策略 | 保留关键信息 |
| 低 | 自定义状态 | 扩展记忆内容 |

### 下一步学习

1. **流式输出**：[流概述学习笔记](./core-streaming.md)
2. **结构化输出**：[结构化输出学习笔记](./core-structured-output.md)

---

## 总结

本笔记涵盖了 LangChain 短期记忆的核心概念：

**核心要点**：
- 使用 checkpointer 启用记忆
- thread_id 标识不同会话
- 三种策略：修剪、删除、摘要

**关键能力**：
- 在工具中访问和修改状态
- 使用中间件钩子处理状态
- 选择合适的 Checkpointer

**下一步**：学习 [流概述学习笔记](./core-streaming.md)，理解 Agent 的实时输出能力。