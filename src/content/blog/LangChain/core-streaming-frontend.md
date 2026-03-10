---
title: LangChain 前端流式处理学习笔记
excerpt: 深入理解 React 前端流式集成，使用 useStream Hook 实现实时 Agent 交互
date: 2026-03-08
tags:
  - LangChain
  - AI
  - React
  - Streaming
category: 技术
readTime: 14
pinned: false
---

# LangChain 前端流式处理学习笔记

## 一、概述

### 前端流式处理的意义

在现代 AI 应用中，前端流式处理至关重要：
- **实时反馈**：用户立即看到响应
- **增强体验**：渐进式内容展示
- **工具可视化**：显示工具执行过程

### LangChain 前端解决方案

- **useStream Hook**：React Hook，简化流式 Agent 集成
- **支持多种流模式**：Token、进度、自定义更新
- **开箱即用**：无需手动处理流逻辑

---

## 二、useStream Hook

### 基本用法

```typescript
import { useStream } from "@langchain/langgraph-sdk/react";

function ChatApp() {
  const stream = useStream({
    apiUrl: "http://localhost:8000",
    assistantId: "agent",
  });

  const handleSubmit = async (message: string) => {
    await stream.submit({
      messages: [{ role: "user", content: message }],
    });
  };

  return (
    <div>
      {/* 消息列表 */}
      {stream.messages.map((msg, idx) => (
        <div key={idx}>{msg.content}</div>
      ))}
      
      {/* 加载状态 */}
      {stream.isLoading && <div>Thinking...</div>}
      
      {/* 输入框 */}
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(input);
      }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

### 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| `messages` | Message[] | 当前消息列表 |
| `isLoading` | boolean | 是否正在加载 |
| `error` | Error | 错误信息 |
| `submit` | function | 提交消息 |
| `stop` | function | 停止流式输出 |

---

## 三、流式消息渲染

### 渲染 Token 流

```typescript
function MessageContent({ content }) {
  return (
    <div className="message">
      {content}
    </div>
  );
}

function ChatStream() {
  const stream = useStream({
    apiUrl: "http://localhost:8000",
    assistantId: "agent",
  });

  return (
    <div>
      {stream.messages.map((msg, idx) => {
        if (msg.type === "ai") {
          return (
            <div key={idx} className="ai-message">
              <MessageContent content={msg.content} />
            </div>
          );
        } else if (msg.type === "human") {
          return (
            <div key={idx} className="human-message">
              {msg.content}
            </div>
          );
        }
      })}
    </div>
  );
}
```

### 工具调用可视化

```typescript
function ToolCallDisplay({ toolCall, result }) {
  return (
    <div className="tool-call">
      <div className="tool-name">Tool: {toolCall.name}</div>
      <div className="tool-args">
        Args: {JSON.stringify(toolCall.args)}
      </div>
      {result && (
        <div className="tool-result">
          Result: {result}
        </div>
      )}
    </div>
  );
}

function ChatWithTools() {
  const stream = useStream({
    apiUrl: "http://localhost:8000",
    assistantId: "agent",
  });

  return (
    <div>
      {stream.messages.map((msg, idx) => {
        if (msg.tool_calls?.length) {
          return (
            <div key={idx}>
              {msg.tool_calls.map((tc, tcIdx) => (
                <ToolCallDisplay
                  key={tcIdx}
                  toolCall={tc}
                  result={/* 从后续 ToolMessage 获取 */}
                />
              ))}
            </div>
          );
        }
      })}
    </div>
  );
}
```

---

## 四、进度指示

### 加载状态

```typescript
function LoadingIndicator({ isLoading }) {
  if (!isLoading) return null;
  
  return (
    <div className="loading-indicator">
      <span className="dot">●</span>
      <span className="dot">●</span>
      <span className="dot">●</span>
    </div>
  );
}

function Chat() {
  const stream = useStream({
    apiUrl: "http://localhost:8000",
    assistantId: "agent",
  });

  return (
    <div>
      {/* 消息列表 */}
      <MessageList messages={stream.messages} />
      
      {/* 加载指示器 */}
      <LoadingIndicator isLoading={stream.isLoading} />
      
      {/* 输入区域 */}
      <InputArea onSubmit={stream.submit} disabled={stream.isLoading} />
    </div>
  );
}
```

### 步骤进度

```typescript
function ProgressTracker({ steps }) {
  return (
    <div className="progress-tracker">
      {steps.map((step, idx) => (
        <div key={idx} className={`step ${step.status}`}>
          <span className="step-number">{idx + 1}</span>
          <span className="step-name">{step.name}</span>
        </div>
      ))}
    </div>
  );
}
```

---

## 五、错误处理

### 基本错误处理

```typescript
function ChatWithErrorHandling() {
  const stream = useStream({
    apiUrl: "http://localhost:8000",
    assistantId: "agent",
  });

  const handleSubmit = async (message: string) => {
    try {
      await stream.submit({
        messages: [{ role: "user", content: message }],
      });
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  return (
    <div>
      {/* 错误提示 */}
      {stream.error && (
        <div className="error-message">
          Error: {stream.error.message}
          <button onClick={() => stream.submit(/* retry */)}>
            Retry
          </button>
        </div>
      )}
      
      {/* 消息列表 */}
      <MessageList messages={stream.messages} />
    </div>
  );
}
```

### 重试机制

```typescript
function useStreamWithRetry(config) {
  const stream = useStream(config);
  const [retryCount, setRetryCount] = useState(0);

  const submitWithRetry = async (message, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await stream.submit(message);
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  };

  return { ...stream, submit: submitWithRetry };
}
```

---

## 六、完整示例

### 示例：聊天应用

```typescript
import React, { useState } from "react";
import { useStream } from "@langchain/langgraph-sdk/react";

function ChatApp() {
  const [input, setInput] = useState("");
  const stream = useStream({
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    assistantId: "chat-agent",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    await stream.submit({
      messages: [{ role: "user", content: userMessage }],
    });
  };

  return (
    <div className="chat-container">
      {/* 消息列表 */}
      <div className="messages">
        {stream.messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            <div className="content">{msg.content}</div>
            
            {/* 显示工具调用 */}
            {msg.tool_calls?.map((tc, tcIdx) => (
              <div key={tcIdx} className="tool-call">
                <span>🔧 {tc.name}</span>
              </div>
            ))}
          </div>
        ))}
        
        {/* 加载指示器 */}
        {stream.isLoading && (
          <div className="loading">Thinking...</div>
        )}
      </div>

      {/* 输入区域 */}
      <form onSubmit={handleSubmit} className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={stream.isLoading}
        />
        <button type="submit" disabled={stream.isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatApp;
```

### 示例：带进度显示

```typescript
import React, { useState, useEffect } from "react";
import { useStream } from "@langchain/langgraph-sdk/react";

function AgentWithProgress() {
  const [steps, setSteps] = useState([]);
  const stream = useStream({
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    assistantId: "task-agent",
  });

  // 监听步骤更新
  useEffect(() => {
    if (stream.messages) {
      const toolCalls = stream.messages
        .filter(m => m.tool_calls)
        .flatMap(m => m.tool_calls);
      
      setSteps(toolCalls.map(tc => ({
        name: tc.name,
        status: "completed"
      })));
    }
  }, [stream.messages]);

  return (
    <div className="agent-container">
      {/* 步骤进度 */}
      <div className="steps">
        {steps.map((step, idx) => (
          <div key={idx} className="step completed">
            ✓ {step.name}
          </div>
        ))}
        {stream.isLoading && (
          <div className="step loading">
            ⏳ Processing...
          </div>
        )}
      </div>

      {/* 最终结果 */}
      {stream.messages?.at(-1)?.type === "ai" && (
        <div className="result">
          {stream.messages.at(-1).content}
        </div>
      )}
    </div>
  );
}
```

---

## 七、最佳实践

### 状态管理

```typescript
// 使用 Context 共享 stream 状态
const StreamContext = createContext(null);

function StreamProvider({ children }) {
  const stream = useStream({
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    assistantId: "agent",
  });

  return (
    <StreamContext.Provider value={stream}>
      {children}
    </StreamContext.Provider>
  );
}

function useChatStream() {
  return useContext(StreamContext);
}
```

### 性能优化

```typescript
import { useMemo, useCallback } from "react";

function OptimizedChat() {
  const stream = useStream(config);

  // 缓存消息列表渲染
  const messageElements = useMemo(() => {
    return stream.messages.map((msg, idx) => (
      <Message key={idx} message={msg} />
    ));
  }, [stream.messages]);

  // 缓存提交函数
  const handleSubmit = useCallback(async (input: string) => {
    await stream.submit({
      messages: [{ role: "user", content: input }],
    });
  }, [stream.submit]);

  return (
    <div>
      {messageElements}
      <Input onSubmit={handleSubmit} />
    </div>
  );
}
```

---

## 八、学习路径

### 核心概念优先级

| 优先级 | 概念 | 说明 |
|--------|------|------|
| 高 | useStream Hook | React 集成核心 |
| 高 | 消息渲染 | 流式消息显示 |
| 中 | 工具可视化 | 工具调用展示 |
| 中 | 错误处理 | 健壮性保障 |
| 低 | 性能优化 | 大规模应用 |

### 下一步学习

1. **结构化输出**：[结构化输出学习笔记](./core-structured-output.md)
2. **中间件**：[中间件概述学习笔记](./middleware-overview.md)

---

## 总结

本笔记涵盖了 LangChain 前端流式处理的核心概念：

**核心要点**：
- useStream Hook 简化 React 集成
- 支持消息、加载状态、错误处理
- 可视化工具调用过程

**关键能力**：
- 实时渲染流式消息
- 显示执行进度
- 处理错误和重试
- 性能优化

**下一步**：学习 [结构化输出学习笔记](./core-structured-output.md)，理解如何强制模型输出特定格式。