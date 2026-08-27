import React, { useRef, useState } from 'react';
import { FileArchive, Layers, Plus, Trash2, Upload, Users } from 'lucide-react';
import * as XLSX from 'xlsx';
import { OfficialCertificateSettings, Recipient } from '../types';
import { generateBatchZip, generateCombinedMultiPagePdf } from '../utils/pdfGenerator';

interface BatchManagerProps {
  recipients: Recipient[];
  settings: OfficialCertificateSettings;
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  onUpdateRecipients: (recipients: Recipient[]) => void;
}

const normalizeCode = (value: string) => {
  const raw = value.trim();
  return raw.includes('/') ? raw : `${raw.padStart(3, '0')}/CVTE/2026`;
};

const normalizeHeader = (value: unknown) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();

const readByAliases = (row: Record<string, unknown>, aliases: string[]) => {
  const entries = Object.entries(row);
  for (const alias of aliases) {
    const wanted = normalizeHeader(alias);
    const found = entries.find(([key]) => normalizeHeader(key) === wanted);
    if (found && found[1] !== undefined && found[1] !== null && String(found[1]).trim() !== '') {
      return String(found[1]).trim();
    }
  }
  return '';
};

export const BatchManager: React.FC<BatchManagerProps> = ({
  recipients,
  settings,
  currentIndex,
  onSelectIndex,
  onUpdateRecipients,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (id: string, field: keyof Recipient, value: string) => {
    onUpdateRecipients(recipients.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const addRecipient = () => {
    const next = String(recipients.length + 1).padStart(3, '0');
    const item: Recipient = {
      id: `rec-${Date.now()}`,
      certNumber: `${next}/CVTE/2026`,
      year: '2026',
      name: 'NOVO PARTICIPANTE',
      cpf: '000.000.000-00',
      cnhRegistro: '00000000000',
      cnhCategoria: 'AD',
      periodo: '08 a 16 de junho de 2026',
      cargaHoraria: '50h/a',
      dataEmissao: '18 de junho de 2026',
    };
    onUpdateRecipients([...recipients, item]);
    onSelectIndex(recipients.length);
  };

  const removeRecipient = (id: string) => {
    if (recipients.length <= 1) return;
    const next = recipients.filter((r) => r.id !== id);
    onUpdateRecipients(next);
    if (currentIndex >= next.length) onSelectIndex(next.length - 1);
  };

  const importCsv = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const rows = text.split(/\r?\n/).filter(Boolean);
      const imported: Recipient[] = rows.map((line, i) => {
        const p = line.split(/[;,|\t]/).map((v) => v.trim());
        return {
          id: `import-${Date.now()}-${i}`,
          certNumber: normalizeCode(p[7] || String(recipients.length + i + 1).padStart(3, '0')),
          year: '2026',
          name: (p[0] || `PARTICIPANTE ${i + 1}`).toUpperCase(),
          cpf: p[1] || '000.000.000-00',
          cnhRegistro: p[2] || '00000000000',
          cnhCategoria: (p[3] || 'AD').replace(/[“”]/g, '').toUpperCase(),
          periodo: p[4] || '08 a 16 de junho de 2026',
          cargaHoraria: p[5] || '50h/a',
          dataEmissao: p[6] || '18 de junho de 2026',
        };
      });
      if (imported.length) onUpdateRecipients([...recipients, ...imported]);
    };
    reader.readAsText(file);
  };

  const importExcel = async (file: File) => {
    try {
      setProgress('Lendo planilha Excel...');
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!firstSheet) throw new Error('A planilha não possui uma aba válida.');

      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
        defval: '',
        raw: false,
      });

      const imported: Recipient[] = rows
        .map((row, i) => {
          const certNumber = readByAliases(row, ['Nº CERTIFICADO', 'N CERTIFICADO', 'NUMERO CERTIFICADO', 'CERTIFICADO']);
          const name = readByAliases(row, ['NOME', 'NOME COMPLETO']);
          const cpf = readByAliases(row, ['CPF']);
          const registro = readByAliases(row, ['Nº REGISTRO', 'N REGISTRO', 'REGISTRO']);
          const categoria = readByAliases(row, ['CATEGORIA']);
          const periodo = readByAliases(row, ['PERÍODO', 'PERIODO']);
          const carga = readByAliases(row, ['CARGA', 'CARGA HORÁRIA', 'CARGA HORARIA']);
          const emissao = readByAliases(row, ['DATA EMISSÃO', 'DATA EMISSAO', 'EMISSÃO', 'EMISSAO']);

          if (![certNumber, name, cpf, registro, categoria, periodo, carga, emissao].some(Boolean)) return null;

          return {
            id: `excel-${Date.now()}-${i}`,
            certNumber: normalizeCode(certNumber || String(recipients.length + i + 1).padStart(3, '0')),
            year: '2026',
            name: (name || `PARTICIPANTE ${i + 1}`).toUpperCase(),
            cpf: cpf || '000.000.000-00',
            cnhRegistro: registro || '00000000000',
            cnhCategoria: (categoria || 'AD').replace(/[“”]/g, '').toUpperCase(),
            periodo: periodo || '08 a 16 de junho de 2026',
            cargaHoraria: carga || '50h/a',
            dataEmissao: emissao || '18 de junho de 2026',
          } as Recipient;
        })
        .filter((item): item is Recipient => Boolean(item));

      if (!imported.length) throw new Error('Nenhuma linha válida foi encontrada na planilha.');

      onUpdateRecipients(imported);
      onSelectIndex(0);
      setProgress(`${imported.length} certificado(s) importado(s) do Excel.`);
    } catch (error) {
      console.error(error);
      setProgress('Erro ao importar a planilha. Confira os títulos das colunas e tente novamente.');
    }
  };

  const handleFileImport = async (file: File) => {
    const name = file.name.toLowerCase();
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) await importExcel(file);
    else importCsv(file);
  };

  const run = async (kind: 'pdf' | 'zip') => {
    try {
      setIsGenerating(true);
      setProgress('Preparando certificados...');
      const cb = (_c: number, _t: number, text: string) => setProgress(text);
      if (kind === 'zip') await generateBatchZip(recipients, settings, cb);
      else await generateCombinedMultiPagePdf(recipients, settings, cb);
      setProgress('Concluído.');
    } catch (error) {
      console.error(error);
      setProgress('Erro ao gerar os arquivos. Verifique as logos e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-700" />
          <div>
            <h2 className="font-bold text-slate-900">Geração em lote</h2>
            <p className="text-xs text-slate-500">Importe uma planilha Excel ou edite somente os 8 campos autorizados.</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => fileInputRef.current?.click()} className="px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Importar Excel/CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv,.txt"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await handleFileImport(file);
              e.currentTarget.value = '';
            }}
          />
          <button onClick={addRecipient} className="px-3 py-2 rounded-lg bg-slate-100 text-xs font-semibold flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        </div>
      </div>

      <div className="px-4 py-3 bg-slate-50 border-b flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-600">{progress || `${recipients.length} certificado(s)`}</span>
        <div className="flex gap-2">
          <button disabled={isGenerating} onClick={() => run('pdf')} className="px-3 py-2 rounded-lg border bg-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50">
            <Layers className="w-3.5 h-3.5" /> PDF único
          </button>
          <button disabled={isGenerating} onClick={() => run('zip')} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50">
            <FileArchive className="w-3.5 h-3.5" /> ZIP com PDFs
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs border-collapse min-w-[1350px]">
          <thead className="sticky top-0 bg-slate-100 z-10">
            <tr className="border-b border-slate-200 text-left text-slate-600">
              <th className="p-2 min-w-[150px]">Nº CERTIFICADO</th>
              <th className="p-2 min-w-[220px]">NOME</th>
              <th className="p-2 min-w-[130px]">CPF</th>
              <th className="p-2 min-w-[130px]">Nº REGISTRO</th>
              <th className="p-2 min-w-[90px]">CATEGORIA</th>
              <th className="p-2 min-w-[190px]">PERÍODO</th>
              <th className="p-2 min-w-[100px]">CARGA</th>
              <th className="p-2 min-w-[170px]">DATA EMISSÃO</th>
              <th className="p-2 w-16">AÇÃO</th>
            </tr>
          </thead>
          <tbody>
            {recipients.map((r, index) => (
              <tr key={r.id} onClick={() => onSelectIndex(index)} className={`border-b border-slate-100 ${index === currentIndex ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                <td className="p-2"><input value={r.certNumber} onBlur={(e) => update(r.id, 'certNumber', normalizeCode(e.target.value))} onChange={(e) => update(r.id, 'certNumber', e.target.value)} className="w-full border rounded px-2 py-1.5 font-mono" /></td>
                <td className="p-2"><input value={r.name} onChange={(e) => update(r.id, 'name', e.target.value.toUpperCase())} className="w-full border rounded px-2 py-1.5 font-semibold uppercase" /></td>
                <td className="p-2"><input value={r.cpf} onChange={(e) => update(r.id, 'cpf', e.target.value)} className="w-full border rounded px-2 py-1.5" /></td>
                <td className="p-2"><input value={r.cnhRegistro} onChange={(e) => update(r.id, 'cnhRegistro', e.target.value)} className="w-full border rounded px-2 py-1.5" /></td>
                <td className="p-2"><input value={r.cnhCategoria} onChange={(e) => update(r.id, 'cnhCategoria', e.target.value.replace(/[“”]/g, '').toUpperCase())} className="w-full border rounded px-2 py-1.5 uppercase text-center" /></td>
                <td className="p-2"><input value={r.periodo} onChange={(e) => update(r.id, 'periodo', e.target.value)} className="w-full border rounded px-2 py-1.5" /></td>
                <td className="p-2"><input value={r.cargaHoraria} onChange={(e) => update(r.id, 'cargaHoraria', e.target.value)} className="w-full border rounded px-2 py-1.5" /></td>
                <td className="p-2"><input value={r.dataEmissao} onChange={(e) => update(r.id, 'dataEmissao', e.target.value)} className="w-full border rounded px-2 py-1.5" /></td>
                <td className="p-2"><button onClick={(e) => { e.stopPropagation(); removeRecipient(r.id); }} className="p-2 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
