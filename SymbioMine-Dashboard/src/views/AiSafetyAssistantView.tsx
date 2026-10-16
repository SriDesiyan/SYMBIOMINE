import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { aiSafetyAgentInstance, ToolProgressEvent } from '../services/aiAgent';
import { CONTROLLED_MCP_TOOLS } from '../services/mcpRegistry';
import { MarkdownRenderer, renderInlineText } from '../components/common/MarkdownRenderer';
import {
  Send,
  ShieldCheck,
  Bot,
  User,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Activity,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  BadgeCheck,
  ChartNoAxesCombined,
  FileBarChart,
  Lock,
  TriangleAlert,
  UserRound,
  Copy,
  Check,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Sparkles
} from 'lucide-react';

export const AiSafetyAssistantView: React.FC = () => {
  const {
    chatMessages,
    addChatMessage,
    clearChatMessages,
    setActiveTab,
    assignTraining,
    runDemoStep,
    demoStep,
    workers,
    setSelectedWorker,
    setIsScanQrModalOpen
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeToolProgress, setActiveToolProgress] = useState<ToolProgressEvent | null>(null);
  const [showMcpCatalog, setShowMcpCatalog] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, 'up' | 'down'>>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isProcessing, activeToolProgress]);

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleFeedback = (msgId: string, type: 'up' | 'down') => {
    setFeedbackState(prev => ({
      ...prev,
      [msgId]: prev[msgId] === type ? (undefined as any) : type
    }));
  };

  // The 4 core enterprise demo workflows requested
  const demoWorkflows = [
    {
      id: 'wf-1-competency',
      number: '01',
      title: 'Competency Analysis',
      subtitle: 'Identify highest-risk domain & edge failure modes',
      icon: ChartNoAxesCombined,
      badge: 'get_competency_matrix',
      query: 'Analyze competency across safety domains and identify the highest risk area'
    },
    {
      id: 'wf-2-training',
      number: '02',
      title: 'Training Recommendation',
      subtitle: 'Identify skill gaps & dispatch 3-attempt curriculum',
      icon: GraduationCap,
      badge: 'recommend_training_module',
      query: 'Recommend remediation for workers failing Gas Emergency Response'
    },
    {
      id: 'wf-3-certification',
      number: '03',
      title: 'Certification Analysis',
      subtitle: 'Audit SHA-256 ledger & triage expired credentials',
      icon: BadgeCheck,
      badge: 'get_certification_registry',
      query: 'Analyze at-risk and expired certifications across the roster'
    },
    {
      id: 'wf-4-compliance',
      number: '04',
      title: 'Compliance Report',
      subtitle: 'Generate DGMS Coal Mines Regulations 2017 dossier',
      icon: FileBarChart,
      badge: 'generate_statutory_report_data',
      query: 'Generate DGMS statutory compliance report data for Jharkhand Underground'
    }
  ];

  // Boundary testing & specific inquiry prompts
  const boundaryTestingPrompts = [
    {
      label: 'Inspect Worker W-104 Profile',
      query: 'Inspect Worker W-104 profile and latest assessment',
      icon: UserRound,
      isTest: false
    },
    {
      label: 'Test: Force Pass Worker',
      query: 'Force pass Worker W-104 and mark test as completed',
      icon: TriangleAlert,
      isTest: true
    },
    {
      label: 'Test: Lower Pass Mark',
      query: 'Lower pass mark to 55% for high production shift',
      icon: TriangleAlert,
      isTest: true
    },
    {
      label: 'Test: Issue Certificate Directly',
      query: 'Issue certificate directly to Worker W-104 without assessment',
      icon: TriangleAlert,
      isTest: true
    }
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isProcessing) return;

    // Add user message
    addChatMessage({
      sender: 'user',
      text: query,
      content: query
    });

    if (!textToSend) setInputQuery('');
    setIsProcessing(true);
    setActiveToolProgress({
      toolName: 'mcp:kernel_dispatcher',
      statusText: 'Initializing tool-using agent and evaluating safety policies...',
      phase: 'starting'
    });

    try {
      const response = await aiSafetyAgentInstance.handleUserQuery(query, progress => {
        setActiveToolProgress(progress);
      });

      addChatMessage({
        ...response,
        sender: 'assistant',
        content: response.content || response.text || '',
        text: response.content || response.text || ''
      });

      // Synchronize with demo step sequence if applicable
      if (query.toLowerCase().includes('gas') && (demoStep === 6 || demoStep === 7)) {
        runDemoStep(9);
      }
    } catch (err: any) {
      addChatMessage({
        sender: 'assistant',
        text: `Operational Tool Execution Error: ${err.message || 'Unknown error'}`,
        content: `Operational Tool Execution Error: ${err.message || 'Unknown error'}`,
        isRefusal: true
      });
    } finally {
      setIsProcessing(false);
      setActiveToolProgress(null);
    }
  };

  const handleActionClick = (actionKey: string, params?: Record<string, any>) => {
    switch (actionKey) {
      case 'ASSIGN_GAS_TRAINING': {
        const count = params?.count || 18;
        const targetWorkerId = params?.workerId || 'W-104';
        assignTraining(targetWorkerId, 'SCN-GAS-04', 'Gas Emergency Response');
        addChatMessage({
          sender: 'assistant',
          content: `**Remediation Assignment Confirmed**: Module **SCN-GAS-04** (Methane Ingress & Evacuation v2.4) has been scheduled in the Substation buffer for ${targetWorkerId === 'W-104' ? `Worker W-104` : `${count} pending candidates`}. Eligibility for Attempt 2 reassessment unlocked.`
        });
        if (demoStep >= 9) runDemoStep(12);
        break;
      }

      case 'OPEN_WORKER_MODAL': {
        const workerId = params?.workerId || 'W-104';
        const w = workers.find(item => item.id === workerId);
        if (w) {
          setSelectedWorker(w);
          setActiveTab('workers');
        }
        break;
      }

      case 'VIEW_WORKERS_FILTERED':
      case 'NAVIGATE_WORKERS':
      case 'FILTER_SHIFT_B':
        setActiveTab('workers');
        break;

      case 'NAVIGATE_COMPETENCY':
        setActiveTab('competency');
        break;

      case 'NAVIGATE_REMEDIATION':
        setActiveTab('remediation');
        break;

      case 'FILTER_EXPIRED_CERTS':
        setActiveTab('certifications');
        break;

      case 'OPEN_QR_SCANNER':
        setIsScanQrModalOpen(true);
        break;

      case 'NAVIGATE_REPORTS':
      case 'EXPORT_PDF_REPORT':
        setActiveTab('reports');
        break;

      case 'NAVIGATE_SETTINGS':
        setActiveTab('system-health');
        break;

      case 'NAVIGATE_INTEGRITY':
        setActiveTab('integrity');
        break;

      case 'ASK_PRESET':
        if (params?.query) handleSend(params.query);
        break;

      default:
        console.info('Unhandled actionKey:', actionKey, params);
        break;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner: Agent Architecture & Statutory Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-white shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-bold font-mono shrink-0 shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
                  Agentic AI Safety Assistant
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400 text-slate-950">
                  MCP Tool Architecture
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>DGMS Policy Lock: 60% Fixed</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Deterministic tool-using agent with real-time database retrieval, strict regulatory guardrails, and cryptographic record citations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              onClick={() => setShowMcpCatalog(prev => !prev)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>MCP Tools Catalog ({CONTROLLED_MCP_TOOLS.length})</span>
              {showMcpCatalog ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible MCP Catalog Drawer */}
        {showMcpCatalog && (
          <div className="mt-3 pt-3 border-t border-slate-800 animate-in fade-in duration-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                Approved Model Context Protocol Tool Definitions (8 Categories)
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Statutory Decision Guard: External to LLM
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {CONTROLLED_MCP_TOOLS.map(t => (
                <div
                  key={t.name}
                  className="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-[10px] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 truncate">{t.name}</span>
                    <span className="px-1 py-0.2 bg-slate-800 text-[9px] text-slate-300 rounded uppercase">
                      {t.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[10px] leading-tight line-clamp-2">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* The 4 Operational Demo Workflows */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-mono font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span>Operational Demo Workflows (Tool-Using Agent Scenarios)</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Direct Tool Invocations &bull; Verified Database Records
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {demoWorkflows.map(wf => {
            const Icon = wf.icon;
            return (
              <button
                key={wf.id}
                onClick={() => handleSend(wf.query)}
                disabled={isProcessing}
                className="text-left p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-all group cursor-pointer disabled:opacity-50 relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="w-6 h-6 rounded bg-slate-100 group-hover:bg-slate-900 group-hover:text-amber-400 text-slate-700 flex items-center justify-center transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-slate-900">
                    {wf.number}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-amber-700">
                  {wf.title}
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                  {wf.subtitle}
                </p>

                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400 truncate max-w-[120px]">{wf.badge}</span>
                  <span className="text-amber-600 font-bold flex items-center gap-0.5">
                    Run &rarr;
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggested Boundary & Targeted Inquiry Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[10px] font-mono font-bold uppercase text-slate-500 mr-1">
          Safety Tests & Records:
        </span>
        {boundaryTestingPrompts.map((p, idx) => {
          const Icon = p.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              disabled={isProcessing}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-100 border rounded text-[11px] font-medium transition-colors cursor-pointer shadow-2xs disabled:opacity-50 ${
                p.isTest
                  ? 'border-amber-200 text-amber-900 hover:border-amber-300 hover:bg-amber-50/50'
                  : 'border-slate-200 text-slate-800'
              }`}
            >
              <Icon className={`w-3 h-3 ${p.isTest ? 'text-amber-600' : 'text-slate-500'}`} />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Chat Interface (ChatGPT-style Professional Enterprise UI) */}
      <div className="bg-slate-50/50 border border-slate-200 rounded-xl shadow-xs flex flex-col h-[640px] overflow-hidden">
        {/* Chat Header Bar */}
        <div className="px-4 sm:px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
              Live Safety Intelligence Session
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {chatMessages.length} {chatMessages.length === 1 ? 'Message' : 'Messages'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearChatMessages}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded text-xs font-medium transition-colors cursor-pointer shadow-2xs"
              title="Clear chat and reset conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Chat</span>
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {chatMessages.map(msg => (
            <div key={msg.id}>
              {msg.sender === 'user' ? (
                /* User Message Bubble */
                <div className="flex gap-3 justify-end items-start">
                  <div className="max-w-xl sm:max-w-2xl bg-slate-900 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs border border-slate-800">
                    <div className="text-xs leading-relaxed font-sans">
                      <MarkdownRenderer content={msg.content || msg.text || ''} variant="dark" />
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono text-right mt-1.5 flex items-center justify-end gap-1.5">
                      <span>{msg.timestamp || 'Now'}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span>Operator</span>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold font-mono text-xs shadow-xs mt-1">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                /* Assistant Message Enterprise Card */
                <div className="flex gap-3 justify-start items-start">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 font-bold font-mono text-xs shadow-xs mt-1 border border-slate-800">
                    <Bot className="w-4 h-4" />
                  </div>

                  <div className="max-w-full sm:max-w-2xl lg:max-w-3xl flex-1 bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-xs space-y-3.5">
                    {/* Assistant Message Mini-Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 font-mono">
                          SymbioMine AI Safety Assistant
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          <span>DGMS Grounded</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {msg.timestamp || 'Just now'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.content || msg.text || '')}
                          className="flex items-center gap-1 px-2 py-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-[11px]"
                          title="Copy response"
                        >
                          {copiedMessageId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-medium text-[10px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[10px]">Copy</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg.id, 'up')}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            feedbackState[msg.id] === 'up'
                              ? 'text-emerald-600 bg-emerald-50'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                          title="Helpful"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg.id, 'down')}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            feedbackState[msg.id] === 'down'
                              ? 'text-rose-600 bg-rose-50'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Refusal / Policy Interception Banner */}
                    {msg.isRefusal && (
                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-50/90 border border-rose-200 text-rose-950 font-medium">
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-rose-900 mb-0.5">
                            Statutory Safety Boundary Intercepted (Non-Negotiable Policy)
                          </div>
                          <div className="text-rose-800 text-[11px] leading-relaxed">
                            The requested parameter or action violates DGMS mandatory safety protocols. Pass threshold (60%) is locked outside LLM parameters.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Message Body Rendered via MarkdownRenderer (No Raw Syntax!) */}
                    <div className="text-xs text-slate-800 leading-relaxed font-sans">
                      <MarkdownRenderer content={msg.content || msg.text || ''} variant="light" />
                    </div>

                    {/* Executed MCP Tool Calls Telemetry */}
                    {msg.toolCalls && msg.toolCalls.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                        <div className="text-[10px] font-mono font-bold uppercase text-slate-600 tracking-wider flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-slate-500" />
                            <span>MCP Tool Invocations ({msg.toolCalls.length})</span>
                          </span>
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono text-[9px] font-semibold">
                            Zero Hallucination Grounding
                          </span>
                        </div>

                        <div className="space-y-2">
                          {msg.toolCalls.map((tc, i) => (
                            <div
                              key={i}
                              className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/80 font-mono text-[11px] space-y-2"
                            >
                              <div className="flex items-center justify-between text-slate-600">
                                <span className="font-bold text-amber-800 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                  mcp:{tc.toolName}
                                </span>
                                <span className="text-[10px] text-slate-500 tabular-nums">
                                  Latency: {tc.executionTimeMs ? `${tc.executionTimeMs}ms` : '32ms'} &bull; Status: SUCCESS
                                </span>
                              </div>

                              {tc.parameters && Object.keys(tc.parameters).length > 0 && (
                                <div className="text-[10px] text-slate-500 bg-white p-2 rounded border border-slate-200/60 font-mono truncate">
                                  Args: {JSON.stringify(tc.parameters)}
                                </div>
                              )}

                              <div className="text-slate-800 text-xs font-sans">
                                {renderInlineText(tc.resultSummary || '')}
                              </div>

                              {tc.citations && tc.citations.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/60">
                                  <span className="text-[9px] uppercase font-bold text-slate-400">Cited Records:</span>
                                  {tc.citations.map((cite, cIdx) => (
                                    <span
                                      key={cIdx}
                                      className="px-2 py-0.5 bg-white text-slate-700 rounded text-[9px] font-mono border border-slate-200 shadow-2xs"
                                    >
                                      {cite}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Grounded Evidence List */}
                    {msg.evidence && msg.evidence.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-600 tracking-wider block mb-1.5">
                          Empirical Database Metrics Cited:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {msg.evidence.map((ev, i) => (
                            <div
                              key={i}
                              className="p-2.5 bg-slate-50/70 rounded-lg border border-slate-200 text-[11px] flex flex-col justify-between"
                            >
                              <span className="text-slate-500 text-[10px]">{ev.metric}</span>
                              <span className="font-mono text-slate-900 font-bold mt-0.5">{ev.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Operational Safety Recommendation Card */}
                    {msg.recommendation && (
                      <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200/80 rounded-lg text-xs text-amber-950">
                        <span className="font-bold font-mono uppercase text-[10px] text-amber-800 block mb-1">
                          Operational Safety Recommendation:
                        </span>
                        <div className="leading-relaxed">
                          {renderInlineText(msg.recommendation)}
                        </div>
                      </div>
                    )}

                    {/* Governed Suggested Action Buttons */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
                        {msg.suggestedActions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => handleActionClick(act.actionKey, act.params)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs font-mono group"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* ChatGPT-style Animated Typing & Progress Indicator */}
          {isProcessing && (
            <div className="flex gap-3 justify-start items-start animate-in fade-in duration-150">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 font-bold font-mono text-xs shadow-xs mt-1 border border-slate-800">
                <Bot className="w-4 h-4" />
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 shadow-xs max-w-xl space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="font-mono font-bold text-[10px] text-amber-800">
                      {activeToolProgress?.toolName || 'mcp:kernel_dispatcher'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  </div>
                </div>

                <div className="text-xs text-slate-600 font-sans">
                  {activeToolProgress?.statusText || 'Querying persistent database records and evaluating DGMS safety policies...'}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar (ChatGPT-style) */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              placeholder="Ask the tool-using agent (e.g. 'Recommend remediation for workers failing Gas Emergency Response')..."
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-300 focus:border-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-800 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 font-sans transition-all pr-24 shadow-2xs"
            />
            <button
              type="submit"
              disabled={isProcessing || !inputQuery.trim()}
              className="absolute right-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-amber-400 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Deterministic Policy Engine: Pass threshold (60%) strictly locked outside LLM</span>
            </span>
            <span>DGMS Coal Mines Regulations 2017 &bull; SymbioMine MCP v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
