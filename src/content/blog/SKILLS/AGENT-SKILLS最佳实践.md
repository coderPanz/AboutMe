---
title: Agent-SKILLS 最佳实践
excerpt: Agent Skills（智能体技能）通过专业知识与工作流扩展 AI Agent 的能力，一次创建、多次复用，减少重复提示与步骤编写。
date: 2026-03-05
tags:
  - AI 提效
  - Agent-SKILLS
  - 最佳实践
category: 技术
readTime: 8
pinned: true
---

# Agent-SKILLS

## 介绍

Agent Skills（智能体技能）通过专业知识与工作流扩展 AI Agent 的能力。执行可重复工作流时，无需反复编写提示与步骤，既能减少提示词编写，也能让 AI 按专业流程产出更可靠的代码。

优势包括：

- 领域定制化能力：react 最佳实践技能套件、项目管理技能套件等。
- 一次创建、多次复用，大模型会按用户需求自动选用对应 Skills
- 组合能力：组合 Skills 构建复杂工作流程

## SKILLS 标准结构

根据标准定义，每个 Skill 都是一个规范化命名的文件夹，其中集合了指令、脚本和资源，AI 通过在上下文中渐进式导入这些内容来理解和学习相关技能。

```js
my-skill/
├── SKILL.md          # 必需：说明和元数据(带有 YAML frontmatter 的 Markdown 格式指令)
├── scripts/          # 可选：可执行代码、脚本（Python、Bash 等）
├── references/       # 可选：文档参考资料(按需加载的文档)
└── assets/           # 可选：输出中使用的模板、字体、图标
```

## 设计原则

Skills 使用三级系统：

- 第一级（YAML frontmatter）- **始终加载**：始终加载到 Claude 的系统提示中。提供恰到好处的信息，让 Claude 知道何时应使用每个 Skill，而无需将全部内容加载到上下文中。

```js
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
---
```

- 第二级（SKILL.md 正文）- **触发时加载**：当 Claude 认为该 Skill 与当前任务相关时加载。包含完整的指令和指导。

````markdown
# PDF Processing

## Quick start

Use pdfplumber to extract text from PDFs:

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

For advanced form filling, see [FORMS.md](FORMS.md).
````

- 第三级（链接文件）- **按需加载**：打包在 Skill 目录中的附加文件，Claude 可以按需选择浏览和发现。

**总结**：这种递进式披露在保持专业能力的同时，能最大限度减少 token 消耗。
![SKILLS 加载时机](/assets/SKILLS/SKILLS%20加载时机.png)

Claude 等工具可以同时加载多个 Skills。你的 Skill 应能与其他 Skills 协同工作，而不是假设自己是唯一可用的能力。


## SKILLS 架构
![skills 架构](/assets/SKILLS/SKILLS架构.png)
Claude 如何访问 Skill 内容：当 Skill 被触发时，Claude 使用 bash 从文件系统读取 SKILL.md，将其指令带入上下文窗口。如果这些指令引用了其他文件（如 FORMS.md 或数据库模式），Claude 也会使用额外的 bash 命令读取这些文件。当指令提到可执行脚本时，Claude 通过 bash 运行它们并仅接收输出。  
注意：脚本代码本身永远不会进入上下文。  

这种架构实现了什么：

按需文件访问：Claude 只读取每个特定任务所需的文件。一个 Skill 可以包含数十个参考文件，但如果您的任务只需要销售模式，Claude 只加载那一个文件。其余文件保留在文件系统上，消耗零 tokens。

高效脚本执行：当 Claude 运行 validate_form.py 时，脚本的代码永远不会加载到上下文窗口中。只有脚本的输出（如"验证通过"或特定错误消息）消耗 tokens。这使得脚本比让 Claude 即时生成等效代码要高效得多。

捆绑内容无实际限制：因为文件在被访问之前不消耗上下文，Skills 可以包含全面的 API 文档、大型数据集、大量示例或您需要的任何参考材料。未使用的捆绑内容不会产生上下文开销。

这种基于文件系统的模型使渐进式披露得以实现。Claude 浏览您的 Skill 就像您查阅入职指南的特定章节一样，精确访问每个任务所需的内容。  

官方示例：  
以下是 Claude 加载和使用 PDF 处理 skill 的过程：

启动：系统提示包含：PDF Processing - Extract text and tables from PDF files, fill forms, merge documents
用户请求："提取这个 PDF 中的文本并总结"
Claude 调用：bash: read pdf-skill/SKILL.md → 指令加载到上下文中
Claude 判断：不需要表单填写，因此不读取 FORMS.md
Claude 执行：使用 SKILL.md 中的指令完成任务

## SKILLS 结构

每个 Skill 都需包含一个带 YAML frontmatter 的 `SKILL.md` 文件。  
**必填字段**：`name`、`description`。

```markdown
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
---

# Your Skill Name

## Instructions
[Clear, step-by-step guidance for Claude to follow]

## Examples
[Concrete examples of using this Skill]
```

**字段要求：**

name：

最多 64 个字符
只能包含小写字母、数字和连字符
不能包含 XML 标签
不能包含保留词："anthropic"、"claude"
description：

不能为空
最多 1024 个字符
不能包含 XML 标签
description 应包含 Skill 的功能以及 Claude 应在何时使用它。  


## 最佳实践
### 简洁很关键
最佳实践围绕上下文窗口的简洁性展开。上下文窗口是共享资源，Skills、大模型与开发工具都需要从中获取： 
- 系统提示
- 对话历史
- 其他技能的元数据
- 您的实际请求  
直接写解决方案和参考文档，不要废话。  

**推荐：**

```markdown
## 提取 PDF 文本

使用 pdfplumber 进行文本提取：

\`\`\`python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
\`\`\`
```

**避免：** 冗长啰嗦

```markdown
## 提取 PDF 文本

PDF（便携式文档格式）文件是一种常见的文件格式，包含
文本、图像和其他内容。要从 PDF 中提取文本，您需要
使用一个库。有许多库可用于 PDF 处理，但我们
建议使用 pdfplumber，因为它易于使用且能处理大多数情况。
首先，您需要使用 pip 安装它。然后您可以使用下面的代码...
```

### 合适的自由度
一、高自由度（基于文本的说明）：

使用场景：
- 多种方法都有效
- 决策取决于上下文
- 启发式方法指导方法


```txt
## 代码审查流程

1. 分析代码结构和组织
2. 检查潜在的错误或边界情况
3. 建议改进可读性和可维护性
4. 验证是否遵守项目约定
```

二、中等自由度（伪代码或带参数的脚本）：
使用场景：
- 存在首选模式
- 某些变化是可以接受的
- 配置影响行为

```python
## 生成报告

使用此模板并根据需要自定义：

def generate_report(data, format="markdown", include_charts=True):
    # 处理数据
    # 以指定格式生成输出
    # 可选地包含可视化
```

三、低自由度（特定脚本，很少或没有参数）：  
使用场景：
- 操作脆弱且容易出错
- 一致性至关重要
- 必须遵循特定的序列
示例：

````markdown
## 数据库迁移

运行完全相同的脚本：

\`\`\`bash
python scripts/migrate.py --verify --backup
\`\`\`

不要修改命令或添加其他标志。
````

技能作为模型的附加功能，因此有效性取决于底层模型。可以使用的所有模型测试相关技能。  
按模型的测试考虑：
- Claude Haiku（快速、经济）：技能是否提供了足够的指导？
- Claude Sonnet（平衡）：技能是否清晰高效？
- Claude Opus（强大的推理）：技能是否避免过度解释？
对 Opus 完美有效的东西可能需要为 Haiku 提供更多细节。如果您计划在多个模型中使用您的技能，请针对所有模型都能很好地工作的说明。  
**待办**：编写若干 Skills，并用不同模型测试效果。


### 命名约定
使用一致的命名模式使技能更容易引用和讨论。我们建议对技能名称使用动名词形式（动词 + -ing），因为这清楚地描述了技能提供的活动或能力。

请记住，name 字段必须仅使用小写字母、数字和连字符。

好的命名示例（动名词形式）：
- processing-pdfs
- analyzing-spreadsheets
- managing-databases
- testing-code
- writing-documentation

避免：
- 模糊的名称：helper、utils、tools
- 过于通用：documents、data、files
- 保留字：anthropic-helper、claude-tools
- 技能集合中的不一致模式

一致的命名使以下操作更容易：
- 在文档和对话中引用技能
- 一目了然地理解技能的功能
- 组织和搜索多个技能
- 维护专业、统一的技能库

### 编写有效的描述
description 字段启用技能发现，应包括技能的功能和使用时机。
始终用第三人称编写。描述被注入到系统提示中，视角不一致可能导致遗漏或误判。

- ✅ 推荐："处理 Excel 文件并生成报告。"
- ❌ 避免："我可以帮助您处理 Excel 文件"
- 避免："您可以使用此功能处理 Excel 文件"

具体并包含关键术语。包括技能的功能和使用它的具体触发器/上下文。

每个技能恰好有一个描述字段。描述对于技能选择至关重要：Claude 使用它从可能的 100+ 个可用技能中选择正确的技能。您的描述必须提供足够的细节，以便 Claude 知道何时选择此技能，而 SKILL.md 的其余部分提供实现细节。

**推荐示例：**

1. PDF 处理技能
```txt
description: 从 PDF 文件中提取文本和表格、填充表单、合并文档。在处理 PDF 文件或用户提及 PDF、表单或文档提取时使用。
```
2. Excel 分析技能
```txt
description: 分析 Excel 电子表格、创建数据透视表、生成图表。在分析 Excel 文件、电子表格、表格数据或 .xlsx 文件时使用。
```

3. Git 提交助手技能：
```txt
description: 通过分析 git 差异生成描述性提交消息。当用户要求帮助编写提交消息或审查暂存更改时使用。
```

**避免：**

```txt
description: 帮助处理文档
description: 处理数据
description: 对文件进行各种操作
```

### 渐进式披露模式
SKILL.md 作为概述，指向 Claude 根据需要查看的详细材料，就像入职指南中的目录一样。有关渐进式披露如何工作的解释，请参阅概述中的技能如何工作。

实用指导：
- 保持 SKILL.md 正文在 500 行以下以获得最佳性能
- 接近此限制时将内容拆分为单独的文件
- 使用下面的模式有效地组织说明、代码和资源

#### 从简单到复杂
基本技能仅包含一个 SKILL.md 文件，其中包含元数据和说明：
简单的 SKILLS
![简单的SKILLS文件](/assets/SKILLS/SKILLS简单的SKILLS.md.png)

复杂的：
![复杂的SKILLS文件](/assets/SKILLS/SKILLS复杂的SKILLS.md.png)

复杂的 SKILLS 完整目录结构如下  
```txt
pdf/
├── SKILL.md              # 主要说明（触发时加载）
├── FORMS.md              # 表单填充指南（根据需要加载）
├── reference.md          # API 参考（根据需要加载）
├── examples.md           # 使用示例（根据需要加载）
└── scripts/
    ├── analyze_form.py   # 实用脚本（执行，不加载）
    ├── fill_form.py      # 表单填充脚本
    └── validate.py       # 验证脚本
```
示例如下：  
**模式 1：高级指南与参考**

````markdown
---
name: pdf-processing
description: 从 PDF 文件中提取文本和表格、填充表单、合并文档。在处理 PDF 文件或用户提及 PDF、表单或文档提取时使用。
---

# PDF 处理

## 快速开始

使用 pdfplumber 提取文本：

\`\`\`python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
\`\`\`

## 高级功能

**表单填充**：参阅 [FORMS.md](FORMS.md) 获取完整指南  
**API 参考**：参阅 [REFERENCE.md](REFERENCE.md) 获取所有方法  
**示例**：参阅 [EXAMPLES.md](EXAMPLES.md) 获取常见模式
````

Claude 仅在需要时加载 FORMS.md、REFERENCE.md 或 EXAMPLES.md。




**模式 2：特定领域组织**

对于具有多个领域的技能，按领域组织内容以避免加载无关上下文。当用户询问销售指标时，Claude 只需读取与销售相关的部分，而非财务或营销数据，从而保持 token 占用低且上下文集中。

```txt
bigquery-skill/
├── SKILL.md (概述和导航)
└── reference/
    ├── finance.md (收入、计费指标)
    ├── sales.md (机会、管道)
    ├── product.md (API 使用、功能)
    └── marketing.md (活动、归因)
```

````markdown
# BigQuery 数据分析

## 可用数据集

**财务**：收入、ARR、计费 → 参阅 [reference/finance.md](reference/finance.md)  
**销售**：机会、管道、账户 → 参阅 [reference/sales.md](reference/sales.md)  
**产品**：API 使用、功能、采用 → 参阅 [reference/product.md](reference/product.md)  
**营销**：活动、归因、电子邮件 → 参阅 [reference/marketing.md](reference/marketing.md)

## 快速搜索

使用 grep 查找特定指标：

\`\`\`bash
grep -i "revenue" reference/finance.md
grep -i "pipeline" reference/sales.md
grep -i "api usage" reference/product.md
\`\`\`
````


**模式 3：条件详情**

在正文中展示基本用法，将高级内容放到链接文件中：

```markdown
# DOCX 处理

## 创建文档

使用 docx-js 创建新文档。参阅 [DOCX-JS.md](DOCX-JS.md)。

## 编辑文档

对于简单编辑，直接修改 XML。

**跟踪更改**：参阅 [REDLINING.md](REDLINING.md)  
**OOXML 详情**：参阅 [OOXML.md](OOXML.md)
```

Claude 仅在用户需要对应功能时读取 REDLINING.md 或 OOXML.md。

### 避免深层嵌套引用
最佳实践推荐仅从 SKILLS.md 引用二级文件，不推荐在二级文件中继续引用其他文件。否则嵌套过深导致信息不完整。  

### 确保 SKILL.md 目录结构化

对于超过 100 行的参考文件，在顶部包含目录，便于快速把握结构。
```txt
# API 参考

## 内容
- 身份验证和设置
- 核心方法（创建、读取、更新、删除）
- 高级功能（批量操作、webhooks）
- 错误处理模式
- 代码示例

## 身份验证和设置
...

## 核心方法
...
```

### 复杂任务工作流处理
将复杂操作分解为清晰的顺序步骤。对于特别复杂的工作流，提供一个清单，Claude 可以将其复制到其响应中并在进行时检查。  
示例 1：研究综合工作流（适用于没有代码的技能）：
```md
## 研究综合工作流

复制此清单并跟踪您的进度：

```
研究进度：
- [ ] 步骤 1：阅读所有源文档
- [ ] 步骤 2：识别关键主题
- [ ] 步骤 3：交叉参考声明
- [ ] 步骤 4：创建结构化摘要
- [ ] 步骤 5：验证引用
```

**步骤 1：阅读所有源文档**

查看 `sources/` 目录中的每个文档。记下主要论点和支持证据。

**步骤 2：识别关键主题**

寻找跨源的模式。哪些主题重复出现？源在哪里一致或不一致？

**步骤 3：交叉参考声明**

对于每个主要声明，验证它出现在源材料中。记下哪个源支持每个点。

**步骤 4：创建结构化摘要**

按主题组织发现。包括：
- 主要声明
- 来自源的支持证据
- 相互矛盾的观点（如果有）

**步骤 5：验证引用**

检查每个声明是否引用了正确的源文档。如果引用不完整，返回步骤 3。
```
此示例展示了工作流如何应用于不需要代码的分析任务。清单模式适用于任何复杂的多步骤流程。

示例 2：PDF 表单填充工作流（适用于有代码的技能）：

```md
## PDF 表单填充工作流

复制此清单并在完成项目时检查：

```
任务进度：
- [ ] 步骤 1：分析表单（运行 analyze_form.py）
- [ ] 步骤 2：创建字段映射（编辑 fields.json）
- [ ] 步骤 3：验证映射（运行 validate_fields.py）
- [ ] 步骤 4：填充表单（运行 fill_form.py）
- [ ] 步骤 5：验证输出（运行 verify_output.py）
```

**步骤 1：分析表单**

运行：`python scripts/analyze_form.py input.pdf`

这提取表单字段及其位置，保存到 `fields.json`。

**步骤 2：创建字段映射**

编辑 `fields.json` 为每个字段添加值。

**步骤 3：验证映射**

运行：`python scripts/validate_fields.py fields.json`

在继续之前修复任何验证错误。

**步骤 4：填充表单**

运行：`python scripts/fill_form.py input.pdf fields.json output.pdf`

**步骤 5：验证输出**

运行：`python scripts/verify_output.py output.pdf`

如果验证失败，返回步骤 2。
```
清晰的步骤防止 Claude 跳过关键验证。清单帮助 Claude 和您跟踪多步骤工作流的进度。


### 实现反馈循环
常见模式：运行验证器 → 修复错误 → 重复。  
**提示**：此模式能显著提高输出质量。  
示例 1：风格指南合规性（适用于没有代码的技能）：


```md
## 内容审查流程

1. 按照 STYLE_GUIDE.md 中的指南起草您的内容
2. 根据清单审查：
   - 检查术语一致性
   - 验证示例遵循标准格式
   - 确认所有必需部分都存在
3. 如果发现问题：
   - 用特定部分参考记录每个问题
   - 修改内容
   - 再次审查清单
4. 仅当满足所有要求时才继续
5. 完成并保存文档
```
这展示了使用参考文档而不是脚本的验证循环模式。"验证器"是 STYLE_GUIDE.md，Claude 通过读取和比较来执行检查。  

示例 2：文档编辑流程（适用于有代码的技能）：
```md
## 文档编辑流程

1. 对 `word/document.xml` 进行编辑
2. **立即验证**：`python ooxml/scripts/validate.py unpacked_dir/`
3. 如果验证失败：
   - 仔细查看错误消息
   - 修复 XML 中的问题
   - 再次运行验证
4. **仅在验证通过时继续**
5. 重建：`python ooxml/scripts/pack.py unpacked_dir/ output.docx`
6. 测试输出文档
```
验证循环可以及早捕获错误。  

### 内容指南
#### 避免时间敏感信息

避免写入时间敏感、容易过时的信息：

不好的例子：时间敏感（会变成错误）：
```md
如果您在 2025 年 8 月之前执行此操作，请使用旧 API。
2025 年 8 月之后，使用新 API。
```

好的例子（使用"旧模式"部分）：
```md
## 当前方法

使用 v2 API 端点：`api.example.com/v2/messages`

## 旧模式

<details>
<summary>旧版 v1 API（已弃用 2025-08）</summary>

v1 API 使用：`api.example.com/v1/messages`

此端点不再受支持。
</details>
```

#### 使用一致的术语
在整份技能中选定一套术语并统一使用。

一致：全文统一使用「API 端点」「字段」「提取」等同一说法。  
不一致：混用「API 端点 / URL / API 路由 / 路径」「字段 / 框 / 元素 / 控件」「提取 / 拉取 / 获取 / 检索」。

全文只选用一个术语，避免混用。  

### 评估和迭代（重要）

在编写大量文档之前先建立评估。这样能确保技能针对真实问题，而不是想象中的需求。

评估驱动的开发：
1. 识别差距：在没有技能的情况下对代表性任务运行 Claude。记录具体的失败或缺失的上下文
2. 创建评估：构建三个场景来测试这些差距
3. 建立基线：测量没有技能的 Claude 的性能
4. 编写最少说明：创建足够的内容来解决差距并通过评估
5. 迭代：执行评估、与基线比较并改进
此方法确保您解决实际问题，而不是预期可能永远不会出现的要求。  

评估结构示例：

```json
{
  "skills": ["pdf-processing"],
  "query": "从此 PDF 文件中提取所有文本并将其保存到 output.txt",
  "files": ["test-files/document.pdf"],
  "expected_behavior": [
    "使用适当的 PDF 处理库或命令行工具成功读取 PDF 文件",
    "从文档中的所有页面提取文本内容，不遗漏任何页面",
    "将提取的文本保存到名为 output.txt 的文件中，格式清晰易读"
  ]
}
```

### 避免
**一、文件路径中始终使用正斜杠**（即使在 Windows 上）：

好的：scripts/helper.py、reference/guide.md
避免：scripts\helper.py、reference\guide.md
Unix 风格的路径在所有平台上都有效，而 Windows 风格的路径在 Unix 系统上会导致错误。

**二、避免提供太多选项**

除非必要，不要同时呈现多种实现方式。

不好（选择过多，容易困惑）：  
"您可以使用 pypdf、或 pdfplumber、或 PyMuPDF、或 pdf2image、或…"

推荐（给出默认方案并保留扩展可能）：  
"使用 pdfplumber 进行文本提取。对需要 OCR 的扫描 PDF，可改用 pdf2image 与 pytesseract。"

### 带有可执行代码的技能

可执行脚本应尽量健壮：执行失败时不要简单把错误抛给 Claude 处理。一段脚本应尽量保证能执行成功，预先考虑常见失败情况并给出明确处理方式。  
```python
def process_file(path):
    """处理文件，如果不存在则创建它。"""
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        # 创建具有默认内容的文件而不是失败
        print(f"文件 {path} 未找到，创建默认值")
        with open(path, 'w') as f:
            f.write('')
        return ''
    except PermissionError:
        # 提供替代方案而不是失败
        print(f"无法访问 {path}，使用默认值")
        return ''
```

### 使用脚本

实用脚本的优势：

- 比现场生成的代码更可靠
- 节省 token（代码不必进入上下文）
- 节省时间（无需反复生成代码）
- 保证多次使用行为一致

**示例：实用脚本说明**

- **analyze_form.py**：从 PDF 中提取所有表单字段  
  `python scripts/analyze_form.py input.pdf > fields.json`  
  输出为 JSON，包含字段名、类型与坐标等。

- **validate_boxes.py**：检查重叠的边界框  
  `python scripts/validate_boxes.py fields.json`  
  返回 "OK" 或列出冲突。

- **fill_form.py**：将字段值写入 PDF  
  `python scripts/fill_form.py input.pdf fields.json output.pdf`

![SKILLS实用脚本](/assets/SKILLS/SKILLS实用脚本.png)

上图展示了可执行脚本与说明文件的配合方式：说明文件（如 FORMS.md）引用脚本，**Claude 可执行脚本而无需将其源码加载到上下文中，这一点非常关键。**

### Claude 如何访问 Skills 与执行流程

- **元数据预加载**：启动时，所有技能 YAML frontmatter 中的 name 与 description 被加载到系统提示中。
- **按需读取文件**：Claude 在需要时通过 bash 从文件系统读取 SKILL.md 及其他文件。
- **高效执行脚本**：实用脚本可通过 bash 执行，其源码不必加载到上下文中，仅脚本输出消耗 token。
- **大文件无上下文惩罚**：参考文件、数据或文档在被实际读取前不占用上下文 token。
- **文件路径**：Claude 按文件系统方式导航技能目录，路径使用正斜杠（如 `reference/guide.md`），勿用反斜杠。
- **文件命名**：使用能体现内容的文件名（如 `form_validation_rules.md`），避免 `doc2.md` 这类泛化命名。
- **目录组织**：按领域或功能组织目录，便于发现。如 `reference/finance.md`、`reference/sales.md`；避免 `docs/file1.md`、`docs/file2.md`。
- **捆绑资源**：可包含完整 API 文档、大量示例与数据集，未访问前不产生上下文开销。
- **优先使用脚本**：对确定性操作优先提供脚本（如 `validate_form.py`），而非让 Claude 现场生成代码。
- **明确执行意图**：区分「运行 xxx 来提取字段」（执行）与「参阅 xxx 了解算法」（仅作参考）。
- **测试访问方式**：用真实请求验证 Claude 能否正确导航你的目录结构。

示例：
```txt
bigquery-skill/
├── SKILL.md (概述，指向参考文件)
└── reference/
    ├── finance.md (收入指标)
    ├── sales.md (管道数据)
    └── product.md (使用分析)
```
  当用户询问收入时，Claude 读取 SKILL.md，看到对 reference/finance.md 的参考，并调用 bash 来仅读取该文件。sales.md 和 product.md 文件保留在文件系统上，在需要前消耗零上下文令牌。这个基于文件系统的模型是启用渐进式披露的原因。Claude 可以导航并有选择地加载每个任务所需的内容。  


### MCP 工具参考
如果您的技能使用 MCP（模型上下文协议）工具，始终使用完全限定的工具名称以避免"找不到工具"错误。
格式：ServerName:tool_name

```txt
使用 BigQuery:bigquery_schema 工具检索表架构。
使用 GitHub:create_issue 工具创建问题。
```
其中：
- BigQuery 和 GitHub 是 MCP 服务器名称
- bigquery_schema 和 create_issue 是这些服务器中的工具名称
**提示**：缺少服务器前缀时，Claude 可能无法定位工具，尤其在存在多个 MCP 服务器时。


### 好的 Skills 检查清单

**一、SKILL.md frontmatter**  
需包含 `name` 与 `description`，并满足以下验证规则：
- name：最多 64 个字符，仅小写字母/数字/连字符，无 XML 标签，无保留字
- description：最多 1024 个字符，非空，无 XML 标签

**二、内容与结构**
- 描述具体并包含关键术语
- 描述包括技能的功能和使用时机
- SKILL.md 正文在 500 行以下
- 其他详情在单独的文件中（如果需要）
- 没有时间敏感信息（或在"旧模式"部分中）
- 整个技能中术语一致
- 示例具体，不抽象
- 文件引用一级深
- 适当使用渐进式披露
- 工作流有清晰的步骤

**三、代码与脚本**
- 脚本应解决问题而非把错误推给 Claude
- 错误处理明确且有帮助
- 没有"巫毒常数"（所有值都有理由）
- 所需的包在说明中列出并验证为可用
- 脚本有清晰的文档
- 没有 Windows 风格的路径（所有正斜杠）
- 关键操作包含验证步骤
- 包含质量关键任务的反馈循环

**四、测试**
- 至少创建三个评估
- 使用 Haiku、Sonnet 和 Opus 进行了测试
- 使用真实使用场景进行了测试
- 合并了团队反馈（如果适用）

