  export const AboutHeroSVG = () => (
    <svg className="w-full h-80" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="500" height="400" fill="url(#heroGradient)"/>
      
      {/* Building */}
      <rect x="150" y="150" width="200" height="200" rx="8" fill="#1f2937" stroke="#374151" strokeWidth="2"/>
      
      {/* Windows */}
      <rect x="170" y="170" width="25" height="25" rx="4" fill="#3b82f6" opacity="0.8"/>
      <rect x="205" y="170" width="25" height="25" rx="4" fill="#10b981" opacity="0.8"/>
      <rect x="240" y="170" width="25" height="25" rx="4" fill="#f59e0b" opacity="0.8"/>
      <rect x="275" y="170" width="25" height="25" rx="4" fill="#ef4444" opacity="0.8"/>
      
      <rect x="170" y="210" width="25" height="25" rx="4" fill="#8b5cf6" opacity="0.8"/>
      <rect x="205" y="210" width="25" height="25" rx="4" fill="#06b6d4" opacity="0.8"/>
      <rect x="240" y="210" width="25" height="25" rx="4" fill="#84cc16" opacity="0.8"/>
      <rect x="275" y="210" width="25" height="25" rx="4" fill="#f97316" opacity="0.8"/>
      
      <rect x="170" y="250" width="25" height="25" rx="4" fill="#ec4899" opacity="0.8"/>
      <rect x="205" y="250" width="25" height="25" rx="4" fill="#6366f1" opacity="0.8"/>
      <rect x="240" y="250" width="25" height="25" rx="4" fill="#14b8a6" opacity="0.8"/>
      <rect x="275" y="250" width="25" height="25" rx="4" fill="#eab308" opacity="0.8"/>
      
      {/* Door */}
      <rect x="210" y="290" width="30" height="60" rx="4" fill="#374151"/>
      <circle cx="235" cy="320" r="2" fill="#9ca3af"/>
      
      {/* Logo/Sign */}
      <rect x="190" y="120" width="70" height="20" rx="10" fill="#3b82f6"/>
      <rect x="195" y="125" width="60" height="3" rx="1.5" fill="#ffffff"/>
      <rect x="195" y="132" width="40" height="2" rx="1" fill="#ffffff"/>
      
      {/* People */}
      <g transform="translate(100, 300)">
        <circle cx="0" cy="0" r="12" fill="#f59e0b"/>
        <rect x="-10" y="8" width="20" height="25" rx="10" fill="#f59e0b"/>
      </g>
      
      <g transform="translate(380, 320)">
        <circle cx="0" cy="0" r="10" fill="#10b981"/>
        <rect x="-8" y="6" width="16" height="20" rx="8" fill="#10b981"/>
      </g>
      
      <g transform="translate(70, 280)">
        <circle cx="0" cy="0" r="8" fill="#3b82f6"/>
        <rect x="-6" y="5" width="12" height="15" rx="6" fill="#3b82f6"/>
      </g>
      
      {/* Floating elements */}
      <circle cx="80" cy="100" r="15" fill="#3b82f6" opacity="0.2"/>
      <circle cx="420" cy="80" r="12" fill="#10b981" opacity="0.3"/>
      <circle cx="60" cy="200" r="10" fill="#f59e0b" opacity="0.2"/>
      <circle cx="440" cy="180" r="18" fill="#ef4444" opacity="0.2"/>
      
      <defs>
        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0f9ff"/>
          <stop offset="100%" stopColor="#ffffff"/>
        </linearGradient>
      </defs>
    </svg>
  );

  export const ValuesSVG = () => (
    <svg className="w-full h-64" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Central circle */}
      <circle cx="200" cy="150" r="40" fill="#3b82f6" opacity="0.1" stroke="#3b82f6" strokeWidth="2"/>
      <circle cx="200" cy="150" r="25" fill="#3b82f6" opacity="0.2"/>
      <circle cx="200" cy="150" r="12" fill="#3b82f6"/>
      
      {/* Value circles */}
      <circle cx="120" cy="80" r="30" fill="#10b981" opacity="0.1" stroke="#10b981" strokeWidth="2"/>
      <circle cx="120" cy="80" r="18" fill="#10b981" opacity="0.2"/>
      <circle cx="120" cy="80" r="8" fill="#10b981"/>
      
      <circle cx="280" cy="80" r="30" fill="#f59e0b" opacity="0.1" stroke="#f59e0b" strokeWidth="2"/>
      <circle cx="280" cy="80" r="18" fill="#f59e0b" opacity="0.2"/>
      <circle cx="280" cy="80" r="8" fill="#f59e0b"/>
      
      <circle cx="120" cy="220" r="30" fill="#ef4444" opacity="0.1" stroke="#ef4444" strokeWidth="2"/>
      <circle cx="120" cy="220" r="18" fill="#ef4444" opacity="0.2"/>
      <circle cx="120" cy="220" r="8" fill="#ef4444"/>
      
      <circle cx="280" cy="220" r="30" fill="#8b5cf6" opacity="0.1" stroke="#8b5cf6" strokeWidth="2"/>
      <circle cx="280" cy="220" r="18" fill="#8b5cf6" opacity="0.2"/>
      <circle cx="280" cy="220" r="8" fill="#8b5cf6"/>
      
      {/* Connection lines */}
      <path d="M 200 150 L 120 80" stroke="#3b82f6" strokeWidth="2" opacity="0.3"/>
      <path d="M 200 150 L 280 80" stroke="#3b82f6" strokeWidth="2" opacity="0.3"/>
      <path d="M 200 150 L 120 220" stroke="#3b82f6" strokeWidth="2" opacity="0.3"/>
      <path d="M 200 150 L 280 220" stroke="#3b82f6" strokeWidth="2" opacity="0.3"/>
      
      {/* Icons representation */}
      {/* Integrity (Shield) */}
      <path d="M 115 70 L 125 70 L 125 85 Q 120 90 120 90 Q 115 85 115 85 Z" fill="#ffffff"/>
      
      {/* Client-Centric (Users) */}
      <circle cx="275" cy="75" r="3" fill="#ffffff"/>
      <circle cx="285" cy="75" r="3" fill="#ffffff"/>
      <rect x="272" y="82" width="6" height="6" rx="3" fill="#ffffff"/>
      <rect x="282" y="82" width="6" height="6" rx="3" fill="#ffffff"/>
      
      {/* Innovation (Zap) */}
      <path d="M 117 212 L 123 212 L 120 218 L 123 224 L 117 224 L 120 218 Z" fill="#ffffff"/>
      
      {/* Excellence (Award) */}
      <circle cx="280" cy="218" r="4" fill="#ffffff"/>
      <path d="M 276 225 L 280 222 L 284 225 L 282 228 L 278 228 Z" fill="#ffffff"/>
      
      {/* Floating particles */}
      <circle cx="60" cy="60" r="3" fill="#3b82f6" opacity="0.4"/>
      <circle cx="340" cy="50" r="4" fill="#10b981" opacity="0.4"/>
      <circle cx="50" cy="180" r="2" fill="#f59e0b" opacity="0.4"/>
      <circle cx="350" cy="190" r="3" fill="#ef4444" opacity="0.4"/>
      <circle cx="70" cy="250" r="2" fill="#8b5cf6" opacity="0.4"/>
      <circle cx="330" cy="260" r="4" fill="#06b6d4" opacity="0.4"/>
    </svg>
  );

  export const TimelineSVG = () => (
    <svg className="w-full h-96" viewBox="0 0 300 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main timeline line */}
      <line x1="150" y1="50" x2="150" y2="450" stroke="#3b82f6" strokeWidth="4"/>
      
      {/* Timeline points */}
      <circle cx="150" cy="70" r="8" fill="#3b82f6"/>
      <circle cx="150" cy="130" r="8" fill="#10b981"/>
      <circle cx="150" cy="190" r="8" fill="#f59e0b"/>
      <circle cx="150" cy="250" r="8" fill="#ef4444"/>
      <circle cx="150" cy="310" r="8" fill="#8b5cf6"/>
      <circle cx="150" cy="370" r="8" fill="#06b6d4"/>
      <circle cx="150" cy="430" r="8" fill="#84cc16"/>
      
      {/* Content boxes */}
      <rect x="40" y="55" width="80" height="30" rx="6" fill="#3b82f6" opacity="0.1" stroke="#3b82f6" strokeWidth="1"/>
      <rect x="180" y="115" width="80" height="30" rx="6" fill="#10b981" opacity="0.1" stroke="#10b981" strokeWidth="1"/>
      <rect x="40" y="175" width="80" height="30" rx="6" fill="#f59e0b" opacity="0.1" stroke="#f59e0b" strokeWidth="1"/>
      <rect x="180" y="235" width="80" height="30" rx="6" fill="#ef4444" opacity="0.1" stroke="#ef4444" strokeWidth="1"/>
      <rect x="40" y="295" width="80" height="30" rx="6" fill="#8b5cf6" opacity="0.1" stroke="#8b5cf6" strokeWidth="1"/>
      <rect x="180" y="355" width="80" height="30" rx="6" fill="#06b6d4" opacity="0.1" stroke="#06b6d4" strokeWidth="1"/>
      <rect x="40" y="415" width="80" height="30" rx="6" fill="#84cc16" opacity="0.1" stroke="#84cc16" strokeWidth="1"/>
      
      {/* Connecting lines */}
      <line x1="142" y1="70" x2="125" y2="70" stroke="#3b82f6" strokeWidth="2"/>
      <line x1="158" y1="130" x2="175" y2="130" stroke="#10b981" strokeWidth="2"/>
      <line x1="142" y1="190" x2="125" y2="190" stroke="#f59e0b" strokeWidth="2"/>
      <line x1="158" y1="250" x2="175" y2="250" stroke="#ef4444" strokeWidth="2"/>
      <line x1="142" y1="310" x2="125" y2="310" stroke="#8b5cf6" strokeWidth="2"/>
      <line x1="158" y1="370" x2="175" y2="370" stroke="#06b6d4" strokeWidth="2"/>
      <line x1="142" y1="430" x2="125" y2="430" stroke="#84cc16" strokeWidth="2"/>
      
      {/* Year labels */}
      <text x="80" y="75" textAnchor="middle" fill="#3b82f6" fontSize="14" fontWeight="bold">2002</text>
      <text x="220" y="135" textAnchor="middle" fill="#10b981" fontSize="14" fontWeight="bold">2004</text>
      <text x="80" y="195" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="bold">2015</text>
      <text x="220" y="255" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">2018</text>
      <text x="80" y="315" textAnchor="middle" fill="#8b5cf6" fontSize="14" fontWeight="bold">2020</text>
      <text x="220" y="375" textAnchor="middle" fill="#06b6d4" fontSize="14" fontWeight="bold">2022</text>
      <text x="80" y="435" textAnchor="middle" fill="#84cc16" fontSize="14" fontWeight="bold">2024</text>
    </svg>
  );
