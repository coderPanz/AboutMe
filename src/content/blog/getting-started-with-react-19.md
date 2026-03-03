---
title: React 19 新特性入门指南
excerpt: 探索 React 19 带来的新特性，包括 Actions、use() Hook、Server Components 等重要更新。
date: 2024-03-15
tags:
  - React
  - Frontend
category: 技术
readTime: 8
pinned: true
---

## React 19 简介

React 19 是 React 团队发布的最新版本，带来了许多激动人心的新特性。本文将带你了解最重要的更新。

## 主要新特性

### 1. Actions

Actions 是 React 19 中最重要的新特性之一。它简化了表单处理和数据提交的流程。

```tsx
function Form() {
  const [state, submitAction, isPending] = useActionState(async (prevState, formData) => {
    const result = await submitForm(formData)
    return result
  }, initialState)

  return (
    <form action={submitAction}>
      <input name="email" />
      <button disabled={isPending}>
        {isPending ? '提交中...' : '提交'}
      </button>
    </form>
  )
}
```

### 2. use() Hook

新的 `use()` Hook 可以在渲染过程中读取 Promise 和 Context 的值。

```tsx
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise)
  return comments.map(comment => <Comment key={comment.id} {...comment} />)
}
```

### 3. Server Components

React 19 正式支持 Server Components，允许组件在服务器端渲染。

## 总结

React 19 带来的新特性让开发体验更好，性能更优。建议新项目直接使用 React 19。