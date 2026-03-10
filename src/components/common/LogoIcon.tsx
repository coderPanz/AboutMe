/**
 * Logo 图标组件 - 螺丝钉/代码块结合
 * 强化个人品牌辨识度
 */
export default function LogoIcon({ className = '', size = 40 }: { className?: string; size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 外圈 - 代码块形状 */}
      <rect 
        x="2" 
        y="2" 
        width="36" 
        height="36" 
        rx="8" 
        fill="#10B981"
        className="drop-shadow-lg"
      />
      
      {/* 内圈装饰 */}
      <rect 
        x="6" 
        y="6" 
        width="28" 
        height="28" 
        rx="5" 
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
      
      {/* 螺丝钉头部 - 六边形 */}
      <path
        d="M20 10L24.5 12.5V17.5L20 20L15.5 17.5V12.5L20 10Z"
        fill="white"
      />
      
      {/* 螺丝钉杆 */}
      <rect x="18" y="18" width="4" height="12" rx="1" fill="white" />
      
      {/* 螺纹线条 */}
      <line x1="16" y1="21" x2="24" y2="21" stroke="#10B981" strokeWidth="1" />
      <line x1="16" y1="24" x2="24" y2="24" stroke="#10B981" strokeWidth="1" />
      <line x1="16" y1="27" x2="24" y2="27" stroke="#10B981" strokeWidth="1" />
      
      {/* 代码符号 </> */}
      <text
        x="20"
        y="32"
        textAnchor="middle"
        fill="white"
        fontSize="6"
        fontFamily="monospace"
        fontWeight="bold"
        opacity="0.8"
      >
        &lt;/&gt;
      </text>
    </svg>
  )
}

/**
 * 简化版 Logo - 仅螺丝钉
 */
export function LogoIconSimple({ className = '', size = 32 }: { className?: string; size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="2" width="28" height="28" rx="6" fill="#10B981" />
      <path
        d="M16 8L19.5 10V14L16 16L12.5 14V10L16 8Z"
        fill="white"
      />
      <rect x="14" y="14" width="4" height="10" rx="1" fill="white" />
    </svg>
  )
}
