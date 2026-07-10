import { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const rawApiKey = process.env.API_KEY_GOV;
    const apiKey = rawApiKey?.trim();

    const isMockOrMissing = !apiKey || apiKey === "your_gemini_api_key_here" || apiKey === "your_gemini_api_key" || apiKey.includes("your") || apiKey.length < 10;

    const id = parseInt(req.query.idServidorPensionista || req.query.id || "0", 10);
    const mesAno = req.query.mesAno || "202312";

    if (isMockOrMissing) {
      // Return high quality mock remuneration mapping to the specific servant ID
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
          servidor: {
            nome: "CARLOS AUGUSTO SILVA ALMEIDA",
            cpfFormatado: "***.456.789-**",
            situacao: "Ativo"
          }
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
          servidor: {
            nome: "MARIA HELENA DE OLIVEIRA SOUZA",
            cpfFormatado: "***.123.456-**",
            situacao: "Ativo"
          }
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
          servidor: {
            nome: "ANA BEATRIZ VASCONCELOS GOMES",
            cpfFormatado: "***.987.654-**",
            situacao: "Ativo"
          }
        };
      } else if (id === 40404) {
        mockRemuneration = {
          id: 40404,
          mesAno: mesAno,
          remuneracaoBasicaBruta: 24900.00,
          gratificacaoNatalina: 12450.00, // 13o salario
          ferias: 0.00,
          outrasRemuneracoesEventuais: 1500.00,
          impostoRenda: 7210.00,
          previdenciaOficial: 2739.00,
          outrosDescontos: 550.00,
          remuneracaoLiquida: 28351.00,
          servidor: {
            nome: "FERNANDO HENRIQUE SOUZA SANTOS",
            cpfFormatado: "***.111.222-**",
            situacao: "Ativo"
          }
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
          servidor: {
            nome: "ROBERTO KENNEDY MOREIRA PINTO",
            cpfFormatado: "***.555.777-**",
            situacao: "Aposentado"
          }
        };
      } else {
        // Generic fallback mock for dynamically generated IDs in search
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
          servidor: {
            nome: "SERVIDOR EXEMPLO DE TESTE",
            cpfFormatado: "***.000.000-**",
            situacao: "Ativo"
          }
        };
      }

      res.status(200).json({
        isSandbox: true,
        data: mockRemuneration
      });
      return;
    }

    // Call the official Portal da Transparência API for remuneration details
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
    
    // In some cases, the Portal da Transparência API returns an array, in others a single object.
    // Ensure we handle both and return the detailed object.
    const result = Array.isArray(data) ? data[0] : data;

    res.status(200).json({
      isSandbox: false,
      data: result
    });
  } catch (error: any) {
    console.error("Error in remuneracao proxy:", error);
    res.status(500).json({ error: error.message });
  }
}
