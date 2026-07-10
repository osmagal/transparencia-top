export default async function handler(req: any, res: any) {
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
      host.endsWith("google.com") ||
      host.endsWith("cnnbrasil.com.br") ||
      host.endsWith("glbimg.com") ||
      host.endsWith("ebc.com.br") ||
      host.endsWith("globo.com");

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
    if (!contentType.startsWith("image/")) {
      res.status(400).send("Apenas arquivos de imagem são permitidos.");
      return;
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (error: any) {
    console.error("Erro no proxy de imagem do Vercel:", error);
    res.status(500).send("Erro interno ao buscar imagem");
  }
}
