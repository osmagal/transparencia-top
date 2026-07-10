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
      res.status(200).json({ isSandbox: true, data: filtered });
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
    res.status(200).json({ isSandbox: false, data: data });
  } catch (error: any) {
    console.error("Error in orgaos local proxy:", error);
    res.status(500).json({ error: error.message });
  }
}
