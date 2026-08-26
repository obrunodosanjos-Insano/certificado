import React from 'react';
import { Calendar, Clock, Lock, UserCheck } from 'lucide-react';
import { OfficialCertificateSettings, Recipient } from '../types';

interface ConfigurationPanelProps {
  recipient: Recipient;
  settings: OfficialCertificateSettings;
  onUpdateRecipient: (recipient: Recipient) => void;
  onUpdateSettings: (settings: OfficialCertificateSettings) => void;
  totalRecipients: number;
}

const normalizeCode = (value: string) => {
  const raw = value.trim();
  return raw.includes('/') ? raw : `${raw.padStart(3, '0')}/CVTE/2026`;
};

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ recipient, onUpdateRecipient }) => {
  const change = (field: keyof Recipient, value: string) => onUpdateRecipient({ ...recipient, [field]: value });

  const fields: Array<{ field: keyof Recipient; label: string; placeholder: string; icon?: React.ReactNode; uppercase?: boolean }> = [
    { field: 'certNumber', label: 'Número do certificado', placeholder: '006/CVTE/2026' },
    { field: 'name', label: 'Nome completo', placeholder: 'CARLOS HENRIQUE CAETANO DA SILVA', icon: <UserCheck className="w-3.5 h-3.5" />, uppercase: true },
    { field: 'cpf', label: 'CPF', placeholder: '067.440.731-84' },
    { field: 'cnhRegistro', label: 'Nº registro', placeholder: '07575025319' },
    { field: 'cnhCategoria', label: 'Categoria', placeholder: 'AD', uppercase: true },
    { field: 'periodo', label: 'Período do curso', placeholder: '08 a 16 de junho de 2026', icon: <Calendar className="w-3.5 h-3.5" /> },
    { field: 'cargaHoraria', label: 'Carga horária', placeholder: '50h/a' },
    { field: 'dataEmissao', label: 'Data de emissão', placeholder: '18 de junho de 2026', icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-700" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">Dados do certificado</h2>
            <p className="text-[11px] text-slate-500">Modelo oficial bloqueado</p>
          </div>
        </div>
      </div>

      <div className="p-4 overflow-y-auto flex-1 space-y-3">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-slate-700">
          <strong>Somente estes 8 campos podem ser alterados.</strong> Logos, textos, assinatura, ornamentos, posições e demais elementos permanecem fixos.
        </div>

        {fields.map(({ field, label, placeholder, icon, uppercase }) => (
          <label key={String(field)} className="block space-y-1">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
              {icon}{label}
              <span className="ml-auto rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">EDITÁVEL</span>
            </span>
            <input
              type="text"
              value={(recipient[field] as string) || ''}
              onChange={(e) => {
                let value = uppercase ? e.target.value.toUpperCase() : e.target.value;
                if (field === 'cnhCategoria') value = value.replace(/[“”]/g, '');
                change(field, value);
              }}
              onBlur={(e) => field === 'certNumber' && change('certNumber', normalizeCode(e.target.value))}
              placeholder={placeholder}
              className={`w-full rounded-lg border border-slate-300 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${uppercase ? 'uppercase' : ''}`}
            />
          </label>
        ))}
      </div>
    </div>
  );
};
