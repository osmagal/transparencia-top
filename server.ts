import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.API_KEY_GOV || process.env.API_KEY_GEMINI || process.env.GEMINI_API_KEY || process.env.VITE_API_KEY_GOV;
    if (!apiKey) {
      throw new Error("MISSING_API_KEY");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
});

// Chatbot integration using Gemini API
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, customGastos, autoridades } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Mensagens inválidas ou não fornecidas." });
      return;
    }

    // Lazy load the AI client
    let ai;
    try {
      ai = getAiClient();
    } catch (err: any) {
      if (err.message === "MISSING_API_KEY") {
        // Fallback friendly mock response if no API key is set yet
        const lastUserMsg = messages[messages.length - 1]?.text || "";
        const lower = lastUserMsg.toLowerCase();
        let fallbackText = "";
        
        if (lower.includes("quem gastou mais") || lower.includes("maior gasto") || lower.includes("ranking") || lower.includes("mais gastou")) {
          fallbackText = "Atualmente, no nosso painel de auditoria, a autoridade com o maior gasto acumulado é **Arthur Lira** (Presidente da Câmara dos Deputados), com um total consolidado de **R$ 1.142.450,22**.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Adicione sua chave de API nas variáveis de ambiente em **API_KEY_GOV** no Vercel para ativar o assistente cognitivo Gemini).*";
        } else if (lower.includes("lula") || lower.includes("presidente")) {
          fallbackText = "O Presidente **Luiz Inácio Lula da Silva** possui um gasto unificado acumulado de **R$ 984.120,00**. Seu maior gasto registrado foi com passagens e suporte internacional em viagens oficiais de Estado.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Adicione sua chave de API nas variáveis de ambiente em **API_KEY_GOV** no Vercel para ativar o assistente cognitivo Gemini).*";
        } else if (lower.includes("lira") || lower.includes("câmara")) {
          fallbackText = "O Deputado **Arthur Lira** acumula despesas de **R$ 1.142.450,22**. Seu principal lançamento é referente à locação de aeronaves privadas para apoio às comitivas parlamentares.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Adicione sua chave de API nas variáveis de ambiente em **API_KEY_GOV** no Vercel para ativar o assistente cognitivo Gemini).*";
        } else {
          fallbackText = "Olá! Entendi sua pergunta sobre despesas federais e transparência pública. Atualmente monitoramos 8 autoridades de alto escalão do executivo, legislativo e judiciário.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Para habilitar respostas cognitivas completas do modelo Gemini 3.5 Flash, configure a variável de ambiente **API_KEY_GOV** com sua chave de API no Vercel ou no AI Studio).*";
        }

        res.json({ text: fallbackText });
        return;
      }
      throw err;
    }

    // System instruction detailing the current state of authorities and spent data
    const systemInstruction = `
Você é o "Assistente de Transparência Cidadã", um assistente virtual inteligente especializado em auditoria social, transparência governamental e fiscalização cidadã de gastos públicos no Brasil.
Sua missão é ajudar os cidadãos a analisar, compreender e auditar as despesas e faturas do alto escalão nacional de maneira totalmente neutra, clara, didática e transparente.

Abaixo está o estado atual do painel de transparência monitorado pelo usuário (incluindo possíveis novos lançamentos de simulação cadastrados na sessão):

AUTORIDADES REGISTRADAS:
${JSON.stringify(autoridades || [], null, 2)}

GASTOS/DESPESAS REGISTRADAS (em Reais R$):
${JSON.stringify(customGastos || [], null, 2)}

DIRETRIZES DE RESPOSTA CRÍTICAS:
1. Responda em Português do Brasil (PT-BR) de forma educada, séria, técnica e voltada ao controle social.
2. Utilize exclusivamente dados reais presentes no JSON acima. Nunca invente valores ou nomes que não estejam descritos ali.
3. Formate valores monetários com a convenção brasileira (ex: R$ 450.000,00) e coloque nomes de autoridades, categorias e despesas relevantes em negrito (**Arthur Lira**, **TRANSPORTE E VIAGENS**).
4. Se o usuário fizer perguntas complexas ou cálculos, realize a soma ou análise com precisão e explique de maneira transparente como chegou ao resultado.
5. Seja apartidário e imparcial em todas as circunstâncias.
`;

    // Map messages history to Gemini Content structure
    const contents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    // Generate response using gemini-3.5-flash as recommended
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Erro no processamento do chatbot:", error);
    res.status(500).json({ error: "Erro interno no servidor ao processar o chat." });
  }
});

// Vite middleware / Static serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
