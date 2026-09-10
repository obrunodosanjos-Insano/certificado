import React from 'react';

export const CertificateCorner: React.FC<{
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ className = 'w-20 h-20 text-black', position = 'top-left' }) => {
  const transforms: Record<string, string> = {
    'top-left': '',
    'top-right': 'scale(-1 1)',
    'bottom-left': 'scale(1 -1)',
    'bottom-right': 'scale(-1 -1)',
  };

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g transform={transforms[position]} fill="currentColor">
        <path d="M1 2c18 0 32 2 43 9-9 3-15 8-18 16 8-6 17-8 26-5-8 5-12 12-12 21-6-7-12-10-20-10 8 7 11 15 8 25-5-8-12-13-22-14 7 7 10 15 8 25-5-6-9-13-10-22C2 32 1 17 1 2Z"/>
        <path d="M11 1c3 14 9 23 20 29-2-9 1-16 8-22 2 8 7 13 15 16-8 2-13 7-16 15-5-11-14-17-27-19V1Z"/>
        <path d="M2 55c14 0 25 5 33 15-8-2-15 0-21 6 9 0 16 4 21 12-10-2-19 0-27 8-3-13-5-27-6-41Z"/>
        <path d="M55 2c14 1 27 3 41 6-8 8-10 17-8 27-8-5-12-12-12-21-6 6-8 13-6 21-10-8-15-19-15-33Z"/>
        <circle cx="22" cy="21" r="3"/>
        <circle cx="13" cy="39" r="2.5"/>
        <circle cx="39" cy="12" r="2.4"/>
      </g>
    </svg>
  );
};

export const CertificateFrame: React.FC<{ inset?: number; className?: string }> = ({ inset = 8, className = '' }) => (
  <div className={`absolute inset-0 pointer-events-none z-[2] text-black ${className}`} aria-hidden="true">
    <CertificateCorner position="top-left" className="absolute left-[4px] top-[4px] w-[92px] h-[92px]" />
    <CertificateCorner position="top-right" className="absolute right-[4px] top-[4px] w-[92px] h-[92px]" />
    <CertificateCorner position="bottom-left" className="absolute left-[4px] bottom-[4px] w-[92px] h-[92px]" />
    <CertificateCorner position="bottom-right" className="absolute right-[4px] bottom-[4px] w-[92px] h-[92px]" />

    <div style={{ top: inset, left: 106, right: 106 }} className="absolute border-t-[4px] border-black" />
    <div style={{ top: inset + 7, left: 106, right: 106 }} className="absolute border-t border-black" />
    <div style={{ bottom: inset, left: 106, right: 106 }} className="absolute border-b-[4px] border-black" />
    <div style={{ bottom: inset + 7, left: 106, right: 106 }} className="absolute border-b border-black" />

    <div style={{ left: inset, top: 106, bottom: 106 }} className="absolute border-l-[4px] border-black" />
    <div style={{ left: inset + 7, top: 106, bottom: 106 }} className="absolute border-l border-black" />
    <div style={{ right: inset, top: 106, bottom: 106 }} className="absolute border-r-[4px] border-black" />
    <div style={{ right: inset + 7, top: 106, bottom: 106 }} className="absolute border-r border-black" />
  </div>
);

export const CertificateBackground: React.FC = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#fffef8]" aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(208,216,198,0.16),transparent_32%),linear-gradient(160deg,rgba(245,242,220,0.22),rgba(235,241,230,0.14)_48%,rgba(246,239,218,0.20))]" />
    <img src="/sgex-logo.jpg" alt="" draggable={false} className="absolute left-1/2 top-[50%] w-[250px] h-[300px] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.025] grayscale" />
    <div className="absolute -left-[80px] bottom-[8px] w-[520px] h-[120px] rotate-[-7deg] bg-black/[0.012] blur-[1px]" />
    <div className="absolute right-[70px] bottom-[20px] w-[390px] h-[92px] rotate-[8deg] bg-black/[0.01] blur-[2px]" />
  </div>
);

export const TopFlourish: React.FC<{ className?: string }> = ({ className = 'w-48 h-6 text-black' }) => (
  <svg viewBox="0 0 240 30" className={className} fill="currentColor">
    <path d="M120,18 C112,18 105,12 98,7 C92,2 84,0 76,2 C65,5 58,15 62,24 C65,30 73,31 78,27 C83,23 81,16 75,15 C71,15 68,17 67,19 C66,20 64,19 64,18 C65,12 72,7 80,7 C88,7 95,12 102,18 C108,23 114,25 120,25 C126,25 132,23 138,18 C145,12 152,7 160,7 C168,7 175,12 176,18 C176,19 174,20 173,19 C172,17 169,15 165,15 C159,16 157,23 162,27 C167,31 175,30 178,24 C182,15 175,5 164,2 C156,0 148,2 142,7 C135,12 128,18 120,18 Z" />
    <circle cx="120" cy="14" r="3" />
    <circle cx="62" cy="14" r="2.5" />
    <circle cx="178" cy="14" r="2.5" />
  </svg>
);

export const BottomSubtitleFlourish: React.FC<{ className?: string }> = ({ className = 'w-64 h-8 text-black' }) => (
  <svg viewBox="0 0 300 35" className={className} fill="currentColor">
    <line x1="10" y1="18" x2="105" y2="18" stroke="currentColor" strokeWidth="2.5" />
    <line x1="195" y1="18" x2="290" y2="18" stroke="currentColor" strokeWidth="2.5" />
    <path d="M150,18 C144,18 138,13 132,8 C126,4 119,3 113,6 C105,10 102,19 107,26 C111,31 118,31 123,26 C126,23 125,17 120,16 C117,15 114,17 114,19 C113,19 111,18 112,17 C115,12 121,9 127,11 C133,13 138,18 144,22 C147,24 153,24 156,22 C162,18 167,13 173,11 C179,9 185,12 188,17 C189,18 187,19 186,19 C186,17 183,15 180,16 C175,17 174,23 177,26 C182,31 189,31 193,26 C198,19 195,10 187,6 C181,3 174,4 168,8 C162,13 156,18 150,18 Z" />
    <circle cx="150" cy="14" r="3.5" />
    <circle cx="10" cy="18" r="2.5" />
    <circle cx="290" cy="18" r="2.5" />
  </svg>
);
