import type { IncomingMessage, ServerResponse } from "http";
import { runAestheticDiagnosis } from "../../src/server/aiService";

export default async function handler(
  req: IncomingMessage & { method?: string; body?: any },
  res: ServerResponse & { status: (code: number) => any; json: (data: any) => any }
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  try {
    const { category, concerns, skinOrBodyType, routineGoal, imageBase64, imageMimeType } =
      req.body || {};
    if (!category || !Array.isArray(concerns) || concerns.length === 0) {
      res.status(400).json({
        error: "Selecione pelo menos uma queixa ou objetivo para gerar seu protocolo.",
      });
      return;
    }
    const plan = await runAestheticDiagnosis({
      category,
      concerns,
      skinOrBodyType: skinOrBodyType || "Não informado",
      routineGoal: routineGoal || "Resultados progressivos com hora marcada",
      imageBase64,
      imageMimeType,
    });
    res.status(200).json(plan);
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Erro ao gerar diagnóstico estético por IA.";
    res.status(500).json({ error: errMessage });
  }
}
