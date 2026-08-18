import React from 'react';
import { Shield, RefreshCw } from 'lucide-react';

export default function LogInput({ rawLogs, setRawLogs, loading, onAnalyze, onClear }) {
  return (
    <section className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 flex flex-col h-full shadow-xl">
      <h2 className="text-lg font-semibold text-slate-200 mb-2 flex items-center justify-between">
        <span>📥 Raw Log Input</span>
        <span className="text-xs text-slate-500 font-normal">Syslog / Auth / Firewall</span>
      </h2>
      
      <textarea
        value={rawLogs}
        onChange={(e) => setRawLogs(e.target.value)}
        placeholder="Paste log entries here... (e.g. Jul 29 22:14:01 server sshd[4112]: Failed password for root from 192.0.2.45...)"
        className="w-full flex-grow min-h-[320px] bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm text-slate-300 focus:outline-none focus:border-indigo-500/60 transition resize-none placeholder:text-slate-600 mb-4"
      />

      <div className="flex gap-3">
        <button
          onClick={onAnalyze}
          disabled={loading || !rawLogs.trim()}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
          {loading ? 'Analyzing Threat...' : 'Analyze Logs'}
        </button>

        <button
          onClick={onClear}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 px-4 rounded-lg transition cursor-pointer"
        >
          Clear
        </button>
      </div>
    </section>
  );
}