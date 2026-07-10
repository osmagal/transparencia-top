import { GoogleGenAI } from "@google/genai";

// Cache client across serverless invocations
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const rawApiKey = process.env.API_KEY_GOV || process.env.API_KEY_GEMINI || process.env.GEMINI_API_KEY || process.env.VITE_API_KEY_GOV;
    const apiKey = rawApiKey?.trim();
    if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey === "your_gemini_api_key" || apiKey.includes("your") || apiKey.length < 15) {
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

export default async function handler(req: any, res: any) {
  // CORS configuration if needed (already on the same domain but good for flexibility)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { messages, customGastos, autoridades } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Mensagens inválidas ou não fornecidas." });
      return;
    }

    const lastUserMsg = messages[messages.length - 1]?.text || "";
    const lower = lastUserMsg.toLowerCase();

    // Helper to generate elegant local rule-based response
    const generateLocalFallback = (isApiError: boolean = false) => {
      let fallbackText = "";
      const isLula = lower.includes("lula") || lower.includes("presidente da república") || lower.includes("executivo");
      const isLira = lower.includes("lira") || lower.includes("câmara") || lower.includes("arthur");
      const isBarroso = lower.includes("barroso") || lower.includes("stf") || lower.includes("judiciário") || lower.includes("luís");
      const isViagem = lower.includes("viagem") || lower.includes("transporte") || lower.includes("passagem") || lower.includes("voo");
      const isSeguranca = lower.includes("segurança") || lower.includes("blindado") || lower.includes("escolta");
      const isRanking = lower.includes("quem gastou mais") || lower.includes("maior gasto") || lower.includes("ranking") || lower.includes("mais gastou");

      if (isRanking) {
        fallbackText = "Atualmente, no nosso painel de auditoria, a autoridade com o maior gasto acumulado é **Arthur Lira** (Presidente da Câmara dos Deputados), com um total consolidado de **R$ 1.142.450,22**.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Adicione sua chave de API nas variáveis de ambiente em **API_KEY_GOV** ou **API_KEY_GEMINI** no Vercel para ativar o assistente de IA Gemini).*";
      } else if (isLula) {
        fallbackText = "O Presidente **Luiz Inácio Lula da Silva** possui um gasto unificado acumulado de **R$ 984.120,00**. Seu maior gasto registrado foi com passagens e suporte internacional em viagens oficiais de Estado.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Adicione sua chave de API nas variáveis de ambiente em **API_KEY_GOV** ou **API_KEY_GEMINI** no Vercel para ativar o assistente de IA Gemini).*";
      } else if (isLira) {
        fallbackText = "O Deputado **Arthur Lira** acumula despesas de **R$ 1.142.450,22**. Seu principal lançamento é referente à locação de aeronaves privadas para apoio às comitivas parlamentares.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Adicione sua chave de API nas variáveis de ambiente em **API_KEY_GOV** ou **API_KEY_GEMINI** no Vercel para ativar o assistente de IA Gemini).*";
      } else if (isBarroso) {
        fallbackText = "O Ministro **Luís Roberto Barroso** (Presidente do STF) acumula despesas de **R$ 380.000,00** focadas principalmente em deslocamentos internacionais e diárias de equipe técnica de apoio.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Adicione sua chave de API nas variáveis de ambiente em **API_KEY_GOV** ou **API_KEY_GEMINI** no Vercel para ativar o assistente de IA Gemini).*";
      } else if (isViagem) {
        fallbackText = "A categoria de **TRANSPORTE E VIAGENS** é disparada a mais onerosa do painel, acumulando mais de **R$ 1.667.125,65** em fretamentos de jatos, passagens e combustível.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Adicione sua chave de API nas variáveis de ambiente em **API_KEY_GOV** ou **API_KEY_GEMINI** no Vercel para ativar o assistente de IA Gemini).*";
      } else if (isSeguranca) {
        fallbackText = "Despesas com **SEGURANÇA E LOGÍSTICA** somam mais de **R$ 220.000,00** no painel atual, englobando carros blindados de escolta, comunicação criptografada e suporte tático.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Adicione sua chave de API nas variáveis de ambiente em **API_KEY_GOV** ou **API_KEY_GEMINI** no Vercel para ativar o assistente de IA Gemini).*";
      } else {
        fallbackText = `Olá! Entendi seu interesse em despesas federais e transparência pública. Atualmente monitoramos 8 autoridades de alto escalão com gastos unificados.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Para habilitar respostas cognitivas completas do modelo Gemini 3.5 Flash, configure a variável de ambiente **API_KEY_GOV** ou **API_KEY_GEMINI** com sua chave de API no Vercel ou no AI Studio).*`;
      }

      if (isApiError) {
        const activeKeyName = process.env.API_KEY_GOV ? 'API_KEY_GOV' : process.env.API_KEY_GEMINI ? 'API_KEY_GEMINI' : 'GEMINI_API_KEY';
        fallbackText = `⚠️ **Nota de Conexão:** A chave de API fornecida (${activeKeyName}) retornou um erro na API do Gemini. Exibindo resposta baseada no motor local:\n\n${fallbackText}`;
      }
      return fallbackText;
    };

    // Lazy load the AI client
    let ai;
    try {
      ai = getAiClient();
    } catch (err: any) {
      if (err.message === "MISSING_API_KEY") {
        res.status(200).json({ text: generateLocalFallback(false) });
        return;
      }
      throw err;
    }

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

    const contents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2,
        }
      });

      res.status(200).json({ text: response.text });
    } catch (genError: any) {
      console.error("Erro na geração do Gemini, aplicando fallback local:", genError);
      res.status(200).json({ text: generateLocalFallback(true) });
    }
  } catch (error: any) {
    console.error("Erro no processamento do chatbot:", error);
    res.status(500).json({ error: "Erro interno no servidor ao processar o chat." });
  }
}
