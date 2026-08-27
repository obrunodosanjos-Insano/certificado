import React from 'react';
import { OfficialCertificateSettings, Recipient } from '../types';
import { TopFlourish, BottomSubtitleFlourish } from './CertificateOrnaments';

interface OfficialCertificateCardProps {
  recipient: Recipient;
  settings?: OfficialCertificateSettings;
  highlightFields?: boolean;
  scale?: number;
  id?: string;
  digitalSignature?: string | null;
}

/** MODELO OFICIAL BLOQUEADO: somente os 8 campos do Recipient podem variar. */
export const OfficialCertificateCard: React.FC<OfficialCertificateCardProps> = ({
  recipient,
  scale = 1,
  id = 'official-certificate-element',
  digitalSignature = null,
}) => {
  const rawNumber = (recipient.certNumber || '006/CVTE/2026').trim();
  const certFullCode = rawNumber.includes('/')
    ? rawNumber
    : `${rawNumber.padStart(3, '0')}/CVTE/2026`;

  const name = recipient.name || 'CARLOS HENRIQUE CAETANO DA SILVA';
  const cpf = recipient.cpf || '067.440.731-84';
  const registro = recipient.cnhRegistro || '07575025319';
  const categoria = (recipient.cnhCategoria || 'AD').replace(/[“”]/g, '');
  const periodo = recipient.periodo || '08 a 16 de junho de 2026';
  const carga = recipient.cargaHoraria || '50h/a';
  const data = recipient.dataEmissao || '18 de junho de 2026';

  const Dynamic: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="font-bold text-black">{children}</span>
  );

  return (
    <div id={id} style={{ width: '892px', height: '621px', transform: scale !== 1 ? `scale(${scale})` : undefined, transformOrigin: 'top left' }} className="relative overflow-hidden bg-white text-black select-none">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10px] left-[24px] right-[24px] border-t-[3px] border-black" />
        <div className="absolute top-[16px] left-[24px] right-[24px] border-t border-black" />
        <div className="absolute bottom-[10px] left-[24px] right-[24px] border-b-[3px] border-black" />
        <div className="absolute bottom-[16px] left-[24px] right-[24px] border-b border-black" />
      </div>

      <img src="/sgex-logo.jpg" alt="SGEx" className="absolute left-[80px] top-[50px] z-10 w-[64px] h-[89px] object-contain" draggable={false} />
      <img src="/badm-qgex-logo.jpg" alt="B ADM QGEX" className="absolute left-[730px] top-[55px] z-10 w-[63px] h-[89px] object-contain" draggable={false} />

      <div className="absolute left-[300px] top-[8px] w-[300px] text-center z-10">
        <TopFlourish className="mx-auto w-[170px] h-[45px] text-black" />
        <div className="font-serif text-[34px] leading-none tracking-[0.07em] text-[#e05b31]">CERTIFICADO</div>
        <div className="mt-[10px] font-sans text-[15px] font-bold leading-[1.12]">Condutores de Veículos de<br />Transporte de Emergência</div>
        <BottomSubtitleFlourish className="mx-auto mt-[3px] w-[230px] h-[30px] text-black" />
      </div>

      <div className="absolute left-[697px] top-[154px] z-10 font-sans text-[17px] font-bold whitespace-nowrap">{certFullCode}</div>

      <div className="absolute left-[46px] top-[230px] right-[46px] z-10 font-serif text-[14.5px] leading-[1.78] text-black text-justify">
        A Instituição de Ensino de Trânsito da Base Administrativa do Quartel-General do Exército – Forte Caxias –
        (Instrução Nº 592, de 10 de agosto de 2020/Detran-DF) certifica que <Dynamic>{name}</Dynamic>, inscrito no CPF nº <Dynamic>{cpf}</Dynamic> e no Nº REGISTRO <Dynamic>{registro}</Dynamic>, categoria <Dynamic>“{categoria}”</Dynamic>, concluiu com aproveitamento o <strong>Curso Especializado para Condutores de Veículos de Transporte de Emergência</strong>, ministrado pela IET - Forte Caxias, no período de <Dynamic>{periodo}</Dynamic>, com carga horária de <Dynamic>{carga}</Dynamic>, com validade de cinco anos após o término do curso, conforme Resolução Nº 1.020/2025 do CONTRAN.
      </div>

      <div className="absolute left-0 top-[449px] w-full text-center z-10 font-serif text-[16px] font-bold">Brasília-DF, <Dynamic>{data}</Dynamic></div>

      <div className="absolute left-[82px] bottom-[56px] z-10 w-[180px] text-center">
        <div className="relative h-[44px] overflow-visible">
          {digitalSignature ? (
            <img
              src={digitalSignature}
              alt="Assinatura digital"
              draggable={false}
              className="absolute left-1/2 bottom-[-11px] w-[198px] h-[60px] max-w-none object-contain pointer-events-none"
              style={{ transform: 'translateX(-50%)' }}
            />
          ) : (
            <div className="h-[42px] w-full" aria-label="Espaço reservado para assinatura" />
          )}
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
