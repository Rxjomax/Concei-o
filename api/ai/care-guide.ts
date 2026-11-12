import type { IncomingMessage, ServerResponse } from "http";
import { runPrePostCareGuide } from "../../src/server/aiService";

export default async function handler(
  req: IncomingMessage & { method?: string; body?: any },
  res: ServerResponse & { status: (code: number) => any; json: (data: any) => any }
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  try {
    const { procedureName, stage, customDoubt } = req.body || {};
    if (!procedureName) {
      res.status(400).json({ error: "Selecione um procedimento para consultar o guia." });
      return;
    }
    const guide = await runPrePostCareGuide({
      procedureName,
      stage: stage || "ambos",
      customDoubt,
    });
    res.status(200).json(guide);
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error
        ? error.message
        : "Erro ao gerar guia de cuidados pré e pós-procedimento.";
    res.status(500).json({ error: errMessage });
  }
}
