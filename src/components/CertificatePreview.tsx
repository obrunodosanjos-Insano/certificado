import React, { useState } from 'react';
import { Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Eye, CheckCircle, FileText, Layers } from 'lucide-react';
import { OfficialCertificateSettings, Recipient } from '../types';
import { OfficialCertificateCard } from './OfficialCertificateCard';
import { OfficialCertificateVerso } from './OfficialCertificateVerso';
import { generate2PagePdfBlobForRecipient } from '../utils/pdfGenerator';
import { saveAs } from 'file-saver';

interface CertificatePreviewProps {
  settings: OfficialCertificateSettings;
  recipients: Recipient[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  onUpdateRecipient?: (updated: Recipient) => void;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  settings,
  recipients,
  currentIndex,
  onSelectIndex,
}) => {
  const [scale, setScale] = useState(0.82);
  const [highlightFields, setHighlightFields] = useState(false);
  const [activeSide, setActiveSide] = useState<'frente' | 'verso'>('frente');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const currentRecipient = recipients[currentIndex] || recipients[0];
  const total = recipients.length;

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      onSelectIndex(currentIndex + 1);
    }
  };

  const handleExport2PagePdf = async () => {
    try {
      setIsExporting(true);
      const safeName = (currentRecipient?.name || 'certificado')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_');
      const filename = `certificado_${currentRecipient?.certNumber || '006'}_${safeName}_frente_verso.pdf`;
      const blob = await generate2PagePdfBlobForRecipient(currentRecipient, settings);
      saveAs(blob, filename);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/5 rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Recipient Navigation */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-1.5 rounded hover:bg-white text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Participante anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2.5 font-semibold text-slate-800">
              {currentIndex + 1} de {total}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === total - 1}
              className="p-1.5 rounded hover:bg-white text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Próximo participante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:block text-xs text-slate-600 font-medium truncate max-w-[200px]">
            {currentRecipient?.name}
          </div>
        </div>

        {/* Frente / Verso Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveSide('frente')}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              activeSide === 'frente'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Frente (Página 1)
          </button>
          <button
            type="button"
            onClick={() => setActiveSide('verso')}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              activeSide === 'verso'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verso (Conteúdo Programático)
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Highlight Fields Toggle (Active on Frente) */}
          {activeSide === 'frente' && (
            <button
              type="button"
              onClick={() => setHighlightFields(!highlightFields)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                highlightFields
                  ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Destacar campos que mudam em cada certificado"
            >
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span>{highlightFields ? 'Campos Variáveis (Ativo)' : 'Destacar Campos'}</span>
            </button>
          )}

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setScale((s) => Math.max(0.45, s - 0.08))}
              className="p-1.5 hover:bg-white rounded text-slate-700 transition cursor-pointer"
              title="Diminuir Zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-slate-600 text-[11px]">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(1.2, s + 0.08))}
              className="p-1.5 hover:bg-white rounded text-slate-700 transition cursor-pointer"
              title="Aumentar Zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export Current 2-Page PDF */}
          <button
            type="button"
            onClick={handleExport2PagePdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-xs transition-all disabled:opacity-60 cursor-pointer"
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Gerando PDF (Frente+Verso)...</span>
              </>
            ) : copiedSuccess ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>PDF Baixado!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Baixar PDF (Frente + Verso)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Stage */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center bg-slate-200/60 relative">
        <div
          style={{
            width: `${1000 * scale}px`,
            height: `${707 * scale}px`,
          }}
          className="transition-transform duration-100 ease-out shadow-2xl rounded-sm bg-white"
        >
          {activeSide === 'frente' ? (
            <OfficialCertificateCard
              id="preview-certificate-canvas"
              recipient={currentRecipient}
              settings={settings}
              highlightFields={highlightFields}
              scale={scale}
            />
          ) : (
            <OfficialCertificateVerso
              id="preview-certificate-verso-canvas"
              recipient={currentRecipient}
              settings={settings}
              scale={scale}
            />
          )}
        </div>
      </div>

      {/* Informative Footer Bar */}
      <div className="bg-white border-t border-slate-200 px-4 py-2 text-[12px] text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <span>
            {activeSide === 'frente' ? 'Página 1: Frente Oficial' : 'Página 2: Verso (Grade Curricular e Instrutores)'} – Formato A4 Paisagem
          </span>
        </div>
        <div className="text-slate-700 font-mono text-[12px] font-bold">
          {currentRecipient.certNumber || '006'}/{settings.certCodePrefix}/{currentRecipient.year || '2026'}
        </div>
      </div>
    </div>
  );
};
