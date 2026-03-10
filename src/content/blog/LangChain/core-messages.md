---
title: LangChain 消息 Messages 学习笔记
excerpt: 深入理解 LangChain 消息类型、内容格式和多模态支持，掌握消息在 Agent 中的作用
date: 2026-03-08
tags:
  - LangChain
  - AI
  - Messages
  - LLM
category: 技术
readTime: 12
pinned: false
---

# LangChain 消息 Messages 学习笔记

## 一、消息概述

### 什么是消息

消息（Messages）是 LangChain 中模型上下文的基本单位，代表模型交互的输入和输出。每条消息包含：

```
┌─────────────────────────────────────────────┐
│                  Message                     │
├─────────────────────────────────────────────┤
│  Role       - 消息类型（system/user/ai/tool）│
│  Content    - 实际内容（文本、图像、音频等）   │
│  Metadata   - 元数据（ID、token 使用量等）    │
└─────────────────────────────────────────────┘
```

### 消息的作用

- 表示对话状态
- 传递多模态内容
- 记录工具调用
- 存储 token 使用信息

---

## 二、消息类型

### 类型总览

| 类型 | 类名 | 说明 |
|------|------|------|
| System | `SystemMessage` | 系统指令，定义模型行为 |
| Human | `HumanMessage` | 用户输入 |
| AI | `AIMessage` | 模型输出 |
| Tool | `ToolMessage` | 工具执行结果 |

### 消息流程图

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ SystemMessage│ ──→ │ HumanMessage │ ──→ │  AIMessage   │
│   系统指令   │     │   用户输入   │     │   模型输出   │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                    ┌──────────────┐              │ tool_calls
                    │ ToolMessage  │ ←────────────┘
                    │  工具结果    │
                    └──────────────┘
```

---

## 三、消息类型详解

### 3.1 SystemMessage（系统消息）

定义模型的行为准则和角色设定。

```typescript
import { SystemMessage } from "langchain";

// 简单系统消息
const systemMsg = new SystemMessage("You are a helpful coding assistant.");

// 详细系统消息
const detailedSystemMsg = new SystemMessage(`
You are a senior TypeScript developer with expertise in web frameworks.
Always provide code examples and explain your reasoning.
Be concise but thorough in your explanations.
`);
```

**使用场景**：
- 定义模型角色
- 设置行为准则
- 提供背景知识
- 指定输出格式

### 3.2 HumanMessage（用户消息）

表示用户输入，可包含文本、图像、音频等多模态内容。

```typescript
import { HumanMessage } from "langchain";

// 文本内容
const textMsg = new HumanMessage("What is machine learning?");

// 带元数据的消息
const msgWithMeta = new HumanMessage({
  content: "Hello!",
  name: "alice",
  id: "msg_123"
});

// 多模态内容
const multimodalMsg = new HumanMessage({
  content: [
    { type: "text", text: "What's in this image?" },
    { type: "image_url", image_url: { url: "https://example.com/image.jpg" } }
  ]
});
```

**简化写法**：

```typescript
// 以下两种写法等价
const response = await model.invoke(new HumanMessage("Hello"));
const response = await model.invoke("Hello");
```

### 3.3 AIMessage（AI 消息）

表示模型输出，包含文本、工具调用和元数据。

```typescript
import { AIMessage } from "langchain";

const response = await model.invoke("Explain AI");
console.log(typeof response);  // AIMessage

// 访问属性
console.log(response.content);           // 文本内容
console.log(response.tool_calls);        // 工具调用
console.log(response.usage_metadata);    // Token 使用量
```

**手动创建 AI 消息**（用于对话历史）：

```typescript
const aiMsg = new AIMessage("I'd be happy to help you with that!");

const messages = [
  new SystemMessage("You are a helpful assistant"),
  new HumanMessage("Can you help me?"),
  aiMsg,  // 插入历史回复
  new HumanMessage("Great! What's 2+2?")
];
```

#### AIMessage 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `content` | string | 文本内容 |
| `tool_calls` | ToolCall[] | 工具调用列表 |
| `id` | string | 消息唯一标识 |
| `usage_metadata` | UsageMetadata | Token 使用信息 |

#### 工具调用示例

```typescript
const modelWithTools = model.bindTools([getWeather]);
const response = await modelWithTools.invoke("What's the weather in Paris?");

for (const toolCall of response.tool_calls) {
  console.log(`Tool: ${toolCall.name}`);      // "get_weather"
  console.log(`Args: ${toolCall.args}`);       // { location: "Paris" }
  console.log(`ID: ${toolCall.id}`);           // "call_123"
}
```

#### Token 使用量

```typescript
const response = await model.invoke("Hello!");
console.log(response.usage_metadata);

// 输出示例：
{
  "output_tokens": 304,
  "input_tokens": 8,
  "total_tokens": 312,
  "input_token_details": { "cache_read": 0 },
  "output_token_details": { "reasoning": 256 }
}
```

### 3.4 ToolMessage（工具消息）

传递工具执行结果给模型。

```typescript
import { ToolMessage } from "langchain";

const toolMessage = new ToolMessage({
  content: "Sunny, 72°F",
  tool_call_id: "call_123",  // 必须匹配 AIMessage 中的 tool_call.id
  name: "get_weather"
});
```

**完整工具调用流程**：

```typescript
const messages = [
  new HumanMessage("What's the weather in San Francisco?"),
  // AI 决定调用工具
  new AIMessage({
    content: "",
    tool_calls: [{
      name: "get_weather",
      args: { location: "San Francisco" },
      id: "call_123"
    }]
  }),
  // 工具执行结果
  new ToolMessage({
    content: "Sunny, 72°F",
    tool_call_id: "call_123"
  })
];

// 模型处理工具结果
const response = await model.invoke(messages);
```

#### artifact 字段

存储不发送给模型的补充数据：

```typescript
const toolMessage = new ToolMessage({
  content: "It was the best of times...",  // 发送给模型
  tool_call_id: "call_123",
  name: "search_books",
  artifact: { document_id: "doc_123", page: 0 }  // 应用程序使用
});
```

**使用场景**：
- 存储文档标识符
- 保存原始结果
- 调试信息
- 下游处理数据

---

## 四、消息内容格式

### 4.1 字符串格式

最简单的形式：

```typescript
const msg = new HumanMessage("Hello");
```

### 4.2 字典格式（OpenAI 兼容）

```typescript
const messages = [
  { role: "system", content: "You are a helpful assistant" },
  { role: "user", content: "Hello" },
  { role: "assistant", content: "Hi there!" }
];
```

### 4.3 标准内容块

LangChain 提供跨提供商的标准化内容格式：

```typescript
const humanMessage = new HumanMessage({
  contentBlocks: [
    { type: "text", text: "What's in this image?" },
    { type: "image", url: "https://example.com/image.jpg" }
  ]
});
```

### 4.4 提供商原生格式

```typescript
// OpenAI 格式
const humanMessage = new HumanMessage({
  content: [
    { type: "text", text: "What's in this image?" },
    { type: "image_url", image_url: { url: "https://example.com/image.jpg" } }
  ]
});
```

---

## 五、多模态内容

### 5.1 图像输入

**URL 图像**：

```typescript
const response = await model.invoke([
  new HumanMessage({
    content: [
      { type: "text", text: "What's in this image?" },
      { type: "image_url", image_url: { url: "https://example.com/image.jpg" } }
    ]
  })
]);
```

**本地图像（Base64）**：

```typescript
import fs from "fs";

const imageBuffer = fs.readFileSync("./image.jpg");
const base64Image = imageBuffer.toString("base64");

const response = await model.invoke([
  new HumanMessage({
    content: [
      { type: "text", text: "Describe this image" },
      { 
        type: "image_url", 
        image_url: { 
          url: `data:image/jpeg;base64,${base64Image}` 
        } 
      }
    ]
  })
]);
```

### 5.2 内容块类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `text` | 文本内容 | `{ type: "text", text: "Hello" }` |
| `image` | 图像 | `{ type: "image", url: "..." }` |
| `reasoning` | 推理过程 | `{ type: "reasoning", reasoning: "..." }` |
| `tool_call` | 工具调用 | `{ type: "tool_call", name: "..." }` |

---

## 六、流式消息处理

### AIMessageChunk

流式输出时接收消息片段：

```typescript
import { AIMessageChunk } from "langchain";

const stream = await model.stream("Tell me a story");

let fullChunk: AIMessageChunk | undefined;
for await (const chunk of stream) {
  fullChunk = fullChunk ? fullChunk.concat(chunk) : chunk;
  console.log(fullChunk.text);  // 逐步显示
}

// 最终获得完整消息
console.log(fullChunk.contentBlocks);
```

### 处理不同内容类型

```typescript
const stream = await model.stream("Complex question...");

for await (const chunk of stream) {
  for (const block of chunk.contentBlocks) {
    switch (block.type) {
      case "reasoning":
        console.log(`[Thinking] ${block.reasoning}`);
        break;
      case "text":
        process.stdout.write(block.text);
        break;
      case "tool_call_chunk":
        console.log(`[Tool] ${block.name}`);
        break;
    }
  }
}
```

---

## 七、消息元数据

### 消息 ID

```typescript
const msg = new HumanMessage({
  content: "Hello",
  id: "custom_id_123"  // 自定义 ID
});

console.log(msg.id);  // 自动生成或自定义的 ID
```

### 名称字段

```typescript
const msg = new HumanMessage({
  content: "Hello",
  name: "alice"  // 用户名称
});
```

**注意**：`name` 字段的行为因提供商而异，部分使用它进行用户识别，部分忽略它。

---

## 八、最佳实践

### 消息结构设计

```typescript
// ✅ 推荐：清晰的消息结构
const messages = [
  new SystemMessage("You are a helpful assistant."),
  new HumanMessage("What is AI?"),
  new AIMessage("AI stands for Artificial Intelligence..."),
  new HumanMessage("Give me examples.")
];

// ✅ 推荐：使用字典格式（OpenAI 兼容）
const messages = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "What is AI?" }
];
```

### 工具消息配对

```typescript
// ✅ 正确：tool_call_id 匹配
const aiMsg = new AIMessage({
  tool_calls: [{ name: "search", id: "call_123", args: {} }]
});

const toolMsg = new ToolMessage({
  content: "Result",
  tool_call_id: "call_123"  // 匹配
});

// ❌ 错误：ID 不匹配
const toolMsg = new ToolMessage({
  content: "Result",
  tool_call_id: "wrong_id"  // 不匹配
});
```

### 多模态内容

```typescript
// ✅ 推荐：使用标准内容块
const msg = new HumanMessage({
  contentBlocks: [
    { type: "text", text: "Describe this" },
    { type: "image", url: "https://..." }
  ]
});

// 或使用提供商原生格式
const msg = new HumanMessage({
  content: [
    { type: "text", text: "Describe this" },
    { type: "image_url", image_url: { url: "https://..." } }
  ]
});
```

---

## 九、完整示例

### 示例：多轮对话

```typescript
import { initChatModel, SystemMessage, HumanMessage, AIMessage } from "langchain";

const model = await initChatModel("gpt-4.1");

// 对话历史
const conversationHistory = [
  new SystemMessage("You are a helpful coding assistant.")
];

async function chat(userInput: string) {
  // 添加用户消息
  conversationHistory.push(new HumanMessage(userInput));
  
  // 获取模型响应
  const response = await model.invoke(conversationHistory);
  
  // 添加到历史
  conversationHistory.push(response);
  
  return response.content;
}

// 使用
console.log(await chat("What is TypeScript?"));
console.log(await chat("Give me an example."));
console.log(await chat("What are the benefits?"));
```

### 示例：工具调用对话

```typescript
import { tool, ToolMessage } from "langchain";

const getWeather = tool(
  ({ location }) => `Weather in ${location}: Sunny, 72°F`,
  {
    name: "get_weather",
    description: "Get weather for a location",
    schema: z.object({ location: z.string() })
  }
);

const modelWithTools = model.bindTools([getWeather]);

async function weatherChat(location: string) {
  const messages = [
    new HumanMessage(`What's the weather in ${location}?`)
  ];
  
  // 1. 模型决定调用工具
  const response1 = await modelWithTools.invoke(messages);
  messages.push(response1);
  
  // 2. 执行工具
  if (response1.tool_calls?.length) {
    const toolCall = response1.tool_calls[0];
    const result = await getWeather.invoke(toolCall.args);
    
    messages.push(new ToolMessage({
      content: result,
      tool_call_id: toolCall.id
    }));
  }
  
  // 3. 模型生成最终回答
  const finalResponse = await modelWithTools.invoke(messages);
  return finalResponse.content;
}
```

---

## 十、学习路径

### 核心概念优先级

| 优先级 | 概念 | 说明 |
|--------|------|------|
| 高 | 消息类型 | 理解四种消息类型 |
| 高 | 内容格式 | 掌握字符串和内容块格式 |
| 中 | 工具消息 | 处理工具调用结果 |
| 中 | 多模态 | 图像、音频处理 |
| 低 | 元数据 | Token 使用量、ID |

### 下一步学习

1. **工具详解**：[工具 Tools 学习笔记](./core-tools.md)
2. **短期记忆**：[短期记忆学习笔记](./core-short-term-memory.md)
3. **流式输出**：[流概述学习笔记](./core-streaming.md)

---

## 总结

本笔记涵盖了 LangChain Messages 的核心概念：

**核心要点**：
- 消息是模型上下文的基本单位
- 四种类型：System、Human、AI、Tool
- 支持多模态内容（文本、图像、音频）
- 工具消息必须匹配 tool_call_id

**关键能力**：
- 设计清晰的消息结构
- 处理工具调用和结果
- 使用多模态内容
- 管理对话历史

**下一步**：学习 [工具 Tools 学习笔记](./core-tools.md)，深入理解工具的定义和使用。