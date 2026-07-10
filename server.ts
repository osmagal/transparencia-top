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
    const rawApiKey = process.env.GEMINI_API_KEY || process.env.API_KEY_GEMINI || process.env.VITE_GEMINI_API_KEY;
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

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
});

// Image Proxy to avoid Wikipedia hotlinking limitations
app.get("/api/proxy-image", async (req, res) => {
  try {
    const imageUrl = req.query.url as string;
    if (!imageUrl) {
      res.status(400).send("Faltando parâmetro 'url'");
      return;
    }

    // Allowed domains validation to prevent open proxy vulnerability
    const urlObj = new URL(imageUrl);
    const host = urlObj.hostname.toLowerCase();
    const isAllowed = 
      host.endsWith("wikimedia.org") || 
      host.endsWith("wikipedia.org") || 
      host.endsWith("googleusercontent.com") ||
      host.endsWith("gstatic.com") ||
      host.endsWith("google.com");

    if (!isAllowed) {
      res.status(400).send("Domínio de imagem não permitido.");
      return;
    }

    const response = await fetch(imageUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://commons.wikimedia.org/"
      }
    });

    if (!response.ok) {
      res.status(response.status).send(`Erro ao buscar imagem: ${response.statusText}`);
      return;
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (error: any) {
    console.error("Erro no proxy de imagem:", error);
    res.status(500).send("Erro interno ao buscar imagem");
  }
});

// Chatbot integration using Gemini API
app.post("/api/chat", async (req, res) => {
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
        fallbackText = "Atualmente, no nosso painel de auditoria, a autoridade com o maior gasto acumulado é **Arthur Lira** (Presidente da Câmara dos Deputados), com um total consolidado de **R$ 1.142.450,22**.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Adicione sua chave de API nas variáveis de ambiente em **GEMINI_API_KEY** ou **API_KEY_GEMINI** no AI Studio para ativar o assistente de IA Gemini).*";
      } else if (isLula) {
        fallbackText = "O Presidente **Luiz Inácio Lula da Silva** possui um gasto unificado acumulado de **R$ 984.120,00**. Seu maior gasto registrado foi com passagens e suporte internacional em viagens oficiais de Estado.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Adicione sua chave de API nas variáveis de ambiente em **GEMINI_API_KEY** ou **API_KEY_GEMINI** no AI Studio para ativar o assistente de IA Gemini).*";
      } else if (isLira) {
        fallbackText = "O Deputado **Arthur Lira** acumula despesas de **R$ 1.142.450,22**. Seu principal lançamento é referente à locação de aeronaves privadas para apoio às comitivas parlamentares.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Adicione sua chave de API nas variáveis de ambiente em **GEMINI_API_KEY** ou **API_KEY_GEMINI** no AI Studio para ativar o assistente de IA Gemini).*";
      } else if (isBarroso) {
        fallbackText = "O Ministro **Luís Roberto Barroso** (Presidente do STF) acumula despesas de **R$ 380.000,00** focadas principalmente em deslocamentos internacionais e diárias de equipe técnica de apoio.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Adicione sua chave de API nas variáveis de ambiente em **GEMINI_API_KEY** ou **API_KEY_GEMINI** no AI Studio para ativar o assistente de IA Gemini).*";
      } else if (isViagem) {
        fallbackText = "A categoria de **TRANSPORTE E VIAGENS** é disparada a mais onerosa do painel, acumulando mais de **R$ 1.667.125,65** em fretamentos de jatos, passagens e combustível.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Adicione sua chave de API nas variáveis de ambiente em **GEMINI_API_KEY** ou **API_KEY_GEMINI** no AI Studio para ativar o assistente de IA Gemini).*";
      } else if (isSeguranca) {
        fallbackText = "Despesas com **SEGURANÇA E LOGÍSTICA** somam mais de **R$ 220.000,00** no painel atual, englobando carros blindados de escolta, comunicação criptografada e suporte tático.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Adicione sua chave de API nas variáveis de ambiente em **GEMINI_API_KEY** ou **API_KEY_GEMINI** no AI Studio para ativar o assistente de IA Gemini).*";
      } else {
        fallbackText = `Olá! Entendi seu interesse em despesas federais e transparência pública. Atualmente monitoramos 8 autoridades de alto escalão com gastos unificados.\n\n*(Nota: O chatbot está operando em Modo de Demonstração Local. Para habilitar respostas cognitivas completas do modelo Gemini 3.5 Flash, configure a variável de ambiente **GEMINI_API_KEY** ou **API_KEY_GEMINI** com sua chave de API no AI Studio).*`;
      }

      if (isApiError) {
        fallbackText = `⚠️ **Nota de Conexão:** A chave de API do Gemini (${process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY' : 'API_KEY_GEMINI'}) retornou um erro na API do Gemini. Exibindo resposta baseada no motor local:\n\n${fallbackText}`;
      }
      return fallbackText;
    };

    // Lazy load the AI client
    let ai;
    try {
      ai = getAiClient();
    } catch (err: any) {
      if (err.message === "MISSING_API_KEY") {
        res.json({ text: generateLocalFallback(false) });
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

    try {
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
    } catch (genError: any) {
      console.error("Erro na geração do Gemini, aplicando fallback local:", genError);
      res.json({ text: generateLocalFallback(true) });
    }
  } catch (error: any) {
    console.error("Erro no processamento do chatbot:", error);
    res.status(500).json({ error: "Erro interno no servidor ao processar o chat." });
  }
});

// Proxy: Servidores Públicos Search
app.get("/api/servidores", async (req, res) => {
  try {
    const rawApiKey = process.env.API_KEY_GOV;
    const apiKey = rawApiKey?.trim();
    const isMockOrMissing = !apiKey || apiKey === "your_gemini_api_key_here" || apiKey === "your_gemini_api_key" || apiKey.includes("your") || apiKey.length < 10;

    if (isMockOrMissing) {
      const queryName = (req.query.nome || "").toString().toLowerCase();
      const mockServidores = [
        {
          id: 10101,
          situacao: "Ativo",
          servidor: {
            id: 10101,
            codigoFormatado: "***.456.789-**",
            nome: "CARLOS AUGUSTO SILVA ALMEIDA",
            cpfFormatado: "***.456.789-**",
            estado: "DF"
          },
          fichasCargoEfetivo: [
            {
              cargo: "Analista de Planejamento e Orçamento",
              classe: "Especial",
              uorgLotacao: "Secretaria de Orçamento Federal",
              uorgExercicio: "Ministério do Planejamento e Orçamento",
              orgaoServidorLotacao: "Ministério do Planejamento e Orçamento",
              orgaoServidorExercicio: "Ministério do Planejamento e Orçamento"
            }
          ],
          fichasFuncao: []
        },
        {
          id: 20202,
          situacao: "Ativo",
          servidor: {
            id: 20202,
            codigoFormatado: "***.123.456-**",
            nome: "MARIA HELENA DE OLIVEIRA SOUZA",
            cpfFormatado: "***.123.456-**",
            estado: "RJ"
          },
          fichasCargoEfetivo: [
            {
              cargo: "Auditor-Fiscal da Receita Federal do Brasil",
              classe: "Especial",
              uorgLotacao: "Delegacia de Julgamento da RFB",
              uorgExercicio: "Ministério da Fazenda",
              orgaoServidorLotacao: "Ministério da Fazenda",
              orgaoServidorExercicio: "Ministério da Fazenda"
            }
          ],
          fichasFuncao: []
        },
        {
          id: 30303,
          situacao: "Ativo",
          servidor: {
            id: 30303,
            codigoFormatado: "***.987.654-**",
            nome: "ANA BEATRIZ VASCONCELOS GOMES",
            cpfFormatado: "***.987.654-**",
            estado: "SP"
          },
          fichasCargoEfetivo: [
            {
              cargo: "Especialista em Políticas Públicas e Gestão Governamental",
              classe: "Especial",
              uorgLotacao: "Secretaria de Gestão e Inovação",
              uorgExercicio: "Ministério de Gestão e Inovação em Serviços Públicos",
              orgaoServidorLotacao: "Ministério da Gestão e da Inovação",
              orgaoServidorExercicio: "Ministério da Gestão e da Inovação"
            }
          ],
          fichasFuncao: []
        },
        {
          id: 40404,
          situacao: "Ativo",
          servidor: {
            id: 40404,
            codigoFormatado: "***.111.222-**",
            nome: "FERNANDO HENRIQUE SOUZA SANTOS",
            cpfFormatado: "***.111.222-**",
            estado: "DF"
          },
          fichasCargoEfetivo: [
            {
              cargo: "Delegado da Polícia Federal",
              classe: "Classe Especial",
              uorgLotacao: "Coordenação-Geral de Combate à Corrupção",
              uorgExercicio: "Polícia Federal",
              orgaoServidorLotacao: "Ministério da Justiça e Segurança Pública",
              orgaoServidorExercicio: "Ministério da Justiça e Segurança Pública"
            }
          ],
          fichasFuncao: []
        },
        {
          id: 50505,
          situacao: "Aposentado",
          servidor: {
            id: 50505,
            codigoFormatado: "***.555.777-**",
            nome: "ROBERTO KENNEDY MOREIRA PINTO",
            cpfFormatado: "***.555.777-**",
            estado: "MG"
          },
          fichasCargoEfetivo: [
            {
              cargo: "Técnico do Seguro Social",
              classe: "Adjunto",
              uorgLotacao: "Superintendência Regional",
              uorgExercicio: "INSS",
              orgaoServidorLotacao: "Instituto Nacional do Seguro Social",
              orgaoServidorExercicio: "Instituto Nacional do Seguro Social"
            }
          ],
          fichasFuncao: []
        }
      ];

      let filtered = mockServidores;

      if (queryName) {
        filtered = filtered.filter(s => s.servidor.nome.toLowerCase().includes(queryName));
      }

      const lotacao = req.query.orgaoServidorLotacao as string;
      if (lotacao) {
        let organKeyword = "";
        if (lotacao === "15000") organKeyword = "educação";
        else if (lotacao === "31000" || lotacao === "17000") organKeyword = "fazenda";
        else if (lotacao === "30000") organKeyword = "justiça";
        else if (lotacao === "20125" || lotacao === "59000") organKeyword = "controladoria";

        if (organKeyword) {
          filtered = filtered.filter(s =>
            s.fichasCargoEfetivo.some(f => f.orgaoServidorLotacao.toLowerCase().includes(organKeyword))
          );
        }
      }

      const cpfQuery = (req.query.cpf as string || "").trim();
      if (cpfQuery) {
        filtered = filtered.filter(s =>
          s.servidor.cpfFormatado.includes(cpfQuery) ||
          s.servidor.codigoFormatado.includes(cpfQuery)
        );
      }

      res.json({
        isSandbox: true,
        data: filtered,
        message: "Sandbox"
      });
      return;
    }

    const params = new URLSearchParams();
    if (req.query.nome) params.append("nome", req.query.nome as string);
    if (req.query.pagina) params.append("pagina", req.query.pagina as string);
    if (req.query.orgaoServidorLotacao) params.append("orgaoServidorLotacao", req.query.orgaoServidorLotacao as string);
    if (req.query.orgaoServidorExercicio) params.append("orgaoServidorExercicio", req.query.orgaoServidorExercicio as string);
    if (req.query.cpf) params.append("cpf", req.query.cpf as string);

    const targetUrl = `https://api.portaldatransparencia.gov.br/api-de-dados/servidores?${params.toString()}`;
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "chave-api-dados": apiKey,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(response.status).json({ error: `Portal API Error: ${errText}` });
      return;
    }

    const data = await response.json();
    res.json({ isSandbox: false, data: data });
  } catch (error: any) {
    console.error("Error in servidores local proxy:", error);
    res.status(500).json({ error: error.message });
  }
});

// Proxy: Órgãos SIAF/SIAPE
app.get("/api/orgaos", async (req, res) => {
  try {
    const rawApiKey = process.env.API_KEY_GOV;
    const apiKey = rawApiKey?.trim();
    const isMockOrMissing = !apiKey || apiKey === "your_gemini_api_key_here" || apiKey === "your_gemini_api_key" || apiKey.includes("your") || apiKey.length < 10;

    const descricao = (req.query.descricao || "").toString().trim();

    if (isMockOrMissing) {
      const mockOrgaos = [
        { codigo: "15000", descricao: "Ministério da Educação" },
        { codigo: "25000", descricao: "Ministério da Saúde" },
        { codigo: "31000", descricao: "Ministério da Economia, Fazenda e Planejamento" },
        { codigo: "30000", descricao: "Ministério da Justiça e Segurança Pública" },
        { codigo: "20125", descricao: "Controladoria-Geral da União" },
        { codigo: "59000", descricao: "Controladoria-Geral da União" },
        { codigo: "22000", descricao: "Ministério da Agricultura e Pecuária" },
        { codigo: "52000", descricao: "Ministério da Defesa" }
      ];
      const filtered = descricao.length > 0
        ? mockOrgaos.filter(o => o.descricao.toLowerCase().includes(descricao.toLowerCase()))
        : mockOrgaos;
      res.json({ isSandbox: true, data: filtered });
      return;
    }

    const params = new URLSearchParams();
    if (descricao) params.append("descricao", descricao);
    params.append("pagina", "1");

    const targetUrl = `https://api.portaldatransparencia.gov.br/api-de-dados/orgaos-siape?${params.toString()}`;
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "chave-api-dados": apiKey,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(response.status).json({ error: `Portal API Error: ${errText}` });
      return;
    }

    const data = await response.json();
    res.json({ isSandbox: false, data: data });
  } catch (error: any) {
    console.error("Error in orgaos local proxy:", error);
    res.status(500).json({ error: error.message });
  }
});

// Proxy: Servidores Públicos Remuneration
app.get("/api/remuneracao", async (req, res) => {
  try {
    const rawApiKey = process.env.API_KEY_GOV;
    const apiKey = rawApiKey?.trim();
    const isMockOrMissing = !apiKey || apiKey === "your_gemini_api_key_here" || apiKey === "your_gemini_api_key" || apiKey.includes("your") || apiKey.length < 10;

    const id = parseInt(req.query.idServidorPensionista as string || req.query.id as string || "0", 10);
    const mesAno = (req.query.mesAno as string) || "202312";

    if (isMockOrMissing) {
      let mockRemuneration: any = null;
      if (id === 10101) {
        mockRemuneration = {
          id: 10101,
          mesAno: mesAno,
          remuneracaoBasicaBruta: 21500.00,
          gratificacaoNatalina: 0.00,
          ferias: 0.00,
          outrasRemuneracoesEventuais: 1200.00,
          impostoRenda: 6120.00,
          previdenciaOficial: 2365.00,
          outrosDescontos: 450.00,
          remuneracaoLiquida: 13765.00,
          servidor: { nome: "CARLOS AUGUSTO SILVA ALMEIDA", cpfFormatado: "***.456.789-**", situacao: "Ativo" }
        };
      } else if (id === 20202) {
        mockRemuneration = {
          id: 20202,
          mesAno: mesAno,
          remuneracaoBasicaBruta: 28300.00,
          gratificacaoNatalina: 0.00,
          ferias: 1500.00,
          outrasRemuneracoesEventuais: 2000.00,
          impostoRenda: 8490.00,
          previdenciaOficial: 3113.00,
          outrosDescontos: 820.00,
          remuneracaoLiquida: 19377.00,
          servidor: { nome: "MARIA HELENA DE OLIVEIRA SOUZA", cpfFormatado: "***.123.456-**", situacao: "Ativo" }
        };
      } else if (id === 30303) {
        mockRemuneration = {
          id: 30303,
          mesAno: mesAno,
          remuneracaoBasicaBruta: 19800.00,
          gratificacaoNatalina: 0.00,
          ferias: 0.00,
          outrasRemuneracoesEventuais: 800.00,
          impostoRenda: 5340.00,
          previdenciaOficial: 2178.00,
          outrosDescontos: 150.00,
          remuneracaoLiquida: 12932.00,
          servidor: { nome: "ANA BEATRIZ VASCONCELOS GOMES", cpfFormatado: "***.987.654-**", situacao: "Ativo" }
        };
      } else if (id === 40404) {
        mockRemuneration = {
          id: 40404,
          mesAno: mesAno,
          remuneracaoBasicaBruta: 24900.00,
          gratificacaoNatalina: 12450.00,
          ferias: 0.00,
          outrasRemuneracoesEventuais: 1500.00,
          impostoRenda: 7210.00,
          previdenciaOficial: 2739.00,
          outrosDescontos: 550.00,
          remuneracaoLiquida: 28351.00,
          servidor: { nome: "FERNANDO HENRIQUE SOUZA SANTOS", cpfFormatado: "***.111.222-**", situacao: "Ativo" }
        };
      } else if (id === 50505) {
        mockRemuneration = {
          id: 50505,
          mesAno: mesAno,
          remuneracaoBasicaBruta: 7800.00,
          gratificacaoNatalina: 0.00,
          ferias: 0.00,
          outrasRemuneracoesEventuais: 650.00,
          impostoRenda: 850.00,
          previdenciaOficial: 0.00,
          outrosDescontos: 220.00,
          remuneracaoLiquida: 7380.00,
          servidor: { nome: "ROBERTO KENNEDY MOREIRA PINTO", cpfFormatado: "***.555.777-**", situacao: "Aposentado" }
        };
      } else {
        mockRemuneration = {
          id: id,
          mesAno: mesAno,
          remuneracaoBasicaBruta: 16500.00,
          gratificacaoNatalina: 0.00,
          ferias: 0.00,
          outrasRemuneracoesEventuais: 900.00,
          impostoRenda: 3950.00,
          previdenciaOficial: 1815.00,
          outrosDescontos: 320.00,
          remuneracaoLiquida: 11315.00,
          servidor: { nome: "SERVIDOR EXEMPLO DE TESTE", cpfFormatado: "***.000.000-**", situacao: "Ativo" }
        };
      }
      res.json({ isSandbox: true, data: mockRemuneration });
      return;
    }

    const params = new URLSearchParams();
    params.append("idServidorPensionista", id.toString());
    params.append("mesAno", mesAno);
    params.append("pagina", "1");

    const targetUrl = `https://api.portaldatransparencia.gov.br/api-de-dados/servidores/remuneracao?${params.toString()}`;
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "chave-api-dados": apiKey,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(response.status).json({ error: `Portal API Error: ${errText}` });
      return;
    }

    const data = await response.json();
    const result = Array.isArray(data) ? data[0] : data;
    res.json({ isSandbox: false, data: result });
  } catch (error: any) {
    console.error("Error in remuneracao local proxy:", error);
    res.status(500).json({ error: error.message });
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
