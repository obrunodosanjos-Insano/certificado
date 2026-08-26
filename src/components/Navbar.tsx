import React from 'react';
import { Award, Zap, FileArchive, Download, Sparkles, Layers } from 'lucide-react';

interface NavbarProps {
  totalCertificates: number;
  onQuickExportZip: () => void;
  onQuickExportUnified: () => void;
  isGenerating?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalCertificates,
  onQuickExportZip,
  onQuickExportUnified,
  isGenerating = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                Gerador Oficial de Certificados
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                <Zap className="w-3 h-3 text-blue-600 fill-blue-600" /> Em Massa (15+ / min)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Modelo oficial padronizado com campos variáveis sob medida
            </p>
          </div>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onQuickExportUnified}
            disabled={isGenerating}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-2xs transition disabled:opacity-50 cursor-pointer"
            title="Exportar todos os participantes em um único arquivo PDF com várias páginas"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>PDF Unificado</span>
          </button>

          <button
            type="button"
            onClick={onQuickExportZip}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Gerando...</span>
              </>
            ) : (
              <>
                <FileArchive className="w-4 h-4" />
                <span>Baixar Todos ({totalCertificates} Certificados)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
