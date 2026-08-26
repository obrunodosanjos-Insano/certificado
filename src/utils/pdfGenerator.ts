import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { OfficialCertificateSettings, Recipient } from '../types';

export interface BatchProgressCallback {
  (current: number, total: number, statusText: string): void;
}

const fullCode = (r: Recipient) => {
  const raw = (r.certNumber || '006').trim();
  return raw.includes('/') ? raw : `${raw.padStart(3, '0')}/CVTE/${r.year || '2026'}`;
};

const waitForAssets = async (root: HTMLElement) => {
  if (document.fonts?.ready) await document.fonts.ready;
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(images.map(img => {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Não foi possível carregar a imagem: ${img.src}`));
    });
  }));
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
};

const logo = (src: string, side: 'left' | 'right') =>
  `<img src="${src}" crossorigin="anonymous" style="position:absolute;${side}:80px;top:50px;width:64px;height:89px;object-fit:contain" />`;

export const buildCertificateFrontHtml = (r: Recipient, _settings: OfficialCertificateSettings): string => {
  const cat = (r.cnhCategoria || 'AD').replace(/[“”]/g, '');
  return `<div style="width:1000px;height:707px;background:#fff;color:#000;box-sizing:border-box;position:relative;overflow:hidden;font-family:'Times New Roman',serif">
    <div style="position:absolute;inset:16px;border:2px solid #000"></div>
    ${logo('/sgex-logo.jpg','left')}${logo('/badm-qgex-logo.jpg','right')}
    <div style="position:absolute;left:330px;top:45px;width:340px;text-align:center">
      <div style="font-size:38px;font-weight:bold;letter-spacing:5px;color:#d4582f">CERTIFICADO</div>
      <div style="margin-top:10px;font:700 17px Arial,sans-serif;line-height:1.2">Condutores de Veículos de<br/>Transporte de Emergência</div>
    </div>
    <div style="position:absolute;right:75px;top:175px;font:700 18px Arial,sans-serif">${fullCode(r)}</div>
    <div style="position:absolute;left:55px;right:55px;top:255px;font-size:17px;line-height:1.8;text-align:justify">
      A Instituição de Ensino de Trânsito da Base Administrativa do Quartel-General do Exército – Forte Caxias – (Instrução Nº 592, de 10 de agosto de 2020/Detran-DF) certifica que <strong>${r.name || 'CARLOS HENRIQUE CAETANO DA SILVA'}</strong>, inscrito no CPF nº <strong>${r.cpf || '067.440.731-84'}</strong> e no Nº REGISTRO <strong>${r.cnhRegistro || '07575025319'}</strong>, categoria <strong>“${cat}”</strong>, concluiu com aproveitamento o <strong>Curso Especializado para Condutores de Veículos de Transporte de Emergência</strong>, ministrado pela IET - Forte Caxias, no período de <strong>${r.periodo || '08 a 16 de junho de 2026'}</strong>, com carga horária de <strong>${r.cargaHoraria || '50h/a'}</strong>, com validade de cinco anos após o término do curso, conforme Resolução Nº 1.020/2025 do CONTRAN.
    </div>
    <div style="position:absolute;left:0;right:0;top:510px;text-align:center;font-size:18px;font-weight:bold">Brasília-DF, ${r.dataEmissao || '18 de junho de 2026'}</div>
    <div style="position:absolute;left:90px;bottom:55px;width:260px;text-align:center;font:12px Arial,sans-serif;border-top:1px solid #000;padding-top:4px"><strong>Carlos Henrique Ferreira De Mello</strong><br/>Diretor Geral<br/>981.050.007-68</div>
    <div style="position:absolute;right:70px;bottom:60px;text-align:right;font:700 11px Arial,sans-serif">CNPJ Nº 21.744.847/0001-50<br/>BASE ADMINISTRATIVA DO QUARTEL-GENERAL DO EXÉRCITO</div>
  </div>`;
};

export const buildCertificateVersoHtml = (r: Recipient, settings: OfficialCertificateSettings): string => {
  const disciplines = r.disciplinas || settings.defaultDisciplines || [];
  const rows = disciplines.map(d => `<tr><td>${d.name}</td><td>${d.cargaHoraria}</td><td>${d.avaliacao}</td><td>${d.instrutor}</td></tr>`).join('');
  return `<div style="width:1000px;height:707px;background:#fff;color:#000;box-sizing:border-box;padding:45px 60px;position:relative;font-family:Arial,sans-serif">
    <div style="position:absolute;inset:16px;border:2px solid #000"></div>
    ${logo('/sgex-logo.jpg','left')}${logo('/badm-qgex-logo.jpg','right')}
    <h1 style="text-align:center;font-size:25px;margin:25px 120px 5px">BASE ADMINISTRATIVA DO QUARTEL-GENERAL DO EXÉRCITO<br/>“FORTE CAXIAS”</h1>
    <div style="text-align:center;font-weight:900;margin:35px 0 15px">CONTEÚDO PROGRAMÁTICO <span style="float:right">${fullCode(r)}</span></div>
    <table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr><th>DISCIPLINA</th><th>CARGA HORÁRIA</th><th>AVALIAÇÃO</th><th>INSTRUTOR</th></tr></thead><tbody>${rows}</tbody></table>
    <style>th,td{border:2px solid #000;padding:12px;text-align:center}th{background:#e2e8f0}</style>
  </div>`;
};

const makeContainer = () => {
  const el = document.createElement('div');
  Object.assign(el.style, { position:'fixed', left:'0', top:'0', width:'1000px', height:'707px', zIndex:'-9999', pointerEvents:'none', opacity:'1' });
  document.body.appendChild(el);
  return el;
};

const capture = async (container: HTMLElement, html: string) => {
  container.innerHTML = html;
  await waitForAssets(container);
  return html2canvas(container, { scale: 2, useCORS: true, allowTaint: false, logging: false, backgroundColor: '#ffffff', width:1000, height:707, windowWidth:1200, windowHeight:900 });
};

export const exportElementToPdf = async (elementId: string, fileName='certificado.pdf'): Promise<void> => {
  const el = document.getElementById(elementId);
  if (!el) throw new Error('Elemento do certificado não encontrado.');
  await waitForAssets(el);
  const canvas = await html2canvas(el,{scale:2,useCORS:true,backgroundColor:'#fff'});
  const pdf = new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
  pdf.addImage(canvas.toDataURL('image/jpeg',0.95),'JPEG',0,0,297,210);
  pdf.save(fileName);
};

export const generate2PagePdfBlobForRecipient = async (r: Recipient, settings: OfficialCertificateSettings): Promise<Blob> => {
  const container = makeContainer();
  try {
    const pdf = new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
    const front = await capture(container, buildCertificateFrontHtml(r,settings));
    pdf.addImage(front.toDataURL('image/jpeg',0.95),'JPEG',0,0,297,210);
    pdf.addPage('a4','landscape');
    const back = await capture(container, buildCertificateVersoHtml(r,settings));
    pdf.addImage(back.toDataURL('image/jpeg',0.95),'JPEG',0,0,297,210);
    return pdf.output('blob');
  } finally { container.remove(); }
};

export const generateBatchZip = async (recipients: Recipient[], settings: OfficialCertificateSettings, onProgress?: BatchProgressCallback): Promise<void> => {
  const zip = new JSZip();
  const folder = zip.folder('certificados')!;
  for (let i=0;i<recipients.length;i++) {
    const r=recipients[i]; onProgress?.(i+1,recipients.length,`Gerando ${i+1} de ${recipients.length}`);
    const blob=await generate2PagePdfBlobForRecipient(r,settings);
    folder.file(`certificado_${(r.certNumber||String(i+1)).replace(/\//g,'-')}_${(r.name||'aluno').replace(/[^a-zA-Z0-9]+/g,'_')}.pdf`,blob);
  }
  saveAs(await zip.generateAsync({type:'blob'}),'certificados.zip');
};

export const generateCombinedMultiPagePdf = async (recipients: Recipient[], settings: OfficialCertificateSettings, onProgress?: BatchProgressCallback): Promise<void> => {
  const pdf = new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
  const container=makeContainer();
  try {
    for(let i=0;i<recipients.length;i++) {
      const r=recipients[i]; onProgress?.(i+1,recipients.length,`Gerando ${i+1} de ${recipients.length}`);
      if(i>0) pdf.addPage('a4','landscape');
      const front=await capture(container,buildCertificateFrontHtml(r,settings));
      pdf.addImage(front.toDataURL('image/jpeg',0.93),'JPEG',0,0,297,210);
      pdf.addPage('a4','landscape');
      const back=await capture(container,buildCertificateVersoHtml(r,settings));
      pdf.addImage(back.toDataURL('image/jpeg',0.93),'JPEG',0,0,297,210);
    }
    pdf.save('todos_certificados.pdf');
  } finally { container.remove(); }
};
