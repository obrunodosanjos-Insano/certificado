import React from 'react';
import { OfficialCertificateSettings, Recipient } from '../types';
import { CertificateCorner, TopFlourish, BottomSubtitleFlourish } from './CertificateOrnaments';

interface OfficialCertificateCardProps {
  recipient: Recipient;
  settings: OfficialCertificateSettings;
  highlightFields?: boolean;
  scale?: number;
  id?: string;
}

export const OfficialCertificateCard: React.FC<OfficialCertificateCardProps> = ({
  recipient,
  settings,
  highlightFields = false,
  scale = 1,
  id = 'official-certificate-element',
}) => {
  const certFullCode = `${recipient.certNumber || '006'}/${recipient.customCodePrefix || settings.certCodePrefix || 'CVTE'}/${recipient.year || '2026'}`;

  // Helper to highlight dynamic fields if user has highlight mode toggled
  const DynamicSpan: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = 'font-bold text-black',
  }) => {
    if (highlightFields) {
      return (
        <span className="relative inline-block px-1 mx-0.5 font-bold text-black bg-amber-100/90 border-b-2 border-amber-500 rounded-xs">
          {children}
        </span>
      );
    }
    return <span className={className}>{children}</span>;
  };

  return (
    <div
      id={id}
      style={{
        width: '1000px',
        height: '707px', // Exact A4 Landscape standard (1000x707px)
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
      className="relative bg-white text-black font-serif select-none box-border px-14 py-8 overflow-hidden shadow-2xl flex flex-col justify-between"
    >
      {/* Outer Border with Double Top & Bottom Bars and Filigree Corners */}
      <div className="absolute inset-4 pointer-events-none z-10">
        {/* Top double lines */}
        <div className="absolute top-2 left-16 right-16 border-t-2 border-black" />
        <div className="absolute top-3.5 left-16 right-16 border-t border-black" />

        {/* Bottom double lines */}
        <div className="absolute bottom-2 left-16 right-16 border-b-2 border-black" />
        <div className="absolute bottom-3.5 left-16 right-16 border-b border-black" />

        {/* 4 Ornate Baroque Corners */}
        <div className="absolute top-0 left-0">
          <CertificateCorner position="top-left" className="w-16 h-16 text-black" />
        </div>
        <div className="absolute top-0 right-0">
          <CertificateCorner position="top-right" className="w-16 h-16 text-black" />
        </div>
        <div className="absolute bottom-0 left-0">
          <CertificateCorner position="bottom-left" className="w-16 h-16 text-black" />
        </div>
        <div className="absolute bottom-0 right-0">
          <CertificateCorner position="bottom-right" className="w-16 h-16 text-black" />
        </div>
      </div>

      {/* Subtle Background Watermark */}
      {settings.showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] z-0">
          <svg className="w-[440px] h-[440px]" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="50" cy="50" r="39" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 2" fill="none" />
            <polygon points="50,14 54,34 76,34 58,47 65,68 50,56 35,68 42,47 24,34 46,34" />
            <path d="M50 82 L50 92 M40 88 L60 88" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      )}

      {/* TOP HEADER SECTION */}
      <div className="relative z-20 flex items-start justify-between min-h-[140px]">
        {/* Top Left: SGEx Shield Badge */}
        <div className="w-[120px] flex justify-start pt-1">
          <img
            src={settings.sgexLogoUrl || '/sgex-logo.jpg'}
            alt="Brasão SGEx"
            referrerPolicy="no-referrer"
            className="w-[78px] h-[104px] object-contain drop-shadow-xs"
          />
        </div>

        {/* Center: Flourish + CERTIFICADO + Subtitle + Bottom Flourish */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          {/* Top Baroque Flourish */}
          <TopFlourish className="w-44 h-5 text-black mb-0.5" />

          {/* CERTIFICADO in Terracotta Orange Serif */}
          <h1 className="text-[34px] font-bold tracking-[0.20em] text-[#d4582f] uppercase font-serif leading-none drop-shadow-xs">
            {settings.title}
          </h1>

          {/* Subtitle */}
          <div className="mt-1.5 text-[15px] font-bold text-black font-sans leading-tight">
            Condutores de Veículos de<br />
            Transporte de Emergência
          </div>

          {/* Bottom Flourish Underline */}
          <BottomSubtitleFlourish className="w-56 h-6 text-black mt-1" />
        </div>

        {/* Top Right: B ADM QGEX Badge + Certificate Code underneath */}
        <div className="w-[120px] flex flex-col items-center pt-1">
          <img
            src={settings.badmLogoUrl || '/badm-qgex-logo.jpg'}
            alt="Brasão B ADM QGEX"
            referrerPolicy="no-referrer"
            className="w-[78px] h-[104px] object-contain drop-shadow-xs"
          />
          <div className="mt-2 text-[15px] font-bold font-sans tracking-tight text-black whitespace-nowrap">
            <DynamicSpan>{certFullCode}</DynamicSpan>
          </div>
        </div>
      </div>

      {/* BODY CONTENT - EXACT TEXT FORMATTING */}
      <div className="relative z-20 px-4 pt-2 pb-1">
        <p className="text-[14.5px] leading-[1.75] text-black font-serif text-justify">
          A Instituição de Ensino de Trânsito da Base Administrativa do Quartel-General do Exército – Forte Caxias –
          (Instrução Nº 592, de 10 de agosto de 2020/Detran-DF) certifica que{' '}
          <DynamicSpan className="font-bold text-black uppercase">
            {recipient.name || 'CARLOS HENRIQUE CAETANO DA SILVA'}
          </DynamicSpan>
          , inscrito no CPF nº{' '}
          <DynamicSpan className="font-bold text-black">
            {recipient.cpf || '067.440.731-84'}
          </DynamicSpan>{' '}
          e no Nº REGISTRO{' '}
          <DynamicSpan className="font-bold text-black">
            {recipient.cnhRegistro || '07575025319'}
          </DynamicSpan>
          , categoria{' '}
          <DynamicSpan className="font-bold text-black">
            {recipient.cnhCategoria?.startsWith('“') ? recipient.cnhCategoria : `“${recipient.cnhCategoria || 'AD'}”`}
          </DynamicSpan>
          , concluiu com aproveitamento o{' '}
          <span className="font-bold text-black">
            {settings.courseName || 'Curso Especializado para Condutores de Veículos de Transporte de Emergência'}
          </span>
          , ministrado pela IET - Forte Caxias, no período de{' '}
          <DynamicSpan className="font-bold text-black">
            {recipient.periodo || '08 a 16 de junho de 2026'}
          </DynamicSpan>
          , com carga horária de{' '}
          <DynamicSpan className="font-bold text-black">
            {recipient.cargaHoraria || '50h/a'}
          </DynamicSpan>
          , {settings.legalResolution || 'com validade de cinco anos após o término do curso, conforme Resolução Nº 1.020/2025 do CONTRAN.'}
        </p>

        {/* Date Centered */}
        <div className="text-center mt-5 text-[15px] font-bold text-black font-serif">
          {recipient.localEmissao || settings.location || 'Brasília-DF'},{' '}
          <DynamicSpan className="font-bold text-black">
            {recipient.dataEmissao || '18 de junho de 2026'}
          </DynamicSpan>
        </div>
      </div>

      {/* FOOTER SECTION: SIGNATURE ON LEFT, CNPJ/COMPANY ON RIGHT */}
      <div className="relative z-20 flex items-end justify-between px-4 pb-2">
        {/* Bottom Left: Signature with realistic blue ink pen stroke */}
        <div className="flex flex-col items-center text-center w-[280px]">
          {settings.showSignature && (
            <div className="relative w-full flex flex-col items-center">
              {/* Realistic SVG Pen Stroke / Signature Loop */}
              <div className="relative -mb-3 h-12 w-48 flex items-center justify-center pointer-events-none">
                <svg viewBox="0 0 200 60" className="w-44 h-12 text-[#1d3557] overflow-visible">
                  <path
                    d="M10,40 Q25,10 40,35 T70,25 T95,45 Q115,5 130,30 T160,28 Q175,15 190,38"
                    fill="none"
                    stroke="#1d3557"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M35,28 C50,15 65,45 80,20 C95,35 110,10 125,32 C140,18 155,40 170,25"
                    fill="none"
                    stroke="#1d3557"
                    strokeWidth="1.2"
                    opacity="0.85"
                  />
                  <ellipse cx="60" cy="32" rx="14" ry="10" fill="none" stroke="#1d3557" strokeWidth="1.4" transform="rotate(-15 60 32)" />
                  <ellipse cx="90" cy="30" rx="10" ry="12" fill="none" stroke="#1d3557" strokeWidth="1.3" transform="rotate(10 90 30)" />
                  <ellipse cx="115" cy="32" rx="12" ry="8" fill="none" stroke="#1d3557" strokeWidth="1.3" transform="rotate(-5 115 32)" />
                </svg>
              </div>

              {/* Signature Line */}
              <div className="w-full border-b border-black mb-1" />

              {/* Director Details */}
              <div className="text-[12px] font-bold text-black font-sans leading-tight">
                {settings.directorName || 'Carlos Henrique Ferreira De Mello'}
              </div>
              <div className="text-[11px] text-black font-sans leading-tight">
                {settings.directorRole || 'Diretor Geral'}
              </div>
              <div className="text-[10.5px] text-black font-sans leading-tight">
                {settings.directorCpf || '981.050.007-68'}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Right: CNPJ and Company Name */}
        <div className="text-right flex flex-col justify-end">
          <div className="text-[11px] font-sans font-bold text-black">
            {settings.cnpj || 'CNPJ Nº 21.744.847/0001-50'}
          </div>
          <div className="text-[10px] font-sans font-bold text-black uppercase tracking-tight">
            {settings.companyName || 'BASE ADMINISTRATIVA DO QUARTEL-GENERAL DO EXÉRCITO'}
          </div>
        </div>
      </div>
    </div>
  );
};
