import React from 'react';
import { FileArchive, FileText } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h1 className="text-sm font-semibold text-slate-900">
            Emissão de Certificados
          </h1>
          <span className="text-xs text-slate-400 font-normal">|</span>
          <span className="text-xs text-slate-500 font-medium">
            CVTE • Forte Caxias
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onQuickExportUnified}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition disabled:opacity-50 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>PDF Unificado</span>
          </button>

          <button
            type="button"
            onClick={onQuickExportZip}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Gerando...</span>
              </>
            ) : (
              <>
                <FileArchive className="w-3.5 h-3.5" />
                <span>Baixar Todos ({totalCertificates})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

