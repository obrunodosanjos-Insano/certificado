import React, { useState, useRef } from 'react';
import {
  Users,
  Download,
  Plus,
  Trash2,
  Upload,
  Zap,
  CheckCircle2,
  FileArchive,
  Layers,
  Edit2,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OfficialCertificateSettings, Recipient } from '../types';
import { generateBatchZip, generateCombinedMultiPagePdf } from '../utils/pdfGenerator';
import { DEFAULT_SAMPLE_15_RECIPIENTS } from '../data/defaultConfig';

interface BatchManagerProps {
  recipients: Recipient[];
  settings: OfficialCertificateSettings;
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  onUpdateRecipients: (recipients: Recipient[]) => void;
}

export const BatchManager: React.FC<BatchManagerProps> = ({
  recipients,
  settings,
  currentIndex,
  onSelectIndex,
  onUpdateRecipients,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, text: '', percent: 0 });
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importRawText, setImportRawText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger celebration on completion
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Generate ZIP with all individual PDFs
  const handleGenerateZip = async () => {
    try {
      setIsGenerating(true);
      const startTime = performance.now();

      await generateBatchZip(recipients, settings, (cur, tot, txt) => {
        setProgress({
          current: cur,
          total: tot,
          text: txt,
          percent: Math.round((cur / tot) * 100),
        });
      });

      const totalTimeSec = ((performance.now() - startTime) / 1000).toFixed(1);
      setElapsedTime(parseFloat(totalTimeSec));
      triggerConfetti();
    } catch (err) {
      console.error('Erro na geração em lote:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate single unified PDF with all certificates as pages
  const handleGenerateUnifiedPdf = async () => {
    try {
      setIsGenerating(true);
      const startTime = performance.now();

      await generateCombinedMultiPagePdf(recipients, settings, (cur, tot, txt) => {
        setProgress({
          current: cur,
          total: tot,
          text: txt,
          percent: Math.round((cur / tot) * 100),
        });
      });

      const totalTimeSec = ((performance.now() - startTime) / 1000).toFixed(1);
      setElapsedTime(parseFloat(totalTimeSec));
      triggerConfetti();
    } catch (err) {
      console.error('Erro na geração unificada:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Quick Reset to 15 Official Sample Certificates
  const handleLoadOfficial15 = () => {
    onUpdateRecipients([...DEFAULT_SAMPLE_15_RECIPIENTS]);
    onSelectIndex(0);
  };

  // Add a single new recipient row
  const handleAddRecipient = () => {
    const nextNum = String(recipients.length + 1).padStart(3, '0');
    const newRec: Recipient = {
      id: `rec-${Date.now()}`,
      certNumber: nextNum,
      year: '2026',
      name: 'NOVO PARTICIPANTE',
      cpf: '000.000.000-00',
      cnhRegistro: '00000000000',
      cnhCategoria: '“AD”',
      periodo: '08 a 16 de junho de 2026',
      cargaHoraria: '50h/a',
      dataEmissao: '18 de junho de 2026',
    };
    onUpdateRecipients([...recipients, newRec]);
    onSelectIndex(recipients.length);
    setEditingId(newRec.id);
  };

  // Remove recipient
  const handleRemoveRecipient = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (recipients.length <= 1) {
      return;
    }
    const updated = recipients.filter((r) => r.id !== id);
    onUpdateRecipients(updated);
    if (currentIndex >= updated.length) {
      onSelectIndex(updated.length - 1);
    }
  };

  // Update specific field in table
  const handleFieldChange = (id: string, field: keyof Recipient, value: string) => {
    const updated = recipients.map((r) => {
      if (r.id === id) {
        return { ...r, [field]: value };
      }
      return r;
    });
    onUpdateRecipients(updated);
  };

  // Quick Text/CSV Import
  const handleProcessImport = () => {
    if (!importRawText.trim()) return;

    const lines = importRawText.split('\n').filter((l) => l.trim().length > 0);
    const newItems: Recipient[] = [];

    lines.forEach((line, idx) => {
      const parts = line.split(/[;,|\t]/).map((p) => p.trim());
      // Expecting: Nome, CPF, CNH Registro, Categoria, Periodo, Carga Horária, Data Emissao, Numero Certificado
      const name = parts[0] || `Participante ${idx + 1}`;
      const cpf = parts[1] || '000.000.000-00';
      const cnhRegistro = parts[2] || '00000000000';
      const cnhCategoria = parts[3] || '“AD”';
      const periodo = parts[4] || '08 a 16 de junho de 2026';
      const cargaHoraria = parts[5] || '50h/a';
      const dataEmissao = parts[6] || '18 de junho de 2026';
      const certNumber = parts[7] || String(recipients.length + idx + 1).padStart(3, '0');

      newItems.push({
        id: `rec-imp-${Date.now()}-${idx}`,
        certNumber,
        year: '2026',
        name: name.toUpperCase(),
        cpf,
        cnhRegistro,
        cnhCategoria,
        periodo,
        cargaHoraria,
        dataEmissao,
      });
    });

    if (newItems.length > 0) {
      onUpdateRecipients([...recipients, ...newItems]);
      setShowImportModal(false);
      setImportRawText('');
    }
  };

  // CSV file picker
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        setImportRawText(text);
        setShowImportModal(true);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Geração em Massa de Certificados
              </h2>
              <p className="text-xs text-slate-500">
                {recipients.length} certificados configurados • Formato padrão idêntico
              </p>
            </div>
          </div>
        </div>

        {/* Batch Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleLoadOfficial15}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            title="Carregar lista modelo com 15 formandos"
          >
            Carregar 15 Alunos Padrão
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Importar CSV</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.txt"
            className="hidden"
          />

          <button
            type="button"
            onClick={handleAddRecipient}
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Aluno</span>
          </button>
        </div>
      </div>

      {/* Speed Guarantee Bar & Quick Export */}
      <div className="bg-slate-50/80 px-4 sm:px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-700">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="font-semibold text-slate-900">Alta Performance:</span>
          <span>Gera 15 certificados em menos de 10 segundos.</span>
          {elapsedTime && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
              <CheckCircle2 className="w-3 h-3" /> Concluído em {elapsedTime}s!
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Unified PDF */}
          <button
            type="button"
            onClick={handleGenerateUnifiedPdf}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 shadow-2xs transition disabled:opacity-50 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Baixar 1 PDF Único (Multi-páginas)</span>
          </button>

          {/* ZIP Batch */}
          <button
            type="button"
            onClick={handleGenerateZip}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processando...</span>
              </>
            ) : (
              <>
                <FileArchive className="w-4 h-4" />
                <span>Gerar Todos em ZIP ({recipients.length} PDFs)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar when Generating */}
      {isGenerating && (
        <div className="p-4 bg-blue-50/70 border-b border-blue-200">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-900 mb-1.5">
            <span>{progress.text}</span>
            <span className="font-mono">{progress.percent}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-200"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Table of Dynamic Fields */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 bg-slate-100/90 backdrop-blur-xs border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3 w-12 text-center">#</th>
              <th className="py-2.5 px-3 min-w-[200px]">Nome Completo (em vermelho)</th>
              <th className="py-2.5 px-3 min-w-[130px]">CPF</th>
              <th className="py-2.5 px-3 min-w-[120px]">Registro CNH</th>
              <th className="py-2.5 px-3 min-w-[90px]">Cat. CNH</th>
              <th className="py-2.5 px-3 min-w-[170px]">Período</th>
              <th className="py-2.5 px-3 min-w-[80px]">Carga</th>
              <th className="py-2.5 px-3 min-w-[150px]">Data Emissão</th>
              <th className="py-2.5 px-3 w-20 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recipients.map((rec, index) => {
              const isSelected = index === currentIndex;
              return (
                <tr
                  key={rec.id}
                  onClick={() => onSelectIndex(index)}
                  className={`group transition-colors cursor-pointer ${
                    isSelected ? 'bg-blue-50/60 font-medium' : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Certificate Number */}
                  <td className="py-2 px-3 text-center font-mono font-bold text-slate-700">
                    <input
                      type="text"
                      value={rec.certNumber}
                      onChange={(e) => handleFieldChange(rec.id, 'certNumber', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-12 text-center py-0.5 px-1 bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded font-mono text-xs"
                    />
                  </td>

                  {/* Name */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={rec.name}
                      onChange={(e) => handleFieldChange(rec.id, 'name', e.target.value.toUpperCase())}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-1 px-1.5 bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded font-semibold text-slate-900 text-xs uppercase"
                    />
                  </td>

                  {/* CPF */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={rec.cpf}
                      onChange={(e) => handleFieldChange(rec.id, 'cpf', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-1 px-1.5 bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded text-slate-800 text-xs font-mono"
                    />
                  </td>

                  {/* CNH Registro */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={rec.cnhRegistro}
                      onChange={(e) => handleFieldChange(rec.id, 'cnhRegistro', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-1 px-1.5 bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded text-slate-800 text-xs font-mono"
                    />
                  </td>

                  {/* CNH Categoria */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={rec.cnhCategoria}
                      onChange={(e) => handleFieldChange(rec.id, 'cnhCategoria', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-1 px-1.5 bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded text-slate-800 text-xs font-semibold text-center"
                    />
                  </td>

                  {/* Período */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={rec.periodo}
                      onChange={(e) => handleFieldChange(rec.id, 'periodo', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-1 px-1.5 bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded text-slate-800 text-xs"
                    />
                  </td>

                  {/* Carga Horária */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={rec.cargaHoraria}
                      onChange={(e) => handleFieldChange(rec.id, 'cargaHoraria', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-1 px-1.5 bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded text-slate-800 text-xs text-center"
                    />
                  </td>

                  {/* Data Emissão */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={rec.dataEmissao}
                      onChange={(e) => handleFieldChange(rec.id, 'dataEmissao', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-1 px-1.5 bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded text-slate-800 text-xs"
                    />
                  </td>

                  {/* Actions */}
                  <td className="py-2 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleRemoveRecipient(rec.id, e)}
                        disabled={recipients.length <= 1}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-20 transition cursor-pointer"
                        title="Remover participante"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CSV / Text Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Importar Lista de Alunos (CSV ou Texto)
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Cole uma linha por formando separando os campos por vírgula ou ponto-e-vírgula:<br />
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-mono text-[11px] block mt-1">
                Nome; CPF; Registro CNH; Categoria; Período; Carga; Data Emissão
              </code>
            </p>

            <textarea
              rows={6}
              value={importRawText}
              onChange={(e) => setImportRawText(e.target.value)}
              placeholder="Exemplo:&#10;GABRIEL SILVA DE SOUZA; 123.456.789-00; 07512345678; AD; 08 a 16 de junho de 2026; 50h/a; 18 de junho de 2026"
              className="w-full p-3 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
            />

            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleProcessImport}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer"
              >
                Importar e Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
