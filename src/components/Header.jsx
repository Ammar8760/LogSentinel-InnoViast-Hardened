import React from 'react';
import { Shield, Lock } from 'lucide-react';

export default function Header() {
  return (
    <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 gap-4">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
            <Shield className="w-7 h-7 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">LogSentinel AI</h1>
        </div>
        <p className="text-sm text-slate-400 mt-1">Human-Centered Security Log & Threat Triage Assistant</p>
      </div>
      <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-slate-400 self-start md:self-auto">
        <Lock className="w-3.5 h-3.5 text-indigo-400" />
        <span>Local Data Boundary Active</span>
      </div>
    </header>
  );
}