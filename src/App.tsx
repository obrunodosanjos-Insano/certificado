import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CertificatePreview } from './components/CertificatePreview';
import { BatchManager } from './components/BatchManager';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { DEFAULT_SETTINGS, DEFAULT_SAMPLE_15_RECIPIENTS } from './data/defaultConfig';
import { OfficialCertificateSettings, Recipient } from './types';
import { generateBatchZip, generateCombinedMultiPagePdf } from './utils/pdfGenerator';
import { Eye, Users, Settings, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [settings, setSettings] = useState<OfficialCertificateSettings>(DEFAULT_SETTINGS);
  const [recipients, setRecipients] = useState<Recipient[]>(DEFAULT_SAMPLE_15_RECIPIENTS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeMainView, setActiveMainView] = useState<'preview' | 'batch'>('preview');
  const [isGeneratingGlobal, setIsGeneratingGlobal] = useState(false);

  const currentRecipient = recipients[currentIndex] || recipients[0];

  const handleUpdateCurrentRecipient = (updated: Recipient) => {
    const newRecipients = recipients.map((r, i) => (i === currentIndex ? updated : r));
    setRecipients(newRecipients);
  };

  const handleQuickExportZip = async () => {
    try {
      setIsGeneratingGlobal(true);
      await generateBatchZip(recipients, settings);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingGlobal(false);
    }
  };

  const handleQuickExportUnified = async () => {
    try {
      setIsGeneratingGlobal(true);
      await generateCombinedMultiPagePdf(recipients, settings);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingGlobal(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
      {/* Top Navbar */}
      <Navbar
        totalCertificates={recipients.length}
        onQuickExportZip={handleQuickExportZip}
        onQuickExportUnified={handleQuickExportUnified}
        isGenerating={isGeneratingGlobal}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Main View Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveMainView('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMainView === 'preview'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Visualização do Certificado</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainView('batch')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMainView === 'batch'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>Gerenciador de Lote ({recipients.length} Alunos)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Modelo: <strong>{settings.courseName}</strong></span>
          </div>
        </div>

        {/* Dynamic Layout according to Active View */}
        {activeMainView === 'preview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Main Column: Realtime Interactive Preview Stage (7 cols) */}
            <div className="lg:col-span-7 h-[680px]">
              <CertificatePreview
                settings={settings}
                recipients={recipients}
                currentIndex={currentIndex}
                onSelectIndex={setCurrentIndex}
                onUpdateRecipient={handleUpdateCurrentRecipient}
              />
            </div>

            {/* Right Column: Editable Dynamic & Fixed Fields (5 cols) */}
            <div className="lg:col-span-5 h-[680px]">
              <ConfigurationPanel
                recipient={currentRecipient}
                settings={settings}
                onUpdateRecipient={handleUpdateCurrentRecipient}
                onUpdateSettings={setSettings}
                totalRecipients={recipients.length}
              />
            </div>
          </div>
        ) : (
          /* Full Batch Table & Fast Multi-Generation View */
          <div className="h-[720px]">
            <BatchManager
              recipients={recipients}
              settings={settings}
              currentIndex={currentIndex}
              onSelectIndex={(idx) => {
                setCurrentIndex(idx);
                setActiveMainView('preview');
              }}
              onUpdateRecipients={setRecipients}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
