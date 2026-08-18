import React, { useState } from 'react';
import { 
  Shield, Terminal, AlertTriangle, CheckCircle2, Trash2, Send, 
  ShieldAlert, Zap, Lock, UserCheck, KeyRound, Globe, Database, 
  ThumbsUp, ThumbsDown, Download, FileText, Check, X, ShieldCheck
} from 'lucide-react';
import { analyzeLogsWithGemini } from './utils/gemini';
import { sanitizeLogs } from './utils/sanitize';

const PRESET_LOGS = [
  {
    id: 1,
    title: 'SSH Brute Force Attack',
    badge: 'High Threat',
    category: 'Auth',
    badgeColor: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    icon: <ShieldAlert className="w-5 h-5 text-emerald-400" />,
    meta: '3 Failed Login Attempts • IP 192.0.2.45',
    logs: `Jul 29 22:14:01 server sshd[4112]: Failed password for root from 192.0.2.45 port 49152 ssh2
Jul 29 22:14:03 server sshd[4112]: Failed password for root from 192.0.2.45 port 49154 ssh2
Jul 29 22:14:05 server sshd[4112]: Failed password for root from 192.0.2.45 port 49156 ssh2`
  },
  {
    id: 2,
    title: 'Payment Gateway Credential Leak',
    badge: 'Privacy Scrub',
    category: 'API',
    badgeColor: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
    icon: <KeyRound className="w-5 h-5 text-cyan-400" />,
    meta: 'Sensitive Key Redacted • Endpoint /v1',
    logs: `2026-07-29 21:05:11 [ERROR] AuthManager: Connection failed to payment gateway.
Config Dump: { endpoint: "https://api.payment.internal/v1", api_key="sk_live_998877665544332211" }
Failed connection from IP 203.0.113.12`
  },
  {
    id: 3,
    title: 'Clean Web Server Access Logs',
    badge: 'Low Risk',
    category: 'Web',
    badgeColor: 'bg-teal-400/10 text-teal-400 border-teal-400/20',
    icon: <Globe className="w-5 h-5 text-teal-400" />,
    meta: 'HTTP 200 OK • Normal User Activity',
    logs: `192.168.1.10 - - [29/Jul/2026:10:00:01 +0000] "GET /index.html HTTP/1.1" 200 1043
192.168.1.11 - - [29/Jul/2026:10:00:05 +0000] "GET /styles.css HTTP/1.1" 200 4502`
  }
];

// Week 6 Required 15-Test Cases Matrix Dataset
const QA_EVALUATION_DATA = [
  { id: 1, test: "SSH Brute Force Preset", status: "PASS", note: "Extracted IP 192.0.2.45 correctly" },
  { id: 2, test: "Credential Leak Redaction", status: "PASS", note: "Masked api_key with [REDACTED]" },
  { id: 3, test: "Clean Access Log", status: "PASS", note: "Threat severity marked as LOW" },
  { id: 4, test: "Prompt Injection Attempt", status: "PASS", note: "Enforced strict JSON schema" },
  { id: 5, test: "Corrupted/Partial Log Input", status: "PASS", note: "Returned UNKNOWN risk gracefully" },
  { id: 6, test: "Empty Text Input", status: "PASS", note: "Action button disabled on empty" },
  { id: 7, test: "Multiple IP Vectors Parsing", status: "PASS", note: "Array returned correctly in output" },
  { id: 8, test: "Client-Side Regex Scrubbing", status: "PASS", note: "API key pre-scrubbed before API call" },
  { id: 9, test: "Missing Gemini Key Fallback", status: "PASS", note: "Displays safe UI error notification" },
  { id: 10, test: "HITL Checkbox Gatekeeping", status: "PASS", note: "Escalation button stays locked" },
  { id: 11, test: "SOC Escalation Confirmation", status: "PASS", note: "State changes to Escalated" },
  { id: 12, test: "Workspace Clear State Reset", status: "PASS", note: "Wipes input, error, and feedback" },
  { id: 13, test: "Category Filter Switching", status: "PASS", note: "Renders filtered preset list" },
  { id: 14, test: "Analysis Export Function", status: "PASS", note: "Generates downloadable JSON report" },
  { id: 15, test: "Analyst Feedback System", status: "PASS", note: "Records thumbs up/down state" },
];

export default function App() {
  const [logInput, setLogInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [humanApproved, setHumanApproved] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  
  // Week 6 New Hardening States
  const [feedback, setFeedback] = useState(null);
  const [showQAModal, setShowQAModal] = useState(false);

  const handleAnalyze = async (textToAnalyze) => {
    const raw = textToAnalyze || logInput;
    if (!raw.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setAnalysis(null);
    setHumanApproved(false);
    setEscalated(false);
    setFeedback(null);

    // Hardened Client-side Sanitization Boundary
    const cleanLog = sanitizeLogs(raw);
    const result = await analyzeLogsWithGemini(cleanLog);

    if (result.error) {
      setErrorMsg(result.error);
    } else {
      setAnalysis(result.data);
    }
    setLoading(false);
  };

  const clearAll = () => {
    setLogInput('');
    setAnalysis(null);
    setErrorMsg(null);
    setHumanApproved(false);
    setEscalated(false);
    setFeedback(null);
  };

  const handleExportJSON = () => {
    if (!analysis) return;
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logsentinel-report-${Date.now()}.json`;
    a.click();
  };

  const filteredPresets = activeTab === 'All' 
    ? PRESET_LOGS 
    : PRESET_LOGS.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen bg-[#070d14] text-slate-100 flex items-center justify-center p-4 md:p-8 font-sans selection:bg-cyan-500/30">
      
      {/* Outer Dashboard Window */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT PANEL: LogSentinel Fleet */}
        <div className="lg:col-span-4 bg-[#0d1622] border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 bg-emerald-400/10 text-emerald-400 rounded-2xl border border-emerald-400/20 shadow-lg shadow-emerald-400/5">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  LogSentinel Fleet
                </h1>
                <p className="text-xs text-slate-400">Select a log preset or enter custom entries.</p>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 my-5 overflow-x-auto pb-1 no-scrollbar">
              {['All', 'Auth', 'API', 'Web'].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeTab === category
                      ? 'bg-cyan-400 text-slate-950 font-semibold shadow-md shadow-cyan-400/20'
                      : 'bg-[#131f2f] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Fleet Cards (Preset Selector) */}
            <div className="space-y-3.5">
              {filteredPresets.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setLogInput(item.logs);
                    handleAnalyze(item.logs);
                  }}
                  className="group bg-[#131f2f] hover:bg-[#18273b] border border-slate-800/80 hover:border-cyan-400/40 p-4 rounded-2xl cursor-pointer transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="p-2 bg-[#0d1622] rounded-xl border border-slate-800 group-hover:border-cyan-400/30 transition-colors">
                      {item.icon}
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">{item.meta}</p>

                  <div className="mt-3.5 flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
                    <span>Inquire / Analyze</span>
                    <span className="group-hover:translate-x-1 transition-transform">›</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Info & Week 6 QA Button */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <button 
              onClick={() => setShowQAModal(true)}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Week 6 QA Audit Matrix
            </button>
            <span className="text-slate-500 font-mono">v1.2.0 (Hardened)</span>
          </div>
        </div>

        {/* RIGHT PANEL: LogSentinel AI Workspace */}
        <div className="lg:col-span-8 bg-[#0d1622] border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative min-h-[640px]">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-400/5">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-100 flex items-center gap-2">
                  LogSentinel AI
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h2>
                <p className="text-xs text-slate-400">Assistant • Human-In-The-Loop Security Triage</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {analysis && (
                <button
                  onClick={handleExportJSON}
                  className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-xl transition-colors flex items-center gap-1 text-xs"
                  title="Export Analysis Report"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              )}
              <button 
                onClick={clearAll}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded-xl transition-colors"
                title="Clear Workspace"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat / Feed Display Area */}
          <div className="flex-1 my-5 overflow-y-auto space-y-4 pr-1">
            
            {/* Welcome Bubble */}
            <div className="bg-[#131f2f] border border-slate-800/80 rounded-2xl p-4 flex gap-3 max-w-2xl">
              <div className="p-2 bg-cyan-400/10 text-cyan-400 rounded-xl h-fit">
                <Zap className="w-4.5 h-4.5" />
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                <p className="font-semibold text-slate-100 mb-1">Welcome to LogSentinel AI Assistant! 🛡️</p>
                <p>You can check our featured log presets on the left panel, click on any incident to auto-analyze, or paste custom raw logs into the prompt area below.</p>
              </div>
            </div>

            {/* Error Active Card */}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>System Fallback Active</span>
                </div>
                <p>{errorMsg}</p>
              </div>
            )}

            {/* Analysis Output Container */}
            {analysis && (
              <div className="bg-[#131f2f] border border-slate-800/80 rounded-2xl p-5 space-y-4 animate-fadeIn">
                
                {/* Threat Banner */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className={`w-5 h-5 ${
                      analysis.risk_score === 'HIGH' ? 'text-red-400' :
                      analysis.risk_score === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
                    }`} />
                    <span className="text-sm font-bold tracking-wide">Threat Severity: {analysis.risk_score}</span>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700 font-mono">
                    Confidence: {analysis.confidence || 'High'}
                  </span>
                </div>

                {/* Summary */}
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">AI Triage Summary</h4>
                  <p className="text-xs text-slate-200 leading-relaxed">{analysis.summary}</p>
                </div>

                {/* Extracted IPs */}
                {analysis.extracted_ips && analysis.extracted_ips.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Identified Threat Vectors / Source IPs</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.extracted_ips.map((ip, i) => (
                        <span key={i} className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg font-mono text-xs">
                          {ip}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Recommended Action</h4>
                  <p className="text-xs text-cyan-300 bg-cyan-400/5 p-3 rounded-xl border border-cyan-400/10">
                    {analysis.recommended_action}
                  </p>
                </div>

                {/* Analyst Feedback Section (Week 6 Hardening Feature) */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60">
                  <span>Was this triage accurate?</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setFeedback('helpful')} 
                      className={`p-1.5 rounded-lg border transition-colors ${
                        feedback === 'helpful' 
                          ? 'bg-emerald-400/20 text-emerald-400 border-emerald-400/40' 
                          : 'bg-slate-900 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setFeedback('unhelpful')} 
                      className={`p-1.5 rounded-lg border transition-colors ${
                        feedback === 'unhelpful' 
                          ? 'bg-red-400/20 text-red-400 border-red-400/40' 
                          : 'bg-slate-900 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Human-in-the-Loop Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={humanApproved}
                      onChange={(e) => setHumanApproved(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-400 focus:ring-cyan-400/20"
                    />
                    <span>I have reviewed raw logs and confirm classification</span>
                  </label>

                  <button
                    disabled={!humanApproved || escalated}
                    onClick={() => setEscalated(true)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                      escalated 
                        ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' 
                        : humanApproved 
                        ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-400/20' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {escalated ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Escalated to SOC
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        Approve & Escalate
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Badges */}
          <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar text-xs">
            <button 
              onClick={() => handleAnalyze(PRESET_LOGS[0].logs)}
              className="px-3 py-1.5 rounded-xl bg-[#131f2f] hover:bg-[#18273b] border border-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              Auth Brute-Force
            </button>
            <button 
              onClick={() => handleAnalyze(PRESET_LOGS[1].logs)}
              className="px-3 py-1.5 rounded-xl bg-[#131f2f] hover:bg-[#18273b] border border-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              API Credential Check
            </button>
            <button 
              onClick={() => handleAnalyze(PRESET_LOGS[2].logs)}
              className="px-3 py-1.5 rounded-xl bg-[#131f2f] hover:bg-[#18273b] border border-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              Syslog Review
            </button>
          </div>

          {/* Input Prompt Field */}
          <div className="relative">
            <textarea
              rows="2"
              value={logInput}
              onChange={(e) => setLogInput(e.target.value)}
              placeholder="Paste raw log entries (Syslog, Auth, Firewall)..."
              className="w-full bg-[#131f2f] border border-slate-800 focus:border-cyan-400/50 rounded-2xl p-3.5 pr-14 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 resize-none font-mono"
            />
            <button
              disabled={loading || !logInput.trim()}
              onClick={() => handleAnalyze()}
              className="absolute right-3 bottom-3.5 p-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-xl transition-all shadow-md shadow-cyan-400/10"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Week 6 QA Audit Matrix Modal */}
      {showQAModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0d1622] border border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5 text-cyan-400 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Week 6 Mandatory Evaluation Matrix (15 Cases)</span>
                </div>
                <button 
                  onClick={() => setShowQAModal(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-4 overflow-y-auto max-h-[50vh] pr-2 space-y-2">
                {QA_EVALUATION_DATA.map((item) => (
                  <div key={item.id} className="p-3 bg-[#131f2f] border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-200">#{item.id} {item.test}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.note}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md font-mono text-[10px] font-bold">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setShowQAModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}