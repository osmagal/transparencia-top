import React, { useState, useMemo } from "react";
import { 
  Search, 
  FileText, 
  Filter, 
  ArrowUpRight, 
  Download, 
  AlertTriangle, 
  TrendingUp, 
  Coins, 
  Building, 
  ChevronRight, 
  Info, 
  Sparkles, 
  Send, 
  RefreshCw, 
  X, 
  ChevronLeft, 
  User,
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { AUTORIDADES, GASTOS } from "./data";
import { Autoridade, Poder, GastoUnificado, CategoriaUnificada } from "./types";

// Core styling colors mapping
const COLOR_MAP = {
  [Poder.EXECUTIVO]: "#3b82f6", // Blue
  [Poder.LEGISLATIVO]: "#6366f1", // Indigo
  [Poder.JUDICIARIO]: "#a855f7" // Purple
};

const CATEGORY_COLORS: Record<CategoriaUnificada, string> = {
  "MANUTENÇÃO E OPERAÇÃO": "#818cf8",
  "TRANSPORTE E VIAGENS": "#60a5fa",
  "HOSPEDAGEM": "#c084fc",
  "ALIMENTAÇÃO": "#34d399",
  "SEGURANÇA E LOGÍSTICA": "#f472b6",
  "OUTROS GASTOS CORPORATIVOS": "#94a3b8"
};

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "autoridades" | "ranking" | "metodologia" | "servidores">("dashboard");

  // Servidores Públicos States
  const [servidoresList, setServidoresList] = useState<any[]>([]);
  const [servidoresLoading, setServidoresLoading] = useState(false);
  const [servidoresError, setServidoresError] = useState<string | null>(null);
  const [servidoresSearch, setServidoresSearch] = useState("SILVA");
  const [servidoresPage, setServidoresPage] = useState(1);
  const [selectedServidor, setSelectedServidor] = useState<any | null>(null);
  const [remuneracaoData, setRemuneracaoData] = useState<any | null>(null);
  const [remuneracaoLoading, setRemuneracaoLoading] = useState(false);
  const [remuneracaoError, setRemuneracaoError] = useState<string | null>(null);
  const [remuneracaoMesAno, setRemuneracaoMesAno] = useState("202312");
  const [isSandboxMode, setIsSandboxMode] = useState(false);

  // Expanded search filters for Servidores
  const [selectedOrgaoCode, setSelectedOrgaoCode] = useState<string>("15000"); // Default to MEC for instant success
  const [selectedOrgaoName, setSelectedOrgaoName] = useState<string>("Ministério da Educação");
  const [cpfSearch, setCpfSearch] = useState<string>("");
  const [orgaosSearchInput, setOrgaosSearchInput] = useState<string>("");
  const [orgaosSearchResults, setOrgaosSearchResults] = useState<any[]>([]);
  const [orgaosLoading, setOrgaosLoading] = useState(false);

  // Search function for Servidores
  const handleSearchServidores = async (pageVal: number = 1) => {
    const sSearch = servidoresSearch.trim();
    const cSearch = cpfSearch.trim();

    if (!cSearch && !selectedOrgaoCode) {
      setServidoresError("O Portal da Transparência exige CPF ou seleção de Órgão Lotação para realizar buscas de servidores.");
      return;
    }

    if (!cSearch && sSearch.length > 0 && sSearch.length < 3) {
      setServidoresError("O nome de busca deve conter pelo menos 3 caracteres, conforme exigido pela API.");
      return;
    }

    setServidoresLoading(true);
    setServidoresError(null);
    setServidoresPage(pageVal);

    try {
      let queryUrl = `/api/servidores?pagina=${pageVal}`;
      if (sSearch) {
        queryUrl += `&nome=${encodeURIComponent(sSearch)}`;
      }
      if (selectedOrgaoCode) {
        queryUrl += `&orgaoServidorLotacao=${encodeURIComponent(selectedOrgaoCode)}`;
      }
      if (cSearch) {
        queryUrl += `&cpf=${encodeURIComponent(cSearch)}`;
      }

      const response = await fetch(queryUrl);
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMessage = errJson.error || `Erro na API: status ${response.status}`;
        throw new Error(errMessage);
      }
      const json = await response.json();
      setIsSandboxMode(!!json.isSandbox);
      setServidoresList(json.data || []);
    } catch (err: any) {
      console.error(err);
      setServidoresError(err.message || "Erro de conexão com o servidor ao carregar servidores.");
    } finally {
      setServidoresLoading(false);
    }
  };

  // Search function for organs
  const handleSearchOrgaos = async (desc: string) => {
    if (desc.trim().length < 2) {
      setOrgaosSearchResults([]);
      return;
    }
    setOrgaosLoading(true);
    try {
      const response = await fetch(`/api/orgaos?descricao=${encodeURIComponent(desc.trim())}`);
      if (response.ok) {
        const json = await response.json();
        setOrgaosSearchResults(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOrgaosLoading(false);
    }
  };

  // Fetch Remuneration detail
  const handleFetchRemuneracao = async (servidorId: number, mesAnoVal: string) => {
    setRemuneracaoLoading(true);
    setRemuneracaoError(null);
    setRemuneracaoData(null);

    try {
      const response = await fetch(`/api/remuneracao?idServidorPensionista=${servidorId}&mesAno=${mesAnoVal}`);
      if (!response.ok) {
        throw new Error(`Erro de remuneração: status ${response.status}`);
      }
      const json = await response.json();
      setRemuneracaoData(json.data || null);
    } catch (err: any) {
      console.error(err);
      setRemuneracaoError(err.message || "Não foi possível carregar os detalhes de remuneração para este período.");
    } finally {
      setRemuneracaoLoading(false);
    }
  };

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPoder, setSelectedPoder] = useState<string>("todos");
  const [selectedState, setSelectedState] = useState<string>("todos");
  const [sortBy, setSortBy] = useState<"gasto" | "nome">("gasto");

  // Detailed selected authority for inspect overlay/drawer
  const [selectedAutoridadeId, setSelectedAutoridadeId] = useState<string | null>(null);

  // Image loading errors tracker and proxy URL helper
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const getProxyUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("https://upload.wikimedia.org/") || url.startsWith("https://encrypted-tbn0.gstatic.com/")) {
      return `/api/proxy-image?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  // Civic simulation states
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isReportingIrregularity, setIsReportingIrregularity] = useState(false);
  const [reportForm, setReportForm] = useState({
    name: "",
    email: "",
    comment: "",
    gastoId: ""
  });
  const [reportSuccess, setReportSuccess] = useState(false);

  // Chatbot states
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string; date: string }>>([
    {
      sender: "bot",
      text: "Olá! Sou o Assistente de Transparência Cidadã. Selecione uma autoridade ou me pergunte algo sobre os gastos do alto escalão! Por exemplo: 'Quem gastou mais?' ou 'Qual o maior gasto de Arthur Lira?'",
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // States for manual custom expenditure simulation (to let the user interactively edit data!)
  const [customGastos, setCustomGastos] = useState<GastoUnificado[]>(GASTOS);
  const [showAddSpendingModal, setShowAddSpendingModal] = useState(false);
  const [newSpending, setNewSpending] = useState({
    autoridadeId: AUTORIDADES[0].id,
    valor: "",
    categoria: "TRANSPORTE E VIAGENS" as CategoriaUnificada,
    descricao: "",
    fornecedor: "",
    cnpj: ""
  });

  // Period filter states (Initially covers the whole range of GASTOS from "2026-03" to "2026-06")
  const [startPeriod, setStartPeriod] = useState<string>("2026-03");
  const [endPeriod, setEndPeriod] = useState<string>("2026-06");

  // Helper function to format "YYYY-MM" period strings to Portuguese format
  const formatPeriod = (yyyymm: string) => {
    if (!yyyymm) return "";
    const [year, month] = yyyymm.split("-");
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const monthIdx = parseInt(month, 10) - 1;
    return `${monthNames[monthIdx]} de ${year}`;
  };

  // Get all unique year-months present in the customGastos list, sorted
  const availablePeriods = useMemo(() => {
    const periods = new Set<string>();
    customGastos.forEach(g => {
      if (g.data_gasto) {
        periods.add(g.data_gasto.substring(0, 7));
      }
    });
    if (periods.size === 0) {
      return ["2026-03", "2026-04", "2026-05", "2026-06"];
    }
    return Array.from(periods).sort();
  }, [customGastos]);

  // Filter expenditures based on selected period range
  const filteredGastosByPeriod = useMemo(() => {
    return customGastos.filter(g => {
      if (!g.data_gasto) return true;
      const yyyymm = g.data_gasto.substring(0, 7);
      const isAfterStart = !startPeriod || yyyymm >= startPeriod;
      const isBeforeEnd = !endPeriod || yyyymm <= endPeriod;
      return isAfterStart && isBeforeEnd;
    });
  }, [customGastos, startPeriod, endPeriod]);

  // Calculate sum of expenditures by authority
  const totalGastoPorAutoridade = useMemo(() => {
    const map: Record<string, number> = {};
    AUTORIDADES.forEach(aut => {
      map[aut.id] = 0;
    });
    filteredGastosByPeriod.forEach(g => {
      if (map[g.autoridade_id] !== undefined) {
        map[g.autoridade_id] += g.valor;
      }
    });
    return map;
  }, [filteredGastosByPeriod]);

  // Aggregate stats per power type
  const powerStats = useMemo(() => {
    let executivo = 0;
    let legislativo = 0;
    let judiciario = 0;

    filteredGastosByPeriod.forEach(g => {
      const aut = AUTORIDADES.find(a => a.id === g.autoridade_id);
      if (aut) {
        if (aut.poder === Poder.EXECUTIVO) executivo += g.valor;
        if (aut.poder === Poder.LEGISLATIVO) legislativo += g.valor;
        if (aut.poder === Poder.JUDICIARIO) judiciario += g.valor;
      }
    });

    const total = executivo + legislativo + judiciario;
    return { executivo, legislativo, judiciario, total };
  }, [filteredGastosByPeriod]);

  // Unique states lists
  const availableStates = useMemo(() => {
    const states = new Set(AUTORIDADES.map(a => a.estado));
    return Array.from(states).sort();
  }, []);

  // Filter authorities based on search, power, and state
  const filteredAutoridades = useMemo(() => {
    return AUTORIDADES.filter(aut => {
      const matchesSearch = aut.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            aut.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            aut.orgao_instituicao.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPoder = selectedPoder === "todos" || aut.poder === selectedPoder;
      const matchesState = selectedState === "todos" || aut.estado === selectedState;
      return matchesSearch && matchesPoder && matchesState;
    }).sort((a, b) => {
      if (sortBy === "gasto") {
        return (totalGastoPorAutoridade[b.id] || 0) - (totalGastoPorAutoridade[a.id] || 0);
      } else {
        return a.nome.localeCompare(b.nome);
      }
    });
  }, [searchQuery, selectedPoder, selectedState, sortBy, totalGastoPorAutoridade]);

  // Category distribution data for chart
  const categoryData = useMemo(() => {
    const map: Record<CategoriaUnificada, number> = {
      "MANUTENÇÃO E OPERAÇÃO": 0,
      "TRANSPORTE E VIAGENS": 0,
      "HOSPEDAGEM": 0,
      "ALIMENTAÇÃO": 0,
      "SEGURANÇA E LOGÍSTICA": 0,
      "OUTROS GASTOS CORPORATIVOS": 0
    };

    filteredGastosByPeriod.forEach(g => {
      if (map[g.categoria_unificada] !== undefined) {
        map[g.categoria_unificada] += g.valor;
      }
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name as CategoriaUnificada]
    })).filter(item => item.value > 0);
  }, [filteredGastosByPeriod]);

  // Selected authority details
  const selectedAutoridade = useMemo(() => {
    return AUTORIDADES.find(a => a.id === selectedAutoridadeId) || null;
  }, [selectedAutoridadeId]);

  // Gastos of selected authority
  const selectedAutoridadeGastos = useMemo(() => {
    if (!selectedAutoridadeId) return [];
    return filteredGastosByPeriod
      .filter(g => g.autoridade_id === selectedAutoridadeId)
      .sort((a, b) => new Date(b.data_gasto).getTime() - new Date(a.data_gasto).getTime());
  }, [selectedAutoridadeId, filteredGastosByPeriod]);

  // Category data specific to selected authority
  const selectedAutoridadeCategoryData = useMemo(() => {
    if (!selectedAutoridadeId) return [];
    const map: Record<CategoriaUnificada, number> = {
      "MANUTENÇÃO E OPERAÇÃO": 0,
      "TRANSPORTE E VIAGENS": 0,
      "HOSPEDAGEM": 0,
      "ALIMENTAÇÃO": 0,
      "SEGURANÇA E LOGÍSTICA": 0,
      "OUTROS GASTOS CORPORATIVOS": 0
    };
    selectedAutoridadeGastos.forEach(g => {
      map[g.categoria_unificada] += g.valor;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      percentage: selectedAutoridadeGastos.length ? (value / (totalGastoPorAutoridade[selectedAutoridadeId] || 1)) * 100 : 0
    })).filter(item => item.value > 0);
  }, [selectedAutoridadeId, selectedAutoridadeGastos, totalGastoPorAutoridade]);

  // Handle Chat Input Question (NLP response engine based on data)
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage = { sender: "user" as const, text: userText, date: timeNow };
    const updatedMessages = [...chatMessages, newUserMessage];

    setChatMessages(updatedMessages);
    setChatInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          customGastos: customGastos,
          autoridades: AUTORIDADES,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to contact chat API");
      }

      const data = await response.json();
      setChatMessages(prev => [
        ...prev,
        {
          sender: "bot" as const,
          text: data.text,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages(prev => [
        ...prev,
        {
          sender: "bot" as const,
          text: "Desculpe, ocorreu um erro ao processar sua solicitação no momento. Verifique a conexão com o servidor ou tente novamente.",
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Add simulated expenditure
  const handleAddSpending = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpending.valor || parseFloat(newSpending.valor) <= 0 || !newSpending.descricao) {
      alert("Por favor, preencha todos os campos obrigatórios corretamente.");
      return;
    }

    const valueNum = parseFloat(newSpending.valor);
    const mockGasto: GastoUnificado = {
      id: `g_sim_${Date.now()}`,
      autoridade_id: newSpending.autoridadeId,
      data_gasto: new Date().toISOString().split('T')[0],
      valor: valueNum,
      categoria_unificada: newSpending.categoria,
      descricao_original: newSpending.descricao,
      documento_fiscal: newSpending.cnpj || "Simulado - Portal Cidadão",
      fornecedor_nome: newSpending.fornecedor || "Fornecedor Simulado S/A",
      fonte_dados: "auditoria_cidada_portal"
    };

    setCustomGastos(prev => [mockGasto, ...prev]);
    setShowAddSpendingModal(false);
    setNewSpending({
      autoridadeId: AUTORIDADES[0].id,
      valor: "",
      categoria: "TRANSPORTE E VIAGENS",
      descricao: "",
      fornecedor: "",
      cnpj: ""
    });

    // Notify the user via chatbot
    setTimeout(() => {
      const selectedAut = AUTORIDADES.find(a => a.id === mockGasto.autoridade_id);
      setChatMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: `🚨 **Novo Gasto Simulado Registrado!** Adicionamos a despesa de **R$ ${valueNum.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}** para a autoridade **${selectedAut?.nome}** na categoria **${mockGasto.categoria_unificada}**. O gráfico de distribuição e o ranking foram atualizados instantaneamente!`,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 500);
  };

  // Export data simulation
  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    }, 1500);
  };

  // Report irregularity simulation
  const submitIrregularityReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReportingIrregularity(true);
    setTimeout(() => {
      setIsReportingIrregularity(false);
      setReportSuccess(true);
      setReportForm({ name: "", email: "", comment: "", gastoId: "" });
      setTimeout(() => setReportSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div id="transparencia-app" class="min-h-screen w-full bg-[#05070a] text-slate-200 font-sans p-4 sm:p-6 relative overflow-x-hidden">
      
      {/* Background Ambient Mesh Gradients - Frosted Glass Aesthetics */}
      <div class="absolute top-[-10%]" id="ambient-glow-top">
        <div class="w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-600/10 rounded-full blur-[100px] sm:blur-[160px] -z-10"></div>
      </div>
      <div class="absolute bottom-[-5%] right-[-5%]" id="ambient-glow-bottom">
        <div class="w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-indigo-600/8 rounded-full blur-[90px] sm:blur-[140px] -z-10"></div>
      </div>
      <div class="absolute top-[40%] right-[20%]" id="ambient-glow-middle">
        <div class="w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-purple-600/8 rounded-full blur-[80px] sm:blur-[120px] -z-10"></div>
      </div>

      {/* Container limit standard */}
      <div class="max-w-7xl mx-auto flex flex-col gap-6 relative z-10">
        
        {/* Top Header Navigation Panel */}
        <header id="main-header" class="backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              T
            </div>
            <div>
              <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Transparência<span class="text-blue-400">Top</span>
              </h1>
              <p class="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Controle Social das Altas Autoridades</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav class="flex items-center gap-2 sm:gap-6 text-sm font-medium">
            <button 
              id="nav-dashboard"
              onClick={() => setActiveTab("dashboard")} 
              class={`px-3 py-1.5 rounded-lg transition-all duration-200 ${activeTab === "dashboard" ? "text-blue-400 bg-white/5 border border-white/10" : "text-slate-400 hover:text-white"}`}
            >
              Dashboard
            </button>
            <button 
              id="nav-autoridades"
              onClick={() => setActiveTab("autoridades")} 
              class={`px-3 py-1.5 rounded-lg transition-all duration-200 ${activeTab === "autoridades" ? "text-blue-400 bg-white/5 border border-white/10" : "text-slate-400 hover:text-white"}`}
            >
              Autoridades
            </button>
            <button 
              id="nav-ranking"
              onClick={() => setActiveTab("ranking")} 
              class={`px-3 py-1.5 rounded-lg transition-all duration-200 ${activeTab === "ranking" ? "text-blue-400 bg-white/5 border border-white/10" : "text-slate-400 hover:text-white"}`}
            >
              Ranking Geral
            </button>
            <button 
              id="nav-metodologia"
              onClick={() => setActiveTab("metodologia")} 
              class={`px-3 py-1.5 rounded-lg transition-all duration-200 ${activeTab === "metodologia" ? "text-blue-400 bg-white/5 border border-white/10" : "text-slate-400 hover:text-white"}`}
            >
              Metodologia
            </button>
            <button 
              id="nav-servidores"
              onClick={() => {
                setActiveTab("servidores");
                // Fetch default records so the list is initialized immediately
                if (servidoresList.length === 0) {
                  setTimeout(() => handleSearchServidores(1), 50);
                }
              }} 
              class={`px-3 py-1.5 rounded-lg transition-all duration-200 ${activeTab === "servidores" ? "text-blue-400 bg-white/5 border border-white/10 animate-pulse" : "text-slate-400 hover:text-white"}`}
            >
              Servidores Públicos
            </button>
          </nav>

          {/* Connection API Status Badge */}
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span class="text-[10px] uppercase tracking-wider font-bold text-emerald-400">Portal Transparência Online</span>
            </div>
            
            <button 
              id="btn-add-gasto"
              onClick={() => setShowAddSpendingModal(true)} 
              class="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-xs font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/10"
            >
              <Sparkles class="w-3.5 h-3.5" />
              Simular Gasto
            </button>
          </div>
        </header>

        {/* Top Executive/Legislative/Judiciary Aggregation Summary Stats Card Grid */}
        <div id="stats-grid" class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[120px]">
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-400 uppercase tracking-widest font-semibold">Gasto Total Geral</span>
              <Coins class="w-4 h-4 text-amber-400" />
            </div>
            <div class="mt-2">
              <span class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
                R$ {powerStats.total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <p class="text-[10px] text-slate-500 mt-1">Soma de todas as despesas no painel</p>
            </div>
          </div>

          <div class="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[120px]">
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-400 uppercase tracking-widest font-semibold">Executivo Federal</span>
              <div class="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
            <div class="mt-2">
              <span class="text-2xl font-bold text-white font-mono">
                R$ {powerStats.executivo.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <p class="text-[10px] text-slate-500 mt-1">Presidência, Ministérios e Governadores</p>
            </div>
            <div class="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div class="bg-blue-500 h-full rounded-full" style={{ width: `${(powerStats.executivo / (powerStats.total || 1)) * 100}%` }}></div>
            </div>
          </div>

          <div class="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[120px]">
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-400 uppercase tracking-widest font-semibold">Legislativo Federal</span>
              <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
            </div>
            <div class="mt-2">
              <span class="text-2xl font-bold text-white font-mono">
                R$ {powerStats.legislativo.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <p class="text-[10px] text-slate-500 mt-1">Câmara dos Deputados e Senado</p>
            </div>
            <div class="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div class="bg-indigo-500 h-full rounded-full" style={{ width: `${(powerStats.legislativo / (powerStats.total || 1)) * 100}%` }}></div>
            </div>
          </div>

          <div class="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[120px]">
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-400 uppercase tracking-widest font-semibold">Judiciário (STF)</span>
              <div class="w-2 h-2 rounded-full bg-purple-500"></div>
            </div>
            <div class="mt-2">
              <span class="text-2xl font-bold text-white font-mono">
                R$ {powerStats.judiciario.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <p class="text-[10px] text-slate-500 mt-1">Supremo Tribunal Federal</p>
            </div>
            <div class="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div class="bg-purple-500 h-full rounded-full" style={{ width: `${(powerStats.judiciario / (powerStats.total || 1)) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Global Period Filter Bar for expense analysis tabs */}
        {(activeTab === "dashboard" || activeTab === "autoridades" || activeTab === "ranking") && (
          <div id="period-filter-bar" class="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4 justify-between bg-white/[0.02] border border-white/10 shadow-lg shadow-black/20">
            <div class="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Filter class="w-4 h-4 text-blue-400" />
                <span>Filtrar Período da Análise:</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex flex-col">
                  <span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Mês Inicial</span>
                  <select 
                    id="select-start-period"
                    value={startPeriod} 
                    onChange={(e) => {
                      setStartPeriod(e.target.value);
                      if (endPeriod && e.target.value > endPeriod) {
                        setEndPeriod(e.target.value);
                      }
                    }}
                    class="bg-[#0b0e14] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 min-w-[130px] hover:border-white/20 transition-all cursor-pointer"
                  >
                    {availablePeriods.map(p => (
                      <option key={`start-${p}`} value={p} class="bg-[#0b0e14] text-white">
                        {formatPeriod(p)}
                      </option>
                    ))}
                  </select>
                </div>

                <span class="text-slate-500 self-end mb-2 font-medium text-xs">até</span>

                <div class="flex flex-col">
                  <span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Mês Final</span>
                  <select 
                    id="select-end-period"
                    value={endPeriod} 
                    onChange={(e) => setEndPeriod(e.target.value)}
                    class="bg-[#0b0e14] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 min-w-[130px] hover:border-white/20 transition-all cursor-pointer"
                  >
                    {availablePeriods.filter(p => p >= startPeriod).map(p => (
                      <option key={`end-${p}`} value={p} class="bg-[#0b0e14] text-white">
                        {formatPeriod(p)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2.5 bg-blue-500/5 border border-blue-500/20 px-3.5 py-2.5 rounded-xl w-full md:w-auto justify-between md:justify-start">
              <span class="text-[11px] text-blue-300 font-mono">
                Análise de despesas ativa: <strong class="text-white font-semibold">{formatPeriod(startPeriod)}</strong> a <strong class="text-white font-semibold">{formatPeriod(endPeriod)}</strong>
              </span>
              <span class="px-2.5 py-0.5 bg-blue-500/15 rounded-full text-[10px] text-blue-400 font-extrabold tracking-wide uppercase border border-blue-500/20">
                {filteredGastosByPeriod.length} faturas encontradas
              </span>
            </div>
          </div>
        )}

        {/* Tab 1: Dashboard Home Layout */}
        {activeTab === "dashboard" && (
          <div id="tab-dashboard-content" class="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
            
            {/* Left side: Main ranking & filter system */}
            <div class="lg:col-span-8 flex flex-col gap-4">
              
              {/* Filter controls */}
              <div class="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3 justify-between">
                <div class="relative w-full sm:w-72">
                  <span class="absolute left-3 top-2.5 text-slate-500"><Search class="w-4 h-4" /></span>
                  <input 
                    id="input-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nome, cargo ou órgão..."
                    class="w-full pl-9 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} class="absolute right-3 top-2.5 text-slate-500 hover:text-white">
                      <X class="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div class="flex items-center gap-2 w-full sm:w-auto justify-end overflow-x-auto py-1">
                  <div class="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
                    <button 
                      onClick={() => setSelectedPoder("todos")} 
                      class={`px-2 py-1 rounded-lg ${selectedPoder === "todos" ? "bg-white/10 text-white font-semibold" : "text-slate-400 hover:text-white"}`}
                    >
                      Todos
                    </button>
                    <button 
                      onClick={() => setSelectedPoder(Poder.EXECUTIVO)} 
                      class={`px-2 py-1 rounded-lg ${selectedPoder === Poder.EXECUTIVO ? "bg-blue-500/20 text-blue-400 font-semibold" : "text-slate-400 hover:text-white"}`}
                    >
                      Executivo
                    </button>
                    <button 
                      onClick={() => setSelectedPoder(Poder.LEGISLATIVO)} 
                      class={`px-2 py-1 rounded-lg ${selectedPoder === Poder.LEGISLATIVO ? "bg-indigo-500/20 text-indigo-400 font-semibold" : "text-slate-400 hover:text-white"}`}
                    >
                      Legislativo
                    </button>
                    <button 
                      onClick={() => setSelectedPoder(Poder.JUDICIARIO)} 
                      class={`px-2 py-1 rounded-lg ${selectedPoder === Poder.JUDICIARIO ? "bg-purple-500/20 text-purple-400 font-semibold" : "text-slate-400 hover:text-white"}`}
                    >
                      Judiciário
                    </button>
                  </div>

                  <select 
                    id="select-state"
                    value={selectedState} 
                    onChange={(e) => setSelectedState(e.target.value)}
                    class="bg-white/5 border border-white/10 rounded-xl px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                  >
                    <option value="todos" class="bg-slate-950 text-white">UF: Todas</option>
                    <option value="Federal" class="bg-slate-950 text-white">Federal</option>
                    {availableStates.filter(s => s !== "Federal").map(state => (
                      <option key={state} value={state} class="bg-slate-950 text-white">{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ranking of Spendings list */}
              <div class="glass-panel rounded-2xl flex flex-col overflow-hidden">
                <div class="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
                  <div>
                    <h2 class="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                      <TrendingUp class="w-4 h-4 text-blue-400" />
                      Gastos Consolidados por Autoridade
                    </h2>
                    <p class="text-[10px] text-slate-400 mt-0.5">Clique em uma autoridade para detalhar faturas e emitir relatórios</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] text-slate-500 font-mono">Dados atualizados de fontes abertas</span>
                  </div>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead class="text-[10px] uppercase text-slate-400 bg-white/5 border-b border-white/10">
                      <tr>
                        <th class="p-4 font-semibold">Autoridade</th>
                        <th class="p-4 font-semibold">Cargo / Órgão</th>
                        <th class="p-4 font-semibold">Poder</th>
                        <th class="p-4 font-semibold">Local / UF</th>
                        <th class="p-4 font-semibold text-right">Total Acumulado</th>
                      </tr>
                    </thead>
                    <tbody class="text-xs divide-y divide-white/5">
                      {filteredAutoridades.length === 0 ? (
                        <tr>
                          <td colSpan={5} class="p-8 text-center text-slate-500">
                            Nenhuma autoridade correspondente aos filtros foi encontrada.
                          </td>
                        </tr>
                      ) : (
                        filteredAutoridades.map((aut, idx) => {
                          const totalSpend = totalGastoPorAutoridade[aut.id] || 0;
                          return (
                            <tr 
                              key={aut.id} 
                              onClick={() => setSelectedAutoridadeId(aut.id)}
                              class="hover:bg-white/5 cursor-pointer transition-colors group"
                            >
                              <td class="p-4 flex items-center gap-3">
                                <div class="relative">
                                  <div class="w-8 h-8 rounded-full bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center">
                                    {aut.foto_url && !imageErrors[aut.id] ? (
                                      <img 
                                        src={getProxyUrl(aut.foto_url)} 
                                        alt={aut.nome} 
                                        class="w-full h-full object-cover" 
                                        referrerPolicy="no-referrer" 
                                        onError={() => setImageErrors(prev => ({ ...prev, [aut.id]: true }))}
                                      />
                                    ) : (
                                      <User class="w-4 h-4 text-slate-400" />
                                    )}
                                  </div>
                                  <div class="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-[8px] font-bold text-slate-400">
                                    {idx + 1}
                                  </div>
                                </div>
                                <div>
                                  <span class="font-semibold text-white group-hover:text-blue-400 transition-colors">{aut.nome}</span>
                                  {aut.id === "lula-123" && <span class="ml-1.5 text-[8px] bg-red-500/20 text-red-400 border border-red-500/30 px-1 py-0.2 rounded uppercase font-bold">Chefe Executivo</span>}
                                </div>
                              </td>
                              <td class="p-4 text-slate-300 font-medium">{aut.cargo} <span class="text-slate-500 text-[10px] block">{aut.orgao_instituicao}</span></td>
                              <td class="p-4">
                                <span class={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                  aut.poder === Poder.EXECUTIVO ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                  aut.poder === Poder.LEGISLATIVO ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                                  "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                }`}>
                                  {aut.poder}
                                </span>
                              </td>
                              <td class="p-4 text-slate-400 font-medium">{aut.estado}</td>
                              <td class="p-4 text-right font-mono font-bold text-white">
                                <span class="text-slate-400 font-normal text-[10px] mr-1">R$</span>
                                {totalSpend.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                <ChevronRight class="w-3.5 h-3.5 inline ml-1 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right side: Charts and Citizen Assistant Panel */}
            <div class="lg:col-span-4 flex flex-col gap-6">
              
              {/* Category distribution pie-chart */}
              <div class="glass-panel rounded-2xl p-5 flex flex-col">
                <h2 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
                  <Building class="w-4 h-4 text-indigo-400" />
                  Divisão de Gastos Globais
                </h2>

                <div class="h-44 w-full flex items-center justify-center relative">
                  {categoryData.length === 0 ? (
                    <span class="text-xs text-slate-500">Sem dados para exibir</span>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => `R$ ${parseFloat(value).toLocaleString("pt-BR")}`}
                          contentStyle={{ backgroundColor: "#090d16", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                  <div class="absolute flex flex-col items-center">
                    <span class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Acumulado</span>
                    <span class="text-sm font-bold text-white">100%</span>
                  </div>
                </div>

                <div class="space-y-2.5 mt-2">
                  {categoryData.slice(0, 4).map((cat) => {
                    const percent = (cat.value / (powerStats.total || 1)) * 100;
                    return (
                      <div key={cat.name} class="text-xs">
                        <div class="flex justify-between text-[11px] mb-1">
                          <span class="text-slate-400 truncate max-w-[190px]">{cat.name}</span>
                          <span class="text-white font-semibold">{percent.toFixed(1)}%</span>
                        </div>
                        <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div class="h-full rounded-full" style={{ backgroundColor: cat.color, width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Glass Interactive Citizen Assistant (NLP Chatbot) */}
              <div class="glass-panel rounded-2xl flex flex-col h-[340px] overflow-hidden">
                <div class="p-4 border-b border-white/10 flex items-center justify-between bg-blue-500/5">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Sparkles class="w-4 h-4" />
                    </div>
                    <div>
                      <h3 class="text-xs font-bold uppercase tracking-wider text-white">Assistente da Transparência</h3>
                      <p class="text-[8px] text-emerald-400 flex items-center gap-1">
                        <span class="w-1 h-1 bg-emerald-400 rounded-full animate-ping"></span> IA Integrada Localmente
                      </p>
                    </div>
                  </div>
                  <span class="text-[9px] text-slate-500 font-mono">v1.2</span>
                </div>

                {/* Messages feed */}
                <div class="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} class={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                      <div class={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                        msg.sender === "user" 
                          ? "bg-blue-600 text-white rounded-tr-none" 
                          : "bg-white/5 border border-white/10 text-slate-300 rounded-tl-none"
                      }`}>
                        {msg.text}
                      </div>
                      <span class="text-[8px] text-slate-500 mt-1 font-mono">{msg.date}</span>
                    </div>
                  ))}
                  {isTyping && (
                    <div class="flex items-center gap-1.5 text-slate-500 text-[10px] pl-1">
                      <RefreshCw class="w-3 h-3 animate-spin text-blue-400" />
                      Analisando faturas governamentais...
                    </div>
                  )}
                </div>

                {/* Input box */}
                <form onSubmit={handleChatSubmit} class="p-2 border-t border-white/10 bg-white/[0.02] flex gap-1.5">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Pergunte sobre despesas..."
                    class="flex-grow bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button 
                    type="submit" 
                    class="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all"
                  >
                    <Send class="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Global PDF Report Export panel */}
              <div class="glass-panel bg-blue-500/5 border-blue-500/20 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p class="text-[9px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">Auditoria Cidadã</p>
                  <h3 class="text-xs font-bold text-white">Exportar Balancete Unificado</h3>
                  <p class="text-[10px] text-slate-400">Download em CSV do painel integrado</p>
                </div>
                
                <button 
                  onClick={handleExportReport}
                  disabled={isExporting}
                  class="w-10 h-10 rounded-xl bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-all disabled:opacity-50"
                >
                  {isExporting ? <RefreshCw class="w-4 h-4 animate-spin" /> : <Download class="w-4 h-4" />}
                </button>
              </div>
              
              {exportSuccess && (
                <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle class="w-4 h-4 text-emerald-400" />
                  <span>Relatório compilado com sucesso! O download do arquivo **transparencia_top_consolidado.csv** começará em instantes.</span>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Tab 2: Detailed Authorities Grid */}
        {activeTab === "autoridades" && (
          <div id="tab-autoridades-content" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AUTORIDADES.map(aut => {
              const totalSpend = totalGastoPorAutoridade[aut.id] || 0;
              const count = customGastos.filter(g => g.autoridade_id === aut.id).length;
              return (
                <div 
                  key={aut.id} 
                  onClick={() => setSelectedAutoridadeId(aut.id)}
                  class="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <div class="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center">
                        {aut.foto_url && !imageErrors[aut.id] ? (
                          <img 
                            src={getProxyUrl(aut.foto_url)} 
                            alt={aut.nome} 
                            class="w-full h-full object-cover" 
                            referrerPolicy="no-referrer" 
                            onError={() => setImageErrors(prev => ({ ...prev, [aut.id]: true }))}
                          />
                        ) : (
                          <User class="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <span class={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        aut.poder === Poder.EXECUTIVO ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        aut.poder === Poder.LEGISLATIVO ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                        "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      }`}>
                        {aut.poder}
                      </span>
                    </div>

                    <h3 class="font-bold text-white text-sm">{aut.nome}</h3>
                    <p class="text-xs text-blue-400 font-medium mt-0.5">{aut.cargo}</p>
                    <p class="text-[10px] text-slate-400 mt-1">{aut.orgao_instituicao} ({aut.estado})</p>
                  </div>

                  <div class="mt-6 pt-3 border-t border-white/5 flex items-end justify-between">
                    <div>
                      <span class="text-[9px] text-slate-500 uppercase tracking-wider">Total Acumulado</span>
                      <p class="font-mono font-extrabold text-white text-base mt-0.5">
                        R$ {totalSpend.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <span class="text-[10px] text-blue-400 font-medium flex items-center gap-0.5">
                      {count} lanc. <ArrowUpRight class="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Detailed Ranking analysis */}
        {activeTab === "ranking" && (
          <div id="tab-ranking-content" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Top 3 podium overview */}
            <div class="lg:col-span-12 glass-panel p-6 rounded-3xl flex flex-col items-center">
              <h2 class="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <TrendingUp class="w-5 h-5 text-indigo-400" />
                Pódio Geral de Gastos Públicos
              </h2>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl items-end mt-4">
                {/* 2nd Place */}
                {filteredAutoridades[1] && (
                  <div class="glass-panel p-5 rounded-2xl flex flex-col items-center text-center order-2 sm:order-1 border-t-2 border-t-slate-400/30">
                    <span class="w-8 h-8 rounded-full bg-slate-400/20 text-slate-300 border border-slate-400/30 flex items-center justify-center text-xs font-bold mb-3">2</span>
                    <div class="w-14 h-14 rounded-full bg-slate-800 overflow-hidden mb-3 border-2 border-slate-400 flex items-center justify-center">
                      {filteredAutoridades[1].foto_url && !imageErrors[filteredAutoridades[1].id] ? (
                        <img 
                          src={getProxyUrl(filteredAutoridades[1].foto_url)} 
                          alt={filteredAutoridades[1].nome} 
                          class="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          onError={() => setImageErrors(prev => ({ ...prev, [filteredAutoridades[1].id]: true }))}
                        />
                      ) : (
                        <User class="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <h3 class="font-bold text-white text-xs">{filteredAutoridades[1].nome}</h3>
                    <p class="text-[10px] text-slate-400 truncate max-w-full">{filteredAutoridades[1].cargo}</p>
                    <span class="font-mono font-extrabold text-white text-sm mt-3">
                      R$ {totalGastoPorAutoridade[filteredAutoridades[1].id].toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                )}

                {/* 1st Place */}
                {filteredAutoridades[0] && (
                  <div class="glass-panel p-6 rounded-2xl flex flex-col items-center text-center order-1 sm:order-2 border-t-4 border-t-blue-500 scale-105 shadow-xl shadow-blue-500/5">
                    <span class="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold mb-3 shadow-[0_0_15px_rgba(59,130,246,0.6)]">1</span>
                    <div class="w-16 h-16 rounded-full bg-slate-800 overflow-hidden mb-3 border-2 border-blue-500 flex items-center justify-center">
                      {filteredAutoridades[0].foto_url && !imageErrors[filteredAutoridades[0].id] ? (
                        <img 
                          src={getProxyUrl(filteredAutoridades[0].foto_url)} 
                          alt={filteredAutoridades[0].nome} 
                          class="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          onError={() => setImageErrors(prev => ({ ...prev, [filteredAutoridades[0].id]: true }))}
                        />
                      ) : (
                        <User class="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <h3 class="font-bold text-white text-sm">{filteredAutoridades[0].nome}</h3>
                    <p class="text-xs text-blue-400 truncate max-w-full font-medium">{filteredAutoridades[0].cargo}</p>
                    <span class="font-mono font-black text-white text-lg mt-3">
                      R$ {totalGastoPorAutoridade[filteredAutoridades[0].id].toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                {/* 3rd Place */}
                {filteredAutoridades[2] && (
                  <div class="glass-panel p-5 rounded-2xl flex flex-col items-center text-center order-3 border-t-2 border-t-amber-700/30">
                    <span class="w-8 h-8 rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/30 flex items-center justify-center text-xs font-bold mb-3">3</span>
                    <div class="w-14 h-14 rounded-full bg-slate-800 overflow-hidden mb-3 border-2 border-amber-700 flex items-center justify-center">
                      {filteredAutoridades[2].foto_url && !imageErrors[filteredAutoridades[2].id] ? (
                        <img 
                          src={getProxyUrl(filteredAutoridades[2].foto_url)} 
                          alt={filteredAutoridades[2].nome} 
                          class="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          onError={() => setImageErrors(prev => ({ ...prev, [filteredAutoridades[2].id]: true }))}
                        />
                      ) : (
                        <User class="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <h3 class="font-bold text-white text-xs">{filteredAutoridades[2].nome}</h3>
                    <p class="text-[10px] text-slate-400 truncate max-w-full">{filteredAutoridades[2].cargo}</p>
                    <span class="font-mono font-extrabold text-white text-sm mt-3">
                      R$ {totalGastoPorAutoridade[filteredAutoridades[2].id].toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* General bar graph comparison of all authorities */}
            <div class="lg:col-span-12 glass-panel p-5 rounded-2xl">
              <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Gráfico Comparativo de Total Gasto</h3>
              <div class="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredAutoridades.map(aut => ({
                      name: aut.nome.split(" ").slice(0, 2).join(" "),
                      Gasto: totalGastoPorAutoridade[aut.id] || 0,
                      poder: aut.poder
                    }))}
                    margin={{ top: 10, right: 10, left: 20, bottom: 20 }}
                  >
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `R$ ${v / 1000}k`} tickLine={false} />
                    <Tooltip 
                      formatter={(value: any) => `R$ ${parseFloat(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                      contentStyle={{ backgroundColor: "#090d16", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                    />
                    <Bar dataKey="Gasto" radius={[4, 4, 0, 0]}>
                      {filteredAutoridades.map((aut, index) => (
                        <Cell key={`cell-${index}`} fill={COLOR_MAP[aut.poder]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* Tab 4: Civic Methodology explanation */}
        {activeTab === "metodologia" && (
          <div id="tab-metodologia-content" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl flex flex-col gap-6 leading-relaxed">
              <div>
                <span class="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Controle Social Ativo</span>
                <h2 class="text-2xl font-bold text-white mt-1">Como consolidamos os dados?</h2>
              </div>

              <p class="text-sm text-slate-300">
                O **Transparência-Top** unifica as despesas de representantes de todas as esferas e poderes nacionais. Em virtude do formato fragmentado dos portais do governo, o sistema opera sob uma 
                **Camada de Extração, Tradução e Carga (ETL)** que normaliza as rubricas originais de gastos em categorias globais padronizadas.
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div class="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <h3 class="font-bold text-white text-xs uppercase tracking-wider mb-2">1. Captura & Higienização</h3>
                  <p class="text-xs text-slate-400">
                    Buscamos registros das faturas do cartão corporativo (Executivo), cota parlamentar (Câmara e Senado) e empenhos de diárias (Supremo Tribunal Federal).
                  </p>
                </div>
                <div class="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <h3 class="font-bold text-white text-xs uppercase tracking-wider mb-2">2. Dicionário Unificado</h3>
                  <p class="text-xs text-slate-400">
                    Valores rotulados genericamente como "serviços terceiros" ou "suprimentos" são interpretados por algoritmos baseados em heurísticas e reatribuídos a categorias como **MANUTENÇÃO**, **TRANSPORTE** ou **HOSPEDAGEM**.
                  </p>
                </div>
              </div>

              <div class="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl text-xs flex gap-3 text-slate-300">
                <Info class="w-5 h-5 text-blue-400 shrink-0" />
                <p>
                  **Aviso Cidadão:** Este painel é uma ferramenta demonstrativa de controle social. Os dados reais provêm das APIs oficiais dos Dados Abertos e do Portal da Transparência da CGU, sob licença de dados públicos abertos da República Federativa do Brasil.
                </p>
              </div>
            </div>

            <div class="lg:col-span-4 flex flex-col gap-6">
              <div class="glass-panel p-5 rounded-2xl">
                <h3 class="font-bold text-white text-xs uppercase tracking-wider mb-3">Fontes Mapeadas</h3>
                <ul class="space-y-3 text-xs">
                  <li class="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                    <span class="text-slate-300">Portal da Transparência Federal</span>
                    <span class="text-blue-400 font-mono text-[10px]">Executivo</span>
                  </li>
                  <li class="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                    <span class="text-slate-300">Dados Abertos da Câmara</span>
                    <span class="text-indigo-400 font-mono text-[10px]">Câmara</span>
                  </li>
                  <li class="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                    <span class="text-slate-300">Dados Abertos do Senado</span>
                    <span class="text-indigo-400 font-mono text-[10px]">Senado</span>
                  </li>
                  <li class="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                    <span class="text-slate-300">Supremo Tribunal Federal</span>
                    <span class="text-purple-400 font-mono text-[10px]">Judiciário</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Servidores Públicos Live Query Tool */}
        {activeTab === "servidores" && (
          <div id="tab-servidores-content" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left side: Search & Results list */}
            <div class="lg:col-span-6 flex flex-col gap-4">
              
              {/* Informative Title */}
              <div class="glass-panel p-5 rounded-2xl">
                <span class="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                  <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                  Integração Oficial Portal da Transparência da CGU
                </span>
                <h2 class="text-lg font-bold text-white mt-1">Consulta Geral de Servidores Públicos</h2>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                  Pesquise no cadastro geral de funcionários civis federais da República Federativa do Brasil. Insira o nome de um servidor para inspecionar seu histórico funcional e remunerações.
                </p>
                
                {isSandboxMode && (
                  <div class="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[11px] text-blue-300 flex gap-2">
                    <Info class="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Modo de Demonstração (Sandbox):</strong> O sistema está rodando sem chave da API do governo. Exibindo cadastro simulado de alta fidelidade. Para conectar à base de dados real do Portal da Transparência, configure a variável de ambiente <code>API_KEY_GOV</code> no seu Vercel ou no arquivo <code>.env</code>.
                    </span>
                  </div>
                )}
              </div>

              {/* Search Inputs and Actions */}
              <div class="glass-panel p-5 rounded-2xl flex flex-col gap-4">
                
                {/* 1st Row: Nome & CPF */}
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Nome Search */}
                  <div class="space-y-1">
                    <label class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Nome do Servidor (Opcional)</label>
                    <div class="relative">
                      <span class="absolute left-3 top-2.5 text-slate-500">
                        <User class="w-4 h-4" />
                      </span>
                      <input 
                        id="servidores-search-input"
                        type="text"
                        value={servidoresSearch}
                        onChange={(e) => setServidoresSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSearchServidores(1);
                        }}
                        placeholder="Nome (ex: SILVA, MARIA...)"
                        class="w-full pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                      {servidoresSearch && (
                        <button 
                          onClick={() => setServidoresSearch("")} 
                          class="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                        >
                          <X class="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* CPF Search */}
                  <div class="space-y-1">
                    <label class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">CPF do Servidor (Busca Direta)</label>
                    <div class="relative">
                      <span class="absolute left-3 top-2.5 text-slate-500">
                        <FileText class="w-4 h-4" />
                      </span>
                      <input 
                        id="cpf-search-input"
                        type="text"
                        value={cpfSearch}
                        onChange={(e) => setCpfSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSearchServidores(1);
                        }}
                        placeholder="Ex: 12345678901 (Apenas Números)"
                        class="w-full pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                      {cpfSearch && (
                        <button 
                          onClick={() => setCpfSearch("")} 
                          class="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                        >
                          <X class="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2nd Row: Órgão Selector */}
                <div class="space-y-1.5 relative">
                  <div class="flex justify-between items-center">
                    <label class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Órgão de Lotação (Exigido se não buscar por CPF)</label>
                    {selectedOrgaoCode && (
                      <button 
                        onClick={() => {
                          setSelectedOrgaoCode("");
                          setSelectedOrgaoName("");
                          setOrgaosSearchInput("");
                        }}
                        class="text-[9px] text-red-400 hover:underline flex items-center gap-0.5 font-semibold"
                      >
                        <X class="w-3 h-3" /> Limpar Órgão
                      </button>
                    )}
                  </div>

                  {selectedOrgaoCode ? (
                    <div class="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between">
                      <div class="flex items-center gap-2 min-w-0">
                        <Building class="w-4 h-4 text-blue-400 shrink-0" />
                        <div class="min-w-0">
                          <p class="text-xs font-bold text-white truncate max-w-[280px] sm:max-w-[400px]">{selectedOrgaoName}</p>
                          <p class="text-[9px] text-blue-400 font-mono">Código SIAPE: {selectedOrgaoCode}</p>
                        </div>
                      </div>
                      <span class="text-[9px] bg-blue-500/25 text-blue-300 font-bold px-1.5 py-0.5 rounded shrink-0">Selecionado</span>
                    </div>
                  ) : (
                    <div class="space-y-2">
                      <div class="relative">
                        <span class="absolute left-3 top-2.5 text-slate-500">
                          <Search class="w-4 h-4" />
                        </span>
                        <input 
                          type="text"
                          value={orgaosSearchInput}
                          onChange={(e) => {
                            setOrgaosSearchInput(e.target.value);
                            handleSearchOrgaos(e.target.value);
                          }}
                          placeholder="Buscar órgãos (ex: Educação, Saúde, Fazenda, CGU...)"
                          class="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                        {orgaosLoading && (
                          <div class="absolute right-3 top-2.5">
                            <RefreshCw class="w-4 h-4 animate-spin text-blue-500" />
                          </div>
                        )}
                      </div>

                      {/* Organ dropdown results */}
                      {orgaosSearchResults.length > 0 && (
                        <div class="absolute z-10 left-0 right-0 mt-1 bg-slate-900 border border-white/10 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
                          {orgaosSearchResults.map((org: any) => (
                            <div 
                              key={org.codigo}
                              onClick={() => {
                                setSelectedOrgaoCode(org.codigo);
                                setSelectedOrgaoName(org.descricao);
                                setOrgaosSearchResults([]);
                                setOrgaosSearchInput("");
                              }}
                              class="p-2.5 hover:bg-white/5 cursor-pointer text-left text-xs transition-colors flex items-center justify-between"
                            >
                              <span class="font-semibold text-slate-200 truncate pr-2">{org.descricao}</span>
                              <span class="text-[9px] text-blue-400 font-mono shrink-0">SIAPE: {org.codigo}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Quick Popular Presets */}
                      <div class="flex flex-wrap gap-1.5 pt-1 items-center">
                        <span class="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Órgãos Comuns:</span>
                        <button 
                          onClick={() => { setSelectedOrgaoCode("15000"); setSelectedOrgaoName("Ministério da Educação"); }}
                          class="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-[10px] rounded-lg text-slate-300 border border-white/5 transition-all"
                        >
                          MEC
                        </button>
                        <button 
                          onClick={() => { setSelectedOrgaoCode("25000"); setSelectedOrgaoName("Ministério da Saúde"); }}
                          class="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-[10px] rounded-lg text-slate-300 border border-white/5 transition-all"
                        >
                          Saúde
                        </button>
                        <button 
                          onClick={() => { setSelectedOrgaoCode("31000"); setSelectedOrgaoName("Ministério da Economia, Fazenda e Planejamento"); }}
                          class="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-[10px] rounded-lg text-slate-300 border border-white/5 transition-all"
                        >
                          Fazenda
                        </button>
                        <button 
                          onClick={() => { setSelectedOrgaoCode("20125"); setSelectedOrgaoName("Controladoria-Geral da União"); }}
                          class="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-[10px] rounded-lg text-slate-300 border border-white/5 transition-all"
                        >
                          CGU
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Consultation button */}
                <button 
                  id="btn-search-servidores"
                  onClick={() => handleSearchServidores(1)}
                  disabled={servidoresLoading}
                  class="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-all shrink-0 mt-1"
                >
                  {servidoresLoading ? <RefreshCw class="w-4 h-4 animate-spin" /> : <Search class="w-4 h-4" />}
                  REALIZAR CONSULTA OFICIAL
                </button>
              </div>

              {/* Error messages */}
              {servidoresError && (
                <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex gap-2">
                  <AlertTriangle class="w-4 h-4 shrink-0" />
                  <span>{servidoresError}</span>
                </div>
              )}

              {/* Servidores Results list */}
              <div class="glass-panel rounded-2xl flex flex-col overflow-hidden">
                <div class="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
                  <span class="text-xs font-bold text-white uppercase tracking-wider">
                    Servidores Encontrados ({servidoresList.length})
                  </span>
                  <span class="text-[10px] text-slate-500 font-mono">Página {servidoresPage}</span>
                </div>

                {servidoresLoading ? (
                  <div class="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                    <RefreshCw class="w-6 h-6 animate-spin text-blue-500" />
                    <span class="text-xs">Consultando banco de dados do Portal da Transparência...</span>
                  </div>
                ) : servidoresList.length === 0 ? (
                  <div class="p-12 text-center text-slate-500 text-xs">
                    Nenhum servidor encontrado. Digite pelo menos 3 caracteres e clique em Consultar.
                  </div>
                ) : (
                  <div class="divide-y divide-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {servidoresList.map((item, idx) => {
                      const idVal = item.id || item.servidor?.idServidorPensionista || item.servidor?.id || idx;
                      const sName = item.servidor?.pessoa?.nome || item.servidor?.nome || "Nome não disponível";
                      const sCpf = item.servidor?.pessoa?.cpfFormatado || item.servidor?.cpfFormatado || "CPF Ocultado";
                      const sState = item.servidor?.estado || item.servidor?.pessoa?.estado || "N/A";
                      const isSelected = (selectedServidor?.id || selectedServidor?.servidor?.idServidorPensionista || selectedServidor?.servidor?.id) === idVal;

                      // Extract main role
                      const firstCargo = item.fichasCargoEfetivo?.[0];
                      const cargoName = firstCargo?.cargo || "Cargo não especificado";
                      const orgaoName = firstCargo?.orgaoServidorExercicio || "Órgão não especificado";

                      return (
                        <div 
                          key={idVal}
                          onClick={() => {
                            setSelectedServidor(item);
                            handleFetchRemuneracao(idVal, remuneracaoMesAno);
                          }}
                          class={`p-4 hover:bg-white/5 transition-all cursor-pointer flex items-center justify-between gap-3 ${isSelected ? "bg-white/[0.03] border-l-2 border-l-blue-500" : ""}`}
                        >
                          <div class="space-y-1.5 min-w-0">
                            <div class="flex items-center gap-2">
                              <span class="font-bold text-white text-xs truncate block max-w-[280px]">
                                {sName}
                              </span>
                              <span class={`px-1.5 py-0.5 rounded text-[8px] font-bold ${item.situacao === "Ativo" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                                {item.situacao || "Ativo"}
                              </span>
                            </div>
                            <p class="text-[10px] text-blue-400 truncate max-w-[320px] font-medium">{cargoName}</p>
                            <p class="text-[10px] text-slate-400 truncate max-w-[320px]">{orgaoName}</p>
                            <div class="flex items-center gap-2 text-[9px] text-slate-500 font-mono">
                              <span>CPF: {sCpf}</span>
                              <span>•</span>
                              <span>UF: {sState}</span>
                            </div>
                          </div>
                          
                          <ChevronRight class="w-4 h-4 text-slate-500" />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Simple pagination */}
                <div class="p-3 border-t border-white/10 flex items-center justify-between bg-white/[0.01]">
                  <button
                    disabled={servidoresPage <= 1 || servidoresLoading}
                    onClick={() => handleSearchServidores(servidoresPage - 1)}
                    class="px-2.5 py-1 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-[10px] font-semibold rounded-lg text-slate-300 transition-all flex items-center gap-1"
                  >
                    <ChevronLeft class="w-3.5 h-3.5" /> Anterior
                  </button>
                  <span class="text-[10px] text-slate-400 font-semibold font-mono">Pág. {servidoresPage}</span>
                  <button
                    disabled={servidoresList.length < 5 || servidoresLoading}
                    onClick={() => handleSearchServidores(servidoresPage + 1)}
                    class="px-2.5 py-1 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-[10px] font-semibold rounded-lg text-slate-300 transition-all flex items-center gap-1"
                  >
                    Próximo <ChevronRight class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right side: Detailed Servant Overview & Remuneration */}
            <div class="lg:col-span-6 flex flex-col gap-4">
              {selectedServidor ? (
                <div class="space-y-4">
                  
                  {/* General details Card */}
                  <div class="glass-panel p-5 rounded-2xl border-t-2 border-t-blue-500 space-y-4">
                    <div class="flex justify-between items-start gap-2">
                      <div>
                        <span class="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-1">DADOS FUNCIONAIS DETALHADOS</span>
                        <h3 class="text-base font-bold text-white">{selectedServidor.servidor?.pessoa?.nome || selectedServidor.servidor?.nome || "Nome não disponível"}</h3>
                        <p class="text-[11px] text-slate-400 mt-0.5 font-mono">ID Registro: {selectedServidor.id || selectedServidor.servidor?.idServidorPensionista || selectedServidor.servidor?.id || "N/A"}</p>
                      </div>
                      <span class={`px-2 py-0.5 rounded-full text-[10px] font-bold ${selectedServidor.situacao === "Ativo" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/15 text-amber-400 border border-amber-500/20"}`}>
                        {selectedServidor.situacao || "Ativo"}
                      </span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                      <div class="p-3 bg-white/5 border border-white/5 rounded-xl space-y-1">
                        <span class="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Órgão Exercício</span>
                        <p class="text-white font-medium">{selectedServidor.fichasCargoEfetivo?.[0]?.orgaoServidorExercicio || "Não especificado"}</p>
                        <span class="text-[9px] text-slate-500 font-mono block">UORG: {selectedServidor.fichasCargoEfetivo?.[0]?.uorgExercicio || "N/A"}</span>
                      </div>

                      <div class="p-3 bg-white/5 border border-white/5 rounded-xl space-y-1">
                        <span class="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Órgão Lotação</span>
                        <p class="text-white font-medium">{selectedServidor.fichasCargoEfetivo?.[0]?.orgaoServidorLotacao || "Não especificado"}</p>
                        <span class="text-[9px] text-slate-500 font-mono block">UORG: {selectedServidor.fichasCargoEfetivo?.[0]?.uorgLotacao || "N/A"}</span>
                      </div>

                      <div class="p-3 bg-white/5 border border-white/5 rounded-xl space-y-1">
                        <span class="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Cargo Efetivo</span>
                        <p class="text-white font-medium">{selectedServidor.fichasCargoEfetivo?.[0]?.cargo || "Não especificado"}</p>
                        <span class="text-[9px] text-slate-500 block">Classe: {selectedServidor.fichasCargoEfetivo?.[0]?.classe || "N/A"}</span>
                      </div>

                      <div class="p-3 bg-white/5 border border-white/5 rounded-xl space-y-1">
                        <span class="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Cargo Função/Comissão</span>
                        <p class="text-white font-medium">{selectedServidor.fichasFuncao?.[0]?.atividade || "Nenhuma função comissionada"}</p>
                        <span class="text-[9px] text-slate-500 block">Opção Cargo Efetivo: {selectedServidor.fichasFuncao?.[0]?.opcaoCargoEfetivo ? "Sim" : "Não"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Remuneration Card */}
                  <div class="glass-panel p-5 rounded-2xl space-y-4">
                    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <h3 class="text-sm font-bold text-white flex items-center gap-1.5">
                          <Coins class="w-4 h-4 text-emerald-400" />
                          Extrato de Remuneração CGU
                        </h3>
                        <p class="text-[10px] text-slate-400 mt-0.5">Detalhamento dos rendimentos públicos mensais</p>
                      </div>

                      {/* Period/month selector */}
                      <div class="flex items-center gap-2">
                        <span class="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Período:</span>
                        <select
                          value={remuneracaoMesAno}
                          onChange={(e) => {
                            setRemuneracaoMesAno(e.target.value);
                            const idVal = selectedServidor.id || selectedServidor.servidor?.idServidorPensionista || selectedServidor.servidor?.id;
                            if (idVal) handleFetchRemuneracao(idVal, e.target.value);
                          }}
                          class="bg-white/5 border border-white/10 rounded-xl px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="202312" class="bg-slate-950 text-white">Dezembro / 2023</option>
                          <option value="202311" class="bg-slate-950 text-white">Novembro / 2023</option>
                          <option value="202310" class="bg-slate-950 text-white">Outubro / 2023</option>
                          <option value="202309" class="bg-slate-950 text-white">Setembro / 2023</option>
                        </select>
                      </div>
                    </div>

                    {remuneracaoLoading ? (
                      <div class="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                        <RefreshCw class="w-5 h-5 animate-spin text-emerald-400" />
                        <span class="text-xs">Buscando folha de pagamento do servidor...</span>
                      </div>
                    ) : remuneracaoError ? (
                      <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 text-center">
                        {remuneracaoError}
                      </div>
                    ) : remuneracaoData ? (
                      <div class="space-y-4">
                        
                        {/* Summary Numbers */}
                        <div class="grid grid-cols-2 gap-3 text-xs">
                          <div class="p-3 bg-white/5 border border-white/5 rounded-xl">
                            <span class="text-[9px] text-slate-400 uppercase tracking-widest block font-medium">Rendimento Bruto</span>
                            <span class="text-lg font-bold text-white font-mono block mt-1">
                              R$ {(remuneracaoData.remuneracaoBasicaBruta + (remuneracaoData.outrasRemuneracoesEventuais || 0) + (remuneracaoData.ferias || 0) + (remuneracaoData.gratificacaoNatalina || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <span class="text-[9px] text-emerald-400 uppercase tracking-widest block font-medium">Líquido Recebido</span>
                            <span class="text-lg font-bold text-emerald-400 font-mono block mt-1">
                              R$ {remuneracaoData.remuneracaoLiquida.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        {/* Breakdown Progress Bars */}
                        <div class="space-y-3.5">
                          {/* 1. Salario Base */}
                          <div>
                            <div class="flex justify-between text-xs mb-1">
                              <span class="text-slate-400">Remuneração Básica (Salário Base)</span>
                              <span class="text-white font-mono">R$ {remuneracaoData.remuneracaoBasicaBruta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                              <div class="bg-blue-500 h-full rounded-full w-full"></div>
                            </div>
                          </div>

                          {/* 2. Remuneracoes Eventuais */}
                          {((remuneracaoData.outrasRemuneracoesEventuais || 0) > 0 || (remuneracaoData.ferias || 0) > 0 || (remuneracaoData.gratificacaoNatalina || 0) > 0) && (
                            <div>
                              <div class="flex justify-between text-xs mb-1">
                                <span class="text-slate-400">Rendimentos Eventuais / Férias / 13º</span>
                                <span class="text-white font-mono">R$ {((remuneracaoData.outrasRemuneracoesEventuais || 0) + (remuneracaoData.ferias || 0) + (remuneracaoData.gratificacaoNatalina || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div class="bg-purple-500 h-full rounded-full" style={{ width: `${(((remuneracaoData.outrasRemuneracoesEventuais || 0) + (remuneracaoData.ferias || 0) + (remuneracaoData.gratificacaoNatalina || 0)) / (remuneracaoData.remuneracaoBasicaBruta || 1)) * 100}%` }}></div>
                              </div>
                            </div>
                          )}

                          {/* 3. Imposto de Renda */}
                          <div>
                            <div class="flex justify-between text-xs mb-1">
                              <span class="text-rose-400">Dedução: Imposto de Renda Retido na Fonte (IRRF)</span>
                              <span class="text-rose-400 font-mono">- R$ {remuneracaoData.impostoRenda.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                              <div class="bg-rose-500 h-full rounded-full" style={{ width: `${(remuneracaoData.impostoRenda / (remuneracaoData.remuneracaoBasicaBruta || 1)) * 100}%` }}></div>
                            </div>
                          </div>

                          {/* 4. Previdencia Oficial */}
                          <div>
                            <div class="flex justify-between text-xs mb-1">
                              <span class="text-amber-500">Dedução: Contribuição Previdenciária Oficial</span>
                              <span class="text-amber-500 font-mono">- R$ {remuneracaoData.previdenciaOficial.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                              <div class="bg-amber-500 h-full rounded-full" style={{ width: `${(remuneracaoData.previdenciaOficial / (remuneracaoData.remuneracaoBasicaBruta || 1)) * 100}%` }}></div>
                            </div>
                          </div>

                          {/* 5. Outros descontos */}
                          {remuneracaoData.outrosDescontos > 0 && (
                            <div>
                              <div class="flex justify-between text-xs mb-1">
                                <span class="text-slate-400">Dedução: Outros Descontos / Retenções Teto</span>
                                <span class="text-slate-400 font-mono">- R$ {remuneracaoData.outrosDescontos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div class="bg-slate-500 h-full rounded-full" style={{ width: `${(remuneracaoData.outrosDescontos / (remuneracaoData.remuneracaoBasicaBruta || 1)) * 100}%` }}></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Audit message or AI breakdown helper */}
                        <div class="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[11px] text-slate-300 flex items-center justify-between gap-2">
                          <span class="leading-relaxed">
                            <strong>Transparência Fiscal:</strong> Esta remuneração respeita os limites estabelecidos pelo teto constitucional do funcionalismo público federal brasileiro.
                          </span>
                          
                          <button
                            onClick={() => {
                              // Forward to chatbot with deep detailed question
                              setActiveTab("dashboard");
                              const prompt = `Analise a remuneração de ${selectedServidor.servidor?.pessoa?.nome || selectedServidor.servidor?.nome || "Nome não disponível"} que recebe R$ ${remuneracaoData.remuneracaoLiquida.toLocaleString("pt-BR")} líquidos de um salário bruto de R$ ${remuneracaoData.remuneracaoBasicaBruta.toLocaleString("pt-BR")}. O que você acha desses descontos e desse nível salarial para o cargo de ${selectedServidor.fichasCargoEfetivo?.[0]?.cargo}?`;
                              setChatInput(prompt);
                              // We can simulate sending automatically!
                              setTimeout(() => {
                                const sendBtn = document.getElementById("btn-send-chat");
                                if (sendBtn) sendBtn.click();
                              }, 150);
                            }}
                            class="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-bold shrink-0 transition-all flex items-center gap-1 uppercase tracking-wider"
                          >
                            <Sparkles class="w-3 h-3" /> Analisar c/ IA
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div class="py-12 text-center text-slate-500 text-xs">
                        Nenhuma informação de remuneração cadastrada para o período selecionado ou este servidor não possui faturas ativas.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div class="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center gap-4 text-slate-400 h-full min-h-[350px]">
                  <div class="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                    <User class="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-white">Nenhum Servidor Selecionado</h3>
                    <p class="text-xs text-slate-400 mt-1 max-w-sm">
                      Selecione um servidor na lista ao lado para inspecionar em detalhes sua ficha funcional de classe e seu salário líquido real do Portal da Transparência.
                    </p>
                  </div>
                  
                  <div class="flex flex-wrap items-center justify-center gap-1.5 pt-2 max-w-xs">
                    <span class="text-[9px] text-slate-500 uppercase font-mono tracking-widest block w-full mb-1">Buscas Sugeridas:</span>
                    <button onClick={() => { setServidoresSearch("CARLOS"); setTimeout(() => handleSearchServidores(1), 50); }} class="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-[10px] rounded-lg text-slate-300 border border-white/5">Carlos</button>
                    <button onClick={() => { setServidoresSearch("MARIA"); setTimeout(() => handleSearchServidores(1), 50); }} class="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-[10px] rounded-lg text-slate-300 border border-white/5">Maria</button>
                    <button onClick={() => { setServidoresSearch("ANA"); setTimeout(() => handleSearchServidores(1), 50); }} class="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-[10px] rounded-lg text-slate-300 border border-white/5">Ana</button>
                    <button onClick={() => { setServidoresSearch("FERNANDO"); setTimeout(() => handleSearchServidores(1), 50); }} class="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-[10px] rounded-lg text-slate-300 border border-white/5">Fernando</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Detailed Drawer Overlay: Clicking on an Authority */}
      <AnimatePresence>
        {selectedAutoridadeId && selectedAutoridade && (
          <div id="inspector-overlay" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              class="w-full max-w-2xl bg-slate-950/95 border-l border-white/10 h-full flex flex-col relative z-50 overflow-hidden shadow-2xl"
            >
              
              {/* Header profile of inspector drawer */}
              <div class="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-full border border-white/20 overflow-hidden bg-slate-800 flex items-center justify-center">
                    {selectedAutoridade.foto_url && !imageErrors[selectedAutoridade.id] ? (
                      <img 
                        src={getProxyUrl(selectedAutoridade.foto_url)} 
                        alt={selectedAutoridade.nome} 
                        class="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                        onError={() => setImageErrors(prev => ({ ...prev, [selectedAutoridade.id]: true }))}
                      />
                    ) : (
                      <User class="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <span class="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{selectedAutoridade.cargo}</span>
                    <h2 class="text-lg font-bold text-white leading-tight">{selectedAutoridade.nome}</h2>
                    <p class="text-xs text-slate-400 mt-0.5">{selectedAutoridade.orgao_instituicao} • UF: {selectedAutoridade.estado}</p>
                  </div>
                </div>

                <button 
                  id="close-inspector"
                  onClick={() => {
                    setSelectedAutoridadeId(null);
                    setReportSuccess(false);
                  }}
                  class="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content Area */}
              <div class="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
                
                {/* Micro aggregated spending overview */}
                <div class="grid grid-cols-2 gap-4">
                  <div class="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span class="text-[10px] text-slate-400 uppercase tracking-widest">Total Despendido</span>
                    <p class="text-xl font-bold font-mono text-white mt-1">
                      R$ {(totalGastoPorAutoridade[selectedAutoridade.id] || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div class="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span class="text-[10px] text-slate-400 uppercase tracking-widest">Nº de Lançamentos</span>
                    <p class="text-xl font-bold font-mono text-white mt-1">
                      {selectedAutoridadeGastos.length} faturas
                    </p>
                  </div>
                </div>

                {/* Local Category breakdown visualizer */}
                <div class="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-white mb-3">Distribuição por Categoria</h3>
                  <div class="space-y-3">
                    {selectedAutoridadeCategoryData.map(cat => (
                      <div key={cat.name}>
                        <div class="flex justify-between text-[11px] mb-1">
                          <span class="text-slate-400 font-semibold">{cat.name}</span>
                          <span class="text-white font-mono">{cat.percentage.toFixed(1)}% ({cat.value.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} BRL)</span>
                        </div>
                        <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div 
                            class="bg-blue-500 h-full rounded-full" 
                            style={{ 
                              width: `${cat.percentage}%`,
                              backgroundColor: CATEGORY_COLORS[cat.name as CategoriaUnificada] 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* List of raw individual bills with auditor report */}
                <div>
                  <h3 class="text-xs font-bold uppercase tracking-wider text-white mb-3">Notas Fiscais & Lançamentos</h3>
                  <div class="space-y-3">
                    {selectedAutoridadeGastos.map(g => (
                      <div key={g.id} class="p-3.5 bg-white/5 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div class="space-y-1 max-w-sm">
                          <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold tracking-wider text-slate-300">
                              {g.categoria_unificada}
                            </span>
                            <span class="text-[10px] text-slate-500 font-mono">{new Date(g.data_gasto).toLocaleDateString("pt-BR")}</span>
                          </div>
                          <p class="text-white font-medium leading-normal">{g.descricao_original}</p>
                          <div class="text-[10px] text-slate-400">
                            Fornecedor: <span class="text-slate-300 font-semibold">{g.fornecedor_nome}</span> 
                            {g.documento_fiscal && <span class="text-slate-500 font-mono block">Documento/CNPJ: {g.documento_fiscal}</span>}
                          </div>
                        </div>
                        
                        <div class="flex sm:flex-col items-end justify-between sm:justify-center gap-1">
                          <span class="text-white font-mono font-bold text-sm">
                            R$ {g.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                          <button 
                            onClick={() => {
                              setReportForm(prev => ({ ...prev, gastoId: g.id }));
                              setIsReportingIrregularity(true);
                            }}
                            class="text-[9px] text-red-400 hover:text-red-300 hover:underline flex items-center gap-0.5"
                          >
                            <AlertTriangle class="w-3 h-3" /> Reportar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick PDF export sim card */}
                <div class="p-4 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 class="text-xs font-bold text-white">Relatório Consolidado de {selectedAutoridade.nome.split(" ")[0]}</h4>
                    <p class="text-[10px] text-slate-400">Gerar extrato detalhado para auditoria de cidadania</p>
                  </div>
                  <button 
                    onClick={handleExportReport}
                    class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <FileSpreadsheet class="w-3.5 h-3.5" /> Planilha
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Report spending irregularity */}
      <AnimatePresence>
        {isReportingIrregularity && (
          <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              class="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 relative"
            >
              <button 
                onClick={() => setIsReportingIrregularity(false)} 
                class="absolute right-4 top-4 text-slate-400 hover:text-white"
              >
                <X class="w-5 h-5" />
              </button>

              <h3 class="text-base font-bold text-white flex items-center gap-2 mb-2">
                <AlertTriangle class="w-5 h-5 text-red-400 animate-pulse" />
                Auditar & Reportar Despesa
              </h3>
              <p class="text-xs text-slate-400 mb-4 leading-relaxed">
                Você está reportando suspeitas de superfaturamento ou irregularidade fiscal para o lançamento **ID: {reportForm.gastoId}**. O relatório será submetido à ouvidoria pública correspondente.
              </p>

              <form onSubmit={submitIrregularityReport} class="space-y-4">
                <div>
                  <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Seu Nome Completo</label>
                  <input 
                    type="text" 
                    required
                    value={reportForm.name}
                    onChange={(e) => setReportForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: João da Silva"
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Seu E-mail</label>
                  <input 
                    type="email" 
                    required
                    value={reportForm.email}
                    onChange={(e) => setReportForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Ex: joao@cidadania.org"
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Evidência / Justificativa Cidadã</label>
                  <textarea 
                    required
                    rows={3}
                    value={reportForm.comment}
                    onChange={(e) => setReportForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Descreva por que considera este gasto excessivo ou irregular..."
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-400"
                  />
                </div>

                <div class="flex items-center gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsReportingIrregularity(false)} 
                    class="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    class="flex-1 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl text-xs font-semibold hover:from-red-600 hover:to-rose-700 transition-all"
                  >
                    Enviar Denúncia
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Report Irregularity Success Popup */}
      <AnimatePresence>
        {reportSuccess && (
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              class="w-full max-w-sm bg-slate-900 border border-emerald-500/20 p-6 rounded-3xl text-center flex flex-col items-center"
            >
              <div class="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle class="w-6 h-6 text-emerald-400" />
              </div>
              <h3 class="text-sm font-bold text-white mb-2">Denúncia Enviada à Ouvidoria!</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                Obrigado pelo seu compromisso com a transparência pública. A denúncia cidadã foi indexada com hash oficial e reportada ao canal competente para análise fiscal de conformidade.
              </p>
              <button 
                onClick={() => setReportSuccess(false)}
                class="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all"
              >
                Concluir
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Simulate Spending (Adding Spending) */}
      <AnimatePresence>
        {showAddSpendingModal && (
          <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              class="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 relative"
            >
              <button 
                onClick={() => setShowAddSpendingModal(false)} 
                class="absolute right-4 top-4 text-slate-400 hover:text-white"
              >
                <X class="w-5 h-5" />
              </button>

              <h3 class="text-base font-bold text-white flex items-center gap-2 mb-2">
                <Sparkles class="w-5 h-5 text-blue-400 animate-pulse" />
                Simular Nova Despesa Pública
              </h3>
              <p class="text-xs text-slate-400 mb-4 leading-relaxed">
                Adicione uma despesa simulada para testar como os gráficos de categorias unificadas se comportam e como o ranking dinâmico é atualizado instantaneamente!
              </p>

              <form onSubmit={handleAddSpending} class="space-y-4">
                <div>
                  <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Autoridade Alvo</label>
                  <select 
                    value={newSpending.autoridadeId}
                    onChange={(e) => setNewSpending(prev => ({ ...prev, autoridadeId: e.target.value }))}
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    {AUTORIDADES.map(a => (
                      <option key={a.id} value={a.id} class="bg-slate-950 text-white">{a.nome} ({a.cargo})</option>
                    ))}
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Valor (BRL)</label>
                    <input 
                      type="number" 
                      required
                      step="0.01"
                      value={newSpending.valor}
                      onChange={(e) => setNewSpending(prev => ({ ...prev, valor: e.target.value }))}
                      placeholder="Ex: 125000"
                      class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Categoria Unificada</label>
                    <select 
                      value={newSpending.categoria}
                      onChange={(e) => setNewSpending(prev => ({ ...prev, categoria: e.target.value as CategoriaUnificada }))}
                      class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="MANUTENÇÃO E OPERAÇÃO" class="bg-slate-950 text-white">MANUTENÇÃO E OPERAÇÃO</option>
                      <option value="TRANSPORTE E VIAGENS" class="bg-slate-950 text-white">TRANSPORTE E VIAGENS</option>
                      <option value="HOSPEDAGEM" class="bg-slate-950 text-white">HOSPEDAGEM</option>
                      <option value="ALIMENTAÇÃO" class="bg-slate-950 text-white">ALIMENTAÇÃO</option>
                      <option value="SEGURANÇA E LOGÍSTICA" class="bg-slate-950 text-white">SEGURANÇA E LOGÍSTICA</option>
                      <option value="OUTROS GASTOS CORPORATIVOS" class="bg-slate-950 text-white">OUTROS GASTOS CORPORATIVOS</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Descrição Original do Empenho</label>
                  <input 
                    type="text" 
                    required
                    value={newSpending.descricao}
                    onChange={(e) => setNewSpending(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Ex: Aquisição de combustíveis oficiais aeronáuticos"
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Fornecedor (Opcional)</label>
                    <input 
                      type="text" 
                      value={newSpending.fornecedor}
                      onChange={(e) => setNewSpending(prev => ({ ...prev, fornecedor: e.target.value }))}
                      placeholder="Ex: Petrobras"
                      class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">CNPJ Fornecedor (Opcional)</label>
                    <input 
                      type="text" 
                      value={newSpending.cnpj}
                      onChange={(e) => setNewSpending(prev => ({ ...prev, cnpj: e.target.value }))}
                      placeholder="Ex: 00.000.000/0001-91"
                      class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div class="flex items-center gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddSpendingModal(false)} 
                    class="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    class="flex-1 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-xs font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
                  >
                    Salvar Despesa
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
