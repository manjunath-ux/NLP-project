
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import IssueCard from './components/IssueCard';
import TextStats from './components/TextStats';
import { analyzeText } from './services/geminiService';
import { AppState, GrammarIssue } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    inputText: '',
    isAnalyzing: false,
    result: null,
    error: null,
  });

  const handleAnalyze = async () => {
    if (!state.inputText.trim()) return;

    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    try {
      const result = await analyzeText(state.inputText);
      setState(prev => ({ ...prev, isAnalyzing: false, result }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        error: "Failed to analyze text. Please ensure you have a valid internet connection." 
      }));
    }
  };

  const applyCorrection = (issue: GrammarIssue) => {
    setState(prev => {
      if (!prev.result) return prev;
      
      // Basic string replacement (in a real app, this would use indices)
      const newText = prev.inputText.replace(issue.original, issue.replacement);
      const remainingIssues = prev.result.issues.filter(i => i !== issue);
      
      return {
        ...prev,
        inputText: newText,
        result: {
          ...prev.result,
          issues: remainingIssues
        }
      };
    });
  };

  const copyToClipboard = () => {
    if (state.result) {
      navigator.clipboard.writeText(state.result.correctedFullText);
      alert('Fully corrected text copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Editor Section */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900">Text Editor</h1>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setState(p => ({ ...p, inputText: '', result: null }))}
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 px-3 py-1"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="relative group">
              <textarea
                value={state.inputText}
                onChange={(e) => setState(prev => ({ ...prev, inputText: e.target.value }))}
                placeholder="Paste or type your text here to analyze syntax, grammar, and style..."
                className="w-full h-[60vh] p-6 text-lg text-slate-800 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none leading-relaxed"
                disabled={state.isAnalyzing}
              />
              {!state.inputText && !state.isAnalyzing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-slate-500">Ready for syntax analysis</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center text-slate-500 text-sm space-x-4">
                <span>{state.inputText.length} characters</span>
                <span>{state.inputText.split(/\s+/).filter(x => x).length} words</span>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={state.isAnalyzing || !state.inputText.trim()}
                className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                  state.isAnalyzing || !state.inputText.trim()
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 transform active:scale-95'
                }`}
              >
                {state.isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Analyze Text</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Side Panel Section */}
          <div className="lg:col-span-4 flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Analysis Results</h2>
            
            {!state.result && !state.isAnalyzing && !state.error && (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center flex-grow flex flex-col justify-center">
                <p className="text-slate-400 font-medium">Results will appear here after analysis.</p>
              </div>
            )}

            {state.error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-600 text-sm mb-4">
                {state.error}
              </div>
            )}

            {state.isAnalyzing && (
              <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                <div className="w-full max-w-[200px] h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 animate-[loading_1.5s_infinite]"></div>
                </div>
                <p className="text-slate-500 text-sm animate-pulse">Running syntactic rule check...</p>
                <style>
                  {`
                    @keyframes loading {
                      0% { transform: translateX(-100%); }
                      100% { transform: translateX(100%); }
                    }
                  `}
                </style>
              </div>
            )}

            {state.result && (
              <div className="flex flex-col animate-fadeIn">
                <TextStats 
                  stats={state.result.statistics} 
                  issueCount={state.result.issues.length} 
                />

                <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                  {state.result.issues.length === 0 ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center">
                      <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-emerald-800 mb-1">Text is looking great!</h3>
                      <p className="text-sm text-emerald-700">We didn't find any glaring grammatical or spelling errors.</p>
                    </div>
                  ) : (
                    state.result.issues.map((issue, idx) => (
                      <IssueCard 
                        key={idx} 
                        issue={issue} 
                        onApply={applyCorrection} 
                      />
                    ))
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Full Correction</h3>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-600 italic mb-4 max-h-40 overflow-y-auto">
                    {state.result.correctedFullText}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="w-full flex items-center justify-center space-x-2 border border-slate-200 py-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>Copy Full Correction</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            Powered by LinguistAI & Gemini Flash 3.0. Grammar checking and syntactic analysis.
          </p>
        </div>
      </footer>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
