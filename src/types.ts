export interface Discipline {
  id: string;
  name: string;
  cargaHoraria: string;
  avaliacao: string;
  instrutor: string;
}

export interface Recipient {
  id: string;
  certNumber: string; // Ex: "006"
  year: string; // Ex: "2026"
  name: string; // Ex: "CARLOS HENRIQUE CAETANO DA SILVA"
  cpf: string; // Ex: "067.440.731-84"
  cnhRegistro: string; // Ex: "07575025319"
  cnhCategoria: string; // Ex: "“AD”"
  periodo: string; // Ex: "08 a 16 de junho de 2026"
  cargaHoraria: string; // Ex: "50h/a"
  dataEmissao: string; // Ex: "18 de junho de 2026"
  localEmissao?: string; // Ex: "Brasília-DF"
  customCodePrefix?: string; // Ex: "CVTE"
  disciplinas?: Discipline[];
}

export interface OfficialCertificateSettings {
  certCodePrefix: string; // "CVTE" -> "006/CVTE/2026"
  title: string; // "CERTIFICADO"
  subtitle: string; // "Condutores de Veículos de\nTransporte de Emergência"
  institutionClause: string; // "A Instituição de Ensino de Trânsito da Base Administrativa do Quartel-General do Exército – Forte Caxias – (Instrução Nº 592, de 10 de agosto de 2020/Detran-DF) certifica que"
  courseName: string; // "Curso Especializado para Condutores de Veículos de Transporte de Emergência"
  legalResolution: string; // "com validade de cinco anos após o término do curso, conforme Resolução Nº 1.020/2025 do CONTRAN."
  location: string; // "Brasília-DF"
  directorName: string; // "Carlos Henrique Ferreira De Mello"
  directorRole: string; // "Diretor Geral"
  directorCpf: string; // "981.050.007-68"
  cnpj: string; // "CNPJ Nº 21.744.847/0001-50"
  companyName: string; // "BASE ADMINISTRATIVA DO QUARTEL-GENERAL DO EXÉRCITO"
  sgexLogoUrl?: string; // SGEx emblem image URL
  badmLogoUrl?: string; // B ADM QGEX emblem image URL
  defaultDisciplines: Discipline[];
  showWatermark: boolean;
  showSignature: boolean;
  highlightEditableFields: boolean;
}

