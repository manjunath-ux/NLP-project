
import React from 'react';
import { AnalysisResult } from '../types';

interface TextStatsProps {
  stats: AnalysisResult['statistics'];
  issueCount: number;
}

const TextStats: React.FC<TextStatsProps> = ({ stats, issueCount }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="text-xs font-medium text-slate-500 uppercase mb-1">Issues Found</div>
        <div className={`text-2xl font-bold ${issueCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
          {issueCount}
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="text-xs font-medium text-slate-500 uppercase mb-1">Word Count</div>
        <div className="text-2xl font-bold text-slate-900">{stats.wordCount}</div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="text-xs font-medium text-slate-500 uppercase mb-1">Readability</div>
        <div className="text-2xl font-bold text-indigo-600">{stats.readabilityScore}</div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="text-xs font-medium text-slate-500 uppercase mb-1">Tone</div>
        <div className="text-2xl font-bold text-slate-900 capitalize">{stats.tone}</div>
      </div>
    </div>
  );
};

export default TextStats;
