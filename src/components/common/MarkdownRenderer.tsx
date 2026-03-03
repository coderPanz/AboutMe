import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 自定义代码块渲染
          pre: ({ children }) => (
            <pre className="bg-[#111113] text-zinc-400 p-4 rounded-lg overflow-x-auto mb-4 border border-white/[0.06]">
              {children}
            </pre>
          ),
          code: ({ className: codeClassName, children, ...props }) => {
            // 检查是否为行内代码
            const isInline = !codeClassName
            if (isInline) {
              return (
                <code
                  className="bg-[#111113] text-[#5b8ff5] px-1.5 py-0.5 rounded text-sm border border-white/[0.06]"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <code className={codeClassName} {...props}>
                {children}
              </code>
            )
          },
          // 自定义链接渲染
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-[#5b8ff5] hover:text-[#7c6af5] transition-colors underline underline-offset-2"
            >
              {children}
            </a>
          ),
          // 自定义标题渲染
          h1: ({ children }) => (
            <h1 className="text-3xl font-semibold text-white mt-8 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium text-white mt-6 mb-3">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-medium text-white mt-4 mb-2">{children}</h4>
          ),
          // 自定义段落渲染
          p: ({ children }) => <p className="mb-4 leading-7 text-zinc-400">{children}</p>,
          // 自定义列表渲染
          ul: ({ children }) => <ul className="mb-4 pl-6 list-disc text-zinc-400">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 pl-6 list-decimal text-zinc-400">{children}</ol>,
          li: ({ children }) => <li className="mb-2 leading-7">{children}</li>,
          // 自定义引用渲染
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#5b8ff5]/30 pl-4 my-4 italic text-zinc-500 bg-[#0a0a0c] py-2 rounded-r-lg">
              {children}
            </blockquote>
          ),
          // 自定义表格渲染
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-white/[0.06]">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-[#111113] text-white font-medium text-left px-4 py-2 border border-white/[0.06]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border border-white/[0.06] text-zinc-400">{children}</td>
          ),
          // 自定义分割线渲染
          hr: () => <hr className="border-white/[0.06] my-8" />,
          // 自定义图片渲染
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="rounded-lg my-4 max-w-full h-auto border border-white/[0.06]"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}