import React, { useState } from 'react';
import { Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Check, PenLine, Trash2 } from 'lucide-react';
import { OfficialCertificateSettings, Recipient } from '../types';
import { OfficialCertificateCard } from './OfficialCertificateCard';
import { OfficialCertificateVerso } from './OfficialCertificateVerso';
import { generate2PagePdfBlobForRecipient } from '../utils/pdfGenerator';
import { saveAs } from 'file-saver';

const DEFAULT_DIGITAL_SIGNATURE = '/assinatura-digital.png';

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
  const [scale, setScale] = useState(0.85);
  const [activeSide, setActiveSide] = useState<'frente' | 'verso'>('frente');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [digitalSignature, setDigitalSignature] = useState<string | null>(null);

  const currentRecipient = recipients[currentIndex] || recipients[0];
  const total = recipients.length;

  const handlePrev = () => currentIndex > 0 && onSelectIndex(currentIndex - 1);
  const handleNext = () => currentIndex < total - 1 && onSelectIndex(currentIndex + 1);

  const handleDigitalSign = () => {
    setDigitalSignature(DEFAULT_DIGITAL_SIGNATURE);
    setActiveSide('frente');
  };

  const handleExport2PagePdf = async () => {
    try {
      setIsExporting(true);
      const safeName = (currentRecipient?.name || 'certificado').toLowerCase().replace(/[^a-z0-9]/g, '_');
      const filename = `certificado_${currentRecipient?.certNumber || '006'}_${safeName}.pdf`;
      const blob = await generate2PagePdfBlobForRecipient(currentRecipient, settings, digitalSignature);
      saveAs(blob, filename);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/60 border border-slate-200 overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-slate-700">
          <button onClick={handlePrev} disabled={currentIndex === 0} className="p-1 hover:bg-slate-100 disabled:opacity-30 cursor-pointer transition" title="Anterior">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-medium px-1 text-slate-800">{currentIndex + 1} / {total}</span>
          <button onClick={handleNext} disabled={currentIndex === total - 1} className="p-1 hover:bg-slate-100 disabled:opacity-30 cursor-pointer transition" title="Próximo">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center bg-slate-100 p-0.5 text-xs font-medium">
          <button type="button" onClick={() => setActiveSide('frente')} className={`px-3 py-1 transition cursor-pointer ${activeSide === 'frente' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}>
            Frente
          </button>
          <button type="button" onClick={() => setActiveSide('verso')} className={`px-3 py-1 transition cursor-pointer ${activeSide === 'verso' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}>
            Verso
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="flex items-center text-xs text-slate-600">
            <button onClick={() => setScale((s) => Math.max(0.45, s - 0.08))} className="p-1 hover:bg-slate-100 cursor-pointer transition" title="Diminuir">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[11px] font-mono w-9 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale((s) => Math.min(1.2, s + 0.08))} className="p-1 hover:bg-slate-100 cursor-pointer transition" title="Aumentar">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleDigitalSign}
            className={`inline-flex items-center gap-1.5 border text-xs font-medium px-3 py-1.5 transition ${digitalSignature ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800'}`}
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>{digitalSignature ? 'Assinatura aplicada' : 'Assinar digitalmente'}</span>
          </button>

          {digitalSignature && (
            <button type="button" onClick={() => setDigitalSignature(null)} className="inline-flex items-center gap-1 border border-red-200 bg-white hover:bg-red-50 text-red-700 text-xs font-medium px-2 py-1.5 transition" title="Remover assinatura digital">
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remover</span>
            </button>
          )}

          <button type="button" onClick={handleExport2PagePdf} disabled={isExporting} className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3 py-1.5 disabled:opacity-50 transition cursor-pointer">
            {isExporting ? (
              <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Gerando...</span></>
            ) : copiedSuccess ? (
              <><Check className="w-3.5 h-3.5 text-emerald-400" /><span>Baixado</span></>
            ) : (
              <><Download className="w-3.5 h-3.5" /><span>Baixar PDF</span></>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center relative">
        <div style={{ width: `${892 * scale}px`, height: `${621 * scale}px` }} className="transition-all duration-100 ease-out shadow-md bg-white">
          {activeSide === 'frente' ? (
            <OfficialCertificateCard id="preview-certificate-canvas" recipient={currentRecipient} settings={settings} scale={scale} digitalSignature={digitalSignature} />
          ) : (
            <OfficialCertificateVerso id="preview-certificate-verso-canvas" recipient={currentRecipient} settings={settings} scale={scale} />
          )}
        </div>
      </div>
    </div>
  );
};
