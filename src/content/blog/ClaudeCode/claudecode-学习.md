如何真正掌握 Claude code
99% 的人都在使用人工智能，比如聊天机器人。
只有 1% 的人，我称他们为高级用户，他们像使用操作系统一样使用它。

这就是区别所在。
以下是如何真正掌握 Claude Code（从入门级 → 到专业级）：
首先，停止“只是提示”。
实际工作流程：
• 以计划模式启动
• 明确定义结果
• 让claude把它分解成几个步骤
• 审查计划
• 然后执行端到端流程

好的计划意味着更少的修改。
其次，要了解大多数人忽略的功能：
MCP → 将 Claude 连接到您的整个工具栈（GitHub、Notion、Slack、API）。
技能 → 可重用的自动化模块。
CLAUDE.md → 永久项目记忆。


场景：
• 在几秒钟内汇总客户数据
• 根据原始笔记起草产品需求文档和演示文稿
• 无需开发团队即可构建 MVP
• 进行竞品调研
• 自动化重复性工作流程
• 创建可重用的人工智能系统

大多数人犯的错误：
他们把人工智能视为更智能的谷歌。
Claude Code 更像是一位能干的队友，他会真正完成工作。
如果你真正学会了这一点，你就不再需要“寻求帮助”了。
然后开始构建系统。

人工智能用户和人工智能运营者之间的差距正在迅速扩大。



二、核心总结
1. 定位差异
普通用户把 AI 当“智能搜索/聊天工具”；高级用户（建筑商）把 AI 当“操作系统/队友”，用来构建系统、自动化流程、做项目。

2. 核心应用场景
数据汇总、写文档、快速做 MVP、竞品调研、自动化重复工作、搭建可复用 AI 系统。

3. 掌握方法（入门→专业）

• 不只是“提问”，而是先做计划、定目标、拆步骤、审计划、端到端执行。
• 用好被忽略的能力：MCP（连接工具栈）、技能（可复用自动化模块）。

4. 核心观点
AI 用户和 AI 运营者（会用 AI 做系统的人）的差距正在快速拉大。





====================================================================
Claude Code 工程化实践（总结）

一、核心理念
• 普通用法：把 Claude Code 当聊天窗口，单次提示、临时指令；
• 工程化用法：把 AI 当工程系统，用软件工程思维做模块化、可复用、可维护的 AI 工作流。

二、三大核心模块
1. CLAUDE.md（项目记忆）
• 作用：统一项目标准、约束、规则、不可协商事项；
• 价值：避免重复指令，减少token浪费与行为偏差，让 AI 行为稳定。

2. 技能（skills/）
• 本质：可复用工作流；
• 适用：代码审查、重构、格式输出、结构化分析等高频重复任务；
• 价值：把临时提示变成固定功能，工作重心从“写提示”转向“做系统设计”。

3. 钩子（hooks/）
• 作用：强制自动化检查（清洁输出、验证结构、日志、JSON 转换等）；
• 价值：减少手动修正，让输出更规范、可预测。

三、模块化目录结构
• docs/：架构决策
• src/：实际逻辑
• tools/：脚本与工具
• 作用：隔离 AI 层与应用层，避免互相干扰。

四、工程化带来的收益
• 重复指令减少
• 输出更可预测
• 协作更便捷

• 配合次级代理人、MCP、GitHub Actions、插件，效果更强。

五、最终结论：AI 工作流不是临时聊天实验，而是一流工程组件；有清晰结构，AI 才能在边界内稳定、高效工作。



claudecode-docs====================================================================
Claude 如何记住你的项目？
就通过 CLAUDE.md: claude 存储项目的记忆文件，提供项目持久记忆，并让 Claude 通过自动记忆自动积累学习。
因为每次会话都是一次全新的上下文，通过一下机制可以传递项目的上下文记忆。
- CLAUDE.md 文件：你编写的指令，为 Claude 提供持久上下文
- 自动记忆：Claude 根据你的更正和偏好自己编写的笔记
这两种模式都在每次开启会话时自动加载。

Hooks 让你在 Claude Code 操作之前或之后运行 shell 命令，如在每次文件编辑后自动格式化或在提交前运行 lint。


常见命令：
- claude： 启动 claude
- claude "运行一次性任务", 可以用这种方式实现粘贴多行文本
- claude commit: 创建 Git 提交


# claude code 如何工作？
 Claude Code 的核心工作机制 ——智能体循环（Agentic Loop）。与传统代码工具 “输入 - 输出” 的线性模式不同，它采用了带人类干预的闭环迭代模式，完美适配了你关注的 AI Agent 开发逻辑。
 Claude Code 的工作流围绕 **“上下文收集 → 执行动作 → 结果验证”** 的闭环展开，同时允许人类在任意节点介入，形成了 “智能体自主工作 + 人类精准把控” 的混合范式。（也就是执行任务的过程中支持打断，claudecode 会根据新的 prompt 规划新的流程）

 ## 工具
 工具是使 Claude Code 成为Agent的原因。没有工具，Claude 只能用文本回应。有了工具，Claude 可以采取行动：读取您的代码、编辑文件、运行命令、搜索网络并与外部服务交互。每个工具使用都会返回信息，反馈到循环中，告知 Claude 的下一个决定。
内置工具通常分为五类，每一类代表不同类型的Agent能力。

类别	        Claude 可以做什么
文件操作	     读取文件、编辑代码、创建新文件、重命名和重新组织
搜索	        按模式查找文件、使用正则表达式搜索内容、探索代码库
执行	        运行 shell 命令、启动服务器、运行测试、使用 git
网络	        搜索网络、获取文档、查找错误消息
代码智能	     编辑后查看类型错误和警告、跳转到定义、查找引用（需要代码智能插件）

会话是独立的。 每个新会话都以新的上下文窗口开始，没有来自以前会话的对话历史。Claude 可以使用自动内存跨会话保持学习，您可以在 CLAUDE.md 中添加您自己的持久说明。

上下文管理：
- 单次上下文接近极限是，claudecode 自动管理上下文。它首先清除较旧的工具输出，对于老旧的上下文细节可能会丢失，所以持久上下文记忆需要放在 claude.md 中，而不是依赖对话历史。
- 使用 skills 和 subagents 管理上下文

Skills 按需加载。Claude 在会话开始时看到 skill 描述，但完整内容仅在使用 skill 时加载。
Subagents（子Agent） 子Agent 运行时会创建一个新的上下文，完全独立于本次上下文不占用上下文 token，当子 Agent 完成任务时，他会返回一个摘要到主上下文窗口。这种隔离是为什么 subagents 有助于长会话。


## 撤销更改
按两次 Esc 以回退到之前的状态，或要求 Claude 撤销。

## 执行流程的控制
按 Shift+Tab 循环通过权限模式：
- 默认：Claude 在文件编辑和 shell 命令之前询问
- 自动接受编辑：Claude 编辑文件而不询问，仍然询问命令
- Plan Mode：Claude 仅使用只读工具，创建您可以在执行前批准的计划
您也可以在 .claude/settings.json 中允许特定命令，以便 Claude 不会每次都询问。这对于受信任的命令（如 npm test 或 git status）很有用。

内置指令：
/init 引导您为项目创建 CLAUDE.md
/agents 帮助您配置自定义 subagents
/doctor 诊断您的安装的常见问题


### 中断和引导
您可以随时中断 Claude。如果它走错了路，只需输入您的更正并按 Enter。Claude 将停止正在做的事情并根据您的输入调整其方法。您不必等待它完成或重新开始。


### 复杂问题解决流程
对于复杂的问题，将研究与编码分开。使用 plan mode（按 Shift+Tab 两次进入 plan mode）首先分析代码库：


# 扩展claude code
目的是：了解何时使用 CLAUDE.md、Skills、subagents、hooks、MCP 和 plugins。
扩展插入Agent循环的不同部分：
- CLAUDE.md 添加 Claude 每个会话都能看到的持久上下文
- Skills 添加可重用的知识和可调用的工作流
MCP 将 Claude 连接到外部服务和工具
Subagents 在隔离的上下文中运行自己的循环，返回摘要
Agent teams 协调多个独立会话，具有共享任务和点对点消息传递
Hooks 完全在循环外作为确定性脚本运行
Plugins 和 marketplaces 打包和分发这些功能

## skills
Skills 是最灵活的扩展。Skill 是一个包含知识、工作流或说明的 markdown 文件。您可以使用 /deploy 之类的命令调用 skills，或者 Claude 可以在相关时自动加载它们。Skills 可以在您当前的对话中运行，也可以通过 subagents 在隔离的上下文中运行。

claudecode 工程化工具  
![claudecode 工程化工具](/assets/ClaudeCode工程化工具.png)

Plugins 是打包层。Plugin 将 skills、hooks、subagents 和 MCP servers 捆绑到单个可安装单元中。Plugin skills 被命名空间化（如 /my-plugin:review），因此多个 plugins 可以共存。当您想在多个存储库中重用相同的设置或通过 marketplace 分发给他人时，使用 plugins。

### 如何更好的区分这些功能
Skills 和 subagents 解决不同的问题：
- Skills 是可重用的内容，您可以将其加载到任何上下文中
- Subagents 是与您的主对话分开运行的隔离工作者

方面	     Skill	                        Subagent
它是什么	 可重用的说明、知识或工作流	         具有自己上下文的隔离工作者
主要优势	 在上下文之间共享内容	             上下文隔离。工作单独进行，仅返回摘要
最适合	  参考材料、可调用的工作流	           读取许多文件的任务、并行工作、专门的工作者

子 Agent 的使用作用和使用场景：  
当您需要上下文隔离或上下文窗口变满时，使用 subagent。Subagent 可能读取数十个文件或运行广泛的搜索，但您的主对话仅接收摘要。由于 subagent 工作不消耗您的主上下文，当您不需要中间工作保持可见时，这也很有用。自定义 subagents 可以有自己的说明并可以预加载 skills。
它们可以结合。 Subagent 可以预加载特定的 skills（skills: 字段）。Skill 可以使用 context: fork 在隔离的上下文中运行。有关详细信息，请参阅 Skills。

## claudecode 功能分层
用户级别、项目级别、组织级别等
一、CLAUDE.md 文件 是累加的：
怎么理解呢？可以把 CLAUDE.md 理解成一套分层的项目规则手册，它的 “累加” 和 “优先级” 机制，本质上是让 Claude 在不同场景下自动获取最贴合的上下文，同时又能兼顾全局约定。
 什么是 “累加”？
全局规则：工作目录及以上的 CLAUDE.md（比如项目根目录）在启动时就加载，作为基础规则。
局部规则：当你进入某个子目录时，该目录下的 CLAUDE.md 会被追加到上下文中，补充或细化规则。
效果：Claude 看到的是所有层级规则的总和，而不是只看当前目录的那一份。
举个例子：
根目录的 CLAUDE.md：“使用 pnpm，提交前运行测试。”
子目录 frontend/ 的 CLAUDE.md：“使用 React 18，组件必须用 TypeScript。”
当你在 frontend/ 目录下工作时，Claude 会同时遵守这两条规则，而不是只遵守其中一条。

总结：  
把这几个功能想象成一个AI 开发团队的分工协作体系，每个角色各司其职，又能无缝配合，共同完成复杂的开发任务。
模式	                 工作原理	                                                        示例
Skill + MCP	MCP       提供连接；skill 教 Claude 如何很好地使用它	                       MCP 连接到您的数据库，skill 记录您的架构和查询模式
Skill + Subagent	    Skill 生成 subagents 进行并行工作	                              /review skill 启动在隔离上下文中工作的安全性、性能和风格 subagents
CLAUDE.md + Skills	  CLAUDE.md 保存始终开启的规则；skills 保存按需加载的参考材料	         CLAUDE.md 说”遵循我们的 API 约定”，skill 包含完整的 API 风格指南
Hook + MCP	          Hook 通过 MCP 触发外部操作	                                     编辑后 hook 在 Claude 修改关键文件时发送 Slack 通知


三、 如何平衡？（落地的 “瘦身” 策略）
作为追求高效的开发者，你需要建立 “最小必要上下文” 原则。针对不同功能，策略如下：
1. 对 CLAUDE.md：做 “分层” 与 “极简”
拒绝大而全：不要把 API 文档、详细注释都写在里面。它只应该放 **“必须时刻遵守的约束”**。
利用累加机制减负：正因为它是累加的，所以根目录只放全局规则（如包管理器、Git 规范）。子目录的规则只放该目录特有的（如前端目录只放 React 规则）。这样在前端工作时，不会加载后端的规则，减少噪音。
2. 对 Skills：做 “懒加载” 与 “精准触发”
区分 “始终需要” 和 “按需需要”：
如果是必须每次都遵守的（如代码缩进），放在 CLAUDE.md。
如果是偶尔才用的（如生成架构图、复杂的重构），做成 Skill。
明确触发词：在 Skill 描述中使用非常具体的触发词（如 /refactor-legacy 而非 /refactor），避免 Claude 误判。
3. 对 Subagents & MCP：做 “隔离” 与 “清理”
Subagents 负责 “消化噪音”：如果有大量的参考资料（如长篇的基金文档、技术论文）需要阅读，绝对不要直接扔进主对话。把它们交给 Subagent，让 Subagent 读取这些 “噪音”，只把提炼出的 3-5 条结论返回给主上下文。
MCP 只传 “数据”，不传 “细节”：调用 MCP 查询数据库时，只让它返回关键的 JSON 数据，不要让它返回整个数据库的连接日志。


功能不是加得越多越好，而是越 “精准” 越好。
CLAUDE.md 要像宪法，只定大规矩，不长篇大论。
Skills 要像工具箱，平时收起来，用的时候再拿。
Subagents 要像废纸篓，把处理海量信息的 “脏活累活” 隔离在主上下文之外。
## 上下文成本-如何控制宝贵的 token

### 每个功能都有不同的加载策略和上下文成本
功能	何时加载	加载内容	上下文成本
CLAUDE.md	会话开始	完整内容	每个请求
Skills	会话开始 + 使用时	启动时的描述，使用时的完整内容	低（每个请求的描述）*
MCP 服务器	会话开始	所有工具定义和 JSON 架构	每个请求
Subagents	生成时	具有指定 skills 的新鲜上下文	与主会话隔离
Hooks	触发时	无（外部运行）	零，除非 hook 返回添加为消息的其他上下文

![按功能的上下文成本](/assets/ClaudeCode/按功能的上下文成本.png)

注意： *默认情况下，skill 描述在会话开始时加载，以便 Claude 可以决定何时使用它们。在 skill 的 frontmatter 中设置 disable-model-invocation: true 以将其从 Claude 完全隐藏，直到您手动调用它。这将 skills 的上下文成本降低到零，您仅自己触发这些 skills。

### 他们何时加载？
claude.md
何时： 会话开始
加载内容： 所有 CLAUDE.md 文件的完整内容（托管、用户和项目级别）。
继承： Claude 从您的工作目录读取 CLAUDE.md 文件直到根目录，并在访问这些文件时发现子目录中的嵌套文件。有关详细信息，请参阅 CLAUDE.md 文件如何加载。
tips: 保持 CLAUDE.md 在约 500 行以下。将参考材料移到 skills，这些 skills 按需加载。

skills:  
Skills 是 Claude 工具包中的额外功能。它们可以是参考材料（如 API 风格指南）或您使用 /<name> 触发的可调用工作流（如 /deploy）。Claude Code 附带 捆绑的 skills，如 /simplify、/batch 和 /debug，可以开箱即用。您也可以创建自己的。Claude 在适当时使用 skills，或者您可以直接调用一个。

何时： 取决于 skill 的配置。默认情况下，描述在会话开始时加载，完整内容在使用时加载。对于仅用户 skills（disable-model-invocation: true），在您调用它们之前不加载任何内容。


加载内容： 对于模型可调用的 skills，Claude 在每个请求中看到名称和描述。当您使用 /<name> 调用 skill 或 Claude 自动加载它时，完整内容加载到您的对话中。


Claude 如何选择 skills： Claude 将您的任务与 skill 描述相匹配，以决定哪些相关。如果描述模糊或重叠，Claude 可能加载错误的 skill 或错过会有帮助的 skill。要告诉 Claude 使用特定的 skill，请使用 /<name> 调用它。带有 disable-model-invocation: true 的 Skills 对 Claude 不可见，直到您调用它们。

上下文成本： 低，直到使用。仅用户 skills 在调用前成本为零。


在 subagents 中： Skills 在 subagents 中的工作方式不同。不是按需加载，而是传递给 subagent 的 skills 在启动时完全预加载到其上下文中。Subagents 不从主会话继承 skills；您必须明确指定它们。

tips: 对有副作用的 skills 使用 disable-model-invocation: true。这节省上下文并确保仅您触发它们。


3. mcp 服务器：
何时： 会话开始。
加载内容： 来自连接服务器的所有工具定义和 JSON 架构。
上下文成本： 工具搜索（默认启用）将 MCP 工具加载到上下文的 10%，并延迟其余部分直到需要。
可靠性说明： MCP 连接可能在会话中途无声地失败。如果服务器断开连接，其工具会无警告地消失。Claude 可能尝试使用不再存在的工具。如果您注意到 Claude 无法使用它之前可以访问的 MCP 工具，请使用 /mcp 检查连接。

tips：运行 /mcp 查看每个服务器的令牌成本。断开您不主动使用的服务器。

4. 子智能体：  
何时： 按需，当您或 Claude 为任务生成一个时。
加载内容： 新鲜、隔离的上下文包含：
1. 系统提示（与父级共享以提高缓存效率）
2. 代理的 skills: 字段中列出的 skills 的完整内容
3. CLAUDE.md 和 git 状态（从父级继承）
4. 主代理在提示中传入的任何上下文

上下文成本： 与主会话隔离。Subagents 不继承您的对话历史或调用的 skills。
tips：对不需要您完整对话上下文的工作使用 subagents。它们的隔离防止膨胀您的主会话。


# CLAUDE.md
使用 CLAUDE.md 文件为 Claude 提供持久指令，并让 Claude 通过自动记忆自动积累学习。  
每个 Claude Code 会话都从一个全新的上下文窗口开始。两种机制可以跨会话传递知识：
1. CLAUDE.md 文件：你编写的指令，为 Claude 提供持久上下文
2. 自动记忆：Claude 根据你的更正和偏好自己编写的笔记


CLAUDE.md 文件： CLAUDE.md 文件是 markdown 文件，为项目、你的个人工作流或整个组织为 Claude 提供持久指令。你用纯文本编写这些文件；Claude 在每个会话开始时读取它们。

![claude.md文件位置](/assets/ClaudeCode/CLAUDE.md文件位置)

对于大型项目，我们可以根据项目结构拆分多个子 CLAUDE.md 文件在不同的文件夹使其成为一个项目记忆 tree，有利于 claudecode 对项目理解。

存在形式：项目 CLAUDE.md 可以存储在 ./CLAUDE.md 或 ./.claude/CLAUDE.md 中。创建此文件并添加适用于在项目上工作的任何人的指令：构建和测试命令、编码标准、架构决策、命名约定和常见工作流。

tips：运行 /init 自动生成起始 CLAUDE.md。Claude 分析你的代码库并创建一个包含构建命令、测试指令和它发现的项目约定的文件。如果 CLAUDE.md 已存在，/init 建议改进而不是覆盖它。从那里进行细化，添加 Claude 不会自己发现的指令。

### 编写有效的指令
CLAUDE.md 文件在每个会话开始时加载到上下文窗口中，与你的对话一起消耗令牌。你编写指令的方式会影响 Claude 遵循它们的可靠性。具体、简洁、结构良好的指令效果最好。  

推荐大小：每个 CLAUDE.md 文件目标在 200 行以下。较长的文件消耗更多上下文并降低遵守度。如果你的指令变得很大，使用 导入 或 .claude/rules/ 文件进行拆分。

结构：markdown 结构化排版即可

如何写：
1 .使用 2 空格缩进”而不是”正确格式化代码”
2. “在提交前运行 npm test”而不是”测试你的更改”
3. “API 处理程序位于 src/api/handlers/”而不是”保持文件有组织”  

一致与冲突：如果两条规则相互矛盾，Claude 可能会任意选择一条。定期审查你的 CLAUDE.md 文件、子目录中的嵌套 CLAUDE.md 文件和 .claude/rules/ 以删除过时或冲突的指令。在 monorepos 中，使用 claudeMdExcludes 跳过与你的工作无关的其他团队的 CLAUDE.md 文件。  

### 如何导入其他文件
CLAUDE.md 文件可以使用 @path/to/import 语法导入其他文件。导入的文件在启动时展开并加载到上下文中，与引用它们的 CLAUDE.md 一起。  
要引入 README、package.json 和工作流指南，请在 CLAUDE.md 中的任何地方使用 @ 语法引用它们：  

```md
有关项目概述，请参阅 @README，有关此项目的可用 npm 命令，请参阅 @package.json。

# 其他指令
- git 工作流 @docs/git-instructions.md
```

## CLAUDE.md 文件如何加载
Claude Code 通过从当前工作目录向上遍历目录树来读取 CLAUDE.md 文件，沿途检查每个目录中的 CLAUDE.md 和 CLAUDE.local.md 文件。  
总结：自下而上遍历读取 claude.md 形成要给记忆树  

## 使用 .claude/rules/ 组织规则
对于较大的项目，你可以使用 .claude/rules/ 目录将指令组织到多个文件中。这使指令保持模块化并更容易让团队维护。规则也可以 范围限定到特定文件路径，因此它们仅在 Claude 处理匹配文件时加载到上下文中，减少噪音并节省上下文空间。


### 设置规则
在项目的 .claude/rules/ 目录中放置 markdown 文件。每个文件应涵盖一个主题，具有描述性文件名，如 testing.md 或 api-design.md。所有 .md 文件都被递归发现，因此你可以将规则组织到子目录中，如 frontend/ 或 backend/：  

```md
your-project/
├── .claude/
│   ├── CLAUDE.md           # 主项目指令
│   └── rules/
│       ├── code-style.md   # 代码样式指南
│       ├── testing.md      # 测试约定
│       └── security.md     # 安全要求
```

注意：没有 paths frontmatter 的规则在启动时加载，优先级与 .claude/CLAUDE.md 相同。
规则可以使用带有 paths 字段的 YAML frontmatter 范围限定到特定文件。这些条件规则仅在 Claude 处理与指定模式匹配的文件时适用。

```md
---
paths:
  - "src/api/**/*.ts"
---

# API 开发规则

- 所有 API 端点必须包括输入验证
- 使用标准错误响应格式
- 包括 OpenAPI 文档注释
```
没有 paths 字段的规则无条件加载并适用于所有文件。路径范围规则在 Claude 读取与模式匹配的文件时触发，而不是在每次工具使用时。  

你可以指定多个模式并使用大括号扩展在一个模式中匹配多个扩展名：

```
---
paths:
  - "src/**/*.{ts,tsx}"
  - "lib/**/*.ts"
  - "tests/**/*.test.ts"
---
```

### 用户级规则
~/.claude/rules/ 中的个人规则适用于你机器上的每个项目。使用它们来处理不是项目特定的偏好：  

```md
~/.claude/rules/
├── preferences.md    # 你的个人编码偏好
└── workflows.md      # 你的首选工作流
```

⚠️：用户级规则在项目规则之前加载，给予项目规则更高的优先级。


## 自动记忆
自动记忆让 Claude 在你不编写任何内容的情况下跨会话积累知识。Claude 在工作时为自己保存笔记：构建命令、调试见解、架构笔记、代码样式偏好和工作流习惯。Claude 不会每个会话都保存内容。它根据信息在未来对话中是否有用来决定值得记住什么。  

### 启用或禁用自动记忆
自动记忆默认开启。要切换它，在会话中打开 /memory 并使用自动记忆切换，或在项目设置中设置 autoMemoryEnabled：

```json
{
  "autoMemoryEnabled": false
}
```
要通过环境变量禁用自动记忆，设置 CLAUDE_CODE_DISABLE_AUTO_MEMORY=1。


### 存储位置
每个项目在 ~/.claude/projects/<project>/memory/ 获得自己的记忆目录。<project> 路径来自 git 存储库，因此同一存储库中的所有 worktrees 和子目录共享一个自动记忆目录。在 git 存储库外，改用项目根目录。  

```md
~/.claude/projects/<project>/memory/
├── MEMORY.md          # 简洁索引，加载到每个会话
├── debugging.md       # 关于调试模式的详细笔记
├── api-conventions.md # API 设计决策
└── ...                # Claude 创建的任何其他主题文件
```
MEMORY.md 充当记忆目录的索引。Claude 在整个会话中读取和写入此目录中的文件，使用 MEMORY.md 跟踪存储的内容。  
自动记忆是本地的，不和云共享。

## Claude 不遵循我的 CLAUDE.md？
CLAUDE.md 是上下文，不是强制。Claude 读取它并尝试遵循它，但没有严格遵守的保证，**特别是对于模糊或冲突的指令。**  

## 我不知道自动记忆保存了什么
运行 /memory 并选择自动记忆文件夹来浏览 Claude 保存的内容。一切都是纯 markdown，你可以读取、编辑或删除。

## CLAUDE.md 太大了怎么办？
over 200 行的文件消耗更多上下文并可能降低遵守度。将详细内容移到使用 @path 导入引用的单独文件中，或将你的指令拆分到 .claude/rules/ 文件中。  




# 常见的工作流
使用 Claude Code 探索代码库、修复错误、重构、测试和其他日常任务的分步指南。  

## 使用专门的 subagents
假设您想使用专门的 AI subagents 来更有效地处理特定任务。
- 查看可用的 subagents：/agents
- 自动使用 subagents：Claude Code 自动将适当的任务委派给专门的 subagents：【查看我最近的代码更改以查找安全问题】、【> run all tests and fix any failures】
- 明确请求特定的 subagents：【使用代码审查子代理来检查验证模块】、【>让调试器子代理调查用户无法登录的原因】
- 为您的工作流创建自定义 subagents：> /agents
1. 然后选择”创建新 subagent”并按照提示定义：
2. 描述 subagent 目的的唯一标识符（例如 code-reviewer、api-designer）。
3. Claude 何时应使用此代理
4. 它可以访问哪些工具
5. 描述代理角色和行为的系统提示


## plan-mode
Plan Mode 指示 Claude 通过使用**只读操作**分析代码库来创建计划，非常适合探索代码库、规划复杂更改或安全地审查代码。  
何时使用 Plan Mode
- 多步骤实现：当您的功能需要对许多文件进行编辑时
- 代码探索：当您想在更改任何内容之前彻底研究代码库时
- 交互式开发：当您想与 Claude 迭代方向时
示例：  
`claude --permission-mode plan` 模式
提示词：> I need to refactor our authentication system to use OAuth2. Create a detailed migration plan.
tips：按 Ctrl+G 在默认文本编辑器中打开计划，您可以在 Claude 继续之前直接编辑它。

























