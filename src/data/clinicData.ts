export type ProcedureCategory =
  | 'todos'
  | 'facial'
  | 'planos-corporais'
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
  instagramHighlight?: string;
  featured?: boolean;
}

export interface WaxingServiceItem {
  id: string;
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
export const GOOGLE_MAPS_DIRECTIONS_URL =
  'https://www.google.com/maps/search/?api=1&query=R.+Landelino+C%C3%A2mara,+244+-+Ipsep,+Recife+-+PE,+51350-070';

export function buildWhatsAppLink(customMessage: string): string {
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(customMessage)}`;
}

// Fotos 100% REAIS da Clínica e da Especialista Conceição Ferraz (extraídas do acervo oficial e Instagram)
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

// Os 3 Protocolos Mais Pedidos no Instagram @espacoconceicaoferraz
export const INSTAGRAM_FEATURED_SERVICES: ProcedureItem[] = [
  {
    id: 'destaque-limpeza-pele',
    number: '01',
    title: 'Limpeza de Pele Profunda & Fototerapia LED',
    category: 'facial',
    categoryLabel: 'Destaque no Instagram · Estética Facial',
    duration: '60 min / sessão',
    priceLabel: 'Resultado na 1ª Sessão',
    sessionsSummary: 'Extração cuidadosa + Máscara de LED',
    description:
      'Nosso protocolo facial queridinho no Instagram: remoção profunda de cravos e impurezas acumuladas sem agredir a pele, associada a máscara fototerápica de LED e ativos calmantes.',
    highlights: [
      'Extração minuciosa e delicada logo na primeira sessão',
      'Fototerapia LED para ação anti-inflamatória e regeneradora',
      'Pele limpa, macia, uniforme e com viço imediato',
    ],
    image: REAL_PHOTOS.beforeAfterSkinCleaning,
    whatsappText:
      'Olá, Conceição! Vi os resultados de Antes e Depois da Limpeza de Pele e quero agendar minha sessão!',
    instagramHighlight: 'Ver Antes e Depois no @espacoconceicaoferraz',
    featured: true,
  },
  {
    id: 'destaque-corporal-personalizado',
    number: '02',
    title: 'Drenagem Linfática & Massagem Modeladora',
    category: 'planos-corporais',
    categoryLabel: 'Mais Procurado · Estética Corporal',
    duration: '60 min / sessão',
    priceLabel: 'Sessão avulsa ou Planos 1x, 2x e 3x/sem',
    sessionsSummary: 'Redução de medidas, inchaço e celulite',
    description:
      'Protocolos corporais manuais e associados a equipamentos (endermoterapia) com mão leve que não deixa roxo, focados em desinchar, melhorar a circulação e remodelar o contorno corporal.',
    highlights: [
      'Planos mensais flexíveis (4, 8 ou 12 sessões) ou sessão individual',
      'Combinação estratégica de Drenagem Linfática e Modeladora',
      'Tratamento para retenção líquida, gordura localizada, celulite e flacidez',
    ],
    image: REAL_PHOTOS.conceicaoBodyEquipment,
    whatsappText:
      'Olá, Conceição! Vim pelo site e quero saber mais sobre os protocolos e planos de Drenagem Linfática e Massagem Modeladora.',
    instagramHighlight: 'Acompanhar rotina corporal no Instagram',
    featured: true,
  },
  {
    id: 'destaque-rejuvenescimento-facial',
    number: '03',
    title: 'Botox, Preenchimento Labial & Microagulhamento',
    category: 'facial',
    categoryLabel: 'Estética Facial Avançada',
    duration: '45 a 60 min',
    priceLabel: 'Avaliação Facial Individualizada',
    sessionsSummary: 'Rejuvenescimento, colágeno e harmonia natural',
    description:
      'Procedimentos faciais avançados para suavizar linhas de expressão, realçar o contorno e volume labial com naturalidade e estimular colágeno para textura firme e luminosa.',
    highlights: [
      'Aplicação precisa e mão leve, preservando sua expressão natural',
      'Microagulhamento e peelings para manchas, poros e linhas finas',
      'Acompanhamento completo antes e após cada procedimento',
    ],
    image: REAL_PHOTOS.skinGlowResult,
    whatsappText:
      'Olá, Conceição! Vim pelo site e quero agendar uma avaliação para Estética Facial Avançada (Botox / Preenchimento / Microagulhamento).',
    instagramHighlight: 'Ver dicas de cuidados faciais no Instagram',
    featured: true,
  },
];

export const PROCEDURES: ProcedureItem[] = [
  {
    id: 'limpeza-pele-led',
    number: '01',
    title: 'Limpeza de Pele Profunda & Fototerapia LED',
    category: 'facial',
    categoryLabel: 'Estética Facial',
    duration: '60 min',
    priceLabel: 'Resultado visível na 1ª sessão',
    sessionsSummary: 'Extração profunda + LED + Hidratação calmante',
    description:
      'Higienização clínica detalhada para remoção de cravos, miliuns e impurezas acumuladas, finalizada com máscara de LED fototerápica e ativos calmantes que devolvem o viço imediato.',
    highlights: [
      'Extração cuidadosa sem machucar ou marcar a pele',
      'Controle da oleosidade e desobstrução profunda dos poros',
      'Alta frequência e máscara de LED para cicatrização e brilho',
    ],
    image: REAL_PHOTOS.ledMaskFacial,
    whatsappText:
      'Olá, Conceição! Vim pelo site e gostaria de agendar uma Limpeza de Pele Profunda com Fototerapia LED.',
    instagramHighlight: 'Ver resultados no Instagram',
  },
  {
    id: 'botox-preenchimento-rejuvenescimento',
    number: '02',
    title: 'Toxina Botulínica (Botox) & Preenchimento Labial',
    category: 'facial',
    categoryLabel: 'Estética Facial Avançada',
    duration: '45 a 60 min',
    priceLabel: 'Sob avaliação personalizada',
    sessionsSummary: 'Realce natural dos traços com mão leve e precisão',
    description:
      'Procedimentos injetáveis e de harmonização realizados com técnica apurada para prevenir e suavizar rugas dinâmicas, hidratar e dar volume delicado aos lábios.',
    highlights: [
      'Aplicação precisa e delicada, minimizando desconfortos',
      'Resultados elegantes que respeitam a anatomia do seu rosto',
      'Avaliação facial detalhada e retorno de acompanhamento',
    ],
    image: REAL_PHOTOS.skinGlowResult,
    whatsappText:
      'Olá, Conceição! Vim pelo site e quero agendar uma avaliação para Botox ou Preenchimento Labial.',
    instagramHighlight: 'Conhecer mais no Instagram',
  },
  {
    id: 'peeling-microagulhamento-hidratacao',
    number: '03',
    title: 'Microagulhamento, Peeling & Hidratação Facial',
    category: 'facial',
    categoryLabel: 'Renovação & Colágeno',
    duration: '60 min',
    priceLabel: 'Protocolo personalizado',
    sessionsSummary: 'Clareamento, textura uniforme e estímulo de colágeno',
    description:
      'Associação de microagulhamento com drug delivery de ativos, peelings renovadores e hidratação profunda para tratar manchas, melasma, cicatrizes de acne e linhas finas.',
    highlights: [
      'Indução de colágeno para poros dilatados e firmeza da pele',
      'Peeling seguro e adaptado ao fototipo da sua pele',
      'Nutrição celular intensa para peles desvitalizadas',
    ],
    image: REAL_PHOTOS.beforeAfterSkinCleaning,
    whatsappText:
      'Olá, Conceição! Vim pelo site e quero saber mais sobre Microagulhamento, Peeling e Hidratação Facial.',
    instagramHighlight: 'Ver conteúdos no Instagram',
  },
  {
    id: 'drenagem-modeladora-planos',
    number: '04',
    title: 'Drenagem Linfática & Massagem Modeladora (1x, 2x ou 3x/sem)',
    category: 'planos-corporais',
    categoryLabel: 'Estética Corporal · Planos Mensais',
    duration: '60 min / sessão',
    priceLabel: 'Planos de 4, 8 ou 12 sessões',
    sessionsSummary: 'Redução de retenção líquida e remodelagem corporal',
    description:
      'Sessões avulsas ou pacotes mensais (Essencial 1x/sem, Bem-Estar 2x/sem ou VIP 3x/sem) combinando drenagem linfática e massagem modeladora manual com técnica que não deixa hematomas.',
    highlights: [
      'Alívio imediato de inchaço, pernas cansadas e retenção de líquidos',
      'Melhora da circulação sanguínea, funcionamento intestinal e contorno',
      'Opção de pacotes mensais com valores especiais pelo WhatsApp',
    ],
    image: REAL_PHOTOS.conceicaoBodyEquipment,
    whatsappText:
      'Olá, Conceição! Vim pelo site e quero conhecer os valores das sessões e planos mensais de Drenagem Linfática e Massagem Modeladora.',
    instagramHighlight: 'Ver rotina no Instagram',
  },
  {
    id: 'gordura-celulite-flacidez',
    number: '05',
    title: 'Tratamento para Gordura Localizada, Celulite & Flacidez',
    category: 'planos-corporais',
    categoryLabel: 'Estética Corporal Avançada',
    duration: '60 min',
    priceLabel: 'Protocolo sob avaliação',
    sessionsSummary: 'Endermoterapia, ativos lipolíticos e firmeza',
    description:
      'Protocolos corporais direcionados para remodelar abdômen, flancos, culote e glúteos, unindo recursos tecnológicos, endermoterapia, termoterapia e dermocosméticos de alta performance.',
    highlights: [
      'Ação direta sobre nódulos de celulite e aspecto casca de laranja',
      'Melhora da tonicidade da pele e fortalecimento do contorno corporal',
      'Plano de tratamento desenhado após avaliação física individual',
    ],
    image: REAL_PHOTOS.clinicRoom2,
    whatsappText:
      'Olá, Conceição! Vim pelo site e quero agendar uma avaliação corporal para Gordura Localizada, Celulite e Flacidez.',
    instagramHighlight: 'Ver protocolos no Instagram',
  },
  {
    id: 'depilacao-cera-completa',
    number: '06',
    title: 'Depilação a Cera Quente ou Morna (Feminina)',
    category: 'depilacao-cera',
    categoryLabel: 'Depilação a Cera',
    duration: '30 min',
    priceLabel: 'De R$ 30 a R$ 90',
    sessionsSummary: 'Remoção delicada pela raiz com 100% de biossegurança',
    description:
      'Procedimento realizado com cera quente ou morna de alta qualidade e totalmente descartável, proporcionando pele lisinha, macia e livre da irritação da lâmina.',
    highlights: [
      'Meia Perna (R$ 30) · Coxa (R$ 30) · Virilha Simples (R$ 35)',
      'Glúteo (R$ 50) · Virilha Completa (R$ 60) · Perna Inteira (R$ 60)',
      'Combo Especial: Perna + Virilha Completa por R$ 90',
    ],
    image: REAL_PHOTOS.conceicaoClinicalMask,
    whatsappText:
      'Olá, Conceição! Vim pelo site e gostaria de agendar um horário para Depilação a Cera.',
    instagramHighlight: 'Agendar pelo WhatsApp',
  },
  {
    id: 'pos-operatorio-massagem-relaxante',
    number: '07',
    title: 'Drenagem de Pós-Operatório & Massagem Relaxante',
    category: 'pos-operatorio',
    categoryLabel: 'Bem-estar & Pós-Operatório',
    duration: '60 min',
    priceLabel: 'Atendimento especializado',
    sessionsSummary: 'Recuperação cirúrgica segura e alívio de tensões',
    description:
      'Cuidado técnico especializado para pós-operatório de cirurgias plásticas (prevenção de fibroses, seromas e edemas) e sessões de massagem relaxante para alívio de estresse e dores musculares.',
    highlights: [
      'Manobras suaves e seguras para cada etapa da cicatrização',
      'Sala térrea 100% acessível para pacientes recém-operadas',
      'Ambiente climatizado, silencioso e acolhedor no Ipsep',
    ],
    image: REAL_PHOTOS.conceicaoPortraitStudio,
    whatsappText:
      'Olá, Conceição! Vim pelo site e gostaria de saber mais sobre Pós-Operatório e Massagem Relaxante.',
    instagramHighlight: 'Tirar dúvidas no WhatsApp',
  },
];

export const WAXING_SERVICES: WaxingServiceItem[] = [
  {
    id: 'meia-perna',
    name: 'Meia Perna - Depilação a Cera',
    duration: '30 min',
    price: 'R$ 30',
    description: 'Remoção pela raiz com cera morna/quente e finalização calmante.',
    whatsappText: 'Olá! Quero agendar Meia Perna - Depilação a Cera (R$ 30).',
  },
  {
    id: 'coxa',
    name: 'Coxa - Depilação a Cera',
    duration: '30 min',
    price: 'R$ 30',
    description: 'Aplicação delicada na região da coxa com cera descartável.',
    whatsappText: 'Olá! Quero agendar Coxa - Depilação a Cera (R$ 30).',
  },
  {
    id: 'virilha-simples',
    name: 'Virilha - Depilação a Cera',
    duration: '30 min',
    price: 'R$ 35',
    description: 'Procedimento rápido, higiênico e cuidadoso para a região da virilha.',
    whatsappText: 'Olá! Quero agendar Virilha - Depilação a Cera (R$ 35).',
  },
  {
    id: 'gluteo',
    name: 'Glúteo - Depilação a Cera',
    duration: '30 min',
    price: 'R$ 50',
    description: 'Cera quente ou morna para pele lisa, macia e sem irritação.',
    whatsappText: 'Olá! Quero agendar Glúteo - Depilação a Cera (R$ 50).',
  },
  {
    id: 'virilha-completa',
    name: 'Virilha Completa - Depilação a Cera',
    duration: '30 min',
    price: 'R$ 60',
    description: 'Cuidado completo com técnica precisa para máximo conforto.',
    whatsappText: 'Olá! Quero agendar Virilha Completa - Depilação a Cera (R$ 60).',
  },
  {
    id: 'perna-inteira',
    name: 'Perna Inteira - Depilação a Cera',
    duration: '30 min',
    price: 'R$ 60',
    description: 'Depilação completa de perna inteira com toque sedoso duradouro.',
    whatsappText: 'Olá! Quero agendar Perna Inteira - Depilação a Cera (R$ 60).',
  },
  {
    id: 'perna-mais-virilha-completa',
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
