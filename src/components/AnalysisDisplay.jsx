import React from 'react';
import { ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react';

export default function AnalysisDisplay({ analysis, loading, error }) {
  const getBadgeColor = (score) => {
    switch (score) {
      case 'HIGH': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'MEDIUM': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'LOW': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-lg text-red-200 text-sm space-y-2">
        <div className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span>System Fallback Active</span>
        </div>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-sm">Scrubbing credentials & building threat model...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-800 rounded-lg text-slate-500">
        <ShieldAlert className="w-12 h-12 text-slate-700 mb-3" />
        <p className="text-sm">Submit log entries on the left to initiate AI threat extraction and triage.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Threat Score Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-500">Threat Level</span>
          <div className="mt-1">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-sm font-bold ${getBadgeColor(analysis.risk_score)}`}>
              {analysis.risk_score}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase tracking-wider text-slate-500">Model Confidence</span>
          <p className="text-sm font-medium text-slate-300 mt-1">{analysis.confidence}</p>
        </div>
      </div>

      {/* Summary */}
      <div>
        <h3 className="text-xs font-semibold uppercase text-slate-400 mb-1">Incident Summary</h3>
        <p className="text-sm text-slate-300 bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 leading-relaxed">
          {analysis.summary}
        </p>
      </div>

      {/* Extracted IPs */}
      {analysis.extracted_ips && analysis.extracted_ips.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase text-slate-400 mb-1">Identified Source IPs</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.extracted_ips.map((ip, idx) => (
              <span key={idx} className="font-mono text-xs bg-slate-800 border border-slate-700 px-2.5 py-1 rounded text-indigo-300">
                {ip}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Remediation */}
      <div>
        <h3 className="text-xs font-semibold uppercase text-slate-400 mb-1">Recommended Remediation</h3>
        <div className="p-3 bg-indigo-950/30 border border-indigo-900/50 rounded-lg text-sm text-indigo-200">
          {analysis.recommended_action}
        </div>
      </div>
    </div>
  );
}