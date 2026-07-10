import { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: any, res: any) {
  // CORS header setting
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

    // Check if API key is missing or a placeholder
    const isMockOrMissing = !apiKey || apiKey === "your_gemini_api_key_here" || apiKey === "your_gemini_api_key" || apiKey.includes("your") || apiKey.length < 10;

    if (isMockOrMissing) {
      // Return a beautiful sandbox mock list of public servants for high fidelity evaluation when key is not set
      const queryName = (req.query.nome || "").toLowerCase();
      
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
              uorgExercicio: "Ministério da Gestão e da Inovação em Serviços Públicos",
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

      // Filter by name if supplied
      const filtered = queryName.length >= 3 
        ? mockServidores.filter(s => s.servidor.nome.toLowerCase().includes(queryName))
        : mockServidores;

      res.status(200).json({
        isSandbox: true,
        data: filtered,
        message: "Operando em Modo de Demonstração (Sandbox). Configure 'API_KEY_GOV' no Vercel para conectar à API real da CGU."
      });
      return;
    }

    // Build query parameters for Portal da Transparência API
    const params = new URLSearchParams();
    if (req.query.nome) params.append("nome", req.query.nome);
    if (req.query.pagina) params.append("pagina", req.query.pagina);
    if (req.query.orgaoServidorLotacao) params.append("orgaoServidorLotacao", req.query.orgaoServidorLotacao);
    if (req.query.orgaoServidorExercicio) params.append("orgaoServidorExercicio", req.query.orgaoServidorExercicio);

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
    res.status(200).json({
      isSandbox: false,
      data: data
    });
  } catch (error: any) {
    console.error("Error in servidores proxy:", error);
    res.status(500).json({ error: error.message });
  }
}
