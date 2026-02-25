 export const PayrollProcessingSVG = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full">
    <defs>
      <linearGradient id="payrollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>

    {/* Background elements */}
    <rect
      x="50"
      y="40"
      width="300"
      height="200"
      rx="20"
      fill="url(#payrollGradient)"
      opacity="0.1"
    />

    {/* Computer/Dashboard */}
    <rect
      x="80"
      y="80"
      width="240"
      height="140"
      rx="12"
      fill="url(#payrollGradient)"
    />
    <rect x="90" y="90" width="220" height="100" rx="8" fill="white" />

    {/* Dashboard elements */}
    <rect x="100" y="100" width="60" height="8" rx="4" fill="#f97316" />
    <rect x="100" y="115" width="40" height="6" rx="3" fill="#e5e7eb" />
    <rect x="100" y="125" width="80" height="6" rx="3" fill="#e5e7eb" />

    {/* Charts */}
    <rect
      x="190"
      y="100"
      width="110"
      height="60"
      rx="6"
      fill="#f8fafc"
      stroke="#e5e7eb"
    />
    <polyline
      points="200,150 220,130 240,140 260,120 280,135"
      stroke="url(#orangeGradient)"
      strokeWidth="3"
      fill="none"
    />

    {/* Money symbols */}
    <circle cx="130" cy="270" r="15" fill="url(#orangeGradient)" />
    <text
      x="130"
      y="275"
      textAnchor="middle"
      fill="white"
      fontSize="12"
      fontWeight="bold"
    >
      $
    </text>
    <circle cx="270" cy="260" r="12" fill="url(#payrollGradient)" />
    <text
      x="270"
      y="265"
      textAnchor="middle"
      fill="white"
      fontSize="10"
      fontWeight="bold"
    >
      $
    </text>
  </svg>
);

export const PayrollAutomationSVG = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full">
    <defs>
      <linearGradient
        id="automationGradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>

    {/* Automation flow */}
    <rect
      x="60"
      y="100"
      width="80"
      height="60"
      rx="12"
      fill="url(#automationGradient)"
      opacity="0.2"
    />
    <rect
      x="160"
      y="100"
      width="80"
      height="60"
      rx="12"
      fill="#f97316"
      opacity="0.2"
    />
    <rect
      x="260"
      y="100"
      width="80"
      height="60"
      rx="12"
      fill="url(#automationGradient)"
      opacity="0.2"
    />

    {/* Arrows */}
    <path
      d="M145 130 L155 130"
      stroke="#f97316"
      strokeWidth="3"
      markerEnd="url(#arrowhead)"
    />
    <path
      d="M245 130 L255 130"
      stroke="#f97316"
      strokeWidth="3"
      markerEnd="url(#arrowhead)"
    />

    {/* Icons */}
    <circle cx="100" cy="130" r="20" fill="url(#automationGradient)" />
    <circle cx="200" cy="130" r="20" fill="#f97316" />
    <circle cx="300" cy="130" r="20" fill="url(#automationGradient)" />

    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
      </marker>
    </defs>
  </svg>
);

 export const PayrollComplianceSVG = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full">
    <defs>
      <linearGradient
        id="complianceGradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>

    {/* Shield */}
    <path
      d="M200 60 L240 80 L240 160 L200 200 L160 160 L160 80 Z"
      fill="url(#complianceGradient)"
    />
    <path
      d="M200 80 L220 90 L220 150 L200 170 L180 150 L180 90 Z"
      fill="white"
    />

    {/* Checkmark */}
    <path
      d="M185 130 L195 140 L215 110"
      stroke="#f97316"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Documents */}
    <rect
      x="120"
      y="220"
      width="40"
      height="50"
      rx="4"
      fill="white"
      stroke="#e5e7eb"
      strokeWidth="2"
    />
    <rect
      x="240"
      y="220"
      width="40"
      height="50"
      rx="4"
      fill="white"
      stroke="#e5e7eb"
      strokeWidth="2"
    />

    {/* Lines on documents */}
    <line
      x1="125"
      y1="235"
      x2="155"
      y2="235"
      stroke="#e5e7eb"
      strokeWidth="2"
    />
    <line
      x1="125"
      y1="245"
      x2="150"
      y2="245"
      stroke="#e5e7eb"
      strokeWidth="2"
    />
    <line
      x1="245"
      y1="235"
      x2="275"
      y2="235"
      stroke="#e5e7eb"
      strokeWidth="2"
    />
    <line
      x1="245"
      y1="245"
      x2="270"
      y2="245"
      stroke="#e5e7eb"
      strokeWidth="2"
    />
  </svg>
);