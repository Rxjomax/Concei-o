export type ProcedureCategory =
  | 'todos'
  | 'planos-corporais'
  | 'facial'
  | 'depilacao-cera'
  | 'pos-operatorio';

export interface ProcedureItem {
  id: string;
  number: string;
  title: string;
  category: Exclude<ProcedureCategory, 'todos'>;
  categoryLabel: string;
  duration: string;
  priceLabel: string;
  sessionsSummary: string;
  description: string;
  highlights: string[];
  image: string;
  whatsappText: string;
  sheermeUrl?: string;
  featured?: boolean;
}

export interface WaxingServiceItem {
  id: string;
  sheermeId: string;
  name: string;
  duration: string;
  price: string;
  description: string;
  whatsappText: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  procedureContext: string;
  datePublished: string;
  rating: number;
  quote: string;
  outcomeHighlight: string;
  googleReviewUrl: string;
}

export interface DifferentialItem {
  id: string;
  index: string;
  title: string;
  description: string;
  detail: string;
}

export interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  category: string;
  likes: string;
}

export const WHATSAPP_BASE_URL = 'https://wa.me/5581985350230';
export const DEFAULT_WHATSAPP_LINK =
  'https://wa.me/5581985350230?text=Ol%C3%A1%20vim%20pelo%20site%20e%20quero%20saber%20mais!';
export const INSTAGRAM_URL = 'https://www.instagram.com/espacoconceicaoferraz/';
export const INSTAGRAM_EMBED_URL = 'https://www.instagram.com/espacoconceicaoferraz/embed';
export const SHEERME_BASE_URL = 'https://sheerme.com/h/espaco-conceicao-ferraz-58890';
export const GOOGLE_MAPS_DIRECTIONS_URL =
  'https://www.google.com/maps/search/?api=1&query=R.+Landelino+C%C3%A2mara,+244+-+Ipsep,+Recife+-+PE,+51350-070';

export function buildWhatsAppLink(customMessage: string): string {
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(customMessage)}`;
}

// Fotos 100% REAIS da Clínica e da Especialista Conceição Ferraz (extraídas do acervo oficial da clínica)
export const REAL_PHOTOS = {
  conceicaoPortraitStudio: '/images/real/clinic_1.jpg',
  clinicRoom1: '/images/real/clinic_2.jpg',
  clinicRoom2: '/images/real/clinic_3.jpg',
  skinGlowResult: '/images/real/clinic_4.jpg',
  ledMaskFacial: '/images/real/clinic_5.jpg',
  conceicaoLabCoatClose: '/images/real/clinic_6.jpg',
  conceicaoLabCoatFull: '/images/real/clinic_7.jpg',
  conceicaoBodyEquipment: '/images/real/clinic_8.jpg',
  conceicaoClinicalMask: '/images/real/clinic_9.jpg',
  officialLogo: '/images/real/clinic_10.jpg',
  beforeAfterSkinCleaning: '/assets/aistudio/image_9220e315.png',
};

export const HERO_IMAGE = REAL_PHOTOS.conceicaoLabCoatFull;
export const FACIAL_IMAGE = REAL_PHOTOS.ledMaskFacial;
export const BODY_IMAGE = REAL_PHOTOS.conceicaoBodyEquipment;
export const WELLNESS_IMAGE = REAL_PHOTOS.clinicRoom2;
export const INTERIOR_IMAGE = REAL_PHOTOS.clinicRoom1;

export const PROCEDURES: ProcedureItem[] = [
  {
    id: 'plano-essencial-1x',
    number: '01',
    title: 'Plano Essencial | 1x na Semana (Drenagem ou Modeladora)',
    category: 'planos-corporais',
    categoryLabel: 'Tratamentos Corporais · Pacote Mensal',
    duration: '60 min / sessão',
    priceLabel: 'A partir de R$ 300 / mês',
    sessionsSummary: 'Pacote com 4 sessões por mês',
    description:
      'Pacote com 4 sessões mensais (1 vez por semana) podendo escolher entre drenagem linfática ou massagem modeladora, ideal para manutenção contínua e redução de retenção líquida.',
    highlights: [
      '4 sessões de 60 minutos por mês (1x por semana)',
      'Escolha livre entre Drenagem Linfática ou Massagem Modeladora',
      'Redução de inchaço, melhora da circulação e contorno corporal',
    ],
    image: REAL_PHOTOS.clinicRoom2,
    whatsappText:
      'Olá! Vim pelo site e quero agendar o Plano Essencial | 1x na semana (4 sessões/mês - R$ 300).',
    sheermeUrl: 'https://sheerme.com/h/espaco-conceicao-ferraz-58890?services=185527',
    featured: true,
  },
  {
    id: 'plano-bem-estar-2x',
    number: '02',
    title: 'Plano Bem-Estar | 2x na Semana (Drenagem ou Modeladora)',
    category: 'planos-corporais',
    categoryLabel: 'Tratamentos Corporais · Pacote Mensal',
    duration: '60 min / sessão',
    priceLabel: 'A partir de R$ 520 / mês',
    sessionsSummary: 'Pacote com 8 sessões por mês',
    description:
      'Pacote com 8 sessões por mês (2 vezes na semana) podendo escolher entre drenagem linfática ou massagem modeladora para acelerar resultados no contorno corporal e bem-estar.',
    highlights: [
      '8 sessões de 60 minutos por mês (2x por semana)',
      'Alternância estratégica entre Drenagem Linfática e Modeladora',
      'Excelente custo-benefício para tratamento de celulite e medidas',
    ],
    image: REAL_PHOTOS.conceicaoBodyEquipment,
    whatsappText:
      'Olá! Vim pelo site e quero agendar o Plano Bem-Estar | 2x na semana (8 sessões/mês - R$ 520).',
    sheermeUrl: 'https://sheerme.com/h/espaco-conceicao-ferraz-58890?services=185528',
    featured: true,
  },
  {
    id: 'plano-vip-3x',
    number: '03',
    title: 'Plano VIP | 3x na Semana com Protocolo Personalizado',
    category: 'planos-corporais',
    categoryLabel: 'Tratamentos Corporais · Pacote VIP',
    duration: '60 min / sessão',
    priceLabel: 'A partir de R$ 690 / mês',
    sessionsSummary: 'Pacote com 12 sessões por mês',
    description:
      'Nosso plano mais completo: pacote com 12 sessões mensais (3 vezes na semana) combinando drenagem linfática e massagem modeladora com protocolo 100% personalizado para o seu objetivo.',
    highlights: [
      '12 sessões de 60 minutos por mês (3x por semana)',
      'Protocolo personalizado para gordura localizada, celulite e flacidez',
      'Acompanhamento intensivo com resultados visíveis mais rápidos',
    ],
    image: REAL_PHOTOS.clinicRoom1,
    whatsappText:
      'Olá! Vim pelo site e quero agendar o Plano VIP | 3x na semana (12 sessões/mês - R$ 690).',
    sheermeUrl: 'https://sheerme.com/h/espaco-conceicao-ferraz-58890?services=185529',
    featured: true,
  },
  {
    id: 'limpeza-pele-microagulhamento',
    number: '04',
    title: 'Limpeza de Pele Profunda, Fototerapia LED & Microagulhamento',
    category: 'facial',
    categoryLabel: 'Estética Facial',
    duration: '60 min',
    priceLabel: 'Sob avaliação personalizada',
    sessionsSummary: 'Renovação celular, controle de oleosidade e viço',
    description:
      'Higienização clínica atraumática associada a máscara de LED fototerápica, peelings, hidratação profunda e microagulhamento para renovação da textura, clareamento e estímulo de colágeno.',
    highlights: [
      'Extração delicada com máscara de LED e ativos calmantes',
      'Indução de colágeno para poros dilatados e cicatrizes de acne',
      'Viço e luminosidade imediatos visíveis já na 1ª sessão',
    ],
    image: REAL_PHOTOS.ledMaskFacial,
    whatsappText:
      'Olá! Vim pelo site e gostaria de saber mais sobre Limpeza de Pele Profunda, Fototerapia LED e Microagulhamento.',
  },
  {
    id: 'botox-preenchimento-rejuvenescimento',
    number: '05',
    title: 'Toxina Botulínica (Botox), Preenchimento Labial & Rejuvenescimento',
    category: 'facial',
    categoryLabel: 'Estética Facial Avançada',
    duration: '45 a 60 min',
    priceLabel: 'Sob avaliação personalizada',
    sessionsSummary: 'Realce natural dos traços com mão leve e precisão',
    description:
      'Procedimentos faciais avançados realizados com técnica apurada para suavizar linhas de expressão, realçar o volume labial com naturalidade e devolver o viço da pele.',
    highlights: [
      'Aplicação precisa e delicada, minimizando desconfortos e marcas',
      'Resultados elegantes que preservam a sua expressão natural',
      'Avaliação facial detalhada e acompanhamento pós-procedimento',
    ],
    image: REAL_PHOTOS.skinGlowResult,
    whatsappText:
      'Olá! Vim pelo site e quero agendar uma avaliação para Botox, Preenchimento Labial ou Rejuvenescimento Facial.',
  },
  {
    id: 'depilacao-cera-completa',
    number: '06',
    title: 'Depilação a Cera Quente ou Morna (Feminina)',
    category: 'depilacao-cera',
    categoryLabel: 'Depilação a Cera',
    duration: '30 min',
    priceLabel: 'De R$ 30 a R$ 90',
    sessionsSummary: 'Remoção delicada pela raiz com biossegurança total',
    description:
      'Procedimento realizado com cera quente ou morna de alta qualidade aplicada na direção do crescimento dos pelos para remoção eficaz pela raiz, deixando a pele macia e cuidada.',
    highlights: [
      'Meia Perna (R$ 30) · Coxa (R$ 30) · Virilha (R$ 35)',
      'Glúteo (R$ 50) · Virilha Completa (R$ 60) · Perna Inteira (R$ 60)',
      'Combo Especial: Perna + Virilha Completa por R$ 90',
    ],
    image: REAL_PHOTOS.conceicaoClinicalMask,
    whatsappText:
      'Olá! Vim pelo site e gostaria de agendar um horário para Depilação a Cera.',
    sheermeUrl: 'https://sheerme.com/h/espaco-conceicao-ferraz-58890?services=185520',
  },
  {
    id: 'pos-operatorio-massagem-relaxante',
    number: '07',
    title: 'Drenagem de Pós-Operatório & Massagem Relaxante',
    category: 'pos-operatorio',
    categoryLabel: 'Bem-estar & Pós-Operatório',
    duration: '60 min',
    priceLabel: 'Protocolo individualizado',
    sessionsSummary: 'Recuperação cirúrgica segura e alívio de tensões',
    description:
      'Cuidado técnico especializado para pós-operatório de cirurgias plásticas (prevenção de fibroses e edemas) e sessões de massagem relaxante para alívio de estresse e dores musculares.',
    highlights: [
      'Manobras suaves e seguras para cada etapa da cicatrização',
      'Sala térrea 100% acessível para pacientes recém-operadas',
      'Ambiente climatizado, silencioso e acolhedor no Ipsep',
    ],
    image: REAL_PHOTOS.conceicaoPortraitStudio,
    whatsappText:
      'Olá! Vim pelo site e gostaria de saber mais sobre Pós-Operatório e Massagem Relaxante.',
  },
];

export const WAXING_SERVICES: WaxingServiceItem[] = [
  {
    id: 'meia-perna',
    sheermeId: '185523',
    name: 'Meia Perna - Depilação a Cera',
    duration: '30 min',
    price: 'R$ 30',
    description: 'Remoção pela raiz com cera morna/quente e finalização calmante.',
    whatsappText: 'Olá! Quero agendar Meia Perna - Depilação a Cera (R$ 30).',
  },
  {
    id: 'coxa',
    sheermeId: '185525',
    name: 'Coxa - Depilação a Cera',
    duration: '30 min',
    price: 'R$ 30',
    description: 'Aplicação delicada na região da coxa com cera descartável.',
    whatsappText: 'Olá! Quero agendar Coxa - Depilação a Cera (R$ 30).',
  },
  {
    id: 'virilha-simples',
    sheermeId: '185520',
    name: 'Virilha - Depilação a Cera',
    duration: '30 min',
    price: 'R$ 35',
    description: 'Procedimento rápido, higiênico e cuidadoso para a região da virilha.',
    whatsappText: 'Olá! Quero agendar Virilha - Depilação a Cera (R$ 35).',
  },
  {
    id: 'gluteo',
    sheermeId: '185522',
    name: 'Glúteo - Depilação a Cera',
    duration: '30 min',
    price: 'R$ 50',
    description: 'Cera quente ou morna para pele lisa, macia e sem irritação.',
    whatsappText: 'Olá! Quero agendar Glúteo - Depilação a Cera (R$ 50).',
  },
  {
    id: 'virilha-completa',
    sheermeId: '185521',
    name: 'Virilha Completa - Depilação a Cera',
    duration: '30 min',
    price: 'R$ 60',
    description: 'Cuidado completo com técnica precisa para máximo conforto.',
    whatsappText: 'Olá! Quero agendar Virilha Completa - Depilação a Cera (R$ 60).',
  },
  {
    id: 'perna-inteira',
    sheermeId: '185524',
    name: 'Perna Inteira - Depilação a Cera',
    duration: '30 min',
    price: 'R$ 60',
    description: 'Depilação completa de perna inteira com toque sedoso duradouro.',
    whatsappText: 'Olá! Quero agendar Perna Inteira - Depilação a Cera (R$ 60).',
  },
  {
    id: 'perna-mais-virilha-completa',
    sheermeId: '185526',
    name: 'Perna + Virilha Completa - Depilação a Cera',
    duration: '30 min',
    price: 'R$ 90',
    description: 'Combo prático unindo Perna Inteira + Virilha Completa na mesma sessão.',
    whatsappText:
      'Olá! Quero agendar o combo Perna + Virilha Completa - Depilação a Cera (R$ 90).',
  },
];

export const DIFFERENTIALS: DifferentialItem[] = [
  {
    id: 'atendimento-humanizado',
    index: '01',
    title: 'Atendimento Humanizado com Hora Marcada',
    description:
      'Cada sessão é conduzida pela Conceição Ferraz sem pressa, com escuta ativa, mão leve e protocolos desenhados exclusivamente para a biologia da sua pele.',
    detail: 'Pontualidade rigorosa · Avaliação individualizada',
  },
  {
    id: 'acessibilidade-total',
    index: '02',
    title: 'Espaço 100% Acessível & Espaço para Lactantes',
    description:
      'Estrutura planejada com acessibilidade completa para cadeirantes e mobilidade reduzida, além de ambiente reservado e acolhedor para mães lactantes e amamentação.',
    detail: 'Acesso sem degraus · Acolhimento materno',
  },
  {
    id: 'liderado-por-mulheres',
    index: '03',
    title: 'Climatizado, Cheiroso e Liderado por Mulheres',
    description:
      'Um espaço pensado por mulheres para que você se sinta segura, confortável e verdadeiramente cuidada desde a recepção até o pós-procedimento.',
    detail: 'Cantinho do café · Biossegurança rigorosa',
  },
  {
    id: 'estacionamento-facil',
    index: '04',
    title: 'Estacionamento Fácil e Gratuito na Rua',
    description:
      'Localização privilegiada e tranquila na Rua Landelino Câmara, 244, no coração do Ipsep, com estacionamento fácil e gratuito em frente ao espaço.',
    detail: 'Ipsep, Recife · Chegada tranquila sem estresse',
  },
];

// AVALIAÇÕES 100% REAIS E LITERAIS EXTRAÍDAS DO GOOGLE MAPS DA CLÍNICA (com link direto "Ver no Google")
export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'google-1',
    author: 'Júlia Montenegro',
    procedureContext: 'Massagem & Cuidado Estético',
    datePublished: '25/09/2025',
    rating: 5,
    quote:
      'Conceição é maravilhosa, profissional, cuida das suas clientes como ninguém. Ela se preocupa com seu bem estar e sua saúde. Ela estuda bastante e divide os conhecimentos. Fora que a mão dela é incrível, não deixa roxo, não arranha. A massagem dela é melhor do que de muitas “pessoas” que criam métodos de massagem e usam charlatanismo pra lucrar em cima. Conceição é, sem dúvida, uma excelente profissional e tem o melhor custo benefício do mundo.',
    outcomeHighlight: 'Mão leve que não deixa roxo e melhor custo-benefício',
    googleReviewUrl:
      'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUN2ckp1SDZBRRAB!2m1!1s0x0:0xf15c5a1547f1b3fb!3m1!1s2@1:CIHM0ogKEICAgICvrJuH6AE%7C%7C?hl=pt-BR',
  },
  {
    id: 'google-2',
    author: 'Mariana Rodrigues',
    procedureContext: 'Limpeza de Pele Profunda',
    datePublished: '04/05/2025',
    rating: 5,
    quote:
      'Quero agradecer pelo atendimento incrível e pela limpeza de pele impecável! Além de cuidar da minha pele com carinho, me senti super bem acolhida. Com certeza voltarei mais vezes!',
    outcomeHighlight: 'Limpeza de pele impecável e atendimento acolhedor',
    googleReviewUrl:
      'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnTUNZb2MyaFd3EAE!2m1!1s0x0:0xf15c5a1547f1b3fb!3m1!1s2@1:CIHM0ogKEICAgMCYoc2hWw%7C%7C?hl=pt-BR',
  },
  {
    id: 'google-3',
    author: 'Ana Paula Albuquerque',
    procedureContext: 'Cliente Fiel há 5 anos',
    datePublished: '30/06/2024',
    rating: 5,
    quote:
      'Conheci o espaço pelo Google e foi a melhor escolha que fiz na minha vida, já são 5 anos que estou sob os cuidados de Conceição que além de uma excelente profissional se tornou minha amiga. Super recomendo, vcs não vão se arrepender!! Nota 1000000000000',
    outcomeHighlight: '5 anos de resultados consistentes e confiança total',
    googleReviewUrl:
      'https://www.google.com/maps/search/?api=1&query=R.+Landelino+C%C3%A2mara,+244+-+Ipsep,+Recife+-+PE,+51350-070',
  },
  {
    id: 'google-4',
    author: 'Aline Meneses',
    procedureContext: 'Cliente há 3 anos · Estética Facial e Corporal',
    datePublished: '01/09/2023',
    rating: 5,
    quote:
      'Também encontrei o Espaço Conceição Ferraz através do Google há 3 anos. Naquele momento estava procurando uma clínica estética nas proximidades da minha residência para fugir do trânsito. Tive a sorte e surpresa de encontrar uma profissional tão dedicada, amiga e sempre disposta a ajustar seu tempo à realidade de seus clientes. Já seu espaço é harmonioso, limpo e climatizado. Pra mim, Conceição se destaca num mercado que normalmente não proporciona custo-benefício, profissionalismo e estrutura. Sucesso!',
    outcomeHighlight: 'Espaço harmonioso, limpo, climatizado e flexível',
    googleReviewUrl:
      'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSURwNzVlOXF3RRAB!2m1!1s0x0:0xf15c5a1547f1b3fb!3m1!1s2@1:CIHM0ogKEICAgIDp75e9qwE%7C%7C?hl=pt-BR',
  },
  {
    id: 'google-5',
    author: 'Vivi De Magalhães',
    procedureContext: 'Depilação a Cera',
    datePublished: '07/03/2022',
    rating: 5,
    quote:
      'Confesso que cheguei com um pouco de medo pois há algum tempo eu estava escrava da Gillette. Mas com todo jeitinho da super hiper mega top profissional, Conceição, que foi me tranquilizando e me deixando bem à vontade, sem contar que o espaço é uma gracinha, tudo de muito bom gosto, muito limpinho, super confortável e agradável. Resumindo: saí de lá "lisinha" e com certeza voltarei na Conceição, porque para gilete nunca mais!',
    outcomeHighlight: 'Depilação delicada, espaço impecável e zero medo',
    googleReviewUrl:
      'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNXNi1iV2NREAE!2m1!1s0x0:0xf15c5a1547f1b3fb!3m1!1s2@1:CIHM0ogKEICAgICW6-bWcQ%7C%7C?hl=pt-BR',
  },
  {
    id: 'google-6',
    author: 'Lucia Helena Ribeiro De Paula',
    procedureContext: 'Drenagem Linfática & Tratamento Corporal',
    datePublished: '20/08/2021',
    rating: 5,
    quote:
      'O efeito em meu corpo com o tratamento de Conceição Ferraz foi muito além da estética. De fato reduzi medidas, minha pele adquiriu tonicidade, fortaleceu a musculatura dos glúteos... Mas os benefícios foram maiores: melhorou a circulação sanguínea, houve redução de líquidos e gases, melhorou o refluxo e atividade intestinal. Pois essa esteticista é atualizada, competente, espontânea, bem humorada e inteligente.',
    outcomeHighlight: 'Redução de medidas, tonicidade e melhora da circulação',
    googleReviewUrl:
      'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSURhMXFDNTVRRRAB!2m1!1s0x0:0xf15c5a1547f1b3fb!3m1!1s2@1:CIHM0ogKEICAgIDa1qC55QE%7C%7C?hl=pt-BR',
  },
  {
    id: 'google-7',
    author: 'Deborah',
    procedureContext: 'Limpeza de Pele Profunda',
    datePublished: '28/12/2021',
    rating: 5,
    quote:
      'Melhor limpeza de pele que já fiz. Logo na primeira vez, fez uma grande diferença na minha pele, na segunda nem se fala. Vale cada centavo e o preço é justo. Fora o carisma e cuidado da profissional Conceição, pessoa super educada e simpática. Experiência maravilhosa!!!',
    outcomeHighlight: 'Diferença visível na pele desde a 1ª sessão',
    googleReviewUrl:
      'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNtenJQRlJ3EAE!2m1!1s0x0:0xf15c5a1547f1b3fb!3m1!1s2@1:CIHM0ogKEICAgICmzrPFRw%7C%7C?hl=pt-BR',
  },
  {
    id: 'google-8',
    author: 'Marília Leão',
    procedureContext: 'Massoterapia & Estética Corporal',
    datePublished: '04/09/2023',
    rating: 5,
    quote:
      'Profissional excelente, com uma personalidade cativante e que passa muita confiança no que faz. Tem propriedade no que fala, possui anos de experiência e demonstra muita paixão pelo seu trabalho. Estou com ela há meses e não abro mão, pois cada sessão de massagem é uma terapia pra mim. Eu super indico!',
    outcomeHighlight: 'Anos de experiência e confiança em cada sessão',
    googleReviewUrl:
      'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNaeEtEWlZ3EAE!2m1!1s0x0:0xf15c5a1547f1b3fb!3m1!1s2@1:CIHM0ogKEICAgICZxKDZVw%7C%7C?hl=pt-BR',
  },
  {
    id: 'google-9',
    author: 'Natalia Lima',
    procedureContext: 'Autoestima & Autocuidado',
    datePublished: '20/11/2020',
    rating: 5,
    quote:
      'Bom, eu sou muito tímida, conheci Ceça através da minha irmã, amei... ela deixa a pessoa bem à vontade, respeitosa e alegre. Depois de ter conhecido Ceça, foi como ter encontrado minha autoestima de volta, descobri o quanto é bom investir em você mesma, muito obrigada Ceça, uso e indico. Você é show!',
    outcomeHighlight: 'Acolhimento respeitoso para clientes tímidas',
    googleReviewUrl:
      'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNpXy0zSzNRRRAB!2m1!1s0x0:0xf15c5a1547f1b3fb!3m1!1s2@1:CIHM0ogKEICAgICi_-3K3QE%7C%7C?hl=pt-BR',
  },
];

export const INSTAGRAM_FEED: InstagramPost[] = [
  {
    id: 'ig-1',
    image: REAL_PHOTOS.beforeAfterSkinCleaning,
    category: 'Antes e Depois · Limpeza de Pele',
    caption:
      'Resultado real logo na primeira sessão de Limpeza de Pele Profunda: remoção cuidadosa de cravos e impurezas acumuladas sem agredir a pele.',
    likes: 'Post real @espacoconceicaoferraz',
  },
  {
    id: 'ig-2',
    image: REAL_PHOTOS.conceicaoPortraitStudio,
    category: 'Conceição Ferraz',
    caption:
      'Especialista em estética facial e corporal no coração do Ipsep. Cuidado individualizado para realçar sua beleza natural.',
    likes: 'Foto real do acervo',
  },
  {
    id: 'ig-3',
    image: REAL_PHOTOS.clinicRoom2,
    category: 'Nosso Espaço no Ipsep',
    caption:
      'Sala de atendimento climatizada, aconchegante, equipada com tecnologia estética e preparada para receber você com hora marcada.',
    likes: 'Foto real do espaço',
  },
  {
    id: 'ig-4',
    image: REAL_PHOTOS.conceicaoBodyEquipment,
    category: 'Estética Corporal & Planos',
    caption:
      'Protocolos corporais personalizados, endermoterapia, drenagem linfática e massagem modeladora em pacotes de 4, 8 ou 12 sessões.',
    likes: 'Foto real do acervo',
  },
  {
    id: 'ig-5',
    image: REAL_PHOTOS.ledMaskFacial,
    category: 'Fototerapia LED & Facial',
    caption:
      'Limpeza de pele profunda, fototerapia com máscara de LED, microagulhamento e rejuvenescimento facial.',
    likes: 'Foto real de procedimento',
  },
  {
    id: 'ig-6',
    image: REAL_PHOTOS.skinGlowResult,
    category: 'Resultado Pele Viçosa',
    caption:
      'Pele renovada, hidratada e com brilho natural logo após o protocolo facial personalizado no Espaço Conceição Ferraz.',
    likes: 'Resultado real',
  },
  {
    id: 'ig-7',
    image: REAL_PHOTOS.clinicRoom1,
    category: 'Conforto & Biossegurança',
    caption:
      'Ambiente planejado nos mínimos detalhes na Rua Landelino Câmara, 244 - Ipsep, Recife.',
    likes: 'Foto real do espaço',
  },
  {
    id: 'ig-8',
    image: REAL_PHOTOS.conceicaoLabCoatFull,
    category: 'Excelência Profissional',
    caption:
      'Formação acadêmica e atualização constante para entregar resultados seguros e reais para sua autoestima.',
    likes: 'Foto real do acervo',
  },
];
