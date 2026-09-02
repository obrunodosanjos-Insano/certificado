import { Discipline, OfficialCertificateSettings, Recipient } from '../types';

export const DEFAULT_DISCIPLINES: Discipline[] = [
  {
    id: 'disc-1',
    name: 'Legislação de Trânsito',
    cargaHoraria: '10h/a',
    avaliacao: '10',
    instrutor: 'PAULO DE JESUS CAMARGO',
  },
  {
    id: 'disc-2',
    name: 'Direção Defensiva',
    cargaHoraria: '15h/a',
    avaliacao: '9,0',
    instrutor: 'ERIK ANDRE RODRIGUES SANTIAGO',
  },
  {
    id: 'disc-3',
    name: 'Primeiros Socorros e Atendimento Inicial',
    cargaHoraria: '15h/a',
    avaliacao: '10',
    instrutor: 'FELIPE VILELA DA COSTA',
  },
  {
    id: 'disc-4',
    name: 'Comportamento e Convívio Social',
    cargaHoraria: '10h/a',
    avaliacao: '10',
    instrutor: 'ERIK ANDRE RODRIGUES SANTIAGO',
  },
];

export const DEFAULT_SETTINGS: OfficialCertificateSettings = {
  certCodePrefix: 'CVTE',
  title: 'CERTIFICADO',
  subtitle: 'Condutores de Veículos de\nTransporte de Emergência',
  institutionClause: 'A Instituição de Ensino de Trânsito da Base Administrativa do Quartel-General do Exército – Forte Caxias – (Instrução Nº 592, de 10 de agosto de 2020/Detran-DF) certifica que',
  courseName: 'Curso Especializado para Condutores de Veículos de Transporte de Emergência',
  legalResolution: 'com validade de cinco anos após o término do curso, conforme Resolução Nº 1.020/2025 do CONTRAN.',
  location: 'Brasília-DF',
  directorName: 'Carlos Henrique Ferreira De Mello',
  directorRole: 'Diretor Geral',
  directorCpf: '981.050.007-68',
  cnpj: 'CNPJ Nº 21.744.847/0001-50',
  companyName: 'BASE ADMINISTRATIVA DO QUARTEL-GENERAL DO EXÉRCITO',
  sgexLogoUrl: '/sgex-logo.jpg',
  badmLogoUrl: '/badm-qgex-logo.jpg',
  defaultDisciplines: DEFAULT_DISCIPLINES,
  showWatermark: true,
  showSignature: true,
  highlightEditableFields: false,
};

export const DEFAULT_INITIAL_RECIPIENT: Recipient = {
  id: 'rec-1',
  certNumber: '006/CVTE/2026',
  year: '2026',
  name: '',
  cpf: '',
  cnhRegistro: '',
  cnhCategoria: '',
  periodo: '',
  cargaHoraria: '',
  dataEmissao: '',
};

export const DEFAULT_SAMPLE_15_RECIPIENTS: Recipient[] = [DEFAULT_INITIAL_RECIPIENT];


