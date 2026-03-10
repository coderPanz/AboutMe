---
title: LangChain 流概述学习笔记
excerpt: 深入理解 LangChain 流式输出系统，掌握 Agent 进度流、LLM Token 流和自定义更新
date: 2026-03-08
tags:
  - LangChain
  - AI
  - Streaming
  - Agent
category: 技术
readTime: 12
pinned: false
---

# LangChain 流概述学习笔记

## 一、流式输出概述

### 为什么需要流式输出

流式输出对于 LLM 应用至关重要：
- **提升用户体验**：逐步显示输出，而非等待完整响应
- **减少感知延迟**：用户立即看到反馈
- **实时进度更新**：显示工具执行过程

### LangChain 流式能力

- 流式 LLM Token
- 流式 Agent 进度
- 流式自定义更新
- 流式思考/推理过程

---

## 二、流模式

### 支持的模式

| 模式 | 说明 |
|------|------|
| `updates` | 每个步骤后的状态更新 |
| `messages` | LLM Token 和元数据 |
| `custom` | 自定义用户数据 |

### 多模式组合

```typescript
await agent.stream(
  { messages: [...] },
  { streamMode: ["updates", "messages", "custom"] }
);
```

---

## 三、Agent 进度流

### 基本用法

使用 `streamMode: "updates"` 获取每个步骤后的更新：

```typescript
import z from "zod";
import { createAgent, tool } from "langchain";

const getWeather = tool(
  async ({ city }) => `The weather in ${city} is always sunny!`,
  {
    name: "get_weather",
    description: "Get weather for a given city.",
    schema: z.object({ city: z.string() }),
  }
);

const agent = createAgent({
  model: "gpt-4.1",
  tools: [getWeather],
});

for await (const chunk of await agent.stream(
  { messages: [{ role: "user", content: "what is the weather in sf" }] },
  { streamMode: "updates" }
)) {
  const [step, content] = Object.entries(chunk)[0];
  console.log(`step: ${step}`);
  console.log(`content: ${JSON.stringify(content, null, 2)}`);
}
```

**输出示例**：
```
step: model
content: { messages: [{ tool_calls: [...] }] }

step: tools
content: { messages: [{ content: "The weather in San Francisco..." }] }

step: model
content: { messages: [{ content: "The latest update says..." }] }
```

---

## 四、LLM Token 流

### 基本用法

使用 `streamMode: "messages"` 流式获取 Token：

```typescript
for await (const [token, metadata] of await agent.stream(
  { messages: [{ role: "user", content: "what is the weather in sf" }] },
  { streamMode: "messages" }
)) {
  console.log(`node: ${metadata.langgraph_node}`);
  console.log(`content: ${JSON.stringify(token.contentBlocks, null, 2)}`);
}
```

### 过滤内容类型

```typescript
for await (const [token, metadata] of await agent.stream(
  { messages: [...] },
  { streamMode: "messages" }
)) {
  if (!token.contentBlocks) continue;
  
  const reasoning = token.contentBlocks.filter((b) => b.type === "reasoning");
  const text = token.contentBlocks.filter((b) => b.type === "text");
  
  if (reasoning.length) {
    process.stdout.write(`[thinking] ${reasoning[0].reasoning}`);
  }
  if (text.length) {
    process.stdout.write(text[0].text);
  }
}
```

---

## 五、自定义更新流

### 从工具发送自定义更新

使用 `config.writer` 流式发送工具执行进度：

```typescript
import z from "zod";
import { tool, createAgent } from "langchain";
import { LangGraphRunnableConfig } from "@langchain/langgraph";

const getWeather = tool(
  async (input, config: LangGraphRunnableConfig) => {
    // 流式发送任意数据
    config.writer?.(`Looking up data for city: ${input.city}`);
    config.writer?.(`Acquired data for city: ${input.city}`);
    return `It's always sunny in ${input.city}!`;
  },
  {
    name: "get_weather",
    description: "Get weather for a given city.",
    schema: z.object({
      city: z.string().describe("The city to get weather for."),
    }),
  }
);

const agent = createAgent({
  model: "gpt-4.1",
  tools: [getWeather],
});

for await (const chunk of await agent.stream(
  { messages: [{ role: "user", content: "what is the weather in sf" }] },
  { streamMode: "custom" }
)) {
  console.log(chunk);
}
```

**输出**：
```
Looking up data for city: San Francisco
Acquired data for city: San Francisco
```

---

## 六、思考/推理流

### 启用推理

某些模型支持内部推理（如 Claude）：

```typescript
import z from "zod";
import { createAgent, tool } from "langchain";
import { ChatAnthropic } from "@langchain/anthropic";

const agent = createAgent({
  model: new ChatAnthropic({
    model: "claude-sonnet-4-6",
    thinking: { type: "enabled", budget_tokens: 5000 },
  }),
  tools: [getWeather],
});

for await (const [token, metadata] of await agent.stream(
  { messages: [{ role: "user", content: "What is the weather in SF?" }] },
  { streamMode: "messages" }
)) {
  if (!token.contentBlocks) continue;
  
  const reasoning = token.contentBlocks.filter((b) => b.type === "reasoning");
  const text = token.contentBlocks.filter((b) => b.type === "text");
  
  if (reasoning.length) {
    process.stdout.write(`[thinking] ${reasoning[0].reasoning}`);
  }
  if (text.length) {
    process.stdout.write(text[0].text);
  }
}
```

**输出示例**：
```
[thinking] The user is asking about the weather in San Francisco. I have a tool available to get this information. Let me call the get_weather tool with "San Francisco" as the city parameter.
The weather in San Francisco is: It's always sunny in San Francisco!
```

---

## 七、禁用流式输出

### 场景

- 部署到 LangSmith 时防止某些输出被流式传输
- 混合支持和不支持流式的模型
- 多 Agent 系统中控制输出

### 方法

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4.1",
  streaming: false,  // 禁用流式输出
});
```

---

## 八、最佳实践

### 选择流模式

| 需求 | 推荐模式 |
|------|----------|
| 显示 Agent 执行步骤 | `updates` |
| 实时显示文本生成 | `messages` |
| 工具执行进度反馈 | `custom` |
| 全部信息 | `["updates", "messages", "custom"]` |

### 处理流式数据

```typescript
// 聚合 Token
let fullText = "";
for await (const [token, metadata] of stream) {
  if (token.contentBlocks) {
    const textBlocks = token.contentBlocks.filter(b => b.type === "text");
    for (const block of textBlocks) {
      fullText += block.text;
      process.stdout.write(block.text);
    }
  }
}
```

---

## 九、完整示例

### 示例：实时进度反馈

```typescript
import z from "zod";
import { createAgent, tool } from "langchain";
import { LangGraphRunnableConfig } from "@langchain/langgraph";

const longRunningTask = tool(
  async ({ task }, config: LangGraphRunnableConfig) => {
    config.writer?.("Starting task...");
    
    for (let i = 1; i <= 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      config.writer?.(`Step ${i}/3 completed`);
    }
    
    return "Task completed successfully!";
  },
  {
    name: "long_running_task",
    description: "Execute a long-running task with progress updates",
    schema: z.object({ task: z.string() }),
  }
);

const agent = createAgent({
  model: "gpt-4.1",
  tools: [longRunningTask],
});

// 多模式流式输出
for await (const [mode, chunk] of await agent.stream(
  { messages: [{ role: "user", content: "Run a long task" }] },
  { streamMode: ["updates", "custom"] }
)) {
  if (mode === "custom") {
    console.log(`[Progress] ${chunk}`);
  } else if (mode === "updates") {
    console.log(`[Update] ${JSON.stringify(chunk)}`);
  }
}
```

---

## 十、学习路径

### 核心概念优先级

| 优先级 | 概念 | 说明 |
|--------|------|------|
| 高 | Agent 进度流 | 显示执行步骤 |
| 高 | LLM Token 流 | 实时文本生成 |
| 中 | 自定义更新 | 工具执行反馈 |
| 低 | 推理流 | 模型思考过程 |

### 下一步学习

1. **前端集成**：[前端流式处理学习笔记](./core-streaming-frontend.md)
2. **结构化输出**：[结构化输出学习笔记](./core-structured-output.md)

---

## 总结

本笔记涵盖了 LangChain 流式输出的核心概念：

**核心要点**：
- 流式输出提升用户体验
- 三种模式：updates、messages、custom
- 可组合多种模式

**关键能力**：
- 流式获取 Agent 进度
- 实时显示 LLM 输出
- 发送工具执行进度
- 流式推理过程

**下一步**：学习 [前端流式处理学习笔记](./core-streaming-frontend.md)，在前端应用中实现实时交互。