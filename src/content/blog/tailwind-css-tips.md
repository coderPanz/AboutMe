---
title: Tailwind CSS 实用技巧
excerpt: 分享 Tailwind CSS 开发中的实用技巧，提高开发效率和代码质量。
date: 2024-03-05
tags:
  - CSS
  - Tailwind
category: JavaScript
readTime: 6
---

## Tailwind CSS 实用技巧

分享一些 Tailwind CSS 开发中的实用技巧。

## 1. 使用 @apply 提取公共样式

当多个元素使用相同的样式组合时，可以使用 `@apply` 提取：

```css
.btn {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
}
```

## 2. 善用任意值语法

当需要使用自定义值时，可以使用任意值语法：

```html
<div class="top-[117px] text-[#ff6b6b]">
  自定义位置和颜色
</div>
```

## 3. 使用 group 和 peer 处理交互状态

```html
<div class="group">
  <img src="image.jpg" class="group-hover:scale-110 transition" />
  <p class="group-hover:text-blue-500">标题</p>
</div>
```

## 4. 响应式设计技巧

Tailwind 的响应式前缀让响应式设计变得简单：

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 移动端单列，平板双列，桌面三列 -->
</div>
```

## 5. 暗色模式支持

使用 `dark:` 前缀轻松支持暗色模式：

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  自动适应暗色模式
</div>
```

## 总结

Tailwind CSS 提供了很多实用功能，合理使用可以大大提高开发效率。