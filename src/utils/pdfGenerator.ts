import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { OfficialCertificateSettings, Recipient } from '../types';

export interface BatchProgressCallback {
  (current: number, total: number, statusText: string): void;
}

// SVG Corner Helper for PDF HTML string
const cornerSvg = (transform: string) => `
  <svg viewBox="0 0 120 120" style="width: 60px; height: 60px; color: #000000; transform: ${transform}; transform-origin: center;" fill="currentColor">
    <g>
      <path d="M4,4 L4,45 C4,47 6,48 8,46 C12,41 18,36 26,38 C32,40 34,47 31,52 C27,58 19,57 16,52 C14,48 11,48 10,51 C8,56 12,65 20,68 C30,71 40,64 42,54 C44,42 36,32 24,30 C15,28 10,21 12,13 C14,6 22,4 30,5 C42,6 50,15 52,26 C53,34 50,42 45,46 C42,48 43,51 46,51 C52,50 60,42 61,33 C63,18 51,4 34,4 Z"></path>
      <path d="M4,4 L45,4 C47,4 48,6 46,8 C41,12 36,18 38,26 C40,32 47,34 52,31 C58,27 57,19 52,16 C48,14 48,11 51,10 C56,8 65,12 68,20 C71,30 64,40 54,42 C42,44 32,36 30,24 C28,15 21,10 13,12 C6,14 4,22 5,30 C6,42 15,50 26,52 C34,53 42,50 46,45 C48,42 51,43 51,46 C50,52 42,60 33,61 C18,63 4,51 4,34 Z"></path>
      <circle cx="8" cy="8" r="3"></circle>
      <circle cx="16" cy="16" r="2.5"></circle>
      <circle cx="28" cy="12" r="2"></circle>
      <circle cx="12" cy="28" r="2"></circle>
    </g>
  </svg>
`;

const topFlourishSvg = `
  <svg viewBox="0 0 240 30" style="width: 170px; height: 20px; color: #000000; margin-bottom: 2px;" fill="currentColor">
    <path d="M120,18 C112,18 105,12 98,7 C92,2 84,0 76,2 C65,5 58,15 62,24 C65,30 73,31 78,27 C83,23 81,16 75,15 C71,15 68,17 67,19 C66,20 64,19 64,18 C65,12 72,7 80,7 C88,7 95,12 102,18 C108,23 114,25 120,25 C126,25 132,23 138,18 C145,12 152,7 160,7 C168,7 175,12 176,18 C176,19 174,20 173,19 C172,17 169,15 165,15 C159,16 157,23 162,27 C167,31 175,30 178,24 C182,15 175,5 164,2 C156,0 148,2 142,7 C135,12 128,18 120,18 Z"></path>
    <circle cx="120" cy="14" r="3"></circle>
  </svg>
`;

const bottomFlourishSvg = `
  <svg viewBox="0 0 300 35" style="width: 210px; height: 22px; color: #000000; margin-top: 4px;" fill="currentColor">
    <line x1="10" y1="18" x2="105" y2="18" stroke="currentColor" stroke-width="2.5"></line>
    <line x1="195" y1="18" x2="290" y2="18" stroke="currentColor" stroke-width="2.5"></line>
    <path d="M150,18 C144,18 138,13 132,8 C126,4 119,3 113,6 C105,10 102,19 107,26 C111,31 118,31 123,26 C126,23 125,17 120,16 C117,15 114,17 114,19 C113,19 111,18 112,17 C115,12 121,9 127,11 C133,13 138,18 144,22 C147,24 153,24 156,22 C162,18 167,13 173,11 C179,9 185,12 188,17 C189,18 187,19 186,19 C186,17 183,15 180,16 C175,17 174,23 177,26 C182,31 189,31 193,26 C198,19 195,10 187,6 C181,3 174,4 168,8 C162,13 156,18 150,18 Z"></path>
    <circle cx="150" cy="14" r="3.5"></circle>
  </svg>
`;

const signatureSvg = `
  <svg viewBox="0 0 200 60" style="width: 170px; height: 44px; color: #1d3557;" fill="none" stroke="#1d3557" stroke-linecap="round">
    <path d="M10,40 Q25,10 40,35 T70,25 T95,45 Q115,5 130,30 T160,28 Q175,15 190,38" stroke-width="1.8"></path>
    <path d="M35,28 C50,15 65,45 80,20 C95,35 110,10 125,32 C140,18 155,40 170,25" stroke-width="1.2" opacity="0.85"></path>
    <ellipse cx="60" cy="32" rx="14" ry="10" stroke-width="1.4" transform="rotate(-15 60 32)"></ellipse>
    <ellipse cx="90" cy="30" rx="10" ry="12" stroke-width="1.3" transform="rotate(10 90 30)"></ellipse>
    <ellipse cx="115" cy="32" rx="12" ry="8" stroke-width="1.3" transform="rotate(-5 115 32)"></ellipse>
  </svg>
`;

/**
 * Builds HTML markup for Certificate Front (Frente)
 */
export const buildCertificateFrontHtml = (recipient: Recipient, settings: OfficialCertificateSettings): string => {
  const certFullCode = `${recipient.certNumber || '006'}/${recipient.customCodePrefix || settings.certCodePrefix || 'CVTE'}/${recipient.year || '2026'}`;
  const cnhCat = recipient.cnhCategoria?.startsWith('“') ? recipient.cnhCategoria : `“${recipient.cnhCategoria || 'AD'}”`;

  return `
    <div style="width: 1000px; height: 707px; background: #ffffff; color: #000000; font-family: 'Times New Roman', Georgia, serif; box-sizing: border-box; padding: 32px 56px 28px 56px; position: relative; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden;">
      <!-- Borders and Ornate Corners -->
      <div style="position: absolute; top: 16px; bottom: 16px; left: 16px; right: 16px; pointer-events: none;">
        <div style="position: absolute; top: 6px; left: 64px; right: 64px; border-top: 2px solid #000000;"></div>
        <div style="position: absolute; top: 11px; left: 64px; right: 64px; border-top: 1px solid #000000;"></div>
        <div style="position: absolute; bottom: 6px; left: 64px; right: 64px; border-bottom: 2px solid #000000;"></div>
        <div style="position: absolute; bottom: 11px; left: 64px; right: 64px; border-bottom: 1px solid #000000;"></div>

        <div style="position: absolute; top: 0; left: 0;">${cornerSvg('')}</div>
        <div style="position: absolute; top: 0; right: 0;">${cornerSvg('scale(-1, 1)')}</div>
        <div style="position: absolute; bottom: 0; left: 0;">${cornerSvg('scale(1, -1)')}</div>
        <div style="position: absolute; bottom: 0; right: 0;">${cornerSvg('scale(-1, -1)')}</div>
      </div>

      <!-- Top Header -->
      <div style="position: relative; z-index: 10; display: flex; align-items: flex-start; justify-content: space-between; min-height: 130px;">
        <!-- Left: SGEx Shield -->
        <div style="width: 110px; display: flex; justify-content: flex-start; padding-top: 4px;">
          <img src="${settings.sgexLogoUrl || '/sgex-logo.jpg'}" style="width: 78px; height: 104px; object-fit: contain;" />
        </div>

        <!-- Center: Title, Flourish, Subtitle -->
        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
          ${topFlourishSvg}
          <h1 style="font-size: 34px; font-weight: bold; letter-spacing: 0.20em; color: #d4582f; text-transform: uppercase; margin: 0; line-height: 1;">
            ${settings.title || 'CERTIFICADO'}
          </h1>
          <div style="margin-top: 6px; font-size: 15px; font-weight: bold; font-family: Arial, sans-serif; color: #000000; line-height: 1.2;">
            Condutores de Veículos de<br />Transporte de Emergência
          </div>
          ${bottomFlourishSvg}
        </div>

        <!-- Right: B ADM QGEX Badge + Cert Code -->
        <div style="width: 110px; display: flex; flex-direction: column; align-items: center; padding-top: 4px;">
          <img src="${settings.badmLogoUrl || '/badm-qgex-logo.jpg'}" style="width: 78px; height: 104px; object-fit: contain;" />
          <div style="margin-top: 8px; font-size: 15px; font-weight: bold; font-family: Arial, sans-serif; color: #000000; white-space: nowrap;">
            ${certFullCode}
          </div>
        </div>
      </div>

      <!-- Body Content -->
      <div style="position: relative; z-index: 10; padding: 4px 12px; margin-top: -6px;">
        <p style="font-size: 14.5px; line-height: 1.72; color: #000000; margin: 0; text-align: justify;">
          A Instituição de Ensino de Trânsito da Base Administrativa do Quartel-General do Exército – Forte Caxias – (Instrução Nº 592, de 10 de agosto de 2020/Detran-DF) certifica que <strong>${recipient.name || 'CARLOS HENRIQUE CAETANO DA SILVA'}</strong>, inscrito no CPF nº <strong>${recipient.cpf || '067.440.731-84'}</strong> e no Nº REGISTRO <strong>${recipient.cnhRegistro || '07575025319'}</strong>, categoria <strong>${cnhCat}</strong>, concluiu com aproveitamento o <strong>${settings.courseName || 'Curso Especializado para Condutores de Veículos de Transporte de Emergência'}</strong>, ministrado pela IET - Forte Caxias, no período de <strong>${recipient.periodo || '08 a 16 de junho de 2026'}</strong>, com carga horária de <strong>${recipient.cargaHoraria || '50h/a'}</strong>, ${settings.legalResolution || 'com validade de cinco anos após o término do curso, conforme Resolução Nº 1.020/2025 do CONTRAN.'}
        </p>

        <div style="text-align: center; margin-top: 18px; font-size: 15px; font-weight: bold; color: #000000;">
          ${recipient.localEmissao || settings.location || 'Brasília-DF'}, ${recipient.dataEmissao || '18 de junho de 2026'}
        </div>
      </div>

      <!-- Footer: Signature on left, CNPJ on right -->
      <div style="position: relative; z-index: 10; display: flex; align-items: flex-end; justify-content: space-between; padding: 0 12px;">
        <div style="width: 270px; display: flex; flex-direction: column; align-items: center; text-align: center;">
          <div style="margin-bottom: -10px;">${signatureSvg}</div>
          <div style="width: 100%; border-bottom: 1px solid #000000; margin-bottom: 3px;"></div>
          <div style="font-size: 12px; font-weight: bold; font-family: Arial, sans-serif; color: #000000;">${settings.directorName || 'Carlos Henrique Ferreira De Mello'}</div>
          <div style="font-size: 11px; font-family: Arial, sans-serif; color: #000000;">${settings.directorRole || 'Diretor Geral'}</div>
          <div style="font-size: 10.5px; font-family: Arial, sans-serif; color: #000000;">${settings.directorCpf || '981.050.007-68'}</div>
        </div>

        <div style="text-align: right; font-family: Arial, sans-serif;">
          <div style="font-size: 11px; font-weight: bold; color: #000000;">${settings.cnpj || 'CNPJ Nº 21.744.847/0001-50'}</div>
          <div style="font-size: 10px; font-weight: bold; color: #000000; text-transform: uppercase;">${settings.companyName || 'BASE ADMINISTRATIVA DO QUARTEL-GENERAL DO EXÉRCITO'}</div>
        </div>
      </div>
    </div>
  `;
};

/**
 * Builds HTML markup for Certificate Back (Verso - Conteúdo Programático)
 */
export const buildCertificateVersoHtml = (recipient: Recipient, settings: OfficialCertificateSettings): string => {
  const certFullCode = `${recipient.certNumber || '006'}/${recipient.customCodePrefix || settings.certCodePrefix || 'CVTE'}/${recipient.year || '2026'}`;
  const disciplines = recipient.disciplinas || settings.defaultDisciplines;

  const rowsHtml = disciplines
    .map(
      (item) => `
      <tr style="border-bottom: 2px solid #000000; background: #f1f5f9;">
        <td style="border-right: 2px solid #000000; padding: 12px 16px; text-align: center; font-weight: bold; font-size: 13px;">${item.name}</td>
        <td style="border-right: 2px solid #000000; padding: 12px 12px; text-align: center; font-weight: bold; font-size: 13.5px;">${item.cargaHoraria}</td>
        <td style="border-right: 2px solid #000000; padding: 12px 12px; text-align: center; font-weight: bold; font-size: 13.5px;">${item.avaliacao}</td>
        <td style="padding: 12px 12px; text-align: center; font-weight: bold; font-size: 12px; text-transform: uppercase;">${item.instrutor}</td>
      </tr>
    `
    )
    .join('');

  return `
    <div style="width: 1000px; height: 707px; background: #ffffff; color: #000000; font-family: Arial, sans-serif; box-sizing: border-box; padding: 32px 56px 28px 56px; position: relative; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden;">
      <!-- Borders and Ornate Corners -->
      <div style="position: absolute; top: 16px; bottom: 16px; left: 16px; right: 16px; pointer-events: none;">
        <div style="position: absolute; top: 6px; left: 64px; right: 64px; border-top: 2px solid #000000;"></div>
        <div style="position: absolute; top: 11px; left: 64px; right: 64px; border-top: 1px solid #000000;"></div>
        <div style="position: absolute; bottom: 6px; left: 64px; right: 64px; border-bottom: 2px solid #000000;"></div>
        <div style="position: absolute; bottom: 11px; left: 64px; right: 64px; border-bottom: 1px solid #000000;"></div>

        <div style="position: absolute; top: 0; left: 0;">${cornerSvg('')}</div>
        <div style="position: absolute; top: 0; right: 0;">${cornerSvg('scale(-1, 1)')}</div>
        <div style="position: absolute; bottom: 0; left: 0;">${cornerSvg('scale(1, -1)')}</div>
        <div style="position: absolute; bottom: 0; right: 0;">${cornerSvg('scale(-1, -1)')}</div>
      </div>

      <!-- Header: SGEx Badge + Title + B ADM QGEX Badge -->
      <div style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: space-between; min-height: 110px;">
        <div style="width: 110px; display: flex; justify-content: flex-start;">
          <img src="${settings.sgexLogoUrl || '/sgex-logo.jpg'}" style="width: 74px; height: 98px; object-fit: contain;" />
        </div>
        <div style="flex: 1; text-align: center;">
          <h2 style="font-size: 26px; font-weight: 900; letter-spacing: -0.01em; color: #000000; text-transform: uppercase; margin: 0; line-height: 1;">
            BASE ADMINISTRATIVA DO QUARTEL-GENERAL DO EXÉRCITO
          </h2>
          <div style="font-size: 26px; font-weight: 900; letter-spacing: 0.05em; color: #000000; text-transform: uppercase; margin-top: 4px;">
            “FORTE CAXIAS”
          </div>
        </div>
        <div style="width: 110px; display: flex; justify-content: flex-end;">
          <img src="${settings.badmLogoUrl || '/badm-qgex-logo.jpg'}" style="width: 74px; height: 98px; object-fit: contain;" />
        </div>
      </div>

      <!-- Subheader: Conteúdo Programático + Code -->
      <div style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 8px 8px 4px 8px;">
        <div style="flex: 1; text-align: center;">
          <span style="font-size: 17px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #000000;">
            CONTEÚDO PROGRAMÁTICO
          </span>
        </div>
        <div style="position: absolute; right: 8px; font-size: 16px; font-weight: bold; color: #000000;">
          ${certFullCode}
        </div>
      </div>

      <!-- Table of Disciplines -->
      <div style="position: relative; z-index: 10; flex: 1; padding: 4px 8px 12px 8px;">
        <table style="width: 100%; border-collapse: collapse; border: 2px solid #000000; color: #000000;">
          <thead>
            <tr style="background: #e2e8f0; border-bottom: 2px solid #000000;">
              <th style="border-right: 2px solid #000000; padding: 10px 12px; text-align: center; font-size: 13px; font-weight: 900; text-transform: uppercase; width: 30%;">DISCIPLINA</th>
              <th style="border-right: 2px solid #000000; padding: 10px 12px; text-align: center; font-size: 13px; font-weight: 900; text-transform: uppercase; width: 22%;">CARGA HORÁRIA</th>
              <th style="border-right: 2px solid #000000; padding: 10px 12px; text-align: center; font-size: 13px; font-weight: 900; text-transform: uppercase; width: 20%;">AVALIAÇÃO</th>
              <th style="padding: 10px 12px; text-align: center; font-size: 13px; font-weight: 900; text-transform: uppercase; width: 28%;">INSTRUTOR</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

/**
 * Renders a specific certificate HTML element to a jsPDF doc using html2canvas
 */
export const exportElementToPdf = async (
  elementId: string,
  fileName: string = 'certificado.pdf'
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Elemento do certificado não encontrado no documento.');
  }

  const canvas = await html2canvas(element, {
    scale: 2.5, // High DPI for crystal clear print quality
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
  pdf.save(fileName);
};

/**
 * Generates a 2-page PDF Blob (Frente + Verso) for a given recipient
 */
export const generate2PagePdfBlobForRecipient = async (
  recipient: Recipient,
  settings: OfficialCertificateSettings
): Promise<Blob> => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '1000px';
  container.style.height = '707px';
  container.style.zIndex = '-1000';
  document.body.appendChild(container);

  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // 1. Render Frente
    container.innerHTML = buildCertificateFrontHtml(recipient, settings);
    const canvasFront = await html2canvas(container, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });
    const imgDataFront = canvasFront.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgDataFront, 'JPEG', 0, 0, 297, 210);

    // 2. Render Verso
    pdf.addPage('a4', 'landscape');
    container.innerHTML = buildCertificateVersoHtml(recipient, settings);
    const canvasVerso = await html2canvas(container, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });
    const imgDataVerso = canvasVerso.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgDataVerso, 'JPEG', 0, 0, 297, 210);

    return pdf.output('blob');
  } finally {
    document.body.removeChild(container);
  }
};

/**
 * Fast batch generator that produces 2-page PDFs (Frente + Verso) for all recipients and zips them.
 */
export const generateBatchZip = async (
  recipients: Recipient[],
  settings: OfficialCertificateSettings,
  onProgress?: BatchProgressCallback
): Promise<void> => {
  const zip = new JSZip();
  const folder = zip.folder('certificados_oficiais_frente_verso') || zip;
  const total = recipients.length;

  for (let i = 0; i < total; i++) {
    const rec = recipients[i];
    if (onProgress) {
      onProgress(i + 1, total, `Gerando certificado (Frente + Verso) ${i + 1} de ${total}: ${rec.name}`);
    }

    const pdfBlob = await generate2PagePdfBlobForRecipient(rec, settings);
    const cleanName = (rec.name || `participante_${i + 1}`)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_');
    const filename = `certificado_${rec.certNumber || String(i + 1).padStart(3, '0')}_${cleanName}.pdf`;

    folder.file(filename, pdfBlob);
  }

  if (onProgress) {
    onProgress(total, total, 'Compactando arquivo ZIP...');
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `lote_certificados_frente_verso_${new Date().toISOString().slice(0, 10)}.zip`);
};

/**
 * Combines all recipients into a single unified multi-page PDF document (Page 1 Frente, Page 2 Verso, Page 3 Frente...)
 */
export const generateCombinedMultiPagePdf = async (
  recipients: Recipient[],
  settings: OfficialCertificateSettings,
  onProgress?: BatchProgressCallback
): Promise<void> => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const total = recipients.length;
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '1000px';
  container.style.height = '707px';
  container.style.zIndex = '-1000';
  document.body.appendChild(container);

  try {
    for (let i = 0; i < total; i++) {
      const rec = recipients[i];
      if (onProgress) {
        onProgress(i + 1, total, `Processando Frente e Verso do certificado ${i + 1} de ${total}...`);
      }

      if (i > 0) {
        pdf.addPage('a4', 'landscape');
      }

      // 1. Frente
      container.innerHTML = buildCertificateFrontHtml(rec, settings);
      const canvasFront = await html2canvas(container, {
        scale: 2.2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const imgFront = canvasFront.toDataURL('image/jpeg', 0.92);
      pdf.addImage(imgFront, 'JPEG', 0, 0, 297, 210);

      // 2. Verso
      pdf.addPage('a4', 'landscape');
      container.innerHTML = buildCertificateVersoHtml(rec, settings);
      const canvasVerso = await html2canvas(container, {
        scale: 2.2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const imgVerso = canvasVerso.toDataURL('image/jpeg', 0.92);
      pdf.addImage(imgVerso, 'JPEG', 0, 0, 297, 210);
    }

    if (onProgress) {
      onProgress(total, total, 'Download pronto!');
    }

    pdf.save(`todos_certificados_unificados_frente_verso_${new Date().toISOString().slice(0, 10)}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
};
