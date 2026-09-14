export const normalizeTurmaCode = (value: string): string => {
  const clean = (value || '').trim();
  if (!clean) return '006/CVTE/2026';
  // If user typed only a number (e.g. "6", "7", "006", "007")
  if (/^\d+$/.test(clean)) {
    return `${clean.padStart(3, '0')}/CVTE/2026`;
  }
  return clean.toUpperCase();
};
