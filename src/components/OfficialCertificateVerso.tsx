import React from 'react';
import { OfficialCertificateSettings, Recipient } from '../types';
import { CertificateCorner } from './CertificateOrnaments';

interface OfficialCertificateVersoProps {
  recipient: Recipient;
  settings: OfficialCertificateSettings;
  scale?: number;
  id?: string;
}

export const OfficialCertificateVerso: React.FC<OfficialCertificateVersoProps> = ({
  recipient,
  settings,
  scale = 1,
  id = 'official-certificate-verso-element',
}) => {
  const certFullCode = `${recipient.certNumber || '006'}/${recipient.customCodePrefix || settings.certCodePrefix || 'CVTE'}/${recipient.year || '2026'}`;
  const disciplines = recipient.disciplinas || settings.defaultDisciplines;

  return (
    <div
      id={id}
      style={{
        width: '1000px',
        height: '707px',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
      className="relative bg-white text-black font-sans select-none box-border px-14 py-8 overflow-hidden shadow-2xl flex flex-col justify-between"
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
          <svg className="w-[440px] h-[440px]" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <polygon points="50,14 54,34 76,34 58,47 65,68 50,56 35,68 42,47 24,34 46,34" />
          </svg>
        </div>
      )}

      {/* HEADER: SGEx Shield + Base Admin Title + B ADM QGEX Badge */}
      <div className="relative z-20 flex items-center justify-between min-h-[110px]">
        {/* Left: SGEx Badge */}
        <div className="w-[110px] flex justify-start">
          <img
            src={settings.sgexLogoUrl || '/sgex-logo.jpg'}
            alt="Brasão SGEx"
            referrerPolicy="no-referrer"
            className="w-[74px] h-[98px] object-contain drop-shadow-xs"
          />
        </div>

        {/* Center Title */}
        <div className="flex-1 text-center px-2">
          <h2 className="text-[26px] font-black tracking-tight text-black uppercase font-sans leading-none">
            BASE ADMINISTRATIVA DO QUARTEL-GENERAL DO EXÉRCITO
          </h2>
          <div className="text-[26px] font-black tracking-wider text-black uppercase font-sans mt-1">
            “FORTE CAXIAS”
          </div>
        </div>

        {/* Right: B ADM QGEX Badge */}
        <div className="w-[110px] flex justify-end">
          <img
            src={settings.badmLogoUrl || '/badm-qgex-logo.jpg'}
            alt="Brasão B ADM QGEX"
            referrerPolicy="no-referrer"
            className="w-[74px] h-[98px] object-contain drop-shadow-xs"
          />
        </div>
      </div>

      {/* SUB-HEADER: CONTEÚDO PROGRAMÁTICO AND CERTIFICATE CODE */}
      <div className="relative z-20 flex items-center justify-between px-2 pt-3 pb-2">
        <div className="flex-1 text-center">
          <span className="text-[17px] font-extrabold uppercase tracking-wide text-black font-sans">
            CONTEÚDO PROGRAMÁTICO
          </span>
        </div>
        <div className="absolute right-2 text-[16px] font-bold text-black font-sans">
          {certFullCode}
        </div>
      </div>

      {/* PROGRAM TABLE - EXACT MATCH WITH BORDERS & BACKGROUND TINT */}
      <div className="relative z-20 flex-1 flex flex-col justify-start px-2 pt-1 pb-4">
        <table className="w-full border-collapse border-2 border-black text-black font-sans">
          <thead>
            <tr className="bg-slate-100/80 border-b-2 border-black">
              <th className="border-r-2 border-black py-2.5 px-3 text-center text-[13px] font-extrabold uppercase tracking-wider w-[30%]">
                DISCIPLINA
              </th>
              <th className="border-r-2 border-black py-2.5 px-3 text-center text-[13px] font-extrabold uppercase tracking-wider w-[22%]">
                CARGA HORÁRIA
              </th>
              <th className="border-r-2 border-black py-2.5 px-3 text-center text-[13px] font-extrabold uppercase tracking-wider w-[20%]">
                AVALIAÇÃO
              </th>
              <th className="py-2.5 px-3 text-center text-[13px] font-extrabold uppercase tracking-wider w-[28%]">
                INSTRUTOR
              </th>
            </tr>
          </thead>
          <tbody>
            {disciplines.map((item, idx) => (
              <tr
                key={item.id || idx}
                className="border-b-2 border-black bg-slate-100/60 font-sans"
              >
                <td className="border-r-2 border-black py-3 px-4 text-center font-bold text-[13px] leading-snug">
                  {item.name}
                </td>
                <td className="border-r-2 border-black py-3 px-3 text-center font-bold text-[13.5px]">
                  {item.cargaHoraria}
                </td>
                <td className="border-r-2 border-black py-3 px-3 text-center font-bold text-[13.5px]">
                  {item.avaliacao}
                </td>
                <td className="py-3 px-3 text-center font-bold text-[12px] uppercase">
                  {item.instrutor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
