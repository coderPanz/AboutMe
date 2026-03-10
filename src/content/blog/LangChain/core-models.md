---
title: LangChain 模型 Models 学习笔记
excerpt: 深入理解 LangChain 模型配置，掌握模型初始化、调用方式、工具绑定和结构化输出
date: 2026-03-08
tags:
  - LangChain
  - AI
  - LLM
  - Models
category: 技术
readTime: 18
pinned: false
---

# LangChain 模型 Models 学习笔记

## 一、模型概述

### 什么是 LLM

LLM（Large Language Model，大语言模型）是强大的 AI 工具，能够像人类一样解释和生成文本。它们足够通用，无需专门训练即可完成：
- 内容创作
- 语言翻译
- 文本摘要
- 问题回答

### 模型核心能力

现代 LLM 除了文本生成，还支持多种高级能力：

```
┌─────────────────────────────────────────────────────┐
│                  LLM 核心能力                         │
├─────────────────────────────────────────────────────┤
│  文本生成   - 理解和生成自然语言                       │
│  推理能力   - 多步骤推理得出结论                       │
│  多模态     - 处理图像、音频、视频等                   │
│  结构化输出 - 强制响应遵循特定格式                     │
│  工具调用   - 调用外部工具并使用结果                   │
└─────────────────────────────────────────────────────┘
```

### 模型在 Agent 中的角色

模型是 Agent 的推理引擎：
- 驱动决策过程
- 决定调用哪些工具
- 解释工具执行结果
- 判断何时提供最终答案

**关键原则**：模型的质量和能力直接影响 Agent 的可靠性和性能。

---

## 二、模型初始化

### 两种使用方式

| 方式 | 说明 | 适用场景 |
|------|------|----------|
| 独立使用 | 直接调用模型 | 文本生成、分类、提取 |
| 与 Agent 结合 | 作为 Agent 组件 | 复杂任务、工具调用 |

### initChatModel 快速初始化

最简单的方式是使用 `initChatModel`：

```typescript
import { initChatModel } from "langchain";

// 方式 1：仅指定模型名称（自动推断提供商）
const model = await initChatModel("gpt-4.1");

// 方式 2：指定提供商和模型
const model = await initChatModel("openai:gpt-4.1");
const model = await initChatModel("anthropic:claude-sonnet-4-6");
const model = await initChatModel("google-genai:gemini-2.5-flash");
```

### 使用提供商集成包

获得更完整的控制权：

```typescript
// OpenAI
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4.1",
  apiKey: "your-api-key"
});

// Anthropic
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  model: "claude-sonnet-4-6",
  apiKey: "your-api-key"
});

// Google Gemini
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: "your-api-key"
});

// Azure OpenAI
import { AzureChatOpenAI } from "@langchain/openai";

const model = new AzureChatOpenAI({
  model: "gpt-4.1",
  azureOpenAIApiKey: "your-api-key",
  azureOpenAIApiEndpoint: "your-endpoint",
  azureOpenAIApiVersion: "your-api-version"
});
```

### 安装集成包

```bash
# OpenAI
npm install @langchain/openai

# Anthropic
npm install @langchain/anthropic

# Google GenAI
npm install @langchain/google-genai

# AWS Bedrock
npm install @langchain/aws
```

---

## 三、模型参数配置

### 核心参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `model` | string | 模型名称或标识符 |
| `apiKey` | string | API 密钥 |
| `temperature` | number | 控制输出随机性（0-1） |
| `maxTokens` | number | 最大输出 token 数 |
| `timeout` | number | 超时时间（秒） |
| `maxRetries` | number | 最大重试次数 |

### 参数详解

#### temperature（温度）

控制输出的随机性和创造性：

```
temperature: 0  → 完全确定性，适合事实性任务
temperature: 0.5 → 平衡创造性和一致性
temperature: 1  → 高度随机，适合创意写作
```

**推荐值**：
- 代码生成：0.1
- 文本摘要：0.3
- 创意写作：0.7-1.0

#### maxTokens（最大 Token 数）

限制响应长度：
- 短回答：100-300
- 段落：500-1000
- 长文本：2000+

#### maxRetries（最大重试次数）

自动重试机制：
- 默认值：2
- 网络不稳定环境：10-15
- 会自动重试：网络错误、429（限流）、5xx（服务器错误）
- 不会重试：401（未授权）、404（未找到）

### 参数配置示例

```typescript
import { initChatModel } from "langchain";

const model = await initChatModel(
  "claude-sonnet-4-6",
  {
    temperature: 0.7,
    timeout: 30,
    maxTokens: 1000,
    maxRetries: 6
  }
);
```

### 提供商特定参数

每个提供商可能有额外参数：

```typescript
// OpenAI 特定参数
const model = new ChatOpenAI({
  model: "gpt-4.1",
  use_responses_api: true  // 使用 Responses API
});

// Anthropic 特定参数
const model = new ChatAnthropic({
  model: "claude-sonnet-4-6",
  thinking: { type: "enabled", budget_tokens: 5000 }  // 启用扩展思考
});
```

---

## 四、调用方式

### 4.1 invoke（单次调用）

最简单的调用方式：

```typescript
// 字符串输入
const response = await model.invoke("Why do parrots have colorful feathers?");
console.log(response.content);
```

**使用消息列表**：

```typescript
// 对话历史格式
const conversation = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "Translate: I love programming." },
  { role: "assistant", content: "J'adore la programmation." },
  { role: "user", content: "Translate: I love building applications." },
];

const response = await model.invoke(conversation);
console.log(response.content);  // "J'adore créer des applications."
```

**使用消息对象**：

```typescript
import { HumanMessage, AIMessage, SystemMessage } from "langchain";

const conversation = [
  new SystemMessage("You are a helpful assistant."),
  new HumanMessage("Translate: I love programming."),
  new AIMessage("J'adore la programmation."),
  new HumanMessage("Translate: I love building applications."),
];

const response = await model.invoke(conversation);
```

### 4.2 stream（流式输出）

实时获取生成内容：

```typescript
const stream = await model.stream("Why do parrots have colorful feathers?");

for await (const chunk of stream) {
  console.log(chunk.text);
}

// 输出：
// Parrots
// Parrots have
// Parrots have colorful
// Parrots have colorful feathers
// Parrots have colorful feathers because...
```

**处理不同类型的内容块**：

```typescript
const stream = await model.stream("What color is the sky?");

for await (const chunk of stream) {
  for (const block of chunk.contentBlocks) {
    if (block.type === "reasoning") {
      console.log(`Reasoning: ${block.reasoning}`);
    } else if (block.type === "text") {
      console.log(block.text);
    } else if (block.type === "tool_call_chunk") {
      console.log(`Tool call: ${block}`);
    }
  }
}
```

**聚合流式输出**：

```typescript
import { AIMessageChunk } from "langchain";

let full: AIMessageChunk | null = null;
for await (const chunk of stream) {
  full = full ? full.concat(chunk) : chunk;
  console.log(full.text);  // 逐步显示完整内容
}

// 最终获得完整消息
console.log(full.contentBlocks);
```

### 4.3 batch（批量处理）

并行处理多个请求：

```typescript
const responses = await model.batch([
  "Why do parrots have colorful feathers?",
  "How do airplanes fly?",
  "What is quantum computing?",
]);

for (const response of responses) {
  console.log(response.content);
}
```

**控制并发数**：

```typescript
const inputs = Array(100).fill("Hello");

await model.batch(inputs, {
  maxConcurrency: 5  // 限制最多 5 个并行请求
});
```

### 4.4 streamEvents（事件流）

获取详细的执行事件：

```typescript
const stream = await model.streamEvents("Hello");

for await (const event of stream) {
  if (event.event === "on_chat_model_start") {
    console.log(`Input: ${event.data.input}`);
  }
  if (event.event === "on_chat_model_stream") {
    console.log(`Token: ${event.data.chunk.text}`);
  }
  if (event.event === "on_chat_model_end") {
    console.log(`Full message: ${event.data.output.text}`);
  }
}
```

**输出示例**：
```
Input: Hello
Token: Hi
Token:  there
Token: !
Token:  How
Token:  can
Token:  I
Full message: Hi there! How can I help today?
```

---

## 五、工具调用

### 工具绑定

将工具绑定到模型，使其可以调用：

```typescript
import { tool } from "langchain";
import * as z from "zod";
import { ChatOpenAI } from "@langchain/openai";

// 1. 定义工具
const getWeather = tool(
  ({ location }) => `It's sunny in ${location}.`,
  {
    name: "get_weather",
    description: "Get the weather at a location.",
    schema: z.object({
      location: z.string().describe("The location to get the weather for"),
    }),
  }
);

// 2. 创建模型并绑定工具
const model = new ChatOpenAI({ model: "gpt-4.1" });
const modelWithTools = model.bindTools([getWeather]);

// 3. 调用模型
const response = await modelWithTools.invoke("What's the weather in Boston?");

// 4. 检查工具调用
const toolCalls = response.tool_calls || [];
for (const tool_call of toolCalls) {
  console.log(`Tool: ${tool_call.name}`);
  console.log(`Args: ${JSON.stringify(tool_call.args)}`);
}
```

### 工具执行循环

当模型返回工具调用时，需要执行工具并将结果返回给模型：

```typescript
const messages = [
  { role: "user", content: "What's the weather in Boston?" }
];

// 1. 模型决定调用工具
const response = await modelWithTools.invoke(messages);
messages.push(response);

// 2. 执行工具
if (response.tool_calls) {
  for (const toolCall of response.tool_calls) {
    const result = await executeToolCall(toolCall);
    messages.push({
      role: "tool",
      content: result,
      tool_call_id: toolCall.id
    });
  }
}

// 3. 模型生成最终回答
const finalResponse = await modelWithTools.invoke(messages);
```

**注意**：使用 Agent 时，工具执行循环会自动处理。

---

## 六、结构化输出

### 基础用法

强制模型返回特定格式的数据：

```typescript
import * as z from "zod";

// 定义输出格式
const ContactInfo = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
});

const model = await initChatModel("gpt-4.1");
const modelWithStructure = model.withStructuredOutput(ContactInfo);

const result = await modelWithStructure.invoke(
  "Extract contact info from: John Doe, john@example.com, (555) 123-4567"
);

console.log(result);
// { name: "John Doe", email: "john@example.com", phone: "(555) 123-4567" }
```

### 使用 JSON Schema

```typescript
const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" }
  },
  required: ["name", "email", "phone"]
};

const modelWithStructure = model.withStructuredOutput(schema);
```

---

## 七、推理能力

### 启用推理

某些模型支持多步骤推理（如 Claude 的扩展思考）：

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  model: "claude-sonnet-4-6",
  thinking: { 
    type: "enabled", 
    budget_tokens: 5000  // 分配给推理的 token 数
  }
});

const response = await model.invoke("Solve: What is 15 * 17 + 23?");

// 响应包含推理过程
for (const block of response.contentBlocks) {
  if (block.type === "reasoning") {
    console.log("思考过程:", block.reasoning);
  } else if (block.type === "text") {
    console.log("最终答案:", block.text);
  }
}
```

### 流式推理输出

```typescript
const stream = await model.stream("Complex problem...");

for await (const chunk of stream) {
  for (const block of chunk.contentBlocks) {
    if (block.type === "reasoning") {
      process.stdout.write(`[thinking] ${block.reasoning}`);
    } else if (block.type === "text") {
      process.stdout.write(block.text);
    }
  }
}
```

---

## 八、多模态能力

### 图像输入

处理包含图像的消息：

```typescript
import { HumanMessage } from "langchain";

const response = await model.invoke([
  new HumanMessage({
    content: [
      { type: "text", text: "What's in this image?" },
      { 
        type: "image_url", 
        image_url: { url: "https://example.com/image.jpg" } 
      }
    ]
  })
]);
```

### 本地图像

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

---

## 九、最佳实践

### 模型选择

| 任务类型 | 推荐模型 | 原因 |
|----------|----------|------|
| 快速原型 | GPT-4o-mini | 成本低、速度快 |
| 复杂推理 | Claude Sonnet | 推理能力强 |
| 长上下文 | Gemini Pro | 支持超长上下文 |
| 生产环境 | GPT-4.1 | 稳定可靠 |

### 参数调优

```typescript
// 事实性任务
const factualModel = new ChatOpenAI({
  model: "gpt-4.1",
  temperature: 0
});

// 创意任务
const creativeModel = new ChatOpenAI({
  model: "gpt-4.1",
  temperature: 0.8
});

// 长文本生成
const longFormModel = new ChatOpenAI({
  model: "gpt-4.1",
  maxTokens: 4000
});
```

### 错误处理

```typescript
try {
  const response = await model.invoke("Hello");
} catch (error) {
  if (error.status === 429) {
    // 速率限制，等待后重试
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 重试逻辑
  } else if (error.status === 401) {
    // 认证错误
    console.error("Invalid API key");
  } else {
    // 其他错误
    console.error("Model error:", error.message);
  }
}
```

### 缓存优化

对于重复请求，考虑使用缓存：

```typescript
// 使用 Anthropic 提示词缓存
import { SystemMessage } from "langchain";

const cachedPrompt = new SystemMessage({
  content: [
    { type: "text", text: "You are a helpful assistant." },
    { 
      type: "text", 
      text: longDocument,  // 长文档会被缓存
      cache_control: { type: "ephemeral" }
    }
  ]
});
```

---

## 十、完整示例

### 示例：智能问答系统

```typescript
import { initChatModel } from "langchain";
import * as z from "zod";

// 1. 初始化模型
const model = await initChatModel("gpt-4.1", {
  temperature: 0.3,
  maxTokens: 1000
});

// 2. 定义工具
const searchDatabase = tool(
  async ({ query }) => {
    // 模拟数据库查询
    return `Results for: ${query}`;
  },
  {
    name: "search_database",
    description: "Search the database for information",
    schema: z.object({
      query: z.string()
    })
  }
);

// 3. 绑定工具
const modelWithTools = model.bindTools([searchDatabase]);

// 4. 流式处理
async function processQuery(query: string) {
  const stream = await modelWithTools.stream(query);
  
  let fullResponse = "";
  for await (const chunk of stream) {
    process.stdout.write(chunk.text);
    fullResponse += chunk.text;
  }
  
  return fullResponse;
}

// 5. 使用
const result = await processQuery("What is machine learning?");
```

---

## 十一、学习路径

### 核心概念优先级

| 优先级 | 概念 | 说明 |
|--------|------|------|
| 高 | 模型初始化 | 掌握 initChatModel 和提供商集成 |
| 高 | invoke/stream | 理解不同调用方式 |
| 高 | 工具绑定 | 实现工具调用能力 |
| 中 | 参数配置 | 优化模型行为 |
| 中 | 结构化输出 | 强制输出格式 |
| 低 | 推理能力 | 高级推理功能 |
| 低 | 多模态 | 图像、音频处理 |

### 下一步学习

1. **消息格式**：[消息 Messages 学习笔记](./core-messages.md)
2. **工具详解**：[工具 Tools 学习笔记](./core-tools.md)
3. **流式输出**：[流概述学习笔记](./core-streaming.md)

---

## 总结

本笔记涵盖了 LangChain Models 的核心概念：

**核心要点**：
- 模型是 Agent 的推理引擎
- initChatModel 快速初始化，提供商集成包获得更多控制
- 调用方式：invoke（单次）、stream（流式）、batch（批量）
- 工具绑定让模型具备执行能力
- 结构化输出确保响应格式一致

**关键能力**：
- 选择合适的模型和参数
- 使用流式输出提升用户体验
- 实现工具调用和结构化输出
- 处理推理和多模态内容

**下一步**：学习 [消息 Messages 学习笔记](./core-messages.md)，深入理解消息格式和内容类型。