// src/components/illustrations/about/AboutSVGs.tsx
export const AboutHeroSVG = () => (
  <svg viewBox="0 0 500 400" className="w-full h-auto">
    <defs>
      <linearGradient id="heroGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="heroGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    
    {/* Background circles */}
    <circle cx="400" cy="100" r="80" fill="url(#heroGrad1)" opacity="0.1" />
    <circle cx="100" cy="300" r="60" fill="url(#heroGrad2)" opacity="0.1" />
    
    {/* Main illustration */}
    <g transform="translate(50, 50)">
      {/* Building/Office */}
      <rect x="100" y="80" width="200" height="250" rx="10" fill="url(#heroGrad1)" opacity="0.2" />
      <rect x="120" y="100" width="40" height="40" rx="4" fill="url(#heroGrad1)" opacity="0.3" />
      <rect x="180" y="100" width="40" height="40" rx="4" fill="url(#heroGrad1)" opacity="0.3" />
      <rect x="240" y="100" width="40" height="40" rx="4" fill="url(#heroGrad1)" opacity="0.3" />
      
      {/* People silhouettes */}
      <circle cx="80" cy="200" r="20" fill="url(#heroGrad2)" opacity="0.8" />
      <rect x="65" y="220" width="30" height="50" rx="15" fill="url(#heroGrad2)" opacity="0.8" />
      
      <circle cx="320" cy="180" r="20" fill="url(#heroGrad1)" opacity="0.8" />
      <rect x="305" y="200" width="30" height="50" rx="15" fill="url(#heroGrad1)" opacity="0.8" />
      
      {/* Connection lines */}
      <line x1="80" y1="220" x2="200" y2="180" stroke="url(#heroGrad1)" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
      <line x1="320" y1="200" x2="200" y2="180" stroke="url(#heroGrad2)" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
    </g>
  </svg>
);

export const ValuesSVG = () => (
  <svg viewBox="0 0 500 400" className="w-full h-auto">
    <defs>
      <linearGradient id="valuesGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="valuesGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#db2777" />
      </linearGradient>
    </defs>
    
    {/* Central heart/value symbol */}
    <g transform="translate(250, 200)">
      <path
        d="M0,-40 Q-40,-80 -80,-40 Q-80,0 0,80 Q80,0 80,-40 Q40,-80 0,-40 Z"
        fill="url(#valuesGrad2)"
        opacity="0.3"
      />
      
      {/* Orbiting circles */}
      <circle cx="-100" cy="-100" r="30" fill="url(#valuesGrad1)" opacity="0.6">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 0 0"
          to="360 0 0"
          dur="20s"
          repeatCount="indefinite"
        />
      </circle>
      
      <circle cx="100" cy="-100" r="30" fill="url(#valuesGrad2)" opacity="0.6">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 0 0"
          to="-360 0 0"
          dur="25s"
          repeatCount="indefinite"
        />
      </circle>
      
      <circle cx="-100" cy="100" r="30" fill="url(#valuesGrad1)" opacity="0.6">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 0 0"
          to="360 0 0"
          dur="30s"
          repeatCount="indefinite"
        />
      </circle>
      
      <circle cx="100" cy="100" r="30" fill="url(#valuesGrad2)" opacity="0.6">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 0 0"
          to="-360 0 0"
          dur="22s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
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

// export const TimelineSVG = () => (
//   <svg viewBox="0 0 500 400" className="w-full h-auto">
//     <defs>
//       <linearGradient id="timelineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
//         <stop offset="0%" stopColor="#3b82f6" />
//         <stop offset="100%" stopColor="#1e40af" />
//       </linearGradient>
//     </defs>
    
//     {/* Timeline vertical line */}
//     <line x1="100" y1="50" x2="100" y2="350" stroke="url(#timelineGrad)" strokeWidth="4" />
    
//     {/* Timeline points */}
//     {[50, 120, 190, 260, 330].map((y, i) => (
//       <g key={i}>
//         <circle cx="100" cy={y} r="12" fill="url(#timelineGrad)" />
//         <circle cx="100" cy={y} r="8" fill="white" />
//         <rect x="130" y={y - 20} width="300" height="40" rx="8" fill="url(#timelineGrad)" opacity="0.1" />
//         <line x1="120" y1={y} x2="130" y2={y} stroke="url(#timelineGrad)" strokeWidth="2" />
//       </g>
//     ))}
//   </svg>
// );
