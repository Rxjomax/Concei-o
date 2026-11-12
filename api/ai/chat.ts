import type { IncomingMessage, ServerResponse } from "http";
import { runClinicChat } from "../../src/server/aiService";

export default async function handler(
  req: IncomingMessage & { method?: string; body?: any },
  res: ServerResponse & { status: (code: number) => any; json: (data: any) => any }
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  try {
    const { message, history } = req.body || {};
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Por favor, digite uma mensagem para a Consultora IA." });
      return;
    }
    const result = await runClinicChat({ message, history });
    res.status(200).json(result);
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Erro ao processar consulta com a IA.";
    res.status(500).json({ error: errMessage });
  }
}
