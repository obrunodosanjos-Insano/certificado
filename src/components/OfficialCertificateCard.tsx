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

/**
 * Official front side.
 * The visual structure is intentionally locked. Only the eight recipient fields
 * are read from `recipient`; institutional text, logos, ornaments and footer data
 * are constants matching the supplied official artwork.
 */
export const OfficialCertificateCard: React.FC<OfficialCertificateCardProps> = ({
  recipient,
  settings,
  scale = 1,
  id = 'official-certificate-element',
}) => {
  const certFullCode = recipient.certNumber || '006/CVTE/2026';
  const name = recipient.name || 'CARLOS HENRIQUE CAETANO DA SILVA';
  const cpf = recipient.cpf || '067.440.731-84';
  const registro = recipient.cnhRegistro || '07575025319';
  const categoria = (recipient.cnhCategoria || 'AD').replace(/[“”]/g, '');
  const periodo = recipient.periodo || '08 a 16 de junho de 2026';
  const carga = recipient.cargaHoraria || '50h/a';
  const data = recipient.dataEmissao || '18 de junho de 2026';

  const Dynamic: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <span className={`font-bold text-black ${className}`}>{children}</span>
  );

  return (
    <div
      id={id}
      style={{
        width: '892px',
        height: '621px',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top left',
      }}
      className="relative overflow-hidden bg-white text-black select-none"
    >
      {/* Fixed border / ornaments */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10px] left-[92px] right-[92px] border-t-[3px] border-black" />
        <div className="absolute top-[16px] left-[92px] right-[92px] border-t border-black" />
        <div className="absolute bottom-[10px] left-[92px] right-[92px] border-b-[3px] border-black" />
        <div className="absolute bottom-[16px] left-[92px] right-[92px] border-b border-black" />
        <CertificateCorner position="top-left" className="absolute left-[10px] top-[8px] w-[75px] h-[75px] text-black" />
        <CertificateCorner position="top-right" className="absolute right-[10px] top-[8px] w-[75px] h-[75px] text-black" />
        <CertificateCorner position="bottom-left" className="absolute left-[10px] bottom-[8px] w-[75px] h-[75px] text-black" />
        <CertificateCorner position="bottom-right" className="absolute right-[10px] bottom-[8px] w-[75px] h-[75px] text-black" />
      </div>

      {/* Logos: fixed position and proportions; these are never user-editable. */}
      <img
        src={settings.sgexLogoUrl || '/sgex-logo.jpg'}
        alt="SGEx"
        className="absolute left-[80px] top-[50px] z-10 w-[64px] h-[89px] object-contain"
        referrerPolicy="no-referrer"
      />
      <img
        src={settings.badmLogoUrl || '/badm-qgex-logo.jpg'}
        alt="B ADM QGEX"
        className="absolute left-[730px] top-[55px] z-10 w-[63px] h-[89px] object-contain"
        referrerPolicy="no-referrer"
      />

      {/* Fixed title block */}
      <div className="absolute left-[300px] top-[8px] w-[300px] text-center z-10">
        <TopFlourish className="mx-auto w-[170px] h-[45px] text-black" />
        <div className="font-serif text-[34px] leading-none tracking-[0.07em] text-[#e05b31]">CERTIFICADO</div>
        <div className="mt-[10px] font-sans text-[15px] font-bold leading-[1.12]">
          Condutores de Veículos de<br />
          Transporte de Emergência
        </div>
        <BottomSubtitleFlourish className="mx-auto mt-[3px] w-[230px] h-[30px] text-black" />
      </div>

      {/* Fixed certificate number position */}
      <div className="absolute left-[697px] top-[154px] z-10 font-sans text-[17px] font-bold whitespace-nowrap">
        {certFullCode}
      </div>

      {/* Fixed body text. Only the marked values below are dynamic. */}
      <div className="absolute left-[46px] top-[230px] right-[46px] z-10 font-serif text-[14.5px] leading-[1.78] text-black text-justify">
        A Instituição de Ensino de Trânsito da Base Administrativa do Quartel-General do Exército – Forte Caxias –
        (Instrução Nº 592, de 10 de agosto de 2020/Detran-DF) certifica que <Dynamic>{name}</Dynamic>, inscrito no CPF nº <Dynamic>{cpf}</Dynamic> e no Nº REGISTRO <Dynamic>{registro}</Dynamic>, categoria <Dynamic>“{categoria}”</Dynamic>, concluiu com aproveitamento o <strong>Curso Especializado para Condutores de Veículos de Transporte de Emergência</strong>, ministrado pela IET - Forte Caxias, no período de <Dynamic>{periodo}</Dynamic>, com carga horária de <Dynamic>{carga}</Dynamic>, com validade de cinco anos após o término do curso, conforme Resolução Nº 1.020/2025 do CONTRAN.
      </div>

      {/* Fixed location; only the date is editable. */}
      <div className="absolute left-0 top-[449px] w-full text-center z-10 font-serif text-[16px] font-bold">
        Brasília-DF, <Dynamic>{data}</Dynamic>
      </div>

      {/* Fixed signature and institutional footer */}
      <div className="absolute left-[82px] bottom-[56px] z-10 w-[180px] text-center">
        <div className="relative h-[42px] flex items-center justify-center">
          <svg viewBox="0 0 200 60" className="w-[170px] h-[48px] overflow-visible">
            <path d="M10,40 Q25,10 40,35 T70,25 T95,45 Q115,5 130,30 T160,28 Q175,15 190,38" fill="none" stroke="#1d3557" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M35,28 C50,15 65,45 80,20 C95,35 110,10 125,32 C140,18 155,40 170,25" fill="none" stroke="#1d3557" strokeWidth="1.2" />
          </svg>
        </div>
        <div className="border-b border-black" />
        <div className="mt-1 font-sans text-[11px] font-bold">Carlos Henrique Ferreira De Mello</div>
        <div className="font-sans text-[10px]">Diretor Geral</div>
        <div className="font-sans text-[9px]">981.050.007-68</div>
      </div>

      <div className="absolute right-[82px] bottom-[54px] z-10 text-right font-sans font-bold">
        <div className="text-[10px]">CNPJ Nº 21.744.847/0001-50</div>
        <div className="text-[9px] uppercase">BASE ADMINISTRATIVA DO QUARTEL-GENERAL DO EXÉRCITO</div>
      </div>
    </div>
  );
};
