import { GoogleGenAI, Type } from "@google/genai";

function getAiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export const CLINIC_SYSTEM_INSTRUCTION = `Você é a Consultora Estética Virtual Oficial do "Espaço Conceição Ferraz" (@espacoconceicaoferraz), liderado pela especialista em Estética Corporal e Facial Conceição Ferraz (carinhosamente chamada de Ceça pelas clientes).

INFORMAÇÕES REAIS E OFICIAIS DA CLÍNICA:
- Nome: Espaço Conceição Ferraz — Estética Corporal e Facial
- Endereço: R. Landelino Câmara, 244 - Ipsep, Recife - PE, 51350-070
- WhatsApp / Telefone Oficial: (81) 98535-0230
- Instagram Oficial: @espacoconceicaoferraz (https://www.instagram.com/espacoconceicaoferraz/)
- Horário de Funcionamento: Segunda a Sexta das 08h às 19h | Sábado das 08h às 12h (Atendimento com hora marcada).
- Avaliação no Google: Nota 4.9 de 5 estrelas (77+ avaliações verificadas), elogiada pela "mão leve que não deixa roxo", limpeza impecável, ambiente climatizado, cheiroso e ótimo custo-benefício.
- Estrutura e Acessibilidade: Espaço térreo 100% acessível para cadeirantes e pós-operatório, espaço acolhedor para lactantes/amamentação, cantinho do café e estacionamento gratuito e fácil na rua.
- Formas de Pagamento: PIX, cartões de débito, crédito e pagamento por aproximação (NFC).

CATÁLOGO DE PROCEDIMENTOS E PROTOCOLOS REAIS:
1. ESTÉTICA FACIAL:
   - Limpeza de Pele Profunda & Fototerapia LED (60 min): Extração cuidadosa de cravos, miliuns e impurezas sem machucar a pele, alta frequência, máscara de LED anti-inflamatória e hidratação calmante. Resultados visíveis já na 1ª sessão.
   - Toxina Botulínica (Botox) & Preenchimento Labial (45–60 min): Aplicação precisa e mão leve para suavizar linhas de expressão e realçar o contorno/volume dos lábios com naturalidade.
   - Microagulhamento, Peeling & Hidratação Facial (60 min): Indução de colágeno, clareamento de manchas/melasma, fechamento de poros, cicatrizes de acne e renovação celular.

2. ESTÉTICA CORPORAL:
   - Drenagem Linfática & Massagem Modeladora (60 min/sessão): Sessões avulsas ou Planos Mensais personalizados (1x na semana / 4 sessões, 2x na semana / 8 sessões, ou VIP 3x na semana / 12 sessões). Reduz retenção líquida, inchaço, melhora a circulação, funcionamento intestinal e remodela o contorno corporal sem deixar hematomas.
   - Tratamento para Gordura Localizada, Celulite & Flacidez (60 min): Protocolos combinando endermoterapia, equipamentos estéticos e dermocosméticos lipolíticos.

3. DEPILAÇÃO A CERA QUENTE OU MORNA (100% DESCARTÁVEL E BIOSSEGURA):
   - Meia Perna: R$ 30 (30 min)
   - Coxa: R$ 30 (30 min)
   - Virilha Simples: R$ 35 (30 min)
   - Glúteo: R$ 50 (30 min)
   - Virilha Completa: R$ 60 (30 min)
   - Perna Inteira: R$ 60 (30 min)
   - Combo Perna + Virilha Completa: R$ 90 (30 min)

4. BEM-ESTAR & PÓS-OPERATÓRIO:
   - Drenagem de Pós-Operatório & Massagem Relaxante (60 min): Prevenção e tratamento de fibroses e edemas pós-cirúrgicos com manobras suaves e seguras, além de massagem relaxante para alívio de tensões e estresse.

REGRAS DE CONDUTA:
- Responda sempre em português do Brasil, com tom elegante, acolhedor, empático e profissional.
- Seja objetiva e estruturada (entre 60 e 160 palavras nas respostas de chat), destacando benefícios reais e convidando a cliente para agendar sua avaliação pelo WhatsApp (81) 98535-0230.
- Nunca invente procedimentos que a clínica não realiza.`;

export interface ChatTurn {
  role: "user" | "model";
  text: string;
}

export async function runClinicChat(params: {
  message: string;
  history?: ChatTurn[];
}) {
  const ai = getAiClient();

  const formattedHistory = (params.history || [])
    .slice(-8)
    .map((m) => `${m.role === "user" ? "Cliente" : "Consultora IA"}: ${m.text}`)
    .join("\n\n");

  const prompt = formattedHistory
    ? `Histórico recente da conversa:\n${formattedHistory}\n\nNova mensagem da Cliente: ${params.message}`
    : params.message;

  const response = await ai.models.generateContent({
    model: "gemini-4-hydrogen",
    contents: prompt,
    config: {
      systemInstruction: CLINIC_SYSTEM_INSTRUCTION,
    },
  });

  const replyText = response.text || "Olá! Como posso ajudar você a cuidar da sua beleza hoje?";

  const suggestedWhatsApp = `Olá, Conceição! Conversei com a Consultora IA no site sobre "${params.message.slice(
    0,
    70
  )}" e gostaria de agendar minha avaliação!`;

  return {
    reply: replyText,
    whatsappMessage: suggestedWhatsApp,
  };
}

export async function runAestheticDiagnosis(params: {
  category: string;
  concerns: string[];
  skinOrBodyType: string;
  routineGoal: string;
  imageBase64?: string;
  imageMimeType?: string;
}) {
  const ai = getAiClient();

  const textPrompt = `Realize uma Avaliação Estética Inteligente personalizada para uma cliente do Espaço Conceição Ferraz com o seguinte perfil:
- Área de Interesse Principal: ${params.category}
- Queixas / Objetivos Selecionados: ${params.concerns.join(", ")}
- Biotipo / Características da Pele ou Corpo: ${params.skinOrBodyType}
- Disponibilidade / Meta: ${params.routineGoal}
${
  params.imageBase64
    ? "- A cliente também anexou uma foto da região para avaliação visual estética complementar (observe textura, viço, poros, oleosidade ou contorno de forma acolhedora e não médica)."
    : ""
}

Retorne um plano personalizado completo recomendando os protocolos reais do Espaço Conceição Ferraz.`;

  const contents =
    params.imageBase64 && params.imageMimeType
      ? {
          parts: [
            {
              inlineData: {
                mimeType: params.imageMimeType,
                data: params.imageBase64,
              },
            },
            { text: textPrompt },
          ],
        }
      : textPrompt;

  const response = await ai.models.generateContent({
    model: "gemini-4-hydrogen",
    contents,
    config: {
      systemInstruction: CLINIC_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tituloPlano: {
            type: Type.STRING,
            description: "Título elegante do protocolo personalizado para a cliente.",
          },
          analisePerfil: {
            type: Type.STRING,
            description:
              "Análise acolhedora e personalizada das necessidades da cliente (2 a 3 frases).",
          },
          protocoloPrincipal: {
            type: Type.OBJECT,
            properties: {
              nome: {
                type: Type.STRING,
                description: "Nome do procedimento principal no Espaço Conceição Ferraz.",
              },
              frequenciaIdeal: {
                type: Type.STRING,
                description: "Frequência e duração recomendada das sessões.",
              },
              porQueFunciona: {
                type: Type.STRING,
                description: "Explicação clara de como o procedimento age nas queixas dela.",
              },
            },
            required: ["nome", "frequenciaIdeal", "porQueFunciona"],
          },
          protocoloComplementar: {
            type: Type.OBJECT,
            properties: {
              nome: {
                type: Type.STRING,
                description: "Procedimento complementar sinérgico da clínica.",
              },
              beneficioExtra: {
                type: Type.STRING,
                description: "Como ele potencializa o resultado principal.",
              },
            },
            required: ["nome", "beneficioExtra"],
          },
          dicasHomeCare: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
            description: "3 orientações práticas de autocuidado em casa para potencializar o protocolo.",
          },
          resultadosEsperados: {
            type: Type.STRING,
            description: "O que a cliente vai sentir e notar desde a 1ª sessão.",
          },
          mensagemWhatsApp: {
            type: Type.STRING,
            description:
              "Mensagem pronta em primeira pessoa para a cliente enviar no WhatsApp da Conceição Ferraz agendando esse protocolo.",
          },
        },
        required: [
          "tituloPlano",
          "analisePerfil",
          "protocoloPrincipal",
          "protocoloComplementar",
          "dicasHomeCare",
          "resultadosEsperados",
          "mensagemWhatsApp",
        ],
      },
    },
  });

  const rawJson = (response.text ?? "{}").trim();
  return JSON.parse(rawJson);
}

export async function runPrePostCareGuide(params: {
  procedureName: string;
  stage: "ambos" | "pre" | "pos";
  customDoubt?: string;
}) {
  const ai = getAiClient();

  const prompt = `Crie um Guia Completo de Cuidados Pré e Pós-Procedimento do Espaço Conceição Ferraz para:
- Procedimento: ${params.procedureName}
- Etapa focada: ${params.stage === "ambos" ? "Antes e Depois da Sessão" : params.stage}
- Dúvida específica da cliente: ${params.customDoubt || "Nenhuma dúvida extra, quero as recomendações completas."}`;

  const response = await ai.models.generateContent({
    model: "gemini-4-hydrogen",
    contents: prompt,
    config: {
      systemInstruction: CLINIC_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          procedimento: {
            type: Type.STRING,
          },
          resumoCuidado: {
            type: Type.STRING,
            description: "Frase síntese explicando a importância do cuidado para esse procedimento.",
          },
          cuidadosPreSessao: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 a 4 orientações essenciais antes de vir para a sessão.",
          },
          cuidadosPosSessao: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "4 orientações essenciais para as primeiras 48h a 7 dias após a sessão.",
          },
          respostaDuvida: {
            type: Type.STRING,
            description: "Resposta direta à dúvida da cliente ou dica de ouro da Conceição Ferraz.",
          },
          tempoRecuperacao: {
            type: Type.STRING,
            description: "Tempo de recuperação e quando os resultados ficam mais evidentes.",
          },
        },
        required: [
          "procedimento",
          "resumoCuidado",
          "cuidadosPreSessao",
          "cuidadosPosSessao",
          "respostaDuvida",
          "tempoRecuperacao",
        ],
      },
    },
  });

  const rawJson = (response.text ?? "{}").trim();
  return JSON.parse(rawJson);
}
