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
  const rawCode = (recipient.certNumber || '006/CVTE/2026').trim();
  const certFullCode = rawCode.includes('/') ? rawCode : `${rawCode.padStart(3, '0')}/CVTE/2026`;
  const disciplines = recipient.disciplinas || settings.defaultDisciplines;

  return (
    <div
      id={id}
      style={{
        width: '1000px',
        height: '707px',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top left',
      }}
      className="relative bg-white text-black font-sans select-none box-border px-14 py-8 overflow-hidden flex flex-col justify-between"
    >
      <div className="absolute inset-4 pointer-events-none z-10">
        <div className="absolute top-2 left-16 right-16 border-t-2 border-black" />
        <div className="absolute top-3.5 left-16 right-16 border-t border-black" />
        <div className="absolute bottom-2 left-16 right-16 border-b-2 border-black" />
        <div className="absolute bottom-3.5 left-16 right-16 border-b border-black" />
        <CertificateCorner position="top-left" className="absolute top-0 left-0 w-16 h-16 text-black" />
        <CertificateCorner position="top-right" className="absolute top-0 right-0 w-16 h-16 text-black" />
        <CertificateCorner position="bottom-left" className="absolute bottom-0 left-0 w-16 h-16 text-black" />
        <CertificateCorner position="bottom-right" className="absolute bottom-0 right-0 w-16 h-16 text-black" />
      </div>

      <div className="relative z-20 flex items-center justify-between min-h-[110px]">
        <div className="w-[110px] flex justify-start">
          <img src="/sgex-logo.jpg" alt="Brasão SGEx" className="w-[74px] h-[98px] object-contain" draggable={false} />
        </div>
        <div className="flex-1 text-center px-2">
          <h2 className="text-[26px] font-black tracking-tight uppercase leading-none">
            BASE ADMINISTRATIVA DO QUARTEL-GENERAL DO EXÉRCITO
          </h2>
          <div className="text-[26px] font-black tracking-wider uppercase mt-1">“FORTE CAXIAS”</div>
        </div>
        <div className="w-[110px] flex justify-end">
          <img src="/badm-qgex-logo.jpg" alt="Brasão B ADM QGEX" className="w-[74px] h-[98px] object-contain" draggable={false} />
        </div>
      </div>

      <div className="relative z-20 flex items-center justify-between px-2 pt-3 pb-2">
        <div className="flex-1 text-center">
          <span className="text-[17px] font-extrabold uppercase tracking-wide">CONTEÚDO PROGRAMÁTICO</span>
        </div>
        <div className="absolute right-2 text-[16px] font-bold">{certFullCode}</div>
      </div>

      <div className="relative z-20 flex-1 px-2 pt-1 pb-4">
        <table className="w-full border-collapse border-2 border-black text-black">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-black">
              <th className="border-r-2 border-black py-2.5 px-3 text-center text-[13px] font-extrabold uppercase w-[30%]">DISCIPLINA</th>
              <th className="border-r-2 border-black py-2.5 px-3 text-center text-[13px] font-extrabold uppercase w-[22%]">CARGA HORÁRIA</th>
              <th className="border-r-2 border-black py-2.5 px-3 text-center text-[13px] font-extrabold uppercase w-[20%]">AVALIAÇÃO</th>
              <th className="py-2.5 px-3 text-center text-[13px] font-extrabold uppercase w-[28%]">INSTRUTOR</th>
            </tr>
          </thead>
          <tbody>
            {disciplines.map((item, idx) => (
              <tr key={item.id || idx} className="border-b-2 border-black bg-slate-100/60">
                <td className="border-r-2 border-black py-3 px-4 text-center font-bold text-[13px]">{item.name}</td>
                <td className="border-r-2 border-black py-3 px-3 text-center font-bold text-[13.5px]">{item.cargaHoraria}</td>
                <td className="border-r-2 border-black py-3 px-3 text-center font-bold text-[13.5px]">{item.avaliacao}</td>
                <td className="py-3 px-3 text-center font-bold text-[12px] uppercase">{item.instrutor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
