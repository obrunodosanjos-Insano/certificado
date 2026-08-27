import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { OfficialCertificateSettings, Recipient } from '../types';
import { OfficialCertificateCard } from '../components/OfficialCertificateCard';
import { OfficialCertificateVerso } from '../components/OfficialCertificateVerso';

export interface BatchProgressCallback {
  (current: number, total: number, statusText: string): void;
}

const waitForImages = async (container: HTMLElement): Promise<void> => {
  const images = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve, reject) => {
          if (img.complete) {
            if (img.naturalWidth > 0) resolve();
            else reject(new Error(`Não foi possível carregar a imagem: ${img.src}`));
            return;
          }
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => reject(new Error(`Não foi possível carregar a imagem: ${img.src}`)), { once: true });
        })
    )
  );
};

const waitForFonts = async (): Promise<void> => {
  if ('fonts' in document) await document.fonts.ready;
};

const nextPaint = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

interface RenderedCertificate {
  host: HTMLDivElement;
  root: Root;
  element: HTMLElement;
}

const renderCertificate = async (
  side: 'front' | 'back',
  recipient: Recipient,
  settings: OfficialCertificateSettings,
  digitalSignature?: string | null
): Promise<RenderedCertificate> => {
  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.left = '-12000px';
  host.style.top = '0';
  host.style.background = '#fff';
  host.style.pointerEvents = 'none';
  host.style.zIndex = '-9999';
  document.body.appendChild(host);

  const root = createRoot(host);
  const id = `pdf-certificate-${side}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  if (side === 'front') {
    root.render(
      React.createElement(OfficialCertificateCard, {
        id,
        recipient,
        settings,
        scale: 1,
        digitalSignature: digitalSignature || null,
      })
    );
  } else {
    root.render(
      React.createElement(OfficialCertificateVerso, {
        id,
        recipient,
        settings,
        scale: 1,
      })
    );
  }

  await nextPaint();
  await waitForFonts();
  await waitForImages(host);
  await nextPaint();

  const element = host.querySelector(`#${id}`) as HTMLElement | null;
  if (!element) {
    root.unmount();
    host.remove();
    throw new Error('Não foi possível montar o certificado para gerar o PDF.');
  }

  return { host, root, element };
};

const cleanupRendered = ({ host, root }: RenderedCertificate) => {
  root.unmount();
  host.remove();
};

const elementToJpeg = async (element: HTMLElement, scale = 2.2): Promise<string> => {
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: false,
    logging: false,
    backgroundColor: '#ffffff',
    imageTimeout: 15000,
    removeContainer: true,
  });
  return canvas.toDataURL('image/jpeg', 0.96);
};

const normalizeCode = (recipient: Recipient): string => {
  const raw = (recipient.certNumber || '006/CVTE/2026').trim();
  return raw.includes('/') ? raw : `${raw.padStart(3, '0')}/CVTE/2026`;
};

const safeFilePart = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

export const exportElementToPdf = async (
  elementId: string,
  fileName = 'certificado.pdf'
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Elemento do certificado não encontrado no documento.');

  await waitForFonts();
  await waitForImages(element);
  const image = await elementToJpeg(element, 2.3);

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  pdf.addImage(image, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
  saveAs(pdf.output('blob'), fileName);
};

export const generate2PagePdfBlobForRecipient = async (
  recipient: Recipient,
  settings: OfficialCertificateSettings,
  digitalSignature?: string | null
): Promise<Blob> => {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  let front: RenderedCertificate | null = null;
  let back: RenderedCertificate | null = null;

  try {
    front = await renderCertificate('front', recipient, settings, digitalSignature);
    const frontImage = await elementToJpeg(front.element, 2.3);
    pdf.addImage(frontImage, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
    cleanupRendered(front);
    front = null;

    back = await renderCertificate('back', recipient, settings);
    const backImage = await elementToJpeg(back.element, 2.1);
    pdf.addPage('a4', 'landscape');
    pdf.addImage(backImage, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');

    return pdf.output('blob');
  } finally {
    if (front) cleanupRendered(front);
    if (back) cleanupRendered(back);
  }
};

export const generateBatchZip = async (
  recipients: Recipient[],
  settings: OfficialCertificateSettings,
  onProgress?: BatchProgressCallback
): Promise<void> => {
  if (!recipients.length) throw new Error('Não há certificados para gerar.');

  const zip = new JSZip();
  const folder = zip.folder('certificados') || zip;

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    onProgress?.(i + 1, recipients.length, `Gerando ${i + 1} de ${recipients.length}: ${recipient.name}`);
    const blob = await generate2PagePdfBlobForRecipient(recipient, settings);
    const code = safeFilePart(normalizeCode(recipient));
    const name = safeFilePart(recipient.name || `participante_${i + 1}`);
    folder.file(`certificado_${code}_${name}.pdf`, blob);
  }

  onProgress?.(recipients.length, recipients.length, 'Compactando certificados...');
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `certificados_${new Date().toISOString().slice(0, 10)}.zip`);
};

export const generateCombinedMultiPagePdf = async (
  recipients: Recipient[],
  settings: OfficialCertificateSettings,
  onProgress?: BatchProgressCallback
): Promise<void> => {
  if (!recipients.length) throw new Error('Não há certificados para gerar.');

  const combined = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  let pageCount = 0;

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    onProgress?.(i + 1, recipients.length, `Processando certificado ${i + 1} de ${recipients.length}...`);

    let front: RenderedCertificate | null = null;
    let back: RenderedCertificate | null = null;
    try {
      front = await renderCertificate('front', recipient, settings);
      const frontImage = await elementToJpeg(front.element, 2.0);
      if (pageCount > 0) combined.addPage('a4', 'landscape');
      combined.addImage(frontImage, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
      pageCount++;
      cleanupRendered(front);
      front = null;

      back = await renderCertificate('back', recipient, settings);
      const backImage = await elementToJpeg(back.element, 1.9);
      combined.addPage('a4', 'landscape');
      combined.addImage(backImage, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
      pageCount++;
    } finally {
      if (front) cleanupRendered(front);
      if (back) cleanupRendered(back);
    }
  }

  onProgress?.(recipients.length, recipients.length, 'PDF pronto para download.');
  saveAs(combined.output('blob'), `todos_certificados_${new Date().toISOString().slice(0, 10)}.pdf`);
};
