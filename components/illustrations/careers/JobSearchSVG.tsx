export const JobSearchSVG = ({ className = "w-full h-80" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <rect width="600" height="400" fill="url(#jobSearchGradient)"/>
    
    {/* Main Search Interface */}
    <rect x="100" y="60" width="400" height="280" rx="20" fill="white" stroke="#e5e7eb" strokeWidth="2" className="dark:fill-neutral-800 dark:stroke-neutral-700 drop-shadow-xl"/>
    
    {/* Header */}
    <rect x="120" y="80" width="360" height="60" rx="12" fill="#f3f4f6" className="dark:fill-neutral-700"/>
    <text x="300" y="115" textAnchor="middle" className="fill-neutral-800 dark:fill-neutral-200 text-lg font-semibold">Job Search Portal</text>
    
    {/* Search Bar */}
    <rect x="140" y="160" width="250" height="50" rx="25" fill="#f9fafb" stroke="#d1d5db" strokeWidth="2" className="dark:fill-neutral-700 dark:stroke-neutral-600"/>
    <circle cx="430" cy="185" r="22" fill="#3b82f6" className="hover:fill-primary-500 transition-colors"/>
    <path d="M422 177 L438 193 M438 177 L422 193" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    
    {/* Job Cards */}
    <g className="animate-fadeInUp">
      <rect x="140" y="230" width="320" height="45" rx="10" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="1"/>
      <circle cx="160" cy="252" r="12" fill="#3b82f6"/>
      <rect x="185" y="240" width="120" height="6" rx="3" fill="#3b82f6"/>
      <rect x="185" y="250" width="90" height="4" rx="2" fill="#6b7280" className="dark:fill-neutral-400"/>
      <rect x="185" y="258" width="60" height="4" rx="2" fill="#6b7280" className="dark:fill-neutral-400"/>
      <rect x="380" y="240" width="60" height="20" rx="10" fill="#10b981" fillOpacity="0.2"/>
      <text x="410" y="253" textAnchor="middle" className="fill-green-600 text-xs font-medium">Apply</text>
    </g>
    
    <g className="animate-fadeInUp" style={{animationDelay: '0.2s'}}>
      <rect x="140" y="285" width="320" height="45" rx="10" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="1"/>
      <circle cx="160" cy="307" r="12" fill="#f59e0b"/>
      <rect x="185" y="295" width="130" height="6" rx="3" fill="#f59e0b"/>
      <rect x="185" y="305" width="100" height="4" rx="2" fill="#6b7280" className="dark:fill-neutral-400"/>
      <rect x="185" y="313" width="70" height="4" rx="2" fill="#6b7280" className="dark:fill-neutral-400"/>
      <rect x="380" y="295" width="60" height="20" rx="10" fill="#10b981" fillOpacity="0.2"/>
      <text x="410" y="308" textAnchor="middle" className="fill-green-600 text-xs font-medium">Apply</text>
    </g>
    
    {/* Person with laptop - Enhanced */}
    <g transform="translate(520, 300)" className="animate-bounce-gentle">
      <ellipse cx="0" cy="35" rx="30" ry="8" fill="#000" fillOpacity="0.1"/>
      <circle cx="0" cy="0" r="28" fill="#f59e0b"/>
      <circle cx="-8" cy="-5" r="2" fill="#fff"/>
      <circle cx="8" cy="-5" r="2" fill="#fff"/>
      <path d="M-8 8 Q0 15 8 8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <rect x="-25" y="25" width="50" height="60" rx="25" fill="#f59e0b"/>
      {/* Enhanced Laptop */}
      <rect x="-20" y="30" width="40" height="25" rx="3" fill="#374151" className="dark:fill-neutral-600"/>
      <rect x="-16" y="34" width="32" height="18" rx="2" fill="#1f2937" className="dark:fill-neutral-800"/>
      <rect x="-12" y="38" width="8" height="2" rx="1" fill="#3b82f6"/>
      <rect x="-12" y="42" width="12" height="2" rx="1" fill="#10b981"/>
      <rect x="-12" y="46" width="10" height="2" rx="1" fill="#f59e0b"/>
    </g>
    
    {/* Floating success indicators */}
    <g className="animate-float-slow">
      <circle cx="80" cy="120" r="12" fill="#3b82f6" fillOpacity="0.3"/>
      <path d="M74 120 L78 124 L86 116" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    
    <g className="animate-float-reverse" style={{animationDelay: '1s'}}>
      <circle cx="520" cy="100" r="10" fill="#10b981" fillOpacity="0.3"/>
      <path d="M515 100 L518 103 L525 96" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    
    {/* Background decoration */}
    <circle cx="60" cy="200" r="15" fill="#f59e0b" fillOpacity="0.2" className="animate-pulse-slow"/>
    <circle cx="540" cy="250" r="12" fill="#3b82f6" fillOpacity="0.2" className="animate-pulse-slow" style={{animationDelay: '2s'}}/>
    
    <defs>
      <linearGradient id="jobSearchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0f9ff" className="dark:stop-color-neutral-900"/>
        <stop offset="100%" stopColor="#ffffff" className="dark:stop-color-neutral-800"/>
      </linearGradient>
    </defs>
  </svg>
);

export const EmployersSVG = ({ className = "w-full h-80" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <rect width="600" height="400" fill="url(#employersGradient)"/>
    
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

export const CareerGrowthSVG = ({ className = "w-full h-80" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <rect width="600" height="400" fill="url(#careerGradient)"/>
    
    {/* Enhanced Career ladder/steps */}
    <g transform="translate(80, 320)" className="animate-fadeInUp">
      {/* Step 1 - Entry Level */}
      <rect x="0" y="0" width="80" height="50" rx="10" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="2" className="hover:fill-opacity-30 transition-all"/>
      <circle cx="40" cy="25" r="12" fill="#3b82f6" className="animate-pulse-slow"/>
      <text x="40" y="70" textAnchor="middle" className="fill-neutral-700 dark:fill-neutral-300 text-sm font-medium">Entry Level</text>
      
      {/* Step 2 - Associate */}
      <rect x="100" y="-50" width="80" height="50" rx="10" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" className="hover:fill-opacity-30 transition-all animate-fadeInUp" style={{animationDelay: '0.2s'}}/>
      <circle cx="140" cy="-25" r="12" fill="#10b981" className="animate-pulse-slow" style={{animationDelay: '0.5s'}}/>
      <text x="140" y="20" textAnchor="middle" className="fill-neutral-700 dark:fill-neutral-300 text-sm font-medium">Associate</text>
      
      {/* Step 3 - Senior */}
      <rect x="200" y="-100" width="80" height="50" rx="10" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" className="hover:fill-opacity-30 transition-all animate-fadeInUp" style={{animationDelay: '0.4s'}}/>
      <circle cx="240" cy="-75" r="12" fill="#f59e0b" className="animate-pulse-slow" style={{animationDelay: '1s'}}/>
      <text x="240" y="-30" textAnchor="middle" className="fill-neutral-700 dark:fill-neutral-300 text-sm font-medium">Senior</text>
      
      {/* Step 4 - Manager */}
      <rect x="300" y="-150" width="80" height="50" rx="10" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="2" className="hover:fill-opacity-30 transition-all animate-fadeInUp" style={{animationDelay: '0.6s'}}/>
      <circle cx="340" cy="-125" r="12" fill="#ef4444" className="animate-pulse-slow" style={{animationDelay: '1.5s'}}/>
      <text x="340" y="-80" textAnchor="middle" className="fill-neutral-700 dark:fill-neutral-300 text-sm font-medium">Manager</text>
      
      {/* Step 5 - Executive */}
      <rect x="400" y="-200" width="80" height="50" rx="10" fill="#8b5cf6" fillOpacity="0.2" stroke="#8b5cf6" strokeWidth="2" className="hover:fill-opacity-30 transition-all animate-fadeInUp" style={{animationDelay: '0.8s'}}/>
      <circle cx="440" cy="-175" r="12" fill="#8b5cf6" className="animate-pulse-slow" style={{animationDelay: '2s'}}/>
      <text x="440" y="-130" textAnchor="middle" className="fill-neutral-700 dark:fill-neutral-300 text-sm font-medium">Executive</text>
      
      {/* Enhanced Connecting arrows */}
      <g className="animate-fadeIn" style={{animationDelay: '1s'}}>
        <path d="M80 25 L100 -25" stroke="#6b7280" strokeWidth="3" markerEnd="url(#arrowhead)" className="dark:stroke-neutral-400"/>
        <path d="M180 -25 L200 -75" stroke="#6b7280" strokeWidth="3" markerEnd="url(#arrowhead)" className="dark:stroke-neutral-400"/>
        <path d="M280 -75 L300 -125" stroke="#6b7280" strokeWidth="3" markerEnd="url(#arrowhead)" className="dark:stroke-neutral-400"/>
        <path d="M380 -125 L400 -175" stroke="#6b7280" strokeWidth="3" markerEnd="url(#arrowhead)" className="dark:stroke-neutral-400"/>
      </g>
    </g>
    
    {/* Enhanced Success indicators with animation */}
    <g transform="translate(480, 120)" className="animate-bounce-gentle">
      <circle cx="0" cy="0" r="30" fill="#fbbf24" className="drop-shadow-lg"/>
      <path d="M-12 -4 L-4 4 L12 -12" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Enhanced Rays */}
      <g stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" className="animate-pulse-slow">
        <line x1="0" y1="-45" x2="0" y2="-50"/>
        <line x1="32" y1="-32" x2="36" y2="-36"/>
        <line x1="45" y1="0" x2="50" y2="0"/>
        <line x1="32" y1="32" x2="36" y2="36"/>
        <line x1="0" y1="45" x2="0" y2="50"/>
        <line x1="-32" y1="32" x2="-36" y2="36"/>
        <line x1="-45" y1="0" x2="-50" y2="0"/>
        <line x1="-32" y1="-32" x2="-36" y2="-36"/>
      </g>
    </g>
    
    {/* Enhanced Growth chart */}
    <g transform="translate(50, 60)" className="animate-fadeInUp" style={{animationDelay: '0.5s'}}>
      <rect x="0" y="0" width="200" height="120" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="2" className="dark:fill-neutral-800 dark:stroke-neutral-700 drop-shadow-lg"/>
      
      {/* Chart title */}
      <text x="100" y="20" textAnchor="middle" className="fill-neutral-800 dark:fill-neutral-200 text-sm font-semibold">Career Progress</text>
      
      {/* Enhanced Chart bars with animation */}
      <g className="animate-fillBar">
        <rect x="25" y="80" width="20" height="30" rx="3" fill="#3b82f6" className="animate-fadeInUp" style={{animationDelay: '1s'}}/>
        <rect x="55" y="70" width="20" height="40" rx="3" fill="#10b981" className="animate-fadeInUp" style={{animationDelay: '1.2s'}}/>
        <rect x="85" y="55" width="20" height="55" rx="3" fill="#f59e0b" className="animate-fadeInUp" style={{animationDelay: '1.4s'}}/>
        <rect x="115" y="40" width="20" height="70" rx="3" fill="#ef4444" className="animate-fadeInUp" style={{animationDelay: '1.6s'}}/>
        <rect x="145" y="25" width="20" height="85" rx="3" fill="#8b5cf6" className="animate-fadeInUp" style={{animationDelay: '1.8s'}}/>
      </g>
      
      {/* Enhanced Trend line with animation */}
      <path d="M35 95 L65 90 L95 82 L125 75 L155 67" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" className="animate-fadeIn" style={{animationDelay: '2s'}}/>
      
      {/* Chart labels */}
      <text x="35" y="125" textAnchor="middle" className="fill-neutral-600 dark:fill-neutral-400 text-xs">2020</text>
      <text x="65" y="125" textAnchor="middle" className="fill-neutral-600 dark:fill-neutral-400 text-xs">2021</text>
      <text x="95" y="125" textAnchor="middle" className="fill-neutral-600 dark:fill-neutral-400 text-xs">2022</text>
      <text x="125" y="125" textAnchor="middle" className="fill-neutral-600 dark:fill-neutral-400 text-xs">2023</text>
      <text x="155" y="125" textAnchor="middle" className="fill-neutral-600 dark:fill-neutral-400 text-xs">2024</text>
    </g>
    
    {/* Enhanced Floating elements with physics */}
    <circle cx="520" cy="80" r="15" fill="#3b82f6" fillOpacity="0.3" className="animate-float-slow"/>
    <circle cx="40" cy="50" r="12" fill="#10b981" fillOpacity="0.3" className="animate-float-reverse"/>
    <circle cx="550" cy="350" r="18" fill="#f59e0b" fillOpacity="0.3" className="animate-bounce-gentle"/>
    
    {/* Additional decorative elements */}
    <g transform="translate(300, 50)" className="animate-slide-in-down">
      <rect x="0" y="0" width="120" height="30" rx="15" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="1"/>
      <text x="60" y="20" textAnchor="middle" className="fill-primary-600 text-sm font-medium">Skills Development</text>
    </g>
    
    <defs>
      <linearGradient id="careerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef3c7" className="dark:stop-color-neutral-900"/>
        <stop offset="100%" stopColor="#ffffff" className="dark:stop-color-neutral-800"/>
      </linearGradient>
      
      <marker id="arrowhead" markerWidth="12" markerHeight="8" refX="11" refY="4" orient="auto">
        <polygon points="0 0, 12 4, 0 8" fill="#6b7280" className="dark:fill-neutral-400"/>
      </marker>
    </defs>
  </svg>
);
