'use client';
import React from 'react';
// Staff Outsourcing SVG
export const OutsourcingSVG = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 400 300" className={className}>
    <defs>
      <linearGradient id="outsourcingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>

    {/* Background elements */}
    <rect x="50" y="40" width="300" height="200" rx="20" fill="url(#outsourcingGradient)" opacity="0.1" />

    {/* Main building/office */}
    <rect x="80" y="80" width="240" height="140" rx="12" fill="url(#outsourcingGradient)" />
    <rect x="90" y="90" width="220" height="100" rx="8" fill="white" />

    {/* People icons representing outsourcing */}
    <circle cx="120" cy="130" r="15" fill="url(#orangeGradient)" />
    <rect x="110" y="140" width="20" height="25" rx="3" fill="url(#orangeGradient)" />
    
    <circle cx="160" cy="130" r="15" fill="url(#outsourcingGradient)" />
    <rect x="150" y="140" width="20" height="25" rx="3" fill="url(#outsourcingGradient)" />
    
    <circle cx="200" cy="130" r="15" fill="url(#orangeGradient)" />
    <rect x="190" y="140" width="20" height="25" rx="3" fill="url(#orangeGradient)" />

    {/* Connection lines */}
    <path d="M140 140 L180 140" stroke="url(#outsourcingGradient)" strokeWidth="3" strokeDasharray="5,5" />
    <path d="M180 140 L220 140" stroke="url(#orangeGradient)" strokeWidth="3" strokeDasharray="5,5" />

    {/* Floating elements */}
    <circle cx="280" cy="120" r="8" fill="url(#orangeGradient)" opacity="0.7" />
    <circle cx="100" cy="180" r="6" fill="url(#outsourcingGradient)" opacity="0.7" />
  </svg>
);

// HR Consulting SVG
export const HRConsultingSVG = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 400 300" className={className}>
    <defs>
      <linearGradient id="consultingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
      <linearGradient id="consultingOrange" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect x="60" y="50" width="280" height="180" rx="20" fill="url(#consultingGradient)" opacity="0.1" />

    {/* Consultation setup */}
    <rect x="100" y="100" width="200" height="120" rx="15" fill="url(#consultingGradient)" />
    <rect x="110" y="110" width="180" height="80" rx="10" fill="white" />

    {/* Chart/presentation */}
    <rect x="120" y="120" width="80" height="60" rx="5" fill="#f8fafc" stroke="#e5e7eb" />
    <polyline points="130,170 145,150 160,160 175,140 190,155" stroke="url(#consultingOrange)" strokeWidth="3" fill="none" />

    {/* Consultant figure */}
    <circle cx="250" cy="140" r="12" fill="url(#consultingOrange)" />
    <rect x="240" y="150" width="20" height="30" rx="3" fill="url(#consultingOrange)" />

    {/* Strategy icons */}
    <circle cx="320" cy="80" r="10" fill="url(#consultingGradient)" />
    <text x="320" y="85" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">S</text>
    
    <circle cx="80" cy="220" r="10" fill="url(#consultingOrange)" />
    <text x="80" y="225" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">P</text>
  </svg>
);

// Time & Attendance SVG
export const AttendanceSVG = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 400 300" className={className}>
    <defs>
      <linearGradient id="attendanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="attendanceOrange" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect x="50" y="40" width="300" height="200" rx="20" fill="url(#attendanceGradient)" opacity="0.1" />

    {/* Clock/time tracking device */}
    <circle cx="200" cy="140" r="60" fill="url(#attendanceGradient)" />
    <circle cx="200" cy="140" r="45" fill="white" />
    
    {/* Clock hands */}
    <line x1="200" y1="140" x2="200" y2="110" stroke="url(#attendanceGradient)" strokeWidth="3" strokeLinecap="round" />
    <line x1="200" y1="140" x2="220" y2="140" stroke="url(#attendanceOrange)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="200" cy="140" r="4" fill="url(#attendanceGradient)" />

    {/* Fingerprint scanner */}
    <rect x="280" y="120" width="40" height="40" rx="8" fill="url(#attendanceOrange)" />
    <rect x="285" y="125" width="30" height="30" rx="5" fill="white" />
    
    {/* Fingerprint pattern */}
    <path d="M295 135 Q300 130 305 135 Q300 140 295 135" stroke="url(#attendanceOrange)" strokeWidth="1" fill="none" />
    <path d="M295 140 Q300 135 305 140 Q300 145 295 140" stroke="url(#attendanceOrange)" strokeWidth="1" fill="none" />

    {/* Mobile device */}
    <rect x="90" y="120" width="30" height="50" rx="8" fill="url(#attendanceGradient)" />
    <rect x="95" y="125" width="20" height="30" rx="3" fill="white" />
    <circle cx="105" cy="162" r="3" fill="white" />

    {/* Data points */}
    <circle cx="150" cy="80" r="4" fill="url(#attendanceOrange)" />
    <circle cx="280" cy="200" r="4" fill="url(#attendanceGradient)" />
    <circle cx="120" cy="220" r="4" fill="url(#attendanceOrange)" />
  </svg>
);

// HR System SVG
export const HRSystemSVG = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 400 300" className={className}>
    <defs>
      <linearGradient id="systemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
      <linearGradient id="systemOrange" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect x="60" y="50" width="280" height="180" rx="20" fill="url(#systemGradient)" opacity="0.1" />

    {/* Main computer/system */}
    <rect x="120" y="80" width="160" height="120" rx="15" fill="url(#systemGradient)" />
    <rect x="130" y="90" width="140" height="80" rx="8" fill="white" />

    {/* Dashboard elements */}
    <rect x="140" y="100" width="50" height="8" rx="4" fill="url(#systemOrange)" />
    <rect x="140" y="115" width="30" height="6" rx="3" fill="#e5e7eb" />
    <rect x="140" y="125" width="40" height="6" rx="3" fill="#e5e7eb" />

    {/* Chart area */}
    <rect x="200" y="100" width="60" height="60" rx="5" fill="#f8fafc" stroke="#e5e7eb" />
    <rect x="210" y="130" width="8" height="20" fill="url(#systemGradient)" />
    <rect x="225" y="120" width="8" height="30" fill="url(#systemOrange)" />
    <rect x="240" y="125" width="8" height="25" fill="url(#systemGradient)" />

    {/* Database cylinders */}
    <ellipse cx="320" cy="120" rx="15" ry="8" fill="url(#systemGradient)" />
    <rect x="305" y="120" width="30" height="30" fill="url(#systemGradient)" />
    <ellipse cx="320" cy="150" rx="15" ry="8" fill="url(#systemGradient)" />

    {/* Network connections */}
    <circle cx="80" cy="140" r="10" fill="url(#systemOrange)" />
    <line x1="90" y1="140" x2="120" y2="140" stroke="url(#systemOrange)" strokeWidth="2" strokeDasharray="3,3" />
    
    <circle cx="360" cy="160" r="8" fill="url(#systemGradient)" />
    <line x1="280" y1="150" x2="352" y2="158" stroke="url(#systemGradient)" strokeWidth="2" strokeDasharray="3,3" />
  </svg>
);

// Web Development SVG
export const WebDevelopmentSVG = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 400 300" className={className}>
    <defs>
      <linearGradient id="webGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <linearGradient id="webOrange" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect x="50" y="40" width="300" height="200" rx="20" fill="url(#webGradient)" opacity="0.1" />

    {/* Laptop/Computer */}
    <rect x="120" y="100" width="160" height="100" rx="12" fill="url(#webGradient)" />
    <rect x="130" y="110" width="140" height="70" rx="6" fill="white" />
    <rect x="180" y="185" width="40" height="8" rx="4" fill="url(#webGradient)" />

    {/* Code editor */}
    <rect x="140" y="120" width="120" height="50" rx="4" fill="#1f2937" />
    
    {/* Code lines */}
    <rect x="145" y="125" width="30" height="3" rx="1" fill="#10b981" />
    <rect x="180" y="125" width="20" height="3" rx="1" fill="#3b82f6" />
    <rect x="145" y="135" width="40" height="3" rx="1" fill="#f59e0b" />
    <rect x="190" y="135" width="25" height="3" rx="1" fill="#ef4444" />
    <rect x="145" y="145" width="35" height="3" rx="1" fill="#8b5cf6" />
    <rect x="185" y="145" width="30" height="3" rx="1" fill="#10b981" />

    {/* Mobile phone */}
    <rect x="300" y="120" width="30" height="50" rx="8" fill="url(#webOrange)" />
    <rect x="305" y="125" width="20" height="35" rx="3" fill="white" />
    <circle cx="315" cy="167" r="3" fill="white" />

    {/* Browser windows */}
    <rect x="80" y="80" width="50" height="40" rx="6" fill="white" stroke="url(#webGradient)" strokeWidth="2" />
    <circle cx="87" cy="87" r="2" fill="#ef4444" />
    <circle cx="94" cy="87" r="2" fill="#fbbf24" />
    <circle cx="101" cy="87" r="2" fill="#10b981" />

    {/* Floating elements */}
    <circle cx="350" cy="80" r="6" fill="url(#webOrange)" opacity="0.7" />
    <circle cx="70" cy="200" r="8" fill="url(#webGradient)" opacity="0.7" />
  </svg>
);

// CCTV Security SVG
export const CCTVSecuritySVG = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 400 300" className={className}>
    <defs>
      <linearGradient id="cctvGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#b91c1c" />
      </linearGradient>
      <linearGradient id="cctvOrange" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect x="50" y="40" width="300" height="200" rx="20" fill="url(#cctvGradient)" opacity="0.1" />

    {/* Building/Property */}
    <rect x="100" y="100" width="200" height="120" rx="15" fill="url(#cctvGradient)" opacity="0.3" />
    <rect x="110" y="110" width="180" height="80" rx="8" fill="white" />

    {/* CCTV Cameras */}
    <rect x="80" y="80" width="20" height="15" rx="3" fill="url(#cctvGradient)" />
    <rect x="85" y="70" width="10" height="10" rx="2" fill="url(#cctvOrange)" />
    <line x1="90" y1="75" x2="100" y2="85" stroke="url(#cctvGradient)" strokeWidth="2" />

    <rect x="300" y="80" width="20" height="15" rx="3" fill="url(#cctvGradient)" />
    <rect x="305" y="70" width="10" height="10" rx="2" fill="url(#cctvOrange)" />
    <line x1="310" y1="75" x2="300" y2="85" stroke="url(#cctvGradient)" strokeWidth="2" />

    {/* Monitor/Control Room */}
    <rect x="140" y="120" width="120" height="60" rx="8" fill="url(#cctvGradient)" />
    <rect x="150" y="130" width="100" height="40" rx="4" fill="white" />

    {/* Camera feeds on monitor */}
    <rect x="155" y="135" width="25" height="15" rx="2" fill="#f3f4f6" stroke="url(#cctvOrange)" />
    <rect x="185" y="135" width="25" height="15" rx="2" fill="#f3f4f6" stroke="url(#cctvOrange)" />
    <rect x="215" y="135" width="25" height="15" rx="2" fill="#f3f4f6" stroke="url(#cctvOrange)" />
    <rect x="155" y="155" width="25" height="15" rx="2" fill="#f3f4f6" stroke="url(#cctvOrange)" />

    {/* Security shield */}
    <path d="M200 220 L210 210 L210 180 L200 170 L190 180 L190 210 Z" fill="url(#cctvGradient)" />
    <path d="M200 210 L205 205 L205 185 L200 180 L195 185 L195 205 Z" fill="white" />
    <path d="M197 195 L199 197 L203 190" stroke="url(#cctvOrange)" strokeWidth="2" fill="none" strokeLinecap="round" />

    {/* Signal waves */}
    <path d="M120 90 Q130 85 140 90" stroke="url(#cctvOrange)" strokeWidth="2" fill="none" opacity="0.7" />
    <path d="M280 90 Q290 85 300 90" stroke="url(#cctvOrange)" strokeWidth="2" fill="none" opacity="0.7" />
  </svg>
);

//Recrutiment 

 export const TalentAcquisitionSVG = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full">
    <defs>
      <linearGradient id="talentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="orangeAccent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    
    {/* Background */}
    <rect x="50" y="50" width="300" height="200" rx="20" fill="url(#talentGradient)" opacity="0.1" />
    
    {/* Talent funnel */}
    <path d="M100 80 L300 80 L280 200 L120 200 Z" fill="url(#talentGradient)" opacity="0.3" />
    
    {/* People icons flowing through funnel */}
    <circle cx="130" cy="100" r="12" fill="url(#orangeAccent)" />
    <circle cx="170" cy="100" r="12" fill="url(#talentGradient)" />
    <circle cx="210" cy="100" r="12" fill="url(#orangeAccent)" />
    <circle cx="250" cy="100" r="12" fill="url(#talentGradient)" />
    <circle cx="270" cy="100" r="12" fill="url(#orangeAccent)" />
    
    {/* Arrow showing flow */}
    <path d="M200 140 L200 170" stroke="#f97316" strokeWidth="4" markerEnd="url(#arrowhead)" />
    
    {/* Selected candidates */}
    <circle cx="180" cy="190" r="15" fill="url(#orangeAccent)" />
    <circle cx="220" cy="190" r="15" fill="url(#talentGradient)" />
    
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
      </marker>
    </defs>
  </svg>
);

export const RecruitmentProcessSVG = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full">
    <defs>
      <linearGradient id="processGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    
    {/* Process steps */}
    <rect x="60" y="100" width="60" height="60" rx="12" fill="url(#processGradient)" opacity="0.2" />
    <rect x="140" y="100" width="60" height="60" rx="12" fill="#f97316" opacity="0.2" />
    <rect x="220" y="100" width="60" height="60" rx="12" fill="url(#processGradient)" opacity="0.2" />
    <rect x="300" y="100" width="60" height="60" rx="12" fill="#f97316" opacity="0.2" />
    
    {/* Step icons */}
    <circle cx="90" cy="130" r="18" fill="url(#processGradient)" />
    <circle cx="170" cy="130" r="18" fill="#f97316" />
    <circle cx="250" cy="130" r="18" fill="url(#processGradient)" />
    <circle cx="330" cy="130" r="18" fill="#f97316" />
    
    {/* Connecting arrows */}
    <path d="M125 130 L135 130" stroke="#f97316" strokeWidth="3" markerEnd="url(#arrow)" />
    <path d="M205 130 L215 130" stroke="#f97316" strokeWidth="3" markerEnd="url(#arrow)" />
    <path d="M285 130 L295 130" stroke="#f97316" strokeWidth="3" markerEnd="url(#arrow)" />
    
    {/* Labels */}
    <text x="90" y="185" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="600">Source</text>
    <text x="170" y="185" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="600">Screen</text>
    <text x="250" y="185" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="600">Interview</text>
    <text x="330" y="185" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="600">Hire</text>
    
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#f97316" />
      </marker>
    </defs>
  </svg>
);

export const CandidateMatchingSVG = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full">
    <defs>
      <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    
    {/* Job requirements on left */}
    <rect x="60" y="80" width="80" height="140" rx="12" fill="url(#matchGradient)" opacity="0.1" />
    <text x="100" y="100" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="600">Job Requirements</text>
    
    {/* Requirements list */}
    <circle cx="75" cy="120" r="3" fill="#f97316" />
    <line x1="85" y1="120" x2="125" y2="120" stroke="#e5e7eb" strokeWidth="2" />
    <circle cx="75" cy="135" r="3" fill="#f97316" />
    <line x1="85" y1="135" x2="125" y2="135" stroke="#e5e7eb" strokeWidth="2" />
    <circle cx="75" cy="150" r="3" fill="#f97316" />
    <line x1="85" y1="150" x2="125" y2="150" stroke="#e5e7eb" strokeWidth="2" />
    
    {/* Candidate profiles on right */}
    <rect x="260" y="80" width="80" height="140" rx="12" fill="#f97316" opacity="0.1" />
    <text x="300" y="100" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="600">Candidates</text>
    
    {/* Candidate avatars */}
    <circle cx="285" cy="130" r="12" fill="url(#matchGradient)" />
    <circle cx="315" cy="130" r="12" fill="#f97316" />
    <circle cx="285" cy="160" r="12" fill="url(#matchGradient)" />
    <circle cx="315" cy="160" r="12" fill="#f97316" />
    
    {/* Matching arrows */}
    <path d="M145 130 L255 130" stroke="#f97316" strokeWidth="3" markerEnd="url(#matchArrow)" />
    <path d="M145 150 L255 150" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#blueArrow)" />
    
    {/* Match percentage */}
    <rect x="170" y="115" width="60" height="30" rx="15" fill="white" stroke="#f97316" strokeWidth="2" />
    <text x="200" y="135" textAnchor="middle" fill="#f97316" fontSize="12" fontWeight="bold">95%</text>
    
    <defs>
      <marker id="matchArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
      </marker>
      <marker id="blueArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
      </marker>
    </defs>
  </svg>
);