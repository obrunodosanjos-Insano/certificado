import React from 'react';
import { Calendar, Clock, FileBadge, Lock, UserCheck } from 'lucide-react';
import { OfficialCertificateSettings, Recipient } from '../types';

interface ConfigurationPanelProps { recipient: Recipient; settings: OfficialCertificateSettings; onUpdateRecipient: (recipient: Recipient) => void; onUpdateSettings: (settings: OfficialCertificateSettings) => void; totalRecipients: number; }

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ recipient, settings, onUpdateRecipient }) => {
  const update = (field: keyof Recipient, value: string) => onUpdateRecipient({ ...recipient, [field]: value });
  const fullCode = `${recipient.certNumber || '006'}/${recipient.customCodePrefix || settings.certCodePrefix || 'CVTE'}/${recipient.year || '2026'}`;
  const updateFullCode = (value: string) => { const parts=value.split('/'); if(parts.length>=3) onUpdateRecipient({...recipient,certNumber:parts[0].trim(),customCodePrefix:parts[1].trim(),year:parts.slice(2).join('/').trim()}); else onUpdateRecipient({...recipient,certNumber:value}); };
  return <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
    <div className="p-4 bg-slate-50/90 border-b border-slate-200"><div className="flex items-center justify-between gap-3"><div><div className="flex items-center gap-2"><FileBadge className="w-4 h-4 text-amber-600"/><h2 className="text-sm font-extrabold text-slate-900">Dados editáveis</h2></div><p className="mt-1 text-[11px] text-slate-500">Somente os campos sublinhados em vermelho no modelo podem ser alterados.</p></div><span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">8 CAMPOS</span></div></div>
    <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5"><Lock className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0"/><p className="text-emerald-900 text-[11px] leading-relaxed"><strong>Modelo oficial bloqueado.</strong> Brasões, textos, curso, assinaturas, ornamentos, posições, fontes, local e estrutura permanecem iguais.</p></div>
      <Field icon={<FileBadge className="w-3.5 h-3.5 text-amber-600"/>} label="Número do certificado" value={fullCode} onChange={updateFullCode}/>
      <Field icon={<UserCheck className="w-3.5 h-3.5 text-amber-600"/>} label="Nome do aluno" value={recipient.name} uppercase onChange={v=>update('name',v.toUpperCase())}/>
      <div className="grid grid-cols-2 gap-3"><Field label="CPF" value={recipient.cpf} onChange={v=>update('cpf',v)}/><Field label="Nº de registro" value={recipient.cnhRegistro} onChange={v=>update('cnhRegistro',v)}/></div>
      <Field label="Categoria" value={recipient.cnhCategoria} onChange={v=>update('cnhCategoria',v)}/>
      <Field icon={<Calendar className="w-3.5 h-3.5 text-amber-600"/>} label="Período do curso" value={recipient.periodo} onChange={v=>update('periodo',v)}/>
      <Field label="Carga horária" value={recipient.cargaHoraria} onChange={v=>update('cargaHoraria',v)}/>
      <Field icon={<Clock className="w-3.5 h-3.5 text-amber-600"/>} label="Data de emissão" value={recipient.dataEmissao} onChange={v=>update('dataEmissao',v)}/>
      <div className="border-t border-slate-200 pt-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Protegido</p><div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-600"><span>🔒 Curso</span><span>🔒 Texto legal</span><span>🔒 Brasões</span><span>🔒 Assinatura</span><span>🔒 Local</span><span>🔒 Layout</span></div></div>
    </div></div>;
};
function Field({icon,label,value,onChange,uppercase=false}:{icon?:React.ReactNode;label:string;value:string;onChange:(value:string)=>void;uppercase?:boolean}){return <div className="space-y-1"><label className="font-bold text-slate-900 flex items-center gap-1.5">{icon}{label}</label><input type="text" value={value} onChange={e=>onChange(e.target.value)} className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50 ${uppercase?'font-bold uppercase':''}`}/></div>;}
