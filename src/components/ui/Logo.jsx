import React from 'react';

const Logo = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Background Shape */}
      <rect width="100" height="100" rx="28" fill="#1E293B" fillOpacity="0.3" />
      
      {/* Stylized E */}
      <path 
        d="M35 30H65M35 50H58M35 70H65M35 30V70" 
        stroke="url(#logo-gradient)" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="url(#glow)"
      />
      
      {/* AI Sparkle */}
      <path 
        d="M75 25L78 32L85 35L78 38L75 45L72 38L65 35L72 32L75 25Z" 
        fill="#FACC15"
      >
        <animate 
          attributeName="opacity" 
          values="1;0.4;1" 
          dur="2s" 
          repeatCount="indefinite" 
        />
      </path>
    </svg>
  );
};

export default Logo;
