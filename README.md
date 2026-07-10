# 🏛️ Transparência-Top | Painel das Altas Autoridades

Portal avançado e interativo de auditoria social, transparência governamental e monitoramento de gastos consolidados de autoridades de alto escalão do Brasil (Poderes Executivo, Legislativo e Judiciário), disponível online em: **[https://transparencia-top.vercel.app/](https://transparencia-top.vercel.app/)**

---

## 📋 Sumário
- [Características Principais](#-características-principais)
- [Arquitetura Geral do Sistema](#-arquitetura-geral-do-sistema)
- [Estrutura de Diretórios](#-estrutura-de-diretórios)
- [Detalhamento do Proxy de Imagens](#-detalhamento-do-proxy-de-imagens)
- [Integração de Inteligência Artificial](#-integração-de-inteligência-artificail)
- [Como Executar o Projeto Localmente](#-como-executar-o-projeto-localmente)

---

## 🌟 Características Principais

1. **Dashboard de Auditoria Social**: Visualização dinâmica e consolidada de faturas e despesas públicas utilizando **Recharts** e **D3** para análise gráfica e temporal de gastos por categoria e autoridade.
2. **Painel de Controle Cívico**: Permite ao usuário simular cenários cadastrando novas autoridades estaduais, inserindo notas fiscais com checagem de CNPJ e realizando exportação de planilhas.
3. **Assistente de Transparência Cidadã (Gemini IA)**: Chatbot cognitivo integrado que auxilia o cidadão a analisar as despesas públicas do painel, fazer cálculos, responder dúvidas fiscais e sugerir melhorias de governança.
4. **Resiliência Multi-Ambiente**: Compatibilidade de execução tanto em container local de desenvolvimento quanto na infraestrutura de Serverless Functions da Vercel.

---

## 📐 Arquitetura Geral do Sistema

O projeto é construído utilizando uma arquitetura **Full-Stack desacoplada**, configurada para funcionar perfeitamente de forma local e otimizada para implantação automatizada na nuvem (Vercel).

```
                      ┌───────────────────────────────────────────────────┐
                      │                 Cliente (Browser)                 │
                      │   [React 18 / TypeScript / Vite / Tailwind CSS]   │
                      └─────────────────────────┬─────────────────────────┘
                                                │
                                 Chamadas de API / Proxy
                                                │
                        ┌───────────────────────┴───────────────────────┐
                        ▼                                               ▼
       ┌─────────────────────────────────┐             ┌─────────────────────────────────┐
       │   Ambiente Local (Desenvolvimento)│             │     Ambiente de Produção (Vercel)│
       │   [Express.js / Vite Middleware] │             │   [Serverless API /api/* Routes]│
       └────────────────┬────────────────┘             └────────────────┬────────────────┘
                        │                                               │
                        ├──────────────────────────┼────────────────────┤
                        ▼                                               ▼
       ┌─────────────────────────────────┐             ┌─────────────────────────────────┐
       │     Proxy de Imagens Local      │             │    Proxy de Imagens Serverless  │
       │     (Evita Bloqueios CORS/Hotlink)│             │     (/api/proxy-image.ts)       │
       └─────────────────────────────────┘             └─────────────────────────────────┘
```

### 1. Frontend (SPA)
- **Framework**: React 18+ estruturado sobre o bundler super-rápido **Vite**.
- **Linguagem**: TypeScript para segurança de tipos estáticos em todas as telas e painéis.
- **Estilização**: Tailwind CSS com tema personalizado **Cosmic Slate Theme** (paleta escura com acabamento translúcido de efeito fosco, alta legibilidade e realces em tons contrastantes).
- **Gráficos**: Recharts para visualizações rápidas e D3 para processamentos interativos.

### 2. Backend & APIs (Híbrido)
- **Local Dev Server (`server.ts`)**: Servidor Express com integração Vite MiddlewareMode para servir a aplicação React de forma unificada na porta `3000`.
- **Produção (Vercel Serveless Server)**: Roteador de funções nativas de borda configurado no arquivo `vercel.json`. As chamadas à API em `/api/*` são processadas sob demanda pelo Vercel Serverless Runtime, economizando recursos e acelerando os tempos de carregamento globais.

---

## 📁 Estrutura de Diretórios

```
├── api/                       # Funções Serverless para produção na Vercel
│   ├── chat.ts                # Endpoint do Chatbot conectado ao Gemini IA
│   ├── proxy-image.ts         # Proxy de imagem para evitar erros de hotlink na Vercel
│   ├── health.ts              # Endpoint de verificação de status do servidor
│   └── ... (outras APIs)
├── public/                    # Arquivos estáticos servidos no root do domínio
│   └── favicon.svg            # Favicon oficial do Transparência-Top
├── src/                       # Código-fonte da aplicação React
│   ├── components/            # Sub-componentes modulares e reutilizáveis
│   ├── data.ts                # Base de dados estruturada de autoridades e faturas
│   ├── App.tsx                # Visualização principal e gerenciamento de estados
│   ├── main.tsx               # Ponto de entrada do React
│   └── index.css              # Diretivas Tailwind e configurações tipográficas
├── server.ts                  # Servidor Express local de desenvolvimento
├── vercel.json                # Configuração de rewrites de rotas para Vercel
├── package.json               # Gerenciador de dependências e scripts NPM
└── tsconfig.json              # Configurações do compilador TypeScript
```

---

## 🖼️ Detalhamento do Proxy de Imagens

Um dos maiores desafios em portais agregadores de dados públicos é a exibição de fotos hospedadas em servidores de terceiros (como a *Wikipedia Commons*, *Globo (glbimg.com)*, *CNN Brasil* e *EBC*), que frequentemente aplicam cabeçalhos Restritos de **CORS**, proteções de **Hotlink** ou proibições de conteúdo misto (Mixed-Content).

Para sanar este problema em ambos os ambientes sem interrupções visuais:
1. **No Desenvolvimento Local**: O servidor Express (`server.ts`) expõe uma rota `/api/proxy-image` que intercepta o pedido, insere cabeçalhos customizados de `User-Agent` e `Referer` compatíveis e serve a imagem.
2. **Na Produção Vercel**: Adicionamos o arquivo `/api/proxy-image.ts`, uma função serverless específica que atua idêntica ao endpoint do Express, fornecendo um fluxo transparente para o navegador.
3. **Mecanismo de Auto-Recuperação no Frontend**: O componente de imagem no React (`src/App.tsx`) é resiliente: se a imagem proxied falhar por qualquer instabilidade na requisição, ele faz um *fallback* automático tentando ler a URL original de forma direta e, se persistir, renderiza com elegância o ícone padrão de usuário público.

---

## 🤖 Integração de Inteligência Artificial

O portal conta com um assistente cognitivo utilizando o SDK mais recente do Google GenAI:

- **Modelo**: **Gemini 3.0 Flash** (`gemini-3.0-flash`), otimizado para baixíssima latência e alta precisão em contextos complexos.
- **Camada de Fallback Inteligente**: Caso o sistema esteja sem chaves de API declaradas no ambiente (`GEMINI_API_KEY`), o sistema ativa automaticamente um motor semântico local baseado em expressões regulares e heurísticas contextuais sobre os gastos mostrados, garantindo que o usuário nunca tenha uma tela de erro e possa interagir livremente com o chat.

---

## 🚀 Como Executar o Projeto Localmente

1. **Clonar e instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente** (opcional para o chatbot do Gemini):
   Crie um arquivo `.env` na raiz do projeto com:
   ```env
   GEMINI_API_KEY=sua_chave_de_api_do_google
   ```

3. **Iniciar servidor de desenvolvimento local**:
   ```bash
   npm run dev
   ```
   A aplicação estará rodando em **`http://localhost:3000`**.
