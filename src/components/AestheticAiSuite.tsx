import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  Camera,
  Check,
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
  Clock,
  RefreshCw,
  Wand2,
  Bot,
  User,
  X,
  AlertCircle,
  HeartPulse,
  ChevronRight,
} from 'lucide-react';
import {
  REAL_PHOTOS,
  buildWhatsAppLink,
  DEFAULT_WHATSAPP_LINK,
} from '../data/clinicData';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  whatsappMessage?: string;
}

interface DiagnosisResult {
  tituloPlano: string;
  analisePerfil: string;
  protocoloPrincipal: {
    nome: string;
    frequenciaIdeal: string;
    porQueFunciona: string;
  };
  protocoloComplementar: {
    nome: string;
    beneficioExtra: string;
  };
  dicasHomeCare: string[];
  resultadosEsperados: string;
  mensagemWhatsApp: string;
}

interface CareGuideResult {
  procedimento: string;
  resumoCuidado: string;
  cuidadosPreSessao: string[];
  cuidadosPosSessao: string[];
  respostaDuvida: string;
  tempoRecuperacao: string;
}

/**
 * Parses inline markdown (**bold**, *italic*) into clean React elements
 * and strips any stray markdown symbols.
 */
function renderInlineMarkdown(text: string, isDarkSurface = false): React.ReactNode[] {
  if (!text) return [];
  const cleaned = text.replace(/^#{1,6}\s+/, '');
  // Match **bold** or *italic*
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*\n]+\*)/g;
  const parts = cleaned.split(tokenRegex);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const inner = part.slice(2, -2);
      return (
        <strong
          key={idx}
          className={`font-semibold ${
            isDarkSurface ? 'text-[#9EE0F2]' : 'text-[#0B161B]'
          }`}
        >
          {inner}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const inner = part.slice(1, -1);
      return (
        <em key={idx} className="italic">
          {inner}
        </em>
      );
    }
    return <React.Fragment key={idx}>{part.replace(/\*\*/g, '')}</React.Fragment>;
  });
}

/**
 * Renders multi-line AI responses with formatted paragraphs, numbered lists (1. 2.),
 * bullet lists (- or *), and bold/italic emphasis.
 */
function FormattedAiText({
  text,
  isDarkSurface = false,
  className = '',
}: {
  text: string;
  isDarkSurface?: boolean;
  className?: string;
}) {
  if (!text) return null;

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return (
    <div className={`space-y-2.5 ${className}`}>
      {lines.map((line, index) => {
        // Check for numbered list item (e.g. "1. **Limpeza...**")
        const numberedMatch = line.match(/^(\d+)[.)]\s+(.*)$/);
        if (numberedMatch) {
          const [, num, content] = numberedMatch;
          return (
            <div
              key={index}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl ${
                isDarkSurface
                  ? 'bg-white/10 border border-white/10'
                  : 'bg-[#F2F7F9] border border-[#0B161B]/[0.06]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                  isDarkSurface
                    ? 'bg-[#8CE0F5] text-[#091418]'
                    : 'bg-metallic-teal text-white'
                }`}
              >
                {num}
              </span>
              <div className="flex-1 leading-relaxed">
                {renderInlineMarkdown(content, isDarkSurface)}
              </div>
            </div>
          );
        }

        // Check for bullet list item (e.g. "- item" or "* item" or "• item")
        const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
        if (bulletMatch) {
          const [, content] = bulletMatch;
          return (
            <div key={index} className="flex items-start gap-2 pl-1">
              <Check
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  isDarkSurface ? 'text-[#8CE0F5]' : 'text-[#287086]'
                }`}
              />
              <div className="flex-1 leading-relaxed">
                {renderInlineMarkdown(content, isDarkSurface)}
              </div>
            </div>
          );
        }

        // Standard paragraph
        return (
          <p key={index} className="leading-relaxed">
            {renderInlineMarkdown(line, isDarkSurface)}
          </p>
        );
      })}
    </div>
  );
}

const CONCERNS_BY_CATEGORY: Record<string, string[]> = {
  'Estética Facial': [
    'Cravos e impurezas acumuladas',
    'Poros dilatados e oleosidade',
    'Manchas escuras ou melasma',
    'Cicatrizes e marcas de acne',
    'Linhas de expressão (Botox)',
    'Volume e contorno labial',
    'Pele opaca, seca e sem viço',
  ],
  'Estética Corporal': [
    'Retenção de líquido e inchaço',
    'Gordura localizada (abdômen/flancos)',
    'Celulite e aspecto casca de laranja',
    'Flacidez corporal',
    'Pernas inchadas e má circulação',
    'Remodelagem de contorno corporal',
  ],
  'Depilação a Cera': [
    'Irritação e alergia à lâmina (Gillette)',
    'Pelos encravados / foliculite',
    'Pele sensível com medo de dor',
    'Combo Perna + Virilha Completa',
  ],
  'Pós-Operatório & Relaxamento': [
    'Pós-operatório de cirurgia plástica',
    'Prevenção de fibroses e edemas',
    'Tensão muscular nas costas e pescoço',
    'Estresse, ansiedade e cansaço físico',
  ],
};

const QUICK_CHAT_QUESTIONS = [
  'Qual o melhor protocolo para cravos, poros e manchas?',
  'Como funcionam os planos de 1x, 2x e 3x na semana de Drenagem e Modeladora?',
  'Tenho medo de dor na depilação a cera, como é feito o atendimento?',
  'Quais os valores da depilação a cera e formas de pagamento?',
  'Fiz cirurgia plástica, como funciona a drenagem de pós-operatório?',
];

const CARE_PROCEDURES = [
  'Limpeza de Pele Profunda & Fototerapia LED',
  'Toxina Botulínica (Botox) & Preenchimento Labial',
  'Microagulhamento, Peeling & Hidratação Facial',
  'Drenagem Linfática & Massagem Modeladora',
  'Depilação a Cera Quente ou Morna',
  'Drenagem de Pós-Operatório',
];

export default function AestheticAiSuite() {
  const [activeTab, setActiveTab] = useState<'diagnostico' | 'chat' | 'cuidados'>(
    'diagnostico'
  );
  const [floatingChatOpen, setFloatingChatOpen] = useState(false);

  // --- STATE: 1. AI DIAGNOSIS & PROTOCOL BUILDER ---
  const [diagCategory, setDiagCategory] = useState<string>('Estética Facial');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([
    'Cravos e impurezas acumuladas',
    'Poros dilatados e oleosidade',
  ]);
  const [skinOrBodyType, setSkinOrBodyType] = useState<string>('Pele Mista a Oleosa');
  const [routineGoal, setRoutineGoal] = useState<string>(
    'Resultado visível já na 1ª sessão + manutenção mensal'
  );
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [uploadedImageMime, setUploadedImageMime] = useState<string | null>(null);
  const [diagLoading, setDiagLoading] = useState(false);
  const [diagError, setDiagError] = useState<string | null>(null);
  const [diagResult, setDiagResult] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- STATE: 2. AI CONCIERGE CHAT ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text: 'Olá! Sou a Consultora Estética IA do **Espaço Conceição Ferraz** ✨\nPosso tirar todas as suas dúvidas sobre **Limpeza de Pele com LED**, **Botox**, **Preenchimento Labial**, **Planos de Drenagem e Modeladora**, **Depilação a Cera** ou **Pós-Operatório**. Como posso cuidar de você hoje?',
      whatsappMessage:
        'Olá, Conceição! Vim pelo site e gostaria de agendar minha avaliação personalizada.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // --- STATE: 3. AI PRE & POST CARE GUIDE ---
  const [careProcedure, setCareProcedure] = useState<string>(CARE_PROCEDURES[0]);
  const [careDoubt, setCareDoubt] = useState<string>('');
  const [careLoading, setCareLoading] = useState(false);
  const [careError, setCareError] = useState<string | null>(null);
  const [careResult, setCareResult] = useState<CareGuideResult | null>(null);

  const handleCategoryChange = (cat: string) => {
    setDiagCategory(cat);
    const defaults = CONCERNS_BY_CATEGORY[cat] || [];
    setSelectedConcerns(defaults.slice(0, 2));
  };

  const toggleConcern = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((item) => item !== concern)
        : [...prev, concern]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setUploadedImagePreview(dataUrl);
      const [header, base64Data] = dataUrl.split(',');
      const mimeMatch = header?.match(/data:(.*?);base64/);
      setUploadedImageMime(mimeMatch?.[1] || file.type || 'image/jpeg');
      setUploadedImageBase64(base64Data || null);
    };
    reader.readAsDataURL(file);
  };

  const clearUploadedPhoto = () => {
    setUploadedImagePreview(null);
    setUploadedImageBase64(null);
    setUploadedImageMime(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerateDiagnosis = async () => {
    if (selectedConcerns.length === 0) {
      setDiagError('Selecione pelo menos uma queixa ou objetivo para gerar seu protocolo.');
      return;
    }
    setDiagLoading(true);
    setDiagError(null);

    try {
      const response = await fetch('/api/ai/diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: diagCategory,
          concerns: selectedConcerns,
          skinOrBodyType,
          routineGoal,
          imageBase64: uploadedImageBase64 || undefined,
          imageMimeType: uploadedImageMime || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível gerar o diagnóstico agora.');
      }
      setDiagResult(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro ao consultar a Inteligência Artificial.';
      setDiagError(message);
    } finally {
      setDiagLoading(false);
    }
  };

  const handleSendChatMessage = async (presetText?: string) => {
    const textToSend = (presetText ?? chatInput).trim();
    if (!textToSend || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
    };

    const updatedHistory = [...chatMessages, userMsg];
    setChatMessages(updatedHistory);
    if (!presetText) setChatInput('');
    setChatLoading(true);
    setChatError(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: updatedHistory.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao conversar com a Consultora IA.');
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: data.reply,
          whatsappMessage: data.whatsappMessage,
        },
      ]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro de conexão com a Consultora IA.';
      setChatError(message);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateCareGuide = async () => {
    setCareLoading(true);
    setCareError(null);

    try {
      const response = await fetch('/api/ai/care-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          procedureName: careProcedure,
          stage: 'ambos',
          customDoubt: careDoubt.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível gerar o guia de cuidados.');
      }
      setCareResult(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro ao gerar guia com a IA.';
      setCareError(message);
    } finally {
      setCareLoading(false);
    }
  };

  return (
    <>
      {/* MAIN SECTION: CENTRAL DE INTELIGÊNCIA ESTÉTICA IA */}
      <section
        id="consultoria-ia"
        className="py-14 sm:py-20 lg:py-28 px-3.5 sm:px-8 max-w-[1280px] mx-auto"
      >
        <div className="bg-gradient-to-br from-[#091418] via-[#112A34] to-[#091418] text-white rounded-[1.75rem] sm:rounded-[2.75rem] p-5 sm:p-10 lg:p-14 border border-[#56B0CA]/40 shadow-[0_28px_65px_-18px_rgba(9,20,24,0.5)] relative overflow-hidden">
          {/* Ambient Metallic Cyan Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 right-8 w-80 h-80 rounded-full bg-[#4CA4BE]/20 blur-[110px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 left-8 w-80 h-80 rounded-full bg-[#24687E]/25 blur-[110px]"
          />

          <div className="relative z-10">
            {/* Header & Mode Switcher */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-white/12">
              <div>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#8CE0F5] mb-2">
                  <Sparkles className="w-4 h-4 text-[#8CE0F5]" />
                  <span>Inteligência Estética Exclusiva · @espacoconceicaoferraz</span>
                </div>
                <h2
                  style={{ textWrap: 'balance' }}
                  className="font-display text-[1.95rem] sm:text-4xl lg:text-[2.85rem] font-semibold text-white leading-tight"
                >
                  Sua Consultora & Diagnóstico Estético por{' '}
                  <span className="italic font-normal text-[#8CE0F5]">
                    Inteligência Artificial
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-white/80 mt-2 max-w-2xl leading-relaxed">
                  Descubra o protocolo ideal para sua pele ou corpo, envie uma foto opcional
                  para análise estética, tire dúvidas em tempo real ou consulte o guia
                  completo de cuidados pré e pós-sessão.
                </p>
              </div>

              {/* 3 AI Mode Tabs (Swipeable on Mobile) */}
              <div
                role="tablist"
                aria-label="Ferramentas de Inteligência Artificial"
                className="flex items-center gap-1.5 p-1.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl overflow-x-auto no-scrollbar max-w-full w-full lg:w-auto shrink-0"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'diagnostico'}
                  onClick={() => setActiveTab('diagnostico')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'diagnostico'
                      ? 'bg-white text-[#091418] font-semibold shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Wand2 className="w-4 h-4 shrink-0" />
                  <span>1. Diagnóstico & Protocolo IA</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'chat'}
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'chat'
                      ? 'bg-white text-[#091418] font-semibold shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Bot className="w-4 h-4 shrink-0" />
                  <span>2. Conversar com Consultora IA</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'cuidados'}
                  onClick={() => setActiveTab('cuidados')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'cuidados'
                      ? 'bg-white text-[#091418] font-semibold shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <HeartPulse className="w-4 h-4 shrink-0" />
                  <span>3. Guia Pré & Pós-Sessão IA</span>
                </button>
              </div>
            </div>

            {/* TAB 1: DIAGNÓSTICO ESTÉTICO & MONTADOR DE PROTOCOLO POR IA */}
            {activeTab === 'diagnostico' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-8 items-start">
                {/* Left Column: Interactive Questionnaire + Optional Photo Upload */}
                <div className="lg:col-span-6 bg-white/[0.06] border border-white/15 rounded-3xl p-5 sm:p-7 space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#8CE0F5] uppercase tracking-wider mb-2.5">
                      Passo 1 · Qual área você deseja cuidar?
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {Object.keys(CONCERNS_BY_CATEGORY).map((cat) => {
                        const isSelected = diagCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-3.5 py-3 rounded-xl text-xs sm:text-sm font-medium text-left border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-metallic-teal border-[#8CE0F5] text-white shadow-md'
                                : 'bg-white/5 border-white/15 text-white/80 hover:bg-white/10'
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8CE0F5] uppercase tracking-wider mb-2.5">
                      Passo 2 · O que mais incomoda você hoje? (Toque para selecionar)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(CONCERNS_BY_CATEGORY[diagCategory] || []).map((concern) => {
                        const isSelected = selectedConcerns.includes(concern);
                        return (
                          <button
                            key={concern}
                            type="button"
                            onClick={() => toggleConcern(concern)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-white text-[#091418] border-white font-semibold'
                                : 'bg-white/5 text-white/85 border-white/15 hover:border-[#8CE0F5]/60'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#1E5C70]" />}
                            <span>{concern}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="ai-skin-type"
                        className="block text-xs font-semibold text-[#8CE0F5] mb-1.5"
                      >
                        Passo 3 · Seu Biotipo / Pele
                      </label>
                      <select
                        id="ai-skin-type"
                        value={skinOrBodyType}
                        onChange={(e) => setSkinOrBodyType(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl bg-white/10 border border-white/20 text-base sm:text-xs text-white font-medium focus:outline-none focus:border-[#8CE0F5]"
                      >
                        <option value="Pele Mista a Oleosa" className="text-[#091418]">
                          Pele Mista a Oleosa
                        </option>
                        <option value="Pele Acneica / Com Cravos" className="text-[#091418]">
                          Pele Acneica / Com Cravos
                        </option>
                        <option value="Pele Seca ou Sensível" className="text-[#091418]">
                          Pele Seca ou Sensível
                        </option>
                        <option
                          value="Retenção Líquida / Inchaço Frequente"
                          className="text-[#091418]"
                        >
                          Retenção Líquida / Inchaço Frequente
                        </option>
                        <option
                          value="Primeira vez fazendo procedimento"
                          className="text-[#091418]"
                        >
                          Primeira vez fazendo procedimento
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="ai-routine-goal"
                        className="block text-xs font-semibold text-[#8CE0F5] mb-1.5"
                      >
                        Passo 4 · Seu Objetivo de Rotina
                      </label>
                      <select
                        id="ai-routine-goal"
                        value={routineGoal}
                        onChange={(e) => setRoutineGoal(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl bg-white/10 border border-white/20 text-base sm:text-xs text-white font-medium focus:outline-none focus:border-[#8CE0F5]"
                      >
                        <option
                          value="Resultado visível já na 1ª sessão + manutenção mensal"
                          className="text-[#091418]"
                        >
                          Resultado na 1ª sessão + manutenção
                        </option>
                        <option
                          value="Plano intensivo semanal (1x, 2x ou 3x na semana)"
                          className="text-[#091418]"
                        >
                          Plano semanal (1x, 2x ou 3x/sem)
                        </option>
                        <option
                          value="Preparação para evento especial / viagem"
                          className="text-[#091418]"
                        >
                          Preparação para evento / viagem
                        </option>
                        <option
                          value="Recuperação pós-cirúrgica segura"
                          className="text-[#091418]"
                        >
                          Recuperação pós-cirúrgica segura
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Optional Multimodal Skin/Region Photo Upload */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-[#8CE0F5]">
                        Passo 5 (Opcional) · Foto da Pele / Região para Análise IA
                      </span>
                      {uploadedImagePreview && (
                        <button
                          type="button"
                          onClick={clearUploadedPhoto}
                          className="text-xs text-rose-300 hover:underline cursor-pointer"
                        >
                          Remover foto
                        </button>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    {uploadedImagePreview ? (
                      <div className="flex items-center gap-3.5 bg-white/10 p-3 rounded-2xl border border-[#8CE0F5]/40">
                        <img
                          src={uploadedImagePreview}
                          alt="Foto enviada para análise estética"
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/20"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-white">
                            Foto anexada para avaliação multimodal
                          </p>
                          <p className="text-[11px] text-white/75">
                            A IA analisará textura, viço e necessidades junto às suas respostas.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 px-4 rounded-2xl border border-dashed border-white/25 hover:border-[#8CE0F5] bg-white/[0.03] hover:bg-white/[0.07] text-xs text-white/85 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Camera className="w-4 h-4 text-[#8CE0F5]" />
                        <span>Enviar foto opcional da pele/rosto para análise da IA</span>
                      </button>
                    )}
                  </div>

                  {diagError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-xs text-rose-100 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{diagError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleGenerateDiagnosis}
                    disabled={diagLoading}
                    className="btn-shimmer w-full py-4 px-6 rounded-2xl bg-white text-[#091418] hover:bg-[#E4F1F5] disabled:opacity-60 text-sm sm:text-base font-semibold shadow-xl flex items-center justify-center gap-2.5 transition-transform active:scale-98 cursor-pointer"
                  >
                    {diagLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin text-[#1E5C70]" />
                        <span>Analisando seu perfil com Inteligência Artificial...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-[#1E5C70]" />
                        <span>Gerar Meu Protocolo Personalizado com IA</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Right Column: AI Diagnosis Output Card */}
                <div className="lg:col-span-6">
                  {diagResult ? (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white text-[#0B161B] rounded-3xl p-5 sm:p-8 border-2 border-[#66C0DA] shadow-2xl space-y-6"
                    >
                      <div className="border-b border-[#0B161B]/10 pb-4">
                        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#1E5C70] mb-1">
                          <span>PROTOCOLO RECOMENDADO PELA IA</span>
                          <span>@espacoconceicaoferraz</span>
                        </div>
                        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#0B161B] leading-snug">
                          {renderInlineMarkdown(diagResult.tituloPlano, false)}
                        </h3>
                        <div className="text-xs sm:text-sm text-[#425861] mt-2">
                          <FormattedAiText
                            text={diagResult.analisePerfil}
                            isDarkSurface={false}
                          />
                        </div>
                      </div>

                      {/* Primary Protocol Box */}
                      <div className="bg-metallic-teal text-white rounded-2xl p-5 border border-[#66C0DA]/40">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9EE0F2] mb-1">
                          Tratamento Principal Indicado
                        </p>
                        <h4 className="font-display text-xl sm:text-2xl font-semibold mb-1">
                          {renderInlineMarkdown(diagResult.protocoloPrincipal.nome, true)}
                        </h4>
                        <p className="text-xs text-[#9EE0F2] font-medium mb-3">
                          Frequência ideal:{' '}
                          {renderInlineMarkdown(
                            diagResult.protocoloPrincipal.frequenciaIdeal,
                            true
                          )}
                        </p>
                        <div className="text-xs sm:text-sm text-white/95">
                          <FormattedAiText
                            text={diagResult.protocoloPrincipal.porQueFunciona}
                            isDarkSurface={true}
                          />
                        </div>
                      </div>

                      {/* Complementary Protocol + Expected Results */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#F2F7F9] rounded-2xl p-4 border border-[#0B161B]/10">
                          <p className="text-[11px] font-semibold text-[#1E5C70] uppercase mb-1">
                            Associação Sinérgica
                          </p>
                          <p className="font-display text-lg font-semibold text-[#0B161B] mb-1">
                            {renderInlineMarkdown(
                              diagResult.protocoloComplementar.nome,
                              false
                            )}
                          </p>
                          <div className="text-xs text-[#425861]">
                            <FormattedAiText
                              text={diagResult.protocoloComplementar.beneficioExtra}
                              isDarkSurface={false}
                            />
                          </div>
                        </div>

                        <div className="bg-[#F2F7F9] rounded-2xl p-4 border border-[#0B161B]/10">
                          <p className="text-[11px] font-semibold text-[#1E5C70] uppercase mb-1">
                            Evolução & Resultados
                          </p>
                          <div className="text-xs text-[#0B161B] font-medium">
                            <FormattedAiText
                              text={diagResult.resultadosEsperados}
                              isDarkSurface={false}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Home Care Checklist */}
                      <div>
                        <p className="text-xs font-semibold text-[#0B161B] mb-2.5">
                          Dicas de Autocuidado (Home Care) da IA para Você:
                        </p>
                        <ul className="space-y-2">
                          {diagResult.dicasHomeCare.map((tip, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-[#34505B]"
                            >
                              <Check className="w-4 h-4 text-[#1E5C70] shrink-0 mt-0.5" />
                              <span>{renderInlineMarkdown(tip, false)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Direct WhatsApp Conversion with AI Protocol */}
                      <div className="pt-2">
                        <a
                          href={buildWhatsAppLink(
                            diagResult.mensagemWhatsApp.replace(/\*\*/g, '')
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-shimmer w-full py-4 px-6 rounded-2xl bg-metallic-teal text-white text-sm sm:text-base font-semibold shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform text-center"
                        >
                          <MessageCircle className="w-5 h-5 shrink-0" />
                          <span>Enviar Meu Diagnóstico IA e Agendar no WhatsApp</span>
                          <ArrowUpRight className="w-4 h-4 shrink-0" />
                        </a>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-white/[0.05] border border-white/15 rounded-3xl p-6 sm:p-9 flex flex-col justify-between min-h-[420px]">
                      <div>
                        <div className="flex items-center gap-3.5 mb-6">
                          <img
                            src={REAL_PHOTOS.conceicaoPortraitStudio}
                            alt="Conceição Ferraz"
                            className="w-14 h-14 rounded-2xl object-cover object-top border-2 border-[#8CE0F5]"
                          />
                          <div>
                            <p className="text-xs font-semibold text-[#8CE0F5]">
                              Consultoria Personalizada IA
                            </p>
                            <h3 className="font-display text-2xl font-semibold text-white">
                              Descubra seu protocolo ideal em 10 segundos
                            </h3>
                          </div>
                        </div>

                        <p className="text-sm text-white/85 leading-relaxed mb-6">
                          Nossa Inteligência Artificial foi treinada com todos os protocolos
                          faciais, corporais, depilação a cera e pós-operatório realizados
                          pela <strong>Conceição Ferraz</strong> no Ipsep.
                        </p>

                        <div className="space-y-3.5">
                          <div className="flex items-start gap-3 bg-white/[0.04] p-4 rounded-2xl border border-white/10">
                            <Sparkles className="w-5 h-5 text-[#8CE0F5] shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-white">
                                Recomendação Sob Medida + Home Care
                              </p>
                              <p className="text-xs text-white/75 mt-0.5">
                                Receba a indicação exata do tratamento principal, frequência
                                de sessões e dicas de cuidados diários.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 bg-white/[0.04] p-4 rounded-2xl border border-white/10">
                            <Camera className="w-5 h-5 text-[#8CE0F5] shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-white">
                                Análise Multimodal com Foto (Opcional)
                              </p>
                              <p className="text-xs text-white/75 mt-0.5">
                                Se desejar, anexe uma foto da pele para que a IA avalie viço,
                                poros e textura junto com suas queixas.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-[#8CE0F5] mt-8">
                        ← Selecione suas queixas ao lado e toque em{' '}
                        <strong>“Gerar Meu Protocolo Personalizado com IA”</strong>.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: CONSULTORA VIRTUAL IA 24H (CHAT INTERATIVO) */}
            {activeTab === 'chat' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
                {/* Left Sidebar: Quick Preset Questions */}
                <div className="lg:col-span-4 bg-white/[0.06] border border-white/15 rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={REAL_PHOTOS.officialLogo}
                        alt="Logo Espaço Conceição Ferraz"
                        className="w-11 h-11 rounded-full object-cover border border-[#8CE0F5]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#8CE0F5]">
                          Atendimento Instantâneo
                        </p>
                        <h3 className="font-display text-xl font-semibold text-white">
                          Perguntas Frequentes para a IA
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-white/80 leading-relaxed mb-4">
                      Toque em qualquer pergunta abaixo ou digite sua dúvida específica no
                      chat:
                    </p>

                    <div className="space-y-2">
                      {QUICK_CHAT_QUESTIONS.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendChatMessage(q)}
                          disabled={chatLoading}
                          className="w-full text-left p-3 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/10 hover:border-[#8CE0F5]/50 text-xs text-white/90 flex items-center justify-between gap-2 transition-all cursor-pointer"
                        >
                          <span>{q}</span>
                          <ChevronRight className="w-4 h-4 text-[#8CE0F5] shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 text-xs text-white/75">
                    Prefere falar direto com a Conceição?{' '}
                    <a
                      href={DEFAULT_WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8CE0F5] font-semibold hover:underline"
                    >
                      Chamar no WhatsApp (81) 98535-0230 →
                    </a>
                  </div>
                </div>

                {/* Right Chat Window */}
                <div className="lg:col-span-8 bg-white text-[#0B161B] rounded-3xl border border-white/20 shadow-2xl flex flex-col h-[520px] sm:h-[560px] overflow-hidden">
                  {/* Chat Window Top Bar */}
                  <div className="bg-metallic-teal text-white px-5 py-4 flex items-center justify-between gap-3 border-b border-[#56B0CA]/30">
                    <div className="flex items-center gap-3">
                      <img
                        src={REAL_PHOTOS.conceicaoPortraitStudio}
                        alt="Consultora IA Conceição Ferraz"
                        className="w-10 h-10 rounded-full object-cover object-top border-2 border-[#8CE0F5]"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Consultora Estética IA · Espaço Conceição Ferraz
                        </p>
                        <p className="text-[11px] text-[#9EE0F2]">
                          Especialista Virtual em Estética Facial, Corporal & Depilação
                        </p>
                      </div>
                    </div>
                    <a
                      href={DEFAULT_WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-full bg-white text-[#091418] text-xs font-semibold hover:bg-[#E4F1F5] transition-colors whitespace-nowrap shrink-0"
                    >
                      WhatsApp Humano
                    </a>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F7FAFC]">
                    {chatMessages.map((msg) => {
                      const isUser = msg.role === 'user';
                      return (
                        <div
                          key={msg.id}
                          className={`flex items-start gap-2.5 ${
                            isUser ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {!isUser && (
                            <div className="w-8 h-8 rounded-full bg-metallic-teal text-white flex items-center justify-center shrink-0 mt-0.5">
                              <Sparkles className="w-4 h-4" />
                            </div>
                          )}

                          <div
                            className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm ${
                              isUser
                                ? 'bg-metallic-teal text-white rounded-br-xs shadow-sm'
                                : 'bg-white text-[#0B161B] border border-[#0B161B]/10 rounded-bl-xs shadow-xs'
                            }`}
                          >
                            <FormattedAiText text={msg.text} isDarkSurface={isUser} />

                            {!isUser && msg.whatsappMessage && (
                              <div className="mt-3.5 pt-2.5 border-t border-[#0B161B]/10 flex items-center justify-between gap-2">
                                <span className="text-[11px] text-[#425861]">
                                  Quer agendar esse atendimento?
                                </span>
                                <a
                                  href={buildWhatsAppLink(msg.whatsappMessage)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E5C70] hover:text-[#0B161B]"
                                >
                                  <span>Agendar no WhatsApp</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            )}
                          </div>

                          {isUser && (
                            <div className="w-8 h-8 rounded-full bg-[#E2EEF2] text-[#0B161B] flex items-center justify-center shrink-0 mt-0.5">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {chatLoading && (
                      <div className="flex items-center gap-2.5 text-xs text-[#425861] p-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#1E5C70]" />
                        <span>Consultora IA está elaborando sua resposta...</span>
                      </div>
                    )}

                    {chatError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                        {chatError}
                      </div>
                    )}
                  </div>

                  {/* Input Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendChatMessage();
                    }}
                    className="p-3.5 sm:p-4 bg-white border-t border-[#0B161B]/10 flex items-center gap-2.5"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Digite sua dúvida sobre procedimentos, valores ou cuidados..."
                      className="flex-1 px-4 py-3 rounded-xl bg-[#F2F7F9] border border-[#0B161B]/12 text-base sm:text-sm text-[#0B161B] placeholder:text-[#425861]/70 focus:outline-none focus:border-[#287086]"
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatInput.trim()}
                      className="btn-shimmer px-5 py-3 rounded-xl bg-metallic-teal text-white text-xs sm:text-sm font-semibold disabled:opacity-50 flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <span>Enviar</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 3: GUIA INTELIGENTE DE CUIDADOS PRÉ E PÓS-PROCEDIMENTO */}
            {activeTab === 'cuidados' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-8 items-start">
                <div className="lg:col-span-5 bg-white/[0.06] border border-white/15 rounded-3xl p-5 sm:p-7 space-y-5">
                  <div>
                    <label
                      htmlFor="care-proc-select"
                      className="block text-xs font-semibold text-[#8CE0F5] uppercase tracking-wider mb-2"
                    >
                      1. Escolha o Procedimento
                    </label>
                    <select
                      id="care-proc-select"
                      value={careProcedure}
                      onChange={(e) => setCareProcedure(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-base sm:text-sm text-white font-medium focus:outline-none focus:border-[#8CE0F5]"
                    >
                      {CARE_PROCEDURES.map((proc) => (
                        <option key={proc} value={proc} className="text-[#091418]">
                          {proc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="care-custom-doubt"
                      className="block text-xs font-semibold text-[#8CE0F5] uppercase tracking-wider mb-2"
                    >
                      2. Alguma dúvida específica sobre o antes ou depois? (Opcional)
                    </label>
                    <input
                      id="care-custom-doubt"
                      type="text"
                      value={careDoubt}
                      onChange={(e) => setCareDoubt(e.target.value)}
                      placeholder="Ex: Posso ir à praia ou usar maquiagem no dia seguinte?"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-base sm:text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[#8CE0F5]"
                    />
                  </div>

                  {careError && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-xs text-rose-100">
                      {careError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleGenerateCareGuide}
                    disabled={careLoading}
                    className="btn-shimmer w-full py-4 px-6 rounded-2xl bg-white text-[#091418] hover:bg-[#E4F1F5] disabled:opacity-60 text-sm font-semibold shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {careLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#1E5C70]" />
                        <span>Gerando Guia de Cuidados com IA...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5 text-[#1E5C70]" />
                        <span>Gerar Guia Pré e Pós-Sessão</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-7">
                  {careResult ? (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white text-[#0B161B] rounded-3xl p-5 sm:p-8 border-2 border-[#66C0DA] shadow-2xl space-y-6"
                    >
                      <div className="border-b border-[#0B161B]/10 pb-4">
                        <p className="text-xs font-semibold text-[#1E5C70] uppercase mb-1">
                          Guia Oficial de Biossegurança & Autocuidado
                        </p>
                        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#0B161B]">
                          {renderInlineMarkdown(careResult.procedimento, false)}
                        </h3>
                        <div className="text-xs sm:text-sm text-[#425861] mt-1.5">
                          <FormattedAiText
                            text={careResult.resumoCuidado}
                            isDarkSurface={false}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#F2F7F9] rounded-2xl p-4 border border-[#0B161B]/10">
                          <p className="text-xs font-semibold text-[#1E5C70] uppercase mb-3">
                            Antes da Sessão (Pré)
                          </p>
                          <ul className="space-y-2">
                            {careResult.cuidadosPreSessao.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs text-[#0B161B]"
                              >
                                <Check className="w-4 h-4 text-[#287086] shrink-0 mt-0.5" />
                                <span>{renderInlineMarkdown(item, false)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-[#F2F7F9] rounded-2xl p-4 border border-[#0B161B]/10">
                          <p className="text-xs font-semibold text-[#1E5C70] uppercase mb-3">
                            Depois da Sessão (Pós)
                          </p>
                          <ul className="space-y-2">
                            {careResult.cuidadosPosSessao.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs text-[#0B161B]"
                              >
                                <Check className="w-4 h-4 text-[#287086] shrink-0 mt-0.5" />
                                <span>{renderInlineMarkdown(item, false)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-metallic-teal text-white rounded-2xl p-4 sm:p-5">
                        <p className="text-xs font-semibold text-[#9EE0F2] mb-1">
                          Orientação da Especialista & Tempo de Recuperação
                        </p>
                        <div className="text-xs sm:text-sm text-white/95 mb-2.5">
                          <FormattedAiText
                            text={careResult.respostaDuvida}
                            isDarkSurface={true}
                          />
                        </div>
                        <p className="text-xs text-[#9EE0F2] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{renderInlineMarkdown(careResult.tempoRecuperacao, true)}</span>
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-white/[0.05] border border-white/15 rounded-3xl p-6 sm:p-9 flex flex-col justify-center min-h-[340px]">
                      <ShieldCheck className="w-10 h-10 text-[#8CE0F5] mb-4" />
                      <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-2">
                        Cuidados Pré e Pós-Procedimento sob medida
                      </h3>
                      <p className="text-sm text-white/80 leading-relaxed mb-4">
                        Saber como preparar a pele antes da sessão e como cuidar dela nas
                        primeiras 48 horas garante resultados muito mais bonitos e
                        duradouros.
                      </p>
                      <p className="text-xs text-[#8CE0F5]">
                        ← Escolha o procedimento ao lado e toque em{' '}
                        <strong>“Gerar Guia Pré e Pós-Sessão”</strong>.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FLOATING AI CONCIERGE BUTTON & DRAWER (Bottom Left on Mobile/Desktop so it complements WhatsApp on Bottom Right) */}
      <div className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-40">
        <button
          type="button"
          onClick={() => setFloatingChatOpen(!floatingChatOpen)}
          className="btn-shimmer inline-flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-metallic-teal text-white text-xs sm:text-sm font-semibold border border-[#8CE0F5]/55 shadow-[0_12px_30px_-6px_rgba(9,20,24,0.65)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#8CE0F5] shrink-0" />
          <span>Consultora IA</span>
        </button>
      </div>

      <AnimatePresence>
        {floatingChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 left-3 right-3 sm:left-5 sm:right-auto sm:w-[410px] z-50 bg-white text-[#0B161B] rounded-3xl border-2 border-[#4CA4BE] shadow-2xl overflow-hidden flex flex-col max-h-[78vh]"
          >
            <div className="bg-metallic-teal text-white p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={REAL_PHOTOS.conceicaoPortraitStudio}
                  alt="Conceição Ferraz IA"
                  className="w-9 h-9 rounded-full object-cover object-top border border-[#8CE0F5] shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    Consultora IA · Conceição Ferraz
                  </p>
                  <p className="text-[10px] text-[#9EE0F2] truncate">
                    Tire dúvidas ou monte seu protocolo
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFloatingChatOpen(false)}
                aria-label="Fechar Consultora IA"
                className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7FAFC] max-h-[350px]">
              {chatMessages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl p-3.5 text-xs ${
                        isUser
                          ? 'bg-metallic-teal text-white'
                          : 'bg-white text-[#0B161B] border border-[#0B161B]/10 shadow-xs'
                      }`}
                    >
                      <FormattedAiText text={msg.text} isDarkSurface={isUser} />
                      {!isUser && msg.whatsappMessage && (
                        <a
                          href={buildWhatsAppLink(msg.whatsappMessage)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2.5 pt-2 border-t border-[#0B161B]/10 inline-flex items-center gap-1 text-[11px] font-semibold text-[#1E5C70]"
                        >
                          <span>Agendar no WhatsApp</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
              {chatLoading && (
                <p className="text-xs text-[#425861] flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#1E5C70]" />
                  <span>Respondendo...</span>
                </p>
              )}
            </div>

            <div className="px-3 py-2 bg-[#EBF4F7] border-t border-[#0B161B]/10 flex gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_CHAT_QUESTIONS.slice(0, 3).map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendChatMessage(q)}
                  className="px-2.5 py-1 rounded-full bg-white text-[#0B161B] border border-[#0B161B]/10 text-[11px] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {q.slice(0, 36)}...
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="p-3 bg-white border-t border-[#0B161B]/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Pergunte para a IA..."
                className="flex-1 px-3 py-2.5 rounded-xl bg-[#F2F7F9] border border-[#0B161B]/12 text-base sm:text-xs text-[#0B161B] focus:outline-none focus:border-[#287086]"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="p-2.5 rounded-xl bg-metallic-teal text-white disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
