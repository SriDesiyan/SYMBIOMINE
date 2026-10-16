import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Users,
  Award,
  BarChart3,
  ClipboardCheck,
  QrCode,
  Sparkles,
  FileText,
  RefreshCw,
  X
} from 'lucide-react';

export const CommandPaletteModal: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveTab,
    setIsScanQrModalOpen,
    openQrGenerator,
    workers,
    setSelectedWorker
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const quickCommands = [
    {
      id: 'cmd-generate-qr',
      title: 'Inbuilt QR Code Generator & Studio (Export PNG/SVG)',
      category: 'Certification',
      icon: QrCode,
      action: () => {
        openQrGenerator();
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'cmd-workers',
      title: 'Search Workforce Roster',
      category: 'Workforce',
      icon: Users,
      action: () => {
        setActiveTab('workers');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'cmd-scan-qr',
      title: 'Launch Optical QR Scanner',
      category: 'Certification',
      icon: QrCode,
      action: () => {
        setIsScanQrModalOpen(true);
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'cmd-ai-assistant',
      title: 'Query AI Safety Intelligence (MCP)',
      category: 'Intelligence',
      icon: Sparkles,
      action: () => {
        setActiveTab('ai-assistant');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'cmd-skill-gaps',
      title: 'Open Competency Matrix & Gap Analysis',
      category: 'Analytics',
      icon: BarChart3,
      action: () => {
        setActiveTab('competency');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'cmd-assessments',
      title: 'Audit Assessment Execution Logs',
      category: 'Assessments',
      icon: ClipboardCheck,
      action: () => {
        setActiveTab('assessments');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'cmd-certificates',
      title: 'Inspect Cryptographic Certificate Registry',
      category: 'Certification',
      icon: Award,
      action: () => {
        setActiveTab('certifications');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'cmd-sync-center',
      title: 'Inspect Offline Store-and-Forward Buffer',
      category: 'Infrastructure',
      icon: RefreshCw,
      action: () => {
        setActiveTab('sync-center');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'cmd-reports',
      title: 'Export DGMS Regulatory Compliance Dossier',
      category: 'Compliance',
      icon: FileText,
      action: () => {
        setActiveTab('reports');
        setIsCommandPaletteOpen(false);
      }
    }
  ];

  // Filter commands
  const filteredCommands = quickCommands.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  // Filter workers matching query
  const matchingWorkers = query.trim().length > 1
    ? workers.filter(w =>
        w.name.toLowerCase().includes(query.toLowerCase()) ||
        w.id.toLowerCase().includes(query.toLowerCase()) ||
        w.role.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/65 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2.5 bg-slate-50">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search operational commands, workers, or certificates (Esc to close)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="p-2.5 max-h-96 overflow-y-auto space-y-3">
          {/* Quick Actions / Commands */}
          <div>
            <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">
              Control Deck Directives
            </div>
            <div className="space-y-1 mt-1">
              {filteredCommands.map(cmd => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    className="w-full px-3 py-2 rounded border border-transparent hover:border-slate-200 hover:bg-slate-50 text-left flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-slate-100 group-hover:bg-slate-900 group-hover:text-amber-400 text-slate-700 flex items-center justify-center transition-colors shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 leading-snug">{cmd.title}</p>
                        <p className="text-[10px] text-slate-500">{cmd.category}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-800">
                      Execute &rarr;
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matching Workers */}
          {matchingWorkers.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">
                Matching Personnel Records ({matchingWorkers.length})
              </div>
              <div className="space-y-1 mt-1">
                {matchingWorkers.map(w => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setSelectedWorker(w);
                      setActiveTab('workers');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded border border-transparent hover:border-slate-200 hover:bg-slate-50 text-left flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-slate-800 text-amber-400 flex items-center justify-center text-[10px] font-bold font-mono">
                        {w.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {w.name} <span className="font-mono text-slate-500">({w.id})</span>
                        </p>
                        <p className="text-[10px] text-slate-500">{w.role} &bull; {w.site}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-900 tabular-nums">{w.overallScore}%</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Navigation: Ctrl+K / Cmd+K &bull; Esc to dismiss</span>
          <span>SymbioMine Kernel v2.4</span>
        </div>
      </div>
    </div>
  );
};
