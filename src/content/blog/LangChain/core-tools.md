---
title: LangChain 工具 Tools 学习笔记
excerpt: 深入理解 LangChain 工具系统，掌握工具定义、上下文访问、返回值类型和 ToolNode 使用
date: 2026-03-08
tags:
  - LangChain
  - AI
  - Tools
  - Agent
category: 技术
readTime: 15
pinned: false
---

# LangChain 工具 Tools 学习笔记

## 一、工具概述

### 什么是工具

工具扩展了 Agent 的能力，让它能够：
- 获取实时数据
- 执行代码
- 查询外部数据库
- 在真实世界中采取行动

**核心原理**：工具是带有明确定义输入和输出的可调用函数，传递给聊天模型后，模型根据对话上下文决定何时调用工具以及提供什么参数。

### 工作流程

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   模型推理   │ ──→ │   决定调用   │ ──→ │   执行工具   │
│             │     │   工具      │     │   返回结果   │
└─────────────┘     └─────────────┘     └─────────────┘
       ↑                                       │
       └───────────── 观察结果 ─────────────────┘
```

---

## 二、创建工具

### 基础工具定义

使用 `tool` 函数和 Zod 定义 Schema：

```typescript
import * as z from "zod";
import { tool } from "langchain";

const searchDatabase = tool(
  // 函数实现
  ({ query, limit }) => `Found ${limit} results for '${query}'`,
  {
    name: "search_database",
    description: "Search the customer database for records matching the query.",
    schema: z.object({
      query: z.string().describe("Search terms to look for"),
      limit: z.number().describe("Maximum number of results to return"),
    }),
  }
);
```

### 命名规范

**推荐使用 snake_case**：

```typescript
// ✅ 推荐
name: "get_weather"
name: "search_database"
name: "calculate_tip"

// ❌ 避免
name: "Get Weather"      // 包含空格
name: "searchDatabase"   // camelCase
name: "search-database"  // 连字符
```

**原因**：某些模型提供商会拒绝包含空格或特殊字符的名称。

### Schema 定义方式

#### 方式 1：Zod（推荐）

```typescript
schema: z.object({
  query: z.string().describe("Search query"),
  limit: z.number().min(1).max(100).describe("Max results"),
})
```

#### 方式 2：JSON Schema

```typescript
schema: {
  type: "object",
  properties: {
    query: { type: "string", description: "Search query" },
    limit: { type: "number", description: "Max results" }
  },
  required: ["query"]
}
```

---

## 三、访问上下文

工具可以访问运行时信息，包括用户数据、对话历史和持久化存储。

### 3.1 Context（上下文）

访问不可变配置数据：

```typescript
import * as z from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent, tool } from "langchain";

const getUserName = tool(
  (_, config) => {
    return config.context.user_name;
  },
  {
    name: "get_user_name",
    description: "Get the user's name.",
    schema: z.object({}),
  }
);

const contextSchema = z.object({
  user_name: z.string(),
});

const agent = createAgent({
  model: new ChatOpenAI({ model: "gpt-4.1" }),
  tools: [getUserName],
  contextSchema,
});

const result = await agent.invoke(
  { messages: [{ role: "user", content: "What is my name?" }] },
  { context: { user_name: "John Smith" } }
);
```

### 3.2 Store（长期记忆）

访问持久化存储：

```typescript
import { InMemoryStore } from "@langchain/langgraph";

const store = new InMemoryStore();

// 读取数据
const getUserInfo = tool(
  async ({ user_id }) => {
    const value = await store.get(["users"], user_id);
    return value;
  },
  {
    name: "get_user_info",
    description: "Look up user info.",
    schema: z.object({ user_id: z.string() }),
  }
);

// 写入数据
const saveUserInfo = tool(
  async ({ user_id, name, age, email }) => {
    await store.put(["users"], user_id, { name, age, email });
    return "Successfully saved user info.";
  },
  {
    name: "save_user_info",
    description: "Save user info.",
    schema: z.object({
      user_id: z.string(),
      name: z.string(),
      age: z.number(),
      email: z.string(),
    }),
  }
);

const agent = createAgent({
  model: new ChatOpenAI({ model: "gpt-4.1" }),
  tools: [getUserInfo, saveUserInfo],
  store,
});
```

### 3.3 StreamWriter（流式更新）

实时发送工具执行进度：

```typescript
import { tool, ToolRuntime } from "langchain";

const getWeather = tool(
  ({ city }, config: ToolRuntime) => {
    const writer = config.writer;

    // 流式发送自定义更新
    if (writer) {
      writer(`Looking up data for city: ${city}`);
      writer(`Acquired data for city: ${city}`);
    }

    return `It's always sunny in ${city}!`;
  },
  {
    name: "get_weather",
    description: "Get weather for a given city.",
    schema: z.object({ city: z.string() }),
  }
);
```

---

## 四、工具返回值

工具可以选择不同的返回值类型。

### 4.1 返回字符串

用于提供人类可读的结果：

```typescript
const getWeather = tool(
  ({ city }) => `It is currently sunny in ${city}.`,
  {
    name: "get_weather",
    description: "Get weather for a city.",
    schema: z.object({ city: z.string() }),
  }
);
```

**行为**：
- 返回值转换为 `ToolMessage`
- 模型读取文本并决定下一步

### 4.2 返回对象

用于结构化数据：

```typescript
const getWeatherData = tool(
  ({ city }) => ({
    city,
    temperature_c: 22,
    conditions: "sunny",
  }),
  {
    name: "get_weather_data",
    description: "Get structured weather data for a city.",
    schema: z.object({ city: z.string() }),
  }
);
```

**行为**：
- 模型可以读取特定字段
- 对象被序列化后发送

### 4.3 返回 Command

用于更新 Agent 状态：

```typescript
import { Command } from "@langchain/langgraph";
import { ToolMessage, type ToolRuntime } from "langchain";

const setLanguage = tool(
  async ({ language }, config: ToolRuntime) => {
    return new Command({
      update: {
        preferredLanguage: language,
        messages: [
          new ToolMessage({
            content: `Language set to ${language}.`,
            tool_call_id: config.toolCallId,
          }),
        ],
      },
    });
  },
  {
    name: "set_language",
    description: "Set the preferred response language.",
    schema: z.object({ language: z.string() }),
  }
);
```

**行为**：
- 更新 Agent 状态
- 可以同时返回消息

### 返回值对比

| 类型 | 使用场景 | 行为 |
|------|----------|------|
| 字符串 | 人类可读文本 | 转换为 ToolMessage |
| 对象 | 结构化数据 | 模型可读取特定字段 |
| Command | 更新状态 | 修改 Agent 状态 |

---

## 五、ToolNode

`ToolNode` 是预构建的节点，用于在 LangGraph 工作流中执行工具。

### 基础用法

```typescript
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { tool } from "langchain/core/tools";
import * as z from "zod";

const search = tool(
  ({ query }) => `Results for: ${query}`,
  {
    name: "search",
    description: "Search for information.",
    schema: z.object({ query: z.string() }),
  }
);

const calculator = tool(
  ({ expression }) => String(eval(expression)),
  {
    name: "calculator",
    description: "Evaluate a math expression.",
    schema: z.object({ expression: z.string() }),
  }
);

// 创建 ToolNode
const toolNode = new ToolNode([search, calculator]);
```

### 错误处理

```typescript
// 默认行为
const toolNode = new ToolNode(tools);

// 捕获所有错误
const toolNode = new ToolNode(tools, { handleToolErrors: true });

// 自定义错误消息
const toolNode = new ToolNode(tools, {
  handleToolErrors: "Something went wrong, please try again."
});
```

### 条件路由

使用 `tools_condition` 根据模型是否调用工具进行路由：

```typescript
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";

const builder = new StateGraph(MessagesAnnotation)
  .addNode("llm", callLlm)
  .addNode("tools", new ToolNode(tools))
  .addEdge("__start__", "llm")
  .addConditionalEdges("llm", toolsCondition)  // 路由到 "tools" 或 "__end__"
  .addEdge("tools", "llm");

const graph = builder.compile();
```

---

## 六、预构建工具

LangChain 提供大量预构建工具和工具包：

| 类别 | 示例工具 |
|------|----------|
| Web 搜索 | Tavily, Serper, Google Search |
| 代码执行 | Python REPL, Code Interpreter |
| 数据库 | SQL Database, Vector Store |
| 文件处理 | PDF, CSV, JSON |
| API 集成 | GitHub, Slack, Gmail |

查看完整列表：[LangChain Tools & Toolkits](https://docs.langchain.com/oss/javascript/integrations/tools)

---

## 七、服务端工具

某些模型提供内置的服务端工具（如网页搜索、代码解释器），无需定义或托管工具逻辑。

详见各提供商文档：
- [OpenAI Tools](https://docs.langchain.com/oss/javascript/integrations/chat/openai)
- [Anthropic Tools](https://docs.langchain.com/oss/javascript/integrations/chat/anthropic)

---

## 八、最佳实践

### 工具描述

清晰的描述决定模型何时使用工具：

```typescript
// ✅ 好的描述
const search = tool(
  ({ query }) => `Results for: ${query}`,
  {
    name: "search_database",
    description: "Search the customer database. Use this when the user asks about customer data.",
    schema: z.object({
      query: z.string().describe("The search query. Use specific keywords for better results.")
    })
  }
);

// ❌ 模糊的描述
const search = tool(
  ({ query }) => `Results: ${query}`,
  {
    name: "search",
    description: "Search",
    schema: z.object({ query: z.string() })
  }
);
```

### 参数说明

使用 Zod 的 `describe()` 提供详细参数说明：

```typescript
schema: z.object({
  query: z.string()
    .min(3)
    .max(100)
    .describe("Search query. Use specific keywords. Example: 'customer order 12345'"),
  limit: z.number()
    .min(1)
    .max(50)
    .default(10)
    .describe("Maximum number of results. Default: 10"),
})
```

### 错误处理

```typescript
const robustTool = tool(
  async ({ input }) => {
    try {
      const result = await riskyOperation(input);
      return result;
    } catch (error) {
      // 返回友好的错误消息
      return `Error: Unable to process request. ${error.message}`;
    }
  },
  {
    name: "robust_tool",
    description: "A tool with error handling",
    schema: z.object({ input: z.string() })
  }
);
```

### 异步操作

```typescript
const asyncTool = tool(
  async ({ url }) => {
    const response = await fetch(url);
    const data = await response.json();
    return JSON.stringify(data);
  },
  {
    name: "fetch_data",
    description: "Fetch data from a URL",
    schema: z.object({ url: z.string().url() })
  }
);
```

---

## 九、完整示例

### 示例：智能助手工具集

```typescript
import * as z from "zod";
import { tool, createAgent } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";

// 1. 定义工具
const searchWeb = tool(
  async ({ query }) => {
    // 模拟搜索 API 调用
    return `Search results for "${query}": ...`;
  },
  {
    name: "search_web",
    description: "Search the web for information. Use when you need current data.",
    schema: z.object({
      query: z.string().describe("The search query")
    })
  }
);

const calculate = tool(
  ({ expression }) => {
    try {
      const result = eval(expression);
      return `Result: ${result}`;
    } catch {
      return "Error: Invalid expression";
    }
  },
  {
    name: "calculate",
    description: "Evaluate a mathematical expression",
    schema: z.object({
      expression: z.string().describe("Math expression, e.g., '2 + 2 * 3'")
    })
  }
);

const getCurrentTime = tool(
  () => {
    return new Date().toLocaleString();
  },
  {
    name: "get_current_time",
    description: "Get the current date and time",
    schema: z.object({})
  }
);

// 2. 创建 Agent
const agent = createAgent({
  model: new ChatOpenAI({ model: "gpt-4.1" }),
  tools: [searchWeb, calculate, getCurrentTime],
  systemPrompt: "You are a helpful assistant with access to tools. Use them when appropriate.",
  checkpointer: new MemorySaver()
});

// 3. 运行
const result = await agent.invoke({
  messages: [{ role: "user", content: "What time is it and what's 15% of 200?" }]
});

console.log(result.messages.at(-1)?.content);
```

### 示例：带上下文的工具

```typescript
import { tool, createAgent, type ToolRuntime } from "langchain";
import * as z from "zod";

const contextSchema = z.object({
  userId: z.string(),
  permissions: z.array(z.string())
});

const getOrders = tool(
  async (_, config: ToolRuntime<unknown, z.infer<typeof contextSchema>>) => {
    const { userId, permissions } = config.context;
    
    if (!permissions.includes("read_orders")) {
      return "Error: You don't have permission to view orders.";
    }
    
    // 使用 userId 查询订单
    return `Orders for user ${userId}: Order #123, Order #456`;
  },
  {
    name: "get_orders",
    description: "Get the user's orders",
    schema: z.object({})
  }
);

const agent = createAgent({
  model: "gpt-4.1",
  tools: [getOrders],
  contextSchema
});

// 调用时传入上下文
const result = await agent.invoke(
  { messages: [{ role: "user", content: "Show my orders" }] },
  { context: { userId: "user_123", permissions: ["read_orders"] } }
);
```

---

## 十、学习路径

### 核心概念优先级

| 优先级 | 概念 | 说明 |
|--------|------|------|
| 高 | 工具定义 | 掌握 tool 函数和 Schema |
| 高 | 返回值类型 | 理解字符串、对象、Command |
| 中 | 上下文访问 | Context、Store、StreamWriter |
| 中 | ToolNode | 工作流中执行工具 |
| 低 | 预构建工具 | 使用现成工具库 |
| 低 | 服务端工具 | 模型内置工具 |

### 下一步学习

1. **短期记忆**：[短期记忆学习笔记](./core-short-term-memory.md)
2. **流式输出**：[流概述学习笔记](./core-streaming.md)
3. **结构化输出**：[结构化输出学习笔记](./core-structured-output.md)

---

## 总结

本笔记涵盖了 LangChain Tools 的核心概念：

**核心要点**：
- 工具扩展 Agent 的能力边界
- 使用 Zod 定义清晰的 Schema
- 工具名称使用 snake_case
- 返回值可以是字符串、对象或 Command

**关键能力**：
- 访问运行时上下文和长期存储
- 使用 StreamWriter 发送实时更新
- 使用 ToolNode 构建工作流
- 处理工具错误和异常

**下一步**：学习 [短期记忆学习笔记](./core-short-term-memory.md)，理解 Agent 如何管理对话状态。