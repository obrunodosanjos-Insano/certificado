import React from 'react';

// Certificate corner ornament (kept clean to avoid smudges)
export const CertificateCorner: React.FC<{ className?: string; position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }> = () => null;

// Ornate scroll flourish ornament for top of CERTIFICADO
export const TopFlourish: React.FC<{ className?: string }> = ({ className = 'w-48 h-6 text-black' }) => (
  <svg viewBox="0 0 240 30" className={className} fill="currentColor">
    <path d="M120,18 C112,18 105,12 98,7 C92,2 84,0 76,2 C65,5 58,15 62,24 C65,30 73,31 78,27 C83,23 81,16 75,15 C71,15 68,17 67,19 C66,20 64,19 64,18 C65,12 72,7 80,7 C88,7 95,12 102,18 C108,23 114,25 120,25 C126,25 132,23 138,18 C145,12 152,7 160,7 C168,7 175,12 176,18 C176,19 174,20 173,19 C172,17 169,15 165,15 C159,16 157,23 162,27 C167,31 175,30 178,24 C182,15 175,5 164,2 C156,0 148,2 142,7 C135,12 128,18 120,18 Z" />
    <circle cx="120" cy="14" r="3" />
    <circle cx="62" cy="14" r="2.5" />
    <circle cx="178" cy="14" r="2.5" />
  </svg>
);

// Ornate scroll flourish with horizontal underline for below subtitle
export const BottomSubtitleFlourish: React.FC<{ className?: string }> = ({ className = 'w-64 h-8 text-black' }) => (
  <svg viewBox="0 0 300 35" className={className} fill="currentColor">
    {/* Left horizontal line */}
    <line x1="10" y1="18" x2="105" y2="18" stroke="currentColor" strokeWidth="2.5" />
    {/* Right horizontal line */}
    <line x1="195" y1="18" x2="290" y2="18" stroke="currentColor" strokeWidth="2.5" />
    {/* Center scroll motif */}
    <path d="M150,18 C144,18 138,13 132,8 C126,4 119,3 113,6 C105,10 102,19 107,26 C111,31 118,31 123,26 C126,23 125,17 120,16 C117,15 114,17 114,19 C113,19 111,18 112,17 C115,12 121,9 127,11 C133,13 138,18 144,22 C147,24 153,24 156,22 C162,18 167,13 173,11 C179,9 185,12 188,17 C189,18 187,19 186,19 C186,17 183,15 180,16 C175,17 174,23 177,26 C182,31 189,31 193,26 C198,19 195,10 187,6 C181,3 174,4 168,8 C162,13 156,18 150,18 Z" />
    <circle cx="150" cy="14" r="3.5" />
    <circle cx="10" cy="18" r="2.5" />
    <circle cx="290" cy="18" r="2.5" />
  </svg>
);
