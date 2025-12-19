
import React from 'react';
import { GrammarIssue, ErrorCategory } from '../types';

interface IssueCardProps {
  issue: GrammarIssue;
  onApply: (issue: GrammarIssue) => void;
}

const categoryStyles = {
  [ErrorCategory.GRAMMAR]: 'border-red-500 text-red-600 bg-red-50',
  [ErrorCategory.SPELLING]: 'border-amber-500 text-amber-600 bg-amber-50',
  [ErrorCategory.PUNCTUATION]: 'border-blue-500 text-blue-600 bg-blue-50',
  [ErrorCategory.STYLE]: 'border-purple-500 text-purple-600 bg-purple-50',
};

const IssueCard: React.FC<IssueCardProps> = ({ issue, onApply }) => {
  return (
    <div className={`p-4 rounded-xl border-l-4 bg-white shadow-sm border mb-4 hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-2">
        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${categoryStyles[issue.category]}`}>
          {issue.category}
        </span>
      </div>
      
      <div className="mb-3">
        <div className="flex items-center space-x-2 text-slate-800 font-medium mb-1">
          <span className="line-through text-slate-400">{issue.original}</span>
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="ArrowRight" />
          </svg>
          <span className="text-emerald-600 font-bold">{issue.replacement}</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed italic">
          "{issue.context}"
        </p>
      </div>

      <div className="bg-slate-50 p-3 rounded-lg mb-4 text-sm text-slate-700">
        <span className="font-semibold block mb-1">Why?</span>
        {issue.explanation}
      </div>

      <button
        onClick={() => onApply(issue)}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition flex items-center justify-center space-x-2"
      >
        <span>Apply Suggestion</span>
      </button>
    </div>
  );
};

export default IssueCard;
