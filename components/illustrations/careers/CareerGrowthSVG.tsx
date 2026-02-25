export const CareerGrowthSVG = ({ className = "w-full h-64" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <rect width="500" height="400" fill="url(#careerGradient)"/>
    
    {/* Career ladder/steps */}
    <g transform="translate(100, 300)">
      {/* Step 1 */}
      <rect x="0" y="0" width="60" height="40" rx="8" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="2"/>
      <circle cx="30" cy="20" r="8" fill="#3b82f6"/>
      
      {/* Step 2 */}
      <rect x="80" y="-40" width="60" height="40" rx="8" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2"/>
      <circle cx="110" cy="-20" r="8" fill="#10b981"/>
      
      {/* Step 3 */}
      <rect x="160" y="-80" width="60" height="40" rx="8" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2"/>
      <circle cx="190" cy="-60" r="8" fill="#f59e0b"/>
      
      {/* Step 4 */}
      <rect x="240" y="-120" width="60" height="40" rx="8" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="2"/>
      <circle cx="270" cy="-100" r="8" fill="#ef4444"/>
      
      {/* Connecting arrows */}
      <path d="M60 20 L80 -20" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)" className="dark:stroke-neutral-400"/>
      <path d="M140 -20 L160 -60" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)" className="dark:stroke-neutral-400"/>
      <path d="M220 -60 L240 -100" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)" className="dark:stroke-neutral-400"/>
    </g>
    
    {/* Success indicators */}
    <g transform="translate(380, 150)">
      <circle cx="0" cy="0" r="20" fill="#fbbf24"/>
      <path d="M-8 -3 L-3 2 L8 -8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Rays */}
      <g stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
        <line x1="0" y1="-30" x2="0" y2="-35"/>
        <line x1="21" y1="-21" x2="25" y2="-25"/>
        <line x1="30" y1="0" x2="35" y2="0"/>
        <line x1="21" y1="21" x2="25" y2="25"/>
        <line x1="0" y1="30" x2="0" y2="35"/>
        <line x1="-21" y1="21" x2="-25" y2="25"/>
        <line x1="-30" y1="0" x2="-35" y2="0"/>
        <line x1="-21" y1="-21" x2="-25" y2="-25"/>
      </g>
    </g>
    
    {/* Growth chart */}
    <g transform="translate(50, 80)">
      <rect x="0" y="0" width="150" height="100" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="2" className="dark:fill-neutral-800 dark:stroke-neutral-700"/>
      
      {/* Chart bars */}
      <rect x="20" y="70" width="15" height="20" rx="2" fill="#3b82f6"/>
      <rect x="45" y="60" width="15" height="30" rx="2" fill="#10b981"/>
      <rect x="70" y="45" width="15" height="45" rx="2" fill="#f59e0b"/>
      <rect x="95" y="30" width="15" height="60" rx="2" fill="#ef4444"/>
      <rect x="120" y="15" width="15" height="75" rx="2" fill="#8b5cf6"/>
      
      {/* Trend line */}
      <path d="M27 80 L52 75 L77 67 L102 60 L127 52" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </g>
    
    {/* Floating elements */}
    <circle cx="450" cy="80" r="12" fill="#3b82f6" fillOpacity="0.3"/>
    <circle cx="40" cy="50" r="8" fill="#10b981" fillOpacity="0.3"/>
    <circle cx="460" cy="320" r="15" fill="#f59e0b" fillOpacity="0.3"/>
    
    <defs>
      <linearGradient id="careerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef3c7" className="dark:stop-color-neutral-900"/>
        <stop offset="100%" stopColor="#ffffff" className="dark:stop-color-neutral-800"/>
      </linearGradient>
      
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" className="dark:fill-neutral-400"/>
      </marker>
    </defs>
  </svg>
);