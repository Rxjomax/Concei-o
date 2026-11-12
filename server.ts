import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import {
  runClinicChat,
  runAestheticDiagnosis,
  runPrePostCareGuide,
} from "./src/server/aiService.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Increase payload limit to support optional client skin/face photo upload in base64
  app.use(express.json({ limit: "12mb" }));

  // 1. AI Concierge Chat Endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history } = req.body || {};
      if (!message || typeof message !== "string") {
        res.status(400).json({ error: "Por favor, digite uma mensagem para a Consultora IA." });
        return;
      }
      const result = await runClinicChat({ message, history });
      res.json(result);
    } catch (error: unknown) {
      console.error("Erro em /api/ai/chat:", error);
      const errMessage =
        error instanceof Error ? error.message : "Erro ao processar consulta com a IA.";
      res.status(500).json({ error: errMessage });
    }
  });

  // 2. AI Aesthetic Diagnosis & Protocol Builder (with optional Multimodal Photo Analysis)
  app.post("/api/ai/diagnosis", async (req, res) => {
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
      res.json(plan);
    } catch (error: unknown) {
      console.error("Erro em /api/ai/diagnosis:", error);
      const errMessage =
        error instanceof Error ? error.message : "Erro ao gerar diagnóstico estético por IA.";
      res.status(500).json({ error: errMessage });
    }
  });

  // 3. AI Pre & Post-Procedure Care Guide
  app.post("/api/ai/care-guide", async (req, res) => {
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
      res.json(guide);
    } catch (error: unknown) {
      console.error("Erro em /api/ai/care-guide:", error);
      const errMessage =
        error instanceof Error
          ? error.message
          : "Erro ao gerar guia de cuidados pré e pós-procedimento.";
      res.status(500).json({ error: errMessage });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Espaço Conceição Ferraz server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
