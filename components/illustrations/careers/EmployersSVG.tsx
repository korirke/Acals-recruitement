export const EmployersSVG = ({ className = "w-full h-64" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <rect width="500" height="400" fill="url(#employersGradient)"/>
    
    {/* Building/Office */}
    <rect x="150" y="100" width="200" height="200" rx="12" fill="#1f2937" stroke="#374151" strokeWidth="2" className="dark:fill-neutral-700 dark:stroke-neutral-600"/>
    
    {/* Windows Grid */}
    <rect x="170" y="120" width="25" height="25" rx="4" fill="#3b82f6" fillOpacity="0.8"/>
    <rect x="205" y="120" width="25" height="25" rx="4" fill="#10b981" fillOpacity="0.8"/>
    <rect x="240" y="120" width="25" height="25" rx="4" fill="#f59e0b" fillOpacity="0.8"/>
    <rect x="275" y="120" width="25" height="25" rx="4" fill="#ef4444" fillOpacity="0.8"/>
    
    <rect x="170" y="155" width="25" height="25" rx="4" fill="#8b5cf6" fillOpacity="0.8"/>
    <rect x="205" y="155" width="25" height="25" rx="4" fill="#06b6d4" fillOpacity="0.8"/>
    <rect x="240" y="155" width="25" height="25" rx="4" fill="#84cc16" fillOpacity="0.8"/>
    <rect x="275" y="155" width="25" height="25" rx="4" fill="#f97316" fillOpacity="0.8"/>
    
    {/* People icons around building */}
    <g transform="translate(100, 250)">
      <circle cx="0" cy="0" r="15" fill="#3b82f6"/>
      <rect x="-12" y="10" width="24" height="30" rx="12" fill="#3b82f6"/>
    </g>
    
    <g transform="translate(400, 270)">
      <circle cx="0" cy="0" r="15" fill="#10b981"/>
      <rect x="-12" y="10" width="24" height="30" rx="12" fill="#10b981"/>
    </g>
    
    <g transform="translate(80, 180)">
      <circle cx="0" cy="0" r="12" fill="#f59e0b"/>
      <rect x="-10" y="8" width="20" height="24" rx="10" fill="#f59e0b"/>
    </g>
    
    <g transform="translate(420, 180)">
      <circle cx="0" cy="0" r="12" fill="#ef4444"/>
      <rect x="-10" y="8" width="20" height="24" rx="10" fill="#ef4444"/>
    </g>
    
    {/* Connection lines */}
    <path d="M115 250 Q200 200 250 240" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="5,5" fillOpacity="0.5"/>
    <path d="M385 270 Q300 220 250 260" stroke="#10b981" strokeWidth="2" fill="none" strokeDasharray="5,5" fillOpacity="0.5"/>
    
    {/* Company logo placeholder */}
    <rect x="210" y="60" width="80" height="30" rx="15" fill="#3b82f6"/>
    <rect x="220" y="68" width="60" height="4" rx="2" fill="white"/>
    <rect x="220" y="76" width="40" height="3" rx="1.5" fill="white"/>
    
    <defs>
      <linearGradient id="employersGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0fdf4" className="dark:stop-color-neutral-900"/>
        <stop offset="100%" stopColor="#ffffff" className="dark:stop-color-neutral-800"/>
      </linearGradient>
    </defs>
  </svg>
);