import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Terminal, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

// 获取代码块的语言
function getLanguage(className?: string): string {
  if (!className) return 'text'
  const match = className.match(/language-(\w+)/)
  return match ? match[1] : 'text'
}

// CLI 风格代码块组件
function CodeBlock({ children, language }: { children: React.ReactNode; language: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = children?.toString() || ''
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl overflow-hidden border border-[#333] bg-[#0d1117] my-4 shadow-xl">
      {/* 终端标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          {/* 三个圆点 */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="ml-3 flex items-center gap-2 text-[#8b949e] text-xs">
            <Terminal size={12} />
            <span className="font-mono">{language}</span>
          </div>
        </div>
        {/* 复制按钮 */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[#8b949e] hover:text-white transition-colors text-xs"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? '已复制' : '复制'}</span>
        </button>
      </div>
      {/* 代码内容 - 直接填充 */}
      <pre className="bg-transparent text-[#e6edf3] text-sm leading-relaxed font-mono m-0 px-4 py-4 overflow-x-auto">
        {children}
      </pre>
    </div>
  )
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 自定义代码块渲染 - CLI 风格
          pre: ({ children }) => {
            return <>{children}</>
          },
          code: ({ className: codeClassName, children, ...props }) => {
            // 检查是否为行内代码
            const isInline = !codeClassName
            if (isInline) {
              return (
                <code
                  className="bg-[#F9FAFB] text-[#1F2937] px-1.5 py-0.5 rounded text-sm font-mono border border-[#F3F4F6]"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            // 代码块使用 CLI 风格
            const language = getLanguage(codeClassName)
            return (
              <CodeBlock language={language}>
                {children}
              </CodeBlock>
            )
          },
          // 自定义链接渲染 - 使用蓝色点缀
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-[#3B82F6] hover:text-[#10B981] transition-colors underline underline-offset-2 font-medium"
            >
              {children}
            </a>
          ),
          // 自定义标题渲染 - 中性色
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-[#1F2937] mt-8 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-[#1F2937] mt-8 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#10B981] rounded-full" />
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold text-[#374151] mt-6 mb-3">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold text-[#4B5563] mt-4 mb-2">
              {children}
            </h4>
          ),
          // 自定义段落渲染
          p: ({ children }) => <p className="mb-4 leading-7 text-[#4B5563]">{children}</p>,
          // 自定义列表渲染
          ul: ({ children }) => <ul className="mb-4 pl-6 list-disc text-[#4B5563] marker:text-[#9CA3AF]">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 pl-6 list-decimal text-[#4B5563] marker:text-[#6B7280]">{children}</ol>,
          li: ({ children }) => <li className="mb-2 leading-7">{children}</li>,
          // 自定义引用渲染 - 使用薄荷绿
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#10B981] pl-4 my-4 italic text-[#4B5563] bg-[#ECFDF5] py-3 px-4 rounded-r-xl">
              {children}
            </blockquote>
          ),
          // 自定义表格渲染
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-[#F3F4F6] rounded-lg">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-[#F9FAFB] text-[#1F2937] font-semibold text-left px-4 py-3 border border-[#F3F4F6]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 border border-[#F3F4F6] text-[#4B5563]">{children}</td>
          ),
          // 自定义分割线渲染
          hr: () => <hr className="border-[#F3F4F6] my-8" />,
          // 自定义图片渲染
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="rounded-xl my-4 max-w-full h-auto border border-[#F3F4F6] shadow-sm"
            />
          ),
          // 加粗文字
          strong: ({ children }) => (
            <strong className="text-[#1F2937] font-bold">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
