/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
} from 'motion/react';
import {
  Star,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Instagram,
  ArrowUpRight,
  Check,
  CreditCard,
  Accessibility,
  HeartHandshake,
  Car,
  MessageCircle,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Eye,
} from 'lucide-react';
import {
  INSTAGRAM_FEATURED_SERVICES,
  PROCEDURES,
  WAXING_SERVICES,
  DIFFERENTIALS,
  TESTIMONIALS,
  INSTAGRAM_FEED,
  REAL_PHOTOS,
  HERO_IMAGE,
  DEFAULT_WHATSAPP_LINK,
  INSTAGRAM_URL,
  INSTAGRAM_EMBED_URL,
  GOOGLE_MAPS_DIRECTIONS_URL,
  buildWhatsAppLink,
  type ProcedureCategory,
  type ProcedureItem,
} from './data/clinicData';
import AestheticAiSuite from './components/AestheticAiSuite';

const revealUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const staggerParent = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.11,
    },
  },
};

const MARQUEE_ITEMS = [
  '★ 4.9 de 5 Estrelas no Google (77+ Avaliações)',
  'Limpeza de Pele Profunda & Fototerapia LED',
  'Drenagem Linfática & Massagem Modeladora',
  'Toxina Botulínica (Botox) & Preenchimento Labial',
  'Microagulhamento, Peeling & Rejuvenescimento',
  'Depilação a Cera Quente ou Morna',
  'Pós-Operatório Seguro no Coração do Ipsep',
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState<ProcedureCategory>('todos');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; caption: string } | null>(
    null
  );
  const [showLiveInstagramEmbed, setShowLiveInstagramEmbed] = useState(false);

  // Interactive Waxing Multi-Select Simulator
  const [selectedWaxIds, setSelectedWaxIds] = useState<string[]>(['meia-perna', 'virilha-simples']);

  // Interactive Google Reviews Carousel & View All State
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Interactive Assessment Builder State
  const [goalArea, setGoalArea] = useState<
    | 'Limpeza de Pele Profunda & Fototerapia LED'
    | 'Estética Corporal (Drenagem / Modeladora / Planos)'
    | 'Estética Facial Avançada (Botox / Labial / Microagulhamento)'
    | 'Depilação a Cera'
    | 'Pós-Operatório & Massagem Relaxante'
  >('Limpeza de Pele Profunda & Fototerapia LED');
  const [preferredPeriod, setPreferredPeriod] = useState<
    'Manhã (08h–12h)' | 'Tarde (13h–19h)' | 'Sábado (08h–12h)'
  >('Manhã (08h–12h)');
  const [patientName, setPatientName] = useState('');

  // Top Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    restDelta: 0.001,
  });

  // 3D Interactive Tilt for Hero Portrait
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Auto-advance featured review carousel every 7 seconds
  useEffect(() => {
    if (showAllReviews) return;
    const timer = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [showAllReviews]);

  const toggleWaxService = (id: string) => {
    setSelectedWaxIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedWaxItems = WAXING_SERVICES.filter((w) => selectedWaxIds.includes(w.id));
  const totalWaxPrice = selectedWaxItems.reduce((acc, item) => {
    const numeric = Number(item.price.replace(/\D/g, '')) || 0;
    return acc + numeric;
  }, 0);

  const waxComboWhatsAppLink = buildWhatsAppLink(
    selectedWaxItems.length > 0
      ? `Olá, Conceição! Vim pelo site e quero agendar Depilação a Cera para: ${selectedWaxItems
          .map((i) => `${i.name.replace(' - Depilação a Cera', '')} (${i.price})`)
          .join(' + ')} — Total estimado: R$ ${totalWaxPrice}.`
      : 'Olá, Conceição! Vim pelo site e gostaria de agendar um horário para Depilação a Cera.'
  );

  const filteredProcedures =
    activeCategory === 'todos'
      ? PROCEDURES
      : PROCEDURES.filter((item) => item.category === activeCategory);

  const customAssessmentWhatsAppLink = buildWhatsAppLink(
    `Olá, Conceição! Me chamo ${
      patientName.trim() ? patientName.trim() : 'cliente do site'
    }. Vim pelo site e gostaria de agendar ${goalArea}, de preferência no turno da ${preferredPeriod}.`
  );

  const visibleCarouselReviews = [
    TESTIMONIALS[activeReviewIndex % TESTIMONIALS.length],
    TESTIMONIALS[(activeReviewIndex + 1) % TESTIMONIALS.length],
    TESTIMONIALS[(activeReviewIndex + 2) % TESTIMONIALS.length],
  ];

  return (
    <div className="min-h-screen bg-white text-[#0B161B] relative overflow-x-hidden">
      {/* Top Scroll Reading Progress Ribbon */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-metallic-teal origin-left z-50"
      />

      {/* Ambient Animated Cyan-Petrol Blur Spheres on Crisp White Canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      >
        <div className="animate-pulse-glow absolute -top-28 right-[-8%] w-[320px] sm:w-[540px] h-[320px] sm:h-[540px] rounded-full bg-gradient-to-br from-[#E2F1F6] via-[#56B0CA]/25 to-transparent blur-[90px] sm:blur-[110px]" />
        <div className="animate-pulse-glow absolute top-[42%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-gradient-to-tr from-[#E6F3F7]/80 via-[#24687E]/15 to-transparent blur-[90px] sm:blur-[120px]" />
      </div>

      {/* 1. FLOATING EDITORIAL GLASSMORPHISM HEADER (Mobile-First 3-Zone Top Bar Contract) */}
      <header className="fixed top-2.5 sm:top-3 left-0 right-0 z-40 px-2.5 sm:px-6 transition-all">
        <div className="max-w-[1280px] mx-auto h-14 sm:h-[72px] px-3.5 sm:px-8 rounded-full bg-[#091418]/95 backdrop-blur-xl border border-[#4CA4BE]/35 shadow-[0_18px_40px_-12px_rgba(9,20,24,0.45)] flex items-center justify-between gap-2 sm:gap-8 text-white">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#inicio"
            className="font-display text-[1.05rem] sm:text-2xl font-semibold tracking-wide text-white hover:text-[#66C0DA] transition-colors truncate lg:overflow-visible lg:whitespace-nowrap min-w-0"
          >
            Espaço Conceição Ferraz
          </a>

          {/* Zone 2: Single-Line Navigation Links (Desktop) */}
          <nav
            aria-label="Navegação Principal"
            className="hidden lg:flex items-center gap-8 text-xs sm:text-sm font-medium text-[#E4F1F5]/85"
          >
            <a
              href="#inicio"
              className="hover:text-white relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#56B0CA] hover:after:w-full after:transition-all whitespace-nowrap shrink-0"
            >
              Início
            </a>
            <a
              href="#procedimentos"
              className="hover:text-white relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#56B0CA] hover:after:w-full after:transition-all whitespace-nowrap shrink-0"
            >
              Procedimentos
            </a>
            <a
              href="#diferenciais"
              className="hover:text-white relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#56B0CA] hover:after:w-full after:transition-all whitespace-nowrap shrink-0"
            >
              Nosso Espaço
            </a>
            <a
              href="#avaliacoes"
              className="hover:text-white relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#56B0CA] hover:after:w-full after:transition-all whitespace-nowrap shrink-0"
            >
              Avaliações
            </a>
            <a
              href="#localizacao"
              className="hover:text-white relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#56B0CA] hover:after:w-full after:transition-all whitespace-nowrap shrink-0"
            >
              Localização
            </a>
          </nav>

          {/* Zone 3: 1 Primary CTA Button + Mobile Drawer Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <a
              href={DEFAULT_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-metallic-teal border border-[#66C0DA]/45 text-white text-xs sm:text-sm font-medium shadow-[0_8px_24px_-4px_rgba(76,164,190,0.55)] hover:scale-105 active:scale-95 transition-transform duration-200 whitespace-nowrap shrink-0"
            >
              <span className="sm:hidden">Agendar</span>
              <span className="hidden sm:inline">Agendar Avaliação</span>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/15 text-white hover:bg-white/10 active:scale-95 flex items-center justify-center transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Glass Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 mx-auto max-w-[1280px] rounded-3xl bg-[#091418]/98 backdrop-blur-2xl border border-[#4CA4BE]/35 p-5 text-white shadow-2xl"
            >
              <nav className="flex flex-col divide-y divide-white/10 text-base font-medium">
                <a
                  href="#inicio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 flex items-center justify-between hover:text-[#66C0DA] transition-colors"
                >
                  <span>Início</span>
                  <ChevronRight className="w-4 h-4 text-[#66C0DA]" />
                </a>
                <a
                  href="#procedimentos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 flex items-center justify-between hover:text-[#66C0DA] transition-colors"
                >
                  <span>Procedimentos & Depilação</span>
                  <ChevronRight className="w-4 h-4 text-[#66C0DA]" />
                </a>
                <a
                  href="#diferenciais"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 flex items-center justify-between hover:text-[#66C0DA] transition-colors"
                >
                  <span>Nosso Espaço & Resultados Reais</span>
                  <ChevronRight className="w-4 h-4 text-[#66C0DA]" />
                </a>
                <a
                  href="#avaliacoes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 flex items-center justify-between hover:text-[#66C0DA] transition-colors"
                >
                  <span>Avaliações Reais do Google (4.9 ★)</span>
                  <ChevronRight className="w-4 h-4 text-[#66C0DA]" />
                </a>
                <a
                  href="#localizacao"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 flex items-center justify-between hover:text-[#66C0DA] transition-colors"
                >
                  <span>Localização & Contato</span>
                  <ChevronRight className="w-4 h-4 text-[#66C0DA]" />
                </a>
              </nav>

              <div className="mt-4 pt-4 border-t border-white/15 flex flex-col gap-2.5">
                <a
                  href={DEFAULT_WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-shimmer w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-metallic-teal border border-[#66C0DA]/45 text-white text-sm font-semibold shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Agendar Avaliação pelo WhatsApp</span>
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 text-white/90 text-xs font-medium"
                >
                  <Instagram className="w-4 h-4 text-[#8CE0F5]" />
                  <span>/@espacoconceicaoferraz</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10">
        {/* 2. EDITORIAL HERO SECTION (Mobile-First Crisp Clinical White & Signature Metallic Petrol-Cyan Typography) */}
        <section
          id="inicio"
          className="relative pt-22 sm:pt-32 lg:pt-36 pb-10 sm:pb-24 px-3 sm:px-8 max-w-[1280px] mx-auto"
        >
          <div className="bg-gradient-to-br from-white via-[#F5FAFC] to-[#E8F3F7] text-[#0B161B] rounded-[1.75rem] sm:rounded-[3rem] p-5 sm:p-12 lg:p-16 border border-[#24687E]/20 shadow-[0_28px_65px_-20px_rgba(11,22,27,0.12)] relative overflow-hidden">
            {/* Subtle Radial Cyan-Petrol Glow inside Hero Canvas */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-32 right-10 w-[300px] sm:w-[480px] h-[300px] sm:h-[480px] rounded-full bg-[#4CA4BE]/18 blur-[100px] sm:blur-[120px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 left-1/4 w-[260px] sm:w-[380px] h-[260px] sm:h-[380px] rounded-full bg-[#1D5466]/12 blur-[90px] sm:blur-[100px]"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-10 items-center relative z-10">
              {/* Left Column: High-Impact Editorial Typography & Conversion */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerParent}
                className="lg:col-span-7 flex flex-col justify-center"
              >
                {/* Unboxed Authority Kicker */}
                <motion.div
                  variants={revealUp}
                  className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm font-medium text-[#34505B] mb-4 sm:mb-6"
                >
                  <span className="inline-flex items-center gap-1.5 text-[#1A5669] font-semibold">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#287086] text-[#287086] shrink-0" />
                    <span className="tabular-nums">4.9 de 5 estrelas no Google</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">77+ avaliações</span>
                  <span aria-hidden="true">·</span>
                  <span>Ipsep, Recife</span>
                </motion.div>

                {/* Display Headline with the Exact Instagram "Antes e depois" Italic Petrol-Cyan Gradient */}
                <motion.h1
                  variants={revealUp}
                  style={{ textWrap: 'balance' }}
                  className="font-display text-[2.1rem] sm:text-[3.5rem] lg:text-[4.05rem] leading-[1.06] sm:leading-[1.03] font-semibold text-[#0B161B] tracking-tight mb-4 sm:mb-6 max-w-2xl"
                >
                  Realce sua beleza natural com{' '}
                  <span className="italic font-normal text-metallic-teal">
                    excelência, cuidado
                  </span>{' '}
                  e tecnologia.
                </motion.h1>

                {/* Subheadline with Bold Key Highlights like her Instagram Posts */}
                <motion.p
                  variants={revealUp}
                  className="text-sm sm:text-lg text-[#34505B] leading-relaxed max-w-[58ch] mb-6 sm:mb-9"
                >
                  Protocolos estéticos faciais e corporais personalizados no coração do{' '}
                  <strong className="text-[#0B161B] font-semibold">Ipsep, Recife</strong>.{' '}
                  <strong className="text-[#0B161B] font-semibold">
                    Limpeza de pele profunda, drenagem linfática, massagem modeladora,
                    Botox
                  </strong>{' '}
                  e depilação a cera com resultados visíveis{' '}
                  <strong className="text-[#0B161B] font-semibold">
                    logo na primeira sessão!
                  </strong>
                </motion.p>

                {/* Primary & Secondary CTAs (Mobile Full-Width Stack, Desktop Row) */}
                <motion.div
                  variants={revealUp}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-12"
                >
                  <a
                    href={DEFAULT_WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shimmer inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-4 rounded-full bg-metallic-teal text-white text-sm sm:text-base font-medium border border-[#66C0DA]/45 shadow-[0_14px_34px_-6px_rgba(30,90,110,0.5)] hover:scale-105 active:scale-98 transition-transform duration-200 text-center"
                  >
                    <span>Quero Agendar Minha Avaliação</span>
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  </a>

                  <a
                    href="#procedimentos"
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full border border-[#0B161B]/20 text-[#0B161B] hover:border-[#24687E] hover:bg-[#E8F3F7] active:scale-98 text-sm sm:text-base font-medium transition-all duration-200 text-center"
                  >
                    <span>Conhecer Procedimentos</span>
                  </a>
                </motion.div>

                {/* 4 Editorial Proof Metrics Strip */}
                <motion.div
                  variants={revealUp}
                  className="pt-6 sm:pt-8 border-t border-[#0B161B]/10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
                >
                  <div>
                    <p className="font-display text-2xl sm:text-3xl font-semibold text-metallic-teal tabular-nums">
                      4.9 ★
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#425861] mt-0.5">
                      77+ avaliações Google
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-2xl sm:text-3xl font-semibold text-[#0B161B] tabular-nums">
                      1ª Sessão
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#425861] mt-0.5">
                      Resultados já visíveis
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-2xl sm:text-3xl font-semibold text-[#0B161B] tabular-nums">
                      100%
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#425861] mt-0.5">
                      Acessível & climatizado
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-2xl sm:text-3xl font-semibold text-[#0B161B]">
                      Ipsep
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#425861] mt-0.5">
                      Estacionamento gratuito
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column: Interactive 3D Tilt Arch Showcase with Rotating SVG Seal & Floating Glass Card */}
              <div
                onMouseMove={handleHeroMouseMove}
                onMouseLeave={handleHeroMouseLeave}
                className="lg:col-span-5 relative flex items-center justify-center perspective-[1200px]"
              >
                {/* Rotating Luxury Circular Stamp Badge (Visible on Mobile & Desktop) */}
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center absolute -top-3 right-2 sm:-top-6 sm:-left-6 sm:right-auto z-20 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#091418] border border-[#56B0CA]/50 shadow-xl"
                >
                  <svg
                    viewBox="0 0 100 100"
                    className="w-17 h-17 sm:w-24 sm:h-24 animate-spin-slow text-[#72C8E0]"
                  >
                    <path
                      id="circlePath"
                      fill="none"
                      d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                    />
                    <text className="text-[8.3px] uppercase tracking-[0.22em] fill-current font-medium">
                      <textPath href="#circlePath" startOffset="0%">
                        • ESPAÇO CONCEIÇÃO FERRAZ • IPSEP RECIFE
                      </textPath>
                    </text>
                  </svg>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#56B0CA] absolute" />
                </div>

                {/* 3D Tilt Portrait Frame */}
                <motion.div
                  style={{ rotateX, rotateY }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="relative w-full max-w-[430px]"
                >
                  {/* Cyan-Petrol Wireframe Arch Offset */}
                  <div
                    aria-hidden="true"
                    className="hidden sm:block absolute -inset-2.5 rounded-t-[220px] rounded-b-[36px] border border-[#287086]/45 translate-x-2 translate-y-2 pointer-events-none"
                  />

                  <div className="relative h-[380px] sm:h-[520px] rounded-t-[170px] sm:rounded-t-[220px] rounded-b-[26px] sm:rounded-b-[32px] overflow-hidden border border-[#287086]/35 bg-[#091418] shadow-2xl">
                    <img
                      src={HERO_IMAGE}
                      alt="Dra. Conceição Ferraz - Especialista em Estética Corporal e Facial"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top scale-[1.02] hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091418]/90 via-[#091418]/15 to-transparent" />

                    {/* Floating Signature Metallic Teal Pill Card inside Portrait */}
                    <div className="animate-float-gentle absolute bottom-3.5 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 bg-metallic-teal text-white border border-white/30 rounded-2xl p-3 sm:p-4 shadow-2xl">
                      <div className="flex items-center justify-between gap-2.5 sm:gap-3">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          <img
                            src={REAL_PHOTOS.officialLogo}
                            alt="Logo Oficial Conceição Ferraz"
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover object-center border-2 border-[#72C8E0] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-[10px] sm:text-[11px] font-semibold text-[#A5E2F2] truncate">
                              /@espacoconceicaoferraz · Hora Marcada
                            </p>
                            <p className="font-display text-base sm:text-lg font-semibold text-white truncate">
                              Conceição Ferraz — Estética Corporal e Facial
                            </p>
                          </div>
                        </div>

                        <a
                          href={DEFAULT_WHATSAPP_LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Agendar avaliação com Conceição Ferraz"
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#091418] hover:bg-[#A5E2F2] flex items-center justify-center shrink-0 transition-colors"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* INFINITE LUXURY MARQUEE RIBBON IN SIGNATURE METALLIC TEAL-BLACK */}
        <div className="py-3.5 sm:py-4 bg-metallic-teal border-y border-[#56B0CA]/35 overflow-hidden select-none">
          <div className="animate-marquee flex items-center gap-8 sm:gap-10 text-xs sm:text-sm font-medium text-white">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
              <div key={index} className="flex items-center gap-8 sm:gap-10 whitespace-nowrap">
                <span>{item}</span>
                <span className="text-[#9EE0F2]" aria-hidden="true">
                  ✦
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3A. DESTAQUES DO INSTAGRAM (@espacoconceicaoferraz) — OS 3 PROTOCOLOS MAIS PROCURADOS */}
        <section id="destaques" className="py-14 sm:py-20 lg:py-24 px-3.5 sm:px-8 max-w-[1280px] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={revealUp}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-9 sm:mb-12"
          >
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#1E5C70] mb-1.5 sm:mb-2">
                Destaques do Instagram /@espacoconceicaoferraz · Resultados Reais
              </p>
              <h2
                style={{ textWrap: 'balance' }}
                className="font-display text-[1.95rem] sm:text-4xl lg:text-[2.85rem] font-semibold text-[#0B161B] leading-tight"
              >
                Protocolos Mais Procurados pelas{' '}
                <span className="italic font-normal text-metallic-teal">
                  Nossas Clientes
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#425861] max-w-md">
              Cuidado facial e corporal personalizado com mão leve, tecnologia estética e
              acompanhamento próximo em cada etapa da sua evolução.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-7 items-stretch">
            {INSTAGRAM_FEATURED_SERVICES.map((service, idx) => {
              const isHighlighted = idx === 1;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  whileHover={{ y: -6 }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden flex flex-col justify-between relative transition-colors ${
                    isHighlighted
                      ? 'bg-metallic-teal-Diagnal text-white border-2 border-[#58B2CC] shadow-[0_24px_50px_-15px_rgba(12,26,32,0.45)]'
                      : 'bg-[#F2F7F9] text-[#0B161B] border border-[#0B161B]/10 hover:border-[#287086]'
                  }`}
                >
                  <div>
                    <div className="relative h-52 sm:h-56 overflow-hidden bg-[#091418]">
                      <img
                        src={service.image}
                        alt={service.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#091418]/90 via-[#091418]/20 to-transparent" />
                      <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between gap-2 text-xs text-white font-medium">
                        <span>{service.duration}</span>
                        <span className="text-[#8CE0F5] font-semibold">
                          {service.priceLabel}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 pb-4">
                      <div className="flex items-center justify-between gap-2 text-xs font-medium mb-3">
                        <span
                          className={
                            isHighlighted ? 'text-[#9EE0F2]' : 'text-[#1E5C70] font-semibold'
                          }
                        >
                          {service.categoryLabel}
                        </span>
                        {isHighlighted && (
                          <span className="text-[#9EE0F2] font-semibold shrink-0">
                            ★ Favorito
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-2xl sm:text-3xl font-semibold leading-snug mb-3">
                        {service.title}
                      </h3>

                      <p
                        className={`text-xs sm:text-sm leading-relaxed mb-5 ${
                          isHighlighted ? 'text-[#E4F1F5]/90' : 'text-[#425861]'
                        }`}
                      >
                        {service.description}
                      </p>

                      <ul className="space-y-2.5 mb-6">
                        {service.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                            <Check
                              className={`w-4 h-4 shrink-0 mt-0.5 ${
                                isHighlighted ? 'text-[#72C8E0]' : 'text-[#287086]'
                              }`}
                            />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-2.5">
                    <a
                      href={buildWhatsAppLink(service.whatsappText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn-shimmer w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-4 rounded-2xl text-sm font-medium transition-transform hover:scale-[1.02] active:scale-98 text-center ${
                        isHighlighted
                          ? 'bg-white text-[#091418] hover:bg-[#E4F1F5] shadow-lg font-semibold'
                          : 'bg-metallic-teal text-white border border-[#56B0CA]/40'
                      }`}
                    >
                      <span>Agendar pelo WhatsApp</span>
                      <ArrowUpRight className="w-4 h-4 shrink-0" />
                    </a>

                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
                        isHighlighted
                          ? 'text-[#E4F1F5]/85 hover:text-white'
                          : 'text-[#425861] hover:text-[#0B161B]'
                      }`}
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>{service.instagramHighlight || 'Ver no Instagram'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 3B. CATÁLOGO COMPLETO DE PROCEDIMENTOS + SIMULADOR INTERATIVO DE DEPILAÇÃO A CERA */}
        <section
          id="procedimentos"
          className="py-14 sm:py-20 lg:py-28 bg-[#F2F7F9] border-y border-[#0B161B]/[0.08]"
        >
          <div className="max-w-[1280px] mx-auto px-3.5 sm:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={revealUp}
              className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-8 mb-8 sm:mb-12"
            >
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#1E5C70] mb-1.5 sm:mb-2">
                  Estética Facial · Estética Corporal · Depilação a Cera · Pós-Operatório
                </p>
                <h2
                  style={{ textWrap: 'balance' }}
                  className="font-display text-[1.95rem] sm:text-4xl lg:text-[2.85rem] font-semibold text-[#0B161B] leading-tight"
                >
                  Nossos Tratamentos{' '}
                  <span className="italic font-normal text-metallic-teal">
                    Especializados
                  </span>
                </h2>
              </div>

              {/* Mobile-Friendly Horizontal Swipeable Filter Tabs */}
              <div
                role="tablist"
                aria-label="Filtrar procedimentos por categoria"
                className="flex items-center gap-1.5 p-1.5 bg-white border border-[#0B161B]/10 rounded-2xl overflow-x-auto no-scrollbar max-w-full w-full lg:w-auto shadow-xs"
              >
                {(
                  [
                    { id: 'todos', label: 'Todos' },
                    { id: 'facial', label: 'Estética Facial' },
                    { id: 'planos-corporais', label: 'Estética Corporal' },
                    { id: 'depilacao-cera', label: 'Depilação a Cera' },
                    { id: 'pos-operatorio', label: 'Pós-Operatório' },
                  ] as const
                ).map((tab) => {
                  const isActive = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`px-3.5 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-metallic-teal text-white shadow-xs'
                          : 'text-[#425861] hover:text-[#0B161B] hover:bg-[#F2F7F9]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Interactive Procedures Cards with Scroll Fade-In-Up & Staggered Delay */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
              <AnimatePresence mode="popLayout">
                {filteredProcedures.map((proc, index) => (
                  <motion.article
                    layout
                    key={proc.id}
                    initial={{ opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    exit={{ opacity: 0, scale: 0.95, y: 16 }}
                    whileHover={{ y: -6 }}
                    transition={{
                      duration: 0.6,
                      delay: (index % 3) * 0.11,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group bg-white rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden border border-[#0B161B]/10 hover:border-[#287086] shadow-[0_12px_32px_-16px_rgba(11,22,27,0.08)] hover:shadow-[0_22px_45px_-16px_rgba(40,112,134,0.28)] transition-colors duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-56 sm:h-64 overflow-hidden bg-[#091418]">
                        <img
                          src={proc.image}
                          alt={proc.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#091418]/90 via-[#091418]/15 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4 sm:bottom-3.5 sm:left-5 sm:right-5 flex items-center justify-between gap-2 text-[11px] sm:text-xs text-white font-medium">
                          <span className="truncate">{proc.sessionsSummary}</span>
                          <span className="tabular-nums font-semibold text-[#8CE0F5] shrink-0">
                            {proc.priceLabel}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 sm:p-7">
                        <div className="flex items-center gap-2 text-xs text-[#425861] mb-2">
                          <span className="font-semibold text-[#1E5C70] tabular-nums">
                            {proc.number}. {proc.categoryLabel}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{proc.duration}</span>
                        </div>

                        <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#0B161B] leading-snug mb-2.5 sm:mb-3 group-hover:text-[#1E5C70] transition-colors">
                          {proc.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#425861] leading-relaxed mb-4 sm:mb-5">
                          {proc.description}
                        </p>

                        <ul className="space-y-2 mb-5 sm:mb-6 border-t border-[#0B161B]/[0.08] pt-3.5 sm:pt-4">
                          {proc.highlights.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-[#0B161B]/90"
                            >
                              <Check className="w-4 h-4 text-[#287086] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="px-5 sm:px-7 pb-5 sm:pb-6 pt-1 flex items-center justify-between gap-2.5 sm:gap-3">
                      <a
                        href={buildWhatsAppLink(proc.whatsappText)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-shimmer flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-3.5 rounded-xl bg-metallic-teal text-white text-xs sm:text-sm font-medium hover:scale-[1.02] active:scale-98 transition-transform duration-200 whitespace-nowrap"
                      >
                        <span>Saiba mais no WhatsApp</span>
                        <ArrowUpRight className="w-4 h-4 shrink-0" />
                      </a>

                      <button
                        type="button"
                        onClick={() => setSelectedProcedure(proc)}
                        className="px-3.5 sm:px-4 py-3.5 rounded-xl border border-[#0B161B]/15 text-xs sm:text-sm font-medium text-[#0B161B] hover:border-[#287086] hover:bg-[#F2F7F9] active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Detalhes
                      </button>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            {/* INTERACTIVE WAXING CALCULATOR & MENU (Monte Sua Sessão de Depilação a Cera) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={revealUp}
              className="mt-12 sm:mt-16 bg-white border border-[#287086]/30 rounded-[1.75rem] sm:rounded-[2.25rem] p-5 sm:p-10 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-[#0B161B]/10">
                <div>
                  <p className="text-xs font-semibold text-[#1E5C70] mb-1.5">
                    Simulador Interativo · Cera Quente ou Morna 100% Descartável
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#0B161B]">
                    Monte Sua Sessão de{' '}
                    <span className="italic font-normal text-metallic-teal">
                      Depilação a Cera
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#425861] mt-1">
                    Toque nas regiões desejadas para calcular o valor na hora e enviar seu
                    agendamento pronto pelo WhatsApp.
                  </p>
                </div>

                <div className="w-full lg:w-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 bg-[#F2F7F9] p-4 sm:px-5 sm:py-3.5 rounded-2xl border border-[#287086]/25 shrink-0">
                  <div>
                    <p className="text-[11px] text-[#425861]">
                      {selectedWaxItems.length}{' '}
                      {selectedWaxItems.length === 1 ? 'área selecionada' : 'áreas selecionadas'}
                    </p>
                    <p className="font-display text-2xl sm:text-3xl font-semibold text-[#0B161B] tabular-nums">
                      Total: R$ {totalWaxPrice}
                    </p>
                  </div>
                  <a
                    href={waxComboWhatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shimmer inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-3 rounded-xl bg-metallic-teal text-white text-xs sm:text-sm font-medium transition-transform hover:scale-105 active:scale-98 whitespace-nowrap"
                  >
                    <span>Agendar Seleção no WhatsApp</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
                {WAXING_SERVICES.map((wax, idx) => {
                  const isSelected = selectedWaxIds.includes(wax.id);
                  return (
                    <motion.button
                      key={wax.id}
                      type="button"
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.12 }}
                      transition={{
                        duration: 0.5,
                        delay: idx * 0.06,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onClick={() => toggleWaxService(wax.id)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer active:scale-98 ${
                        isSelected
                          ? 'bg-metallic-teal text-white border-[#4CA4BE] shadow-md'
                          : 'bg-[#F2F7F9]/70 hover:bg-[#E4F1F5] text-[#0B161B] border-[#0B161B]/10 hover:border-[#287086]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 ${
                              isSelected
                                ? 'bg-white border-white text-[#091418]'
                                : 'border-[#425861]/40'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                          </span>
                          <p className="text-sm font-semibold truncate">
                            {wax.name.replace(' - Depilação a Cera', '')}
                          </p>
                        </div>
                        <p
                          className={`text-xs mt-1 pl-6.5 ${
                            isSelected ? 'text-white/80' : 'text-[#425861]'
                          }`}
                        >
                          Sessão de {wax.duration}
                        </p>
                      </div>

                      <span
                        className={`font-display text-xl font-semibold tabular-nums shrink-0 ${
                          isSelected ? 'text-[#A5E8FA]' : 'text-[#0B161B]'
                        }`}
                      >
                        {wax.price}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3C. CENTRAL DE INTELIGÊNCIA ESTÉTICA IA (Diagnóstico Multimodal, Chat 24h & Guia Pré/Pós-Sessão) */}
        <AestheticAiSuite />

        {/* 4. DIFERENCIAIS & GALERIA BENTO INTERATIVA DE ESTRUTURA E ANTES/DEPOIS REAL */}
        <section
          id="diferenciais"
          className="py-14 sm:py-20 lg:py-28 px-3.5 sm:px-8 max-w-[1280px] mx-auto"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={revealUp}
            className="max-w-2xl mb-10 sm:mb-14"
          >
            <p className="text-xs sm:text-sm font-semibold text-[#1E5C70] mb-1.5 sm:mb-2">
              Por que escolher o Espaço Conceição Ferraz?
            </p>
            <h2
              style={{ textWrap: 'balance' }}
              className="font-display text-[1.95rem] sm:text-4xl lg:text-[2.85rem] font-semibold text-[#0B161B] leading-tight mb-3 sm:mb-4"
            >
              Estrutura real, acolhedora e{' '}
              <span className="italic font-normal text-metallic-teal">
                resultados visíveis
              </span>{' '}
              no Ipsep.
            </h2>
            <p className="text-sm sm:text-base text-[#425861] leading-relaxed">
              Conheça por dentro nosso espaço na Rua Landelino Câmara, 244, veja resultados
              reais de limpeza de pele desde a 1ª sessão e descubra nossos diferenciais.
              Toque nas fotos para ampliar.
            </p>
          </motion.div>

          {/* 4 Pillars Row with Scroll Fade-In-Up & Staggered Delay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {DIFFERENTIALS.map((item, idx) => {
              const icons = [HeartHandshake, Accessibility, Sparkles, Car];
              const IconComponent = icons[idx % icons.length];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  whileHover={{ y: -6 }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="bg-[#F2F7F9] hover:bg-[#E6F1F5] border border-[#0B161B]/10 hover:border-[#287086] rounded-3xl p-5 sm:p-7 flex flex-col justify-between transition-colors duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                      <div className="w-11 h-11 rounded-2xl bg-metallic-teal flex items-center justify-center text-white shadow-sm">
                        <IconComponent className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <span className="font-display text-2xl font-semibold text-[#287086]/80 tabular-nums">
                        {item.index}
                      </span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#0B161B] leading-snug mb-2">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#425861] leading-relaxed mb-4 sm:mb-5">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-[#0B161B]/[0.08] text-[11px] font-semibold text-[#1E5C70]">
                    {item.detail}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Interactive 3-Card Bento Gallery: Real Before/After Skin Cleaning + Clinic Room + Body Equipment */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 0.995 }}
              onClick={() =>
                setLightboxImage({
                  src: REAL_PHOTOS.beforeAfterSkinCleaning,
                  caption:
                    'Antes e Depois Real — Limpeza de Pele Profunda logo na 1ª sessão no @espacoconceicaoferraz.',
                })
              }
              className="md:col-span-4 group relative h-72 sm:h-96 rounded-3xl overflow-hidden border border-[#287086]/25 bg-white text-left cursor-pointer shadow-sm"
            >
              <img
                src={REAL_PHOTOS.beforeAfterSkinCleaning}
                alt="Antes e Depois Limpeza de Pele - Espaço Conceição Ferraz"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091418]/90 via-[#091418]/20 to-transparent flex items-end justify-between p-5 sm:p-6 text-white">
                <div>
                  <p className="text-xs text-[#8CE0F5] font-medium mb-1">
                    Antes e Depois Real · 1ª Sessão
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-medium">
                    Limpeza de Pele Profunda com extração cuidadosa
                  </p>
                </div>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4" />
                </span>
              </div>
            </motion.button>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 0.995 }}
              onClick={() =>
                setLightboxImage({
                  src: REAL_PHOTOS.clinicRoom2,
                  caption:
                    'Sala de atendimento climatizada e equipada do Espaço Conceição Ferraz no Ipsep, Recife.',
                })
              }
              className="md:col-span-4 group relative h-72 sm:h-96 rounded-3xl overflow-hidden border border-[#0B161B]/12 text-left cursor-pointer shadow-sm"
            >
              <img
                src={REAL_PHOTOS.clinicRoom2}
                alt="Sala de atendimento real do Espaço Conceição Ferraz"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091418]/90 via-transparent to-transparent flex items-end justify-between p-5 sm:p-6 text-white">
                <div>
                  <p className="text-xs text-[#8CE0F5] font-medium mb-1">
                    Estrutura Real · Ambiente Climatizado
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-medium">
                    Consultório equipado com maca ergonômica e cantinho do café
                  </p>
                </div>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4" />
                </span>
              </div>
            </motion.button>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 0.995 }}
              onClick={() =>
                setLightboxImage({
                  src: REAL_PHOTOS.conceicaoBodyEquipment,
                  caption:
                    'Conceição Ferraz com equipamentos de estética corporal e remodelagem.',
                })
              }
              className="md:col-span-4 group relative h-72 sm:h-96 rounded-3xl overflow-hidden border border-[#0B161B]/12 text-left cursor-pointer shadow-sm"
            >
              <img
                src={REAL_PHOTOS.conceicaoBodyEquipment}
                alt="Conceição Ferraz com equipamentos corporais"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091418]/90 via-transparent to-transparent flex items-end justify-between p-5 sm:p-6 text-white">
                <div>
                  <p className="text-xs text-[#8CE0F5] font-medium mb-1">
                    Tecnologia Corporal & Manual
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-medium">
                    Protocolos de modeladora, drenagem e endermoterapia
                  </p>
                </div>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4" />
                </span>
              </div>
            </motion.button>
          </div>
        </section>

        {/* 5. PROVA SOCIAL INTERATIVA (Carrossel Dinâmico + Grade Expansível com as 9 Avaliações Reais do Google) */}
        <section
          id="avaliacoes"
          className="py-14 sm:py-20 lg:py-28 bg-metallic-teal-Diagnal text-white relative overflow-hidden"
        >
          <div className="max-w-[1280px] mx-auto px-3.5 sm:px-8 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={revealUp}
              className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-9 sm:mb-12 pb-6 sm:pb-8 border-b border-white/15"
            >
              <div>
                <p className="text-xs sm:text-sm font-medium text-[#8CE0F5] mb-1.5 sm:mb-2">
                  Excelência Comprovada · Depoimentos Reais do Google Maps
                </p>
                <h2
                  style={{ textWrap: 'balance' }}
                  className="font-display text-[1.95rem] sm:text-4xl lg:text-[2.75rem] font-semibold text-white leading-tight"
                >
                  O que nossas clientes dizem no Google
                </h2>
              </div>

              {/* Google Rating Summary & Carousel Controls */}
              <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 sm:gap-4 w-full lg:w-auto">
                <div className="flex items-center gap-3.5 sm:gap-4 bg-white/[0.07] border border-white/15 rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[#8CE0F5] justify-end mb-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#8CE0F5] text-[#8CE0F5]" />
                      ))}
                    </div>
                    <p className="text-[11px] text-white/80 tabular-nums">
                      77+ avaliações no Google
                    </p>
                  </div>
                  <div className="h-8 w-[1px] bg-white/15" />
                  <p className="font-display text-2xl sm:text-3xl font-semibold text-white tabular-nums leading-none">
                    4.9<span className="text-sm sm:text-base text-[#8CE0F5] font-normal">/5</span>
                  </p>
                </div>

                {!showAllReviews && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveReviewIndex(
                          (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
                        )
                      }
                      aria-label="Avaliação anterior"
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/25 hover:border-[#8CE0F5] active:scale-95 flex items-center justify-center text-white hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveReviewIndex((prev) => (prev + 1) % TESTIMONIALS.length)
                      }
                      aria-label="Próxima avaliação"
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/25 hover:border-[#8CE0F5] active:scale-95 flex items-center justify-center text-white hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Animated Reviews Cards (Carousel of 3 or Full 9 Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-7">
              <AnimatePresence mode="popLayout">
                {(showAllReviews ? TESTIMONIALS : visibleCarouselReviews).map((review) => (
                  <motion.article
                    layout
                    key={review.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-[#091418]/55 hover:bg-[#091418]/75 border border-white/15 hover:border-[#66C0DA] rounded-3xl p-5 sm:p-8 flex flex-col justify-between transition-colors duration-300 backdrop-blur-md"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4 sm:mb-5">
                        <div
                          className="flex items-center gap-1"
                          aria-label="5 de 5 estrelas"
                        >
                          {[...Array(review.rating)].map((_, idx) => (
                            <Star
                              key={idx}
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#8CE0F5] text-[#8CE0F5]"
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/75 tabular-nums">
                          <span>{review.datePublished}</span>
                          <span aria-hidden="true">·</span>
                          <a
                            href={review.googleReviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8CE0F5] hover:underline inline-flex items-center gap-0.5 font-medium"
                          >
                            <span>Ver no Google</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      <blockquote className="text-sm sm:text-base text-white/95 leading-relaxed mb-5 sm:mb-6">
                        “{review.quote}”
                      </blockquote>
                    </div>

                    <div className="pt-4 sm:pt-5 border-t border-white/12">
                      <p className="text-xs font-medium text-[#8CE0F5] mb-1.5 sm:mb-2">
                        Destaque: {review.outcomeHighlight}
                      </p>
                      <div className="flex items-center justify-between gap-2 text-xs text-white/80">
                        <span className="font-semibold text-white text-sm">
                          {review.author}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{review.procedureContext}</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-4">
              <button
                type="button"
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="px-5 sm:px-6 py-3.5 rounded-full border border-white/25 hover:border-[#8CE0F5] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer text-center"
              >
                {showAllReviews
                  ? 'Voltar para o Carrossel Dinâmico'
                  : `Expandir todas as ${TESTIMONIALS.length} avaliações reais do Google`}
              </button>

              <a
                href={DEFAULT_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shimmer inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-full bg-white text-[#091418] hover:bg-[#E4F1F5] text-sm font-semibold hover:scale-105 active:scale-98 transition-transform duration-200 text-center"
              >
                <span>Agendar Meu Horário pelo WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>
            </div>
          </div>
        </section>

        {/* 6. SEÇÃO INSTAGRAM & GALERIA REAL (@espacoconceicaoferraz — 2x4 Grid on Mobile like the Real Instagram App) */}
        <section className="py-14 sm:py-20 lg:py-24 px-3.5 sm:px-8 max-w-[1280px] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={revealUp}
            className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-10"
          >
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#1E5C70] mb-1.5 sm:mb-2">
                /@espacoconceicaoferraz · Fotos e Resultados Reais da Clínica
              </p>
              <h2
                style={{ textWrap: 'balance' }}
                className="font-display text-[1.95rem] sm:text-4xl font-semibold text-[#0B161B] leading-tight"
              >
                Acompanhe nossa rotina,{' '}
                <span className="italic font-normal text-metallic-teal">
                  antes e depois
                </span>{' '}
                e dicas no Instagram.
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setShowLiveInstagramEmbed(!showLiveInstagramEmbed)}
                className="px-4 py-3 rounded-full border border-[#0B161B]/15 hover:border-[#287086] bg-[#F2F7F9] text-[#0B161B] text-xs sm:text-sm font-medium transition-all cursor-pointer text-center"
              >
                {showLiveInstagramEmbed
                  ? 'Ver Galeria de Fotos Reais (8 fotos)'
                  : 'Ver Embed ao Vivo do Instagram'}
              </button>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shimmer inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-metallic-teal border border-[#66C0DA]/45 text-white text-xs sm:text-sm font-medium transition-all text-center"
              >
                <Instagram className="w-4 h-4 shrink-0" />
                <span>/@espacoconceicaoferraz</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>
            </div>
          </motion.div>

          {showLiveInstagramEmbed ? (
            <div className="rounded-3xl overflow-hidden border border-[#0B161B]/15 bg-white shadow-sm">
              <iframe
                title="Perfil Oficial Instagram @espacoconceicaoferraz"
                src={INSTAGRAM_EMBED_URL}
                className="w-full min-h-[540px] sm:min-h-[620px] border-0"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {INSTAGRAM_FEED.map((post) => (
                <div
                  key={post.id}
                  onClick={() =>
                    setLightboxImage({ src: post.image, caption: post.caption })
                  }
                  className="group cursor-pointer bg-[#F2F7F9]/75 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#0B161B]/10 hover:border-[#287086] transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#091418]">
                    <img
                      src={post.image}
                      alt={post.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091418]/90 via-[#091418]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 sm:p-5 text-white">
                      <p className="text-[11px] sm:text-xs font-medium text-[#8CE0F5] mb-1">
                        {post.category}
                      </p>
                      <p className="text-[11px] sm:text-xs leading-relaxed line-clamp-3">
                        {post.caption}
                      </p>
                    </div>
                  </div>
                  <div className="p-2.5 sm:p-4 flex items-center justify-between gap-1 text-[11px] sm:text-xs text-[#425861]">
                    <span className="font-semibold text-[#0B161B] truncate">
                      {post.category}
                    </span>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-0.5 text-[#1E5C70] hover:text-[#0B161B] font-semibold shrink-0"
                    >
                      <span className="hidden sm:inline">Instagram</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 7. CONSULTORIA RÁPIDA + LOCALIZAÇÃO, HORÁRIOS E CONTATO */}
        <section
          id="localizacao"
          className="pt-12 sm:pt-16 pb-16 sm:pb-20 bg-[#F2F7F9] border-t border-[#0B161B]/10"
        >
          <div className="max-w-[1280px] mx-auto px-3.5 sm:px-8">
            {/* Quick WhatsApp Evaluation Builder (text-base on mobile inputs prevents iOS Safari auto-zoom) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={revealUp}
              className="mb-10 sm:mb-12 bg-metallic-teal-Diagnal text-white border border-[#56B0CA]/45 rounded-[1.75rem] sm:rounded-[2.25rem] p-5 sm:p-10 shadow-xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                <div className="lg:col-span-5">
                  <p className="text-xs font-medium text-[#8CE0F5] mb-1.5 sm:mb-2">
                    Agendamento Inteligente · Hora Marcada
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white leading-tight mb-2.5 sm:mb-3">
                    Agende sua avaliação personalizada em segundos
                  </h3>
                  <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                    Escolha seu objetivo principal e o melhor turno para você. Sua
                    mensagem já vai pronta para o WhatsApp oficial da clínica.
                  </p>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                  <div>
                    <label
                      htmlFor="goal-select"
                      className="block text-xs font-medium text-white/85 mb-1.5"
                    >
                      1. Procedimento Desejado
                    </label>
                    <select
                      id="goal-select"
                      value={goalArea}
                      onChange={(e) =>
                        setGoalArea(
                          e.target.value as
                            | 'Limpeza de Pele Profunda & Fototerapia LED'
                            | 'Estética Corporal (Drenagem / Modeladora / Planos)'
                            | 'Estética Facial Avançada (Botox / Labial / Microagulhamento)'
                            | 'Depilação a Cera'
                            | 'Pós-Operatório & Massagem Relaxante'
                        )
                      }
                      className="w-full px-3.5 py-3 rounded-xl bg-white/10 border border-white/25 text-base sm:text-sm text-white font-medium focus:outline-none focus:border-[#8CE0F5]"
                    >
                      <option
                        value="Limpeza de Pele Profunda & Fototerapia LED"
                        className="text-[#0B161B]"
                      >
                        Limpeza de Pele Profunda & LED
                      </option>
                      <option
                        value="Estética Corporal (Drenagem / Modeladora / Planos)"
                        className="text-[#0B161B]"
                      >
                        Drenagem / Modeladora / Planos
                      </option>
                      <option
                        value="Estética Facial Avançada (Botox / Labial / Microagulhamento)"
                        className="text-[#0B161B]"
                      >
                        Botox / Labial / Microagulhamento
                      </option>
                      <option value="Depilação a Cera" className="text-[#0B161B]">
                        Depilação a Cera
                      </option>
                      <option
                        value="Pós-Operatório & Massagem Relaxante"
                        className="text-[#0B161B]"
                      >
                        Pós-Operatório & Relaxamento
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="period-select"
                      className="block text-xs font-medium text-white/85 mb-1.5"
                    >
                      2. Turno de preferência
                    </label>
                    <select
                      id="period-select"
                      value={preferredPeriod}
                      onChange={(e) =>
                        setPreferredPeriod(
                          e.target.value as
                            | 'Manhã (08h–12h)'
                            | 'Tarde (13h–19h)'
                            | 'Sábado (08h–12h)'
                        )
                      }
                      className="w-full px-3.5 py-3 rounded-xl bg-white/10 border border-white/25 text-base sm:text-sm text-white font-medium focus:outline-none focus:border-[#8CE0F5]"
                    >
                      <option value="Manhã (08h–12h)" className="text-[#0B161B]">
                        Manhã (08h–12h)
                      </option>
                      <option value="Tarde (13h–19h)" className="text-[#0B161B]">
                        Tarde (13h–19h)
                      </option>
                      <option value="Sábado (08h–12h)" className="text-[#0B161B]">
                        Sábado (08h–12h)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="patient-name"
                      className="block text-xs font-medium text-white/85 mb-1.5"
                    >
                      3. Seu nome (opcional)
                    </label>
                    <input
                      id="patient-name"
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Ex: Ana Clara"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/25 text-base sm:text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[#8CE0F5]"
                    />
                  </div>

                  <div className="sm:col-span-3 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
                    <p className="text-xs text-white/80">
                      WhatsApp oficial de atendimento:{' '}
                      <strong className="text-[#8CE0F5] tabular-nums">
                        (81) 98535-0230
                      </strong>
                    </p>
                    <a
                      href={customAssessmentWhatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-shimmer inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl bg-white text-[#091418] hover:bg-[#E4F1F5] text-sm font-semibold hover:scale-105 active:scale-98 transition-transform duration-200 text-center"
                    >
                      <span>Enviar Solicitação pelo WhatsApp</span>
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Location & Google Maps Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-stretch">
              <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-3xl p-5 sm:p-9 border border-[#0B161B]/10 shadow-xs">
                <div>
                  <p className="text-xs font-semibold text-[#1E5C70] mb-1.5 sm:mb-2">
                    Visite Nosso Espaço no Ipsep
                  </p>
                  <h2 className="font-display text-2xl sm:text-4xl font-semibold text-[#0B161B] leading-tight mb-5 sm:mb-6">
                    Localização, Horários & Contato
                  </h2>

                  <div className="space-y-5 sm:space-y-6">
                    <div className="flex items-start gap-3.5 sm:gap-4">
                      <div className="w-10 h-10 rounded-xl bg-metallic-teal flex items-center justify-center text-white shrink-0 mt-0.5">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-sans text-sm font-semibold text-[#0B161B]">
                          Endereço
                        </h3>
                        <p className="text-xs sm:text-sm text-[#425861] mt-0.5 leading-relaxed">
                          R. Landelino Câmara, 244 - Ipsep, Recife - PE, 51350-070
                        </p>
                        <a
                          href={GOOGLE_MAPS_DIRECTIONS_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E5C70] hover:text-[#0B161B] mt-1.5 transition-colors"
                        >
                          <span>Traçar rota no Google Maps</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 sm:gap-4">
                      <div className="w-10 h-10 rounded-xl bg-metallic-teal flex items-center justify-center text-white shrink-0 mt-0.5">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-sans text-sm font-semibold text-[#0B161B]">
                          Horário de Funcionamento
                        </h3>
                        <p className="text-xs sm:text-sm text-[#425861] mt-0.5 tabular-nums">
                          Segunda a Sexta: 08h às 19h
                        </p>
                        <p className="text-xs sm:text-sm text-[#425861] tabular-nums">
                          Sábado: 08h às 12h
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 sm:gap-4">
                      <div className="w-10 h-10 rounded-xl bg-metallic-teal flex items-center justify-center text-white shrink-0 mt-0.5">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-sans text-sm font-semibold text-[#0B161B]">
                          Telefone / WhatsApp Oficial
                        </h3>
                        <a
                          href={DEFAULT_WHATSAPP_LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm font-medium text-[#425861] hover:text-[#1E5C70] transition-colors tabular-nums block mt-0.5"
                        >
                          (81) 98535-0230
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 sm:gap-4">
                      <div className="w-10 h-10 rounded-xl bg-metallic-teal flex items-center justify-center text-white shrink-0 mt-0.5">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-sans text-sm font-semibold text-[#0B161B]">
                          Formas de Pagamento
                        </h3>
                        <p className="text-xs sm:text-sm text-[#425861] mt-0.5 leading-relaxed">
                          Cartões de crédito, débito, PIX e pagamentos por aproximação
                          (NFC).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-7 sm:mt-8 pt-5 sm:pt-6 border-t border-[#0B161B]/10">
                  <a
                    href={DEFAULT_WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shimmer w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-4 rounded-2xl bg-metallic-teal text-white text-sm font-medium shadow-sm hover:scale-[1.02] active:scale-98 transition-transform duration-200 text-center"
                  >
                    <span>Falar com a Recepção no WhatsApp</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#0B161B]/12 bg-[#E2EEF2] min-h-[320px] sm:min-h-[420px] relative shadow-sm">
                <iframe
                  title="Localização Espaço Conceição Ferraz - Rua Landelino Câmara, 244, Ipsep, Recife"
                  src="https://www.google.com/maps?q=R.+Landelino+C%C3%A2mara,+244+-+Ipsep,+Recife+-+PE,+51350-070&output=embed"
                  className="w-full h-full min-h-[320px] sm:min-h-[420px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* QUIET FOOTER WITH OFFICIAL LOGO & SIGNATURE /@espacoconceicaoferraz BADGE */}
      <footer className="bg-[#091418] text-white pt-10 pb-24 sm:py-12 px-4 sm:px-8 border-t border-white/10">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <img
              src={REAL_PHOTOS.officialLogo}
              alt="Logo Conceição Ferraz Estética Corporal e Facial"
              className="h-11 sm:h-12 w-auto rounded-lg border border-[#56B0CA]/35"
            />
            <div>
              <p className="font-display text-xl sm:text-2xl font-semibold text-white">
                Espaço Conceição Ferraz
              </p>
              <p className="text-xs text-white/70 mt-0.5">
                R. Landelino Câmara, 244 - Ipsep, Recife - PE · (81) 98535-0230
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-white/80">
            <a href="#inicio" className="hover:text-[#8CE0F5] transition-colors">
              Início
            </a>
            <a href="#destaques" className="hover:text-[#8CE0F5] transition-colors">
              Mais Procurados
            </a>
            <a href="#procedimentos" className="hover:text-[#8CE0F5] transition-colors">
              Procedimentos
            </a>
            <a href="#diferenciais" className="hover:text-[#8CE0F5] transition-colors">
              Nosso Espaço
            </a>
            <a href="#avaliacoes" className="hover:text-[#8CE0F5] transition-colors">
              Avaliações
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-metallic-teal border border-white/25 text-white font-medium hover:scale-105 transition-transform"
            >
              /@espacoconceicaoferraz
            </a>
          </div>

          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Espaço Conceição Ferraz. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>

      {/* LIGHTBOX MODAL FOR REAL CLINIC PHOTOS (Mobile Bottom-Friendly & Touch Close) */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-[#091418]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-[#091418] border border-[#56B0CA]/45 rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                aria-label="Fechar foto ampliada"
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-10 h-10 rounded-full bg-[#091418]/85 text-white flex items-center justify-center hover:bg-[#287086] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={lightboxImage.src}
                alt={lightboxImage.caption}
                className="w-full max-h-[65vh] sm:max-h-[75vh] object-contain bg-[#050C0F]"
              />
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 text-white">
                <p className="text-xs sm:text-sm text-white/90">{lightboxImage.caption}</p>
                <a
                  href={DEFAULT_WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shimmer px-4 py-3 sm:py-2.5 rounded-xl bg-metallic-teal border border-white/25 text-white text-xs font-medium text-center whitespace-nowrap shrink-0"
                >
                  Agendar no WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROCEDURE DETAIL MODAL (Scrollable on Small Phone Screens) */}
      <AnimatePresence>
        {selectedProcedure && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProcedure(null)}
            className="fixed inset-0 z-50 bg-[#091418]/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border-t sm:border border-[#0B161B]/15 rounded-t-3xl sm:rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="relative h-52 sm:h-60 bg-[#091418]">
                <img
                  src={selectedProcedure.image}
                  alt={selectedProcedure.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                <button
                  type="button"
                  onClick={() => setSelectedProcedure(null)}
                  aria-label="Fechar detalhes do procedimento"
                  className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-10 h-10 rounded-full bg-white/90 text-[#0B161B] flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#425861] mb-2">
                  <span className="font-semibold text-[#1E5C70]">
                    {selectedProcedure.categoryLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    Duração: {selectedProcedure.duration}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[#0B161B] tabular-nums">
                    {selectedProcedure.priceLabel}
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#0B161B] mb-2.5 sm:mb-3">
                  {selectedProcedure.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#425861] leading-relaxed mb-4 sm:mb-5">
                  {selectedProcedure.description}
                </p>

                <div className="bg-[#F2F7F9] rounded-2xl p-4 mb-5 sm:mb-6">
                  <p className="text-xs font-semibold text-[#0B161B] mb-2.5">
                    O que está incluso neste protocolo:
                  </p>
                  <ul className="space-y-2">
                    {selectedProcedure.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs sm:text-sm text-[#0B161B]"
                      >
                        <Check className="w-4 h-4 text-[#287086] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                  <a
                    href={buildWhatsAppLink(selectedProcedure.whatsappText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shimmer flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-metallic-teal text-white text-sm font-medium hover:scale-[1.02] transition-transform"
                  >
                    <span>Agendar pelo WhatsApp</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>

                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl border border-[#0B161B]/15 text-xs sm:text-sm font-medium text-[#0B161B] hover:border-[#287086] hover:bg-[#F2F7F9] transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-[#1E5C70]" />
                    <span>Ver no Instagram</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING WHATSAPP CTA BUTTON (Bottom Right with Ping Wave Effect & Mobile Thumb Ergonomics) */}
      <a
        href={DEFAULT_WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp com o Espaço Conceição Ferraz"
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 group flex items-center gap-2.5 sm:gap-3"
      >
        <span className="px-3.5 py-2 rounded-full bg-metallic-teal text-white text-xs font-medium shadow-lg border border-[#66C0DA]/45 sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
          Agendar pelo WhatsApp
        </span>
        <span className="relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-40" />
          <span className="relative inline-flex rounded-full h-13 w-13 sm:h-14 sm:w-14 bg-gradient-to-tr from-[#1DA851] to-[#25D366] text-white shadow-[0_10px_25px_-5px_rgba(37,211,102,0.65)] items-center justify-center group-hover:scale-105 active:scale-95 transition-transform duration-200 border border-white/25">
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white/15" />
          </span>
        </span>
      </a>
    </div>
  );
}
