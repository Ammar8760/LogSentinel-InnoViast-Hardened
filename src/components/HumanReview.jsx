import React from 'react';
import { Shield, Send, CheckCircle2 } from 'lucide-react';

export default function HumanReview({ isVerified, setIsVerified, escalated, onEscalate }) {
  return (
    <div className="border-t border-slate-800 pt-5 mt-4 space-y-4">
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-indigo-500/10 rounded-md border border-indigo-500/20 text-indigo-400 mt-0.5">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Human Review Safeguard</h4>
            <p className="text-xs text-slate-400">AI outputs require explicit analyst validation before SIEM escalation.</p>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            checked={isVerified}
            onChange={(e) => setIsVerified(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900 cursor-pointer"
          />
          <span className="text-xs text-slate-300 font-medium">
            I have reviewed the raw logs and confirm this threat classification.
          </span>
        </label>

        <button
          onClick={onEscalate}
          disabled={!isVerified || escalated}
          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition cursor-pointer disabled:cursor-not-allowed"
        >
          {escalated ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Send className="w-4 h-4" />}
          {escalated ? 'Escalated to SOC Queue' : 'Approve & Escalate Incident'}
        </button>

        {escalated && (
          <p className="text-xs text-emerald-400 text-center font-medium pt-1">
            ✅ Incident ticket #INC-8924 logged to SIEM dashboard.
          </p>
        )}
      </div>
    </div>
  );
}