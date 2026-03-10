---
title: LangChain 结构化输出学习笔记
excerpt: 深入理解 LangChain 结构化输出机制，掌握 Provider Strategy 和 Tool Strategy 的使用
date: 2026-03-08
tags:
  - LangChain
  - AI
  - Structured Output
  - Agent
category: 技术
readTime: 15
pinned: false
---

# LangChain 结构化输出学习笔记

## 一、概述

### 什么是结构化输出

结构化输出让 Agent 返回特定、可预测格式的数据，而非自然语言响应。

**优势**：
- 类型安全
- 易于解析
- 格式一致
- 可直接集成到应用

### 两种策略

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| Provider Strategy | 使用模型提供商原生支持 | 支持结构化输出的模型 |
| Tool Strategy | 通过工具调用实现 | 所有支持工具调用的模型 |

---

## 二、基本用法

### 在 Agent 中使用

```typescript
import * as z from "zod";
import { createAgent } from "langchain";

// 定义响应格式
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
// { name: "John Doe", email: "john@example.com", phone: "(555) 123-4567" }
```

### 响应位置

结构化响应在 `result.structuredResponse` 中返回。

---

## 三、Provider Strategy

### 原理

使用模型提供商的原生结构化输出 API（如 OpenAI、Anthropic、Google）。

### 使用方式

```typescript
import * as z from "zod";
import { createAgent, providerStrategy } from "langchain";

const ContactInfo = z.object({
  name: z.string().describe("The name of the person"),
  email: z.string().describe("The email address"),
  phone: z.string().describe("The phone number"),
});

const agent = createAgent({
  model: "gpt-4.1",
  responseFormat: providerStrategy(ContactInfo)
});
```

### 自动选择

LangChain 会自动使用 Provider Strategy（当模型支持时）：

```typescript
// 以下两种写法等效（当模型支持原生结构化输出时）
const agent = createAgent({
  model: "gpt-4.1",
  responseFormat: ContactInfo  // 自动使用 Provider Strategy
});

const agent = createAgent({
  model: "gpt-4.1",
  responseFormat: providerStrategy(ContactInfo)  // 显式指定
});
```

### 支持的提供商

- OpenAI
- Anthropic (Claude)
- Google (Gemini)
- xAI (Grok)

---

## 四、Tool Strategy

### 原理

通过工具调用实现结构化输出，适用于不支持原生结构化输出的模型。

### 使用方式

```typescript
import * as z from "zod";
import { createAgent, toolStrategy } from "langchain";

const ProductReview = z.object({
  rating: z.number().min(1).max(5).optional(),
  sentiment: z.enum(["positive", "negative"]),
  keyPoints: z.array(z.string()),
});

const agent = createAgent({
  model: "gpt-4.1",
  responseFormat: toolStrategy(ProductReview)
});

const result = await agent.invoke({
  messages: [
    { role: "user", content: "Analyze this review: 'Great product: 5 out of 5 stars. Fast shipping, but expensive'" }
  ],
});

console.log(result.structuredResponse);
// { rating: 5, sentiment: "positive", keyPoints: ["fast shipping", "expensive"] }
```

### 自定义工具消息

```typescript
const agent = createAgent({
  model: "gpt-4.1",
  responseFormat: toolStrategy(MeetingAction, {
    toolMessageContent: "Action item captured and added to meeting notes!"
  })
});
```

---

## 五、Schema 定义

### Zod Schema（推荐）

```typescript
import * as z from "zod";

const ContactInfo = z.object({
  name: z.string().describe("The name of the person"),
  email: z.string().email().describe("Email address"),
  phone: z.string().describe("Phone number"),
});
```

### Standard Schema

```typescript
import * as v from "valibot";
import { toStandardJsonSchema } from "@valibot/to-json-schema";

const ContactInfo = toStandardJsonSchema(
  v.object({
    name: v.pipe(v.string(), v.description("Name")),
    email: v.pipe(v.string(), v.description("Email")),
    phone: v.pipe(v.string(), v.description("Phone")),
  })
);
```

### JSON Schema

```typescript
const contactInfoSchema = {
  type: "object",
  description: "Contact information for a person.",
  properties: {
    name: { type: "string", description: "The name" },
    email: { type: "string", description: "Email address" },
    phone: { type: "string", description: "Phone number" }
  },
  required: ["name", "email", "phone"]
};
```

---

## 六、多结构化输出

### 定义多个输出格式

```typescript
import * as z from "zod";
import { createAgent, toolStrategy } from "langchain";

const ProductReview = z.object({
  rating: z.number().min(1).max(5).optional(),
  sentiment: z.enum(["positive", "negative"]),
  keyPoints: z.array(z.string()),
});

const CustomerComplaint = z.object({
  issueType: z.enum(["product", "service", "shipping", "billing"]),
  severity: z.enum(["low", "medium", "high"]),
  description: z.string(),
});

const agent = createAgent({
  model: "gpt-4.1",
  responseFormat: toolStrategy([ProductReview, CustomerComplaint])
});
```

模型会根据输入自动选择合适的格式。

---

## 七、错误处理

### 多输出错误

当模型错误地返回多个结构化输出时：

```
Error: Model incorrectly returned multiple structured responses (ContactInfo, EventDetails) when only one is expected.
Please fix your mistakes.
```

Agent 会自动提供错误反馈并提示模型重试。

### Schema 验证错误

当输出不符合 Schema 时：

```
Error: Failed to parse structured output for tool 'ProductRating':
1 validation error for ProductRating
rating
  Input should be less than or equal to 5
Please fix your mistakes.
```

### 自定义错误处理

```typescript
import { ToolInputParsingException } from "@langchain/core/tools";

const responseFormat = toolStrategy(ProductRating, {
  handleError: (error) => {
    if (error instanceof ToolInputParsingException) {
      return "Please provide a valid rating between 1-5.";
    }
    return error.message;
  }
});
```

### 禁用错误处理

```typescript
const responseFormat = toolStrategy(ProductRating, {
  handleError: false  // 所有错误直接抛出
});
```

---

## 八、完整示例

### 示例：信息提取

```typescript
import * as z from "zod";
import { createAgent } from "langchain";

// 定义多个提取格式
const PersonInfo = z.object({
  name: z.string(),
  age: z.number().optional(),
  occupation: z.string().optional(),
});

const CompanyInfo = z.object({
  name: z.string(),
  industry: z.string(),
  employees: z.number().optional(),
});

const LocationInfo = z.object({
  name: z.string(),
  country: z.string(),
  population: z.number().optional(),
});

const agent = createAgent({
  model: "gpt-4.1",
  responseFormat: [PersonInfo, CompanyInfo, LocationInfo],
});

// 提取人物信息
const personResult = await agent.invoke({
  messages: [
    { role: "user", content: "Extract: John Smith is a 35-year-old software engineer." }
  ],
});
console.log(personResult.structuredResponse);
// { name: "John Smith", age: 35, occupation: "software engineer" }

// 提取公司信息
const companyResult = await agent.invoke({
  messages: [
    { role: "user", content: "Extract: Microsoft is a tech company with 220,000 employees." }
  ],
});
console.log(companyResult.structuredResponse);
// { name: "Microsoft", industry: "tech", employees: 220000 }
```

### 示例：数据分析

```typescript
import * as z from "zod";
import { createAgent, toolStrategy } from "langchain";

const SentimentAnalysis = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  confidence: z.number().min(0).max(1),
  keywords: z.array(z.string()),
  summary: z.string(),
});

const agent = createAgent({
  model: "gpt-4.1",
  responseFormat: toolStrategy(SentimentAnalysis),
});

const result = await agent.invoke({
  messages: [
    { 
      role: "user", 
      content: "Analyze: 'I absolutely love this product! The quality exceeded my expectations, and the customer service was fantastic. Highly recommend!'" 
    }
  ],
});

console.log(result.structuredResponse);
// {
//   sentiment: "positive",
//   confidence: 0.95,
//   keywords: ["love", "quality", "exceeded expectations", "customer service", "fantastic", "highly recommend"],
//   summary: "Very positive review praising product quality and customer service"
// }
```

---

## 九、最佳实践

### Schema 设计

```typescript
// ✅ 推荐：提供详细描述
const UserInfo = z.object({
  name: z.string().describe("Full name of the user"),
  email: z.string().email().describe("Valid email address"),
  age: z.number().min(0).max(150).describe("Age in years"),
});

// ❌ 避免：缺少描述
const UserInfo = z.object({
  name: z.string(),
  email: z.string(),
  age: z.number(),
});
```

### 选择策略

| 场景 | 推荐策略 |
|------|----------|
| 支持原生输出的模型 | Provider Strategy |
| 需要高可靠性 | Provider Strategy |
| 不支持原生输出 | Tool Strategy |
| 混合使用工具和结构化输出 | 检查模型支持 |

### 验证输出

```typescript
const result = await agent.invoke({
  messages: [{ role: "user", content: "Extract info..." }],
});

// 验证输出
if (result.structuredResponse) {
  // 类型安全访问
  const { name, email } = result.structuredResponse;
}
```

---

## 十、学习路径

### 核心概念优先级

| 优先级 | 概念 | 说明 |
|--------|------|------|
| 高 | 基本用法 | responseFormat 参数 |
| 高 | Schema 定义 | Zod/JSON Schema |
| 中 | 策略选择 | Provider vs Tool |
| 中 | 错误处理 | 验证和重试 |
| 低 | 多输出格式 | 复杂场景 |

### 下一步学习

1. **中间件**：[中间件概述学习笔记](./middleware-overview.md)
2. **进阶主题**：Guardrails、运行时

---

## 总结

本笔记涵盖了 LangChain 结构化输出的核心概念：

**核心要点**：
- 结构化输出确保响应格式一致
- 两种策略：Provider Strategy 和 Tool Strategy
- 使用 Zod 定义 Schema

**关键能力**：
- 定义复杂的输出格式
- 处理多种结构化输出
- 错误处理和重试
- 多 Schema 支持

**下一步**：学习 [中间件概述学习笔记](./middleware-overview.md)，理解如何扩展 Agent 行为。