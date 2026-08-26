import React, { useState } from 'react';
import {
  UserCheck,
  Building2,
  Calendar,
  Clock,
  Shield,
  FileBadge,
  Sparkles,
  Lock,
  Edit3,
  BookOpen,
  Plus,
  Trash2,
} from 'lucide-react';
import { Discipline, OfficialCertificateSettings, Recipient } from '../types';

interface ConfigurationPanelProps {
  recipient: Recipient;
  settings: OfficialCertificateSettings;
  onUpdateRecipient: (recipient: Recipient) => void;
  onUpdateSettings: (settings: OfficialCertificateSettings) => void;
  totalRecipients: number;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  recipient,
  settings,
  onUpdateRecipient,
  onUpdateSettings,
  totalRecipients,
}) => {
  const [activeTab, setActiveTab] = useState<'dynamic' | 'disciplines' | 'fixed'>('dynamic');

  const handleRecipientChange = (field: keyof Recipient, value: string) => {
    onUpdateRecipient({
      ...recipient,
      [field]: value,
    });
  };

  const handleSettingsChange = (field: keyof OfficialCertificateSettings, value: any) => {
    onUpdateSettings({
      ...settings,
      [field]: value,
    });
  };

  const currentDisciplines = recipient.disciplinas || settings.defaultDisciplines;

  const handleUpdateDiscipline = (index: number, field: keyof Discipline, value: string) => {
    const updated = [...currentDisciplines];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateRecipient({
      ...recipient,
      disciplinas: updated,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Header Tabs */}
      <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl w-full">
          <button
            type="button"
            onClick={() => setActiveTab('dynamic')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'dynamic'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
            <span>Frente (Dados)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('disciplines')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'disciplines'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Verso (Grade)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fixed')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'fixed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Estrutura</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
        {activeTab === 'dynamic' ? (
          <>
            {/* Notice */}
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-600 mt-1.5 shrink-0 animate-pulse" />
              <p className="text-slate-700 text-[11.5px] leading-relaxed">
                Estes são os campos variáveis do certificado deste aluno. As alterações refletem imediatamente no preview e no PDF.
              </p>
            </div>

            {/* Field: Recipient Name */}
            <div className="space-y-1">
              <label className="flex items-center justify-between font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                  Nome Completo do Formando
                </span>
                <span className="text-[10px] text-amber-700 font-semibold bg-amber-100/60 px-1.5 py-0.5 rounded">
                  Variável
                </span>
              </label>
              <input
                type="text"
                value={recipient.name}
                onChange={(e) => handleRecipientChange('name', e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-bold uppercase focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50"
                placeholder="NOME COMPLETO"
              />
            </div>

            {/* Field: Cert Number & Year */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Número Certificado</span>
                  <span className="text-[10px] text-amber-700 font-semibold">Código</span>
                </label>
                <input
                  type="text"
                  value={recipient.certNumber}
                  onChange={(e) => handleRecipientChange('certNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50"
                  placeholder="006"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Ano de Emissão</span>
                  <span className="text-[10px] text-amber-700 font-semibold">Ano</span>
                </label>
                <input
                  type="text"
                  value={recipient.year}
                  onChange={(e) => handleRecipientChange('year', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50"
                  placeholder="2026"
                />
              </div>
            </div>

            {/* Field: CPF and CNH Registro */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-900 flex items-center justify-between">
                  <span>CPF do Aluno</span>
                  <span className="text-[10px] text-amber-700 font-semibold">CPF</span>
                </label>
                <input
                  type="text"
                  value={recipient.cpf}
                  onChange={(e) => handleRecipientChange('cpf', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50"
                  placeholder="000.000.000-00"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Registro CNH</span>
                  <span className="text-[10px] text-amber-700 font-semibold">CNH</span>
                </label>
                <input
                  type="text"
                  value={recipient.cnhRegistro}
                  onChange={(e) => handleRecipientChange('cnhRegistro', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50"
                  placeholder="07575025319"
                />
              </div>
            </div>

            {/* Field: Categoria CNH and Carga Horária */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Categoria CNH</span>
                  <span className="text-[10px] text-amber-700 font-semibold">Cat.</span>
                </label>
                <input
                  type="text"
                  value={recipient.cnhCategoria}
                  onChange={(e) => handleRecipientChange('cnhCategoria', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-bold text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50"
                  placeholder='“AD”'
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Carga Horária</span>
                  <span className="text-[10px] text-amber-700 font-semibold">Carga</span>
                </label>
                <input
                  type="text"
                  value={recipient.cargaHoraria}
                  onChange={(e) => handleRecipientChange('cargaHoraria', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-center font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50"
                  placeholder="50h/a"
                />
              </div>
            </div>

            {/* Field: Período do Curso */}
            <div className="space-y-1">
              <label className="font-bold text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  Período Realizado
                </span>
                <span className="text-[10px] text-amber-700 font-semibold">Período</span>
              </label>
              <input
                type="text"
                value={recipient.periodo}
                onChange={(e) => handleRecipientChange('periodo', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50"
                placeholder="08 a 16 de junho de 2026"
              />
            </div>

            {/* Field: Data de Emissão */}
            <div className="space-y-1">
              <label className="font-bold text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Data de Emissão
                </span>
                <span className="text-[10px] text-amber-700 font-semibold">Data</span>
              </label>
              <input
                type="text"
                value={recipient.dataEmissao}
                onChange={(e) => handleRecipientChange('dataEmissao', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-slate-50/50"
                placeholder="18 de junho de 2026"
              />
            </div>
          </>
        ) : activeTab === 'disciplines' ? (
          <>
            {/* Disciplines Verso Editor */}
            <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-slate-700 text-[11.5px] leading-relaxed">
              <div className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Grade Curricular do Verso (Conteúdo Programático)
              </div>
              Disciplinas, cargas horárias, avaliações e instrutores impressos na tabela do verso.
            </div>

            <div className="space-y-3">
              {currentDisciplines.map((disc, idx) => (
                <div key={disc.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-slate-900 text-[11.5px]">Disciplina {idx + 1}</div>
                  <div>
                    <input
                      type="text"
                      value={disc.name}
                      onChange={(e) => handleUpdateDiscipline(idx, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-semibold text-xs"
                      placeholder="Nome da Disciplina"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600">Carga Horária</label>
                      <input
                        type="text"
                        value={disc.cargaHoraria}
                        onChange={(e) => handleUpdateDiscipline(idx, 'cargaHoraria', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 rounded-md text-slate-900 text-xs text-center"
                        placeholder="10h/a"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600">Avaliação</label>
                      <input
                        type="text"
                        value={disc.avaliacao}
                        onChange={(e) => handleUpdateDiscipline(idx, 'avaliacao', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 rounded-md text-slate-900 text-xs text-center font-bold"
                        placeholder="10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Instrutor</label>
                    <input
                      type="text"
                      value={disc.instrutor}
                      onChange={(e) => handleUpdateDiscipline(idx, 'instrutor', e.target.value.toUpperCase())}
                      className="w-full px-2.5 py-1 border border-slate-300 rounded-md text-slate-900 text-xs uppercase"
                      placeholder="NOME DO INSTRUTOR"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Fixed Institutional Parameters */}
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-[11.5px] leading-relaxed">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Estrutura Fixa Padrão
              </div>
              Estes parâmetros compõem a base oficial do documento em conformidade com as resoluções vigentes.
            </div>

            {/* Course Title */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nome Oficial do Curso</label>
              <input
                type="text"
                value={settings.courseName}
                onChange={(e) => handleSettingsChange('courseName', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
              />
            </div>

            {/* Institution Clause */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Texto Institucional de Certificação</label>
              <textarea
                rows={3}
                value={settings.institutionClause}
                onChange={(e) => handleSettingsChange('institutionClause', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden text-[11.5px]"
              />
            </div>

            {/* Resolution text */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Validade & Resolução Legal</label>
              <input
                type="text"
                value={settings.legalResolution}
                onChange={(e) => handleSettingsChange('legalResolution', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
              />
            </div>

            {/* Signatory Details */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 text-xs">Dados do Signatário / Diretor</div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nome do Diretor</label>
                <input
                  type="text"
                  value={settings.directorName}
                  onChange={(e) => handleSettingsChange('directorName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Cargo</label>
                  <input
                    type="text"
                    value={settings.directorRole}
                    onChange={(e) => handleSettingsChange('directorRole', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">CPF do Diretor</label>
                  <input
                    type="text"
                    value={settings.directorCpf}
                    onChange={(e) => handleSettingsChange('directorCpf', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Institutional Organization */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-xs">Instituição Emissora</div>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => handleSettingsChange('companyName', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
              />
              <input
                type="text"
                value={settings.cnpj}
                onChange={(e) => handleSettingsChange('cnpj', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono text-xs"
              />
            </div>

            {/* Brasões Oficiais */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-yellow-600" />
                  Brasões Oficiais
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                  Ambos Ativos
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <img
                    src={settings.sgexLogoUrl || '/sgex-logo.jpg'}
                    alt="SGEx"
                    className="w-10 h-14 object-contain bg-white border border-slate-200 rounded p-0.5 shrink-0"
                  />
                  <div className="text-[10.5px] text-slate-700 font-semibold">
                    SGEx (Esquerdo)
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <img
                    src={settings.badmLogoUrl || '/badm-qgex-logo.jpg'}
                    alt="B ADM QGEX"
                    className="w-10 h-14 object-contain bg-white border border-slate-200 rounded p-0.5 shrink-0"
                  />
                  <div className="text-[10.5px] text-slate-700 font-semibold">
                    B ADM QGEX (Direito)
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
