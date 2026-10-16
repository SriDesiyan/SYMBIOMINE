import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { CryptoVerificationService } from '../../services/cryptoService';
import { QRCodeView } from '../common/QRCodeView';
import { SafetyDomain } from '../../types';
import {
  SAMPLE_WORKER_PASS,
  SAMPLE_WORKER_FAIL
} from '../../services/samplePackages';
import {
  X,
  QrCode,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Sliders,
  Printer,
  ExternalLink,
  RefreshCw,
  FileCode2,
  BadgeAlert,
  Hash,
  Palette,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Cpu,
  Layers
} from 'lucide-react';

interface PresetPayload {
  id: string;
  name: string;
  category: 'Worker Package' | 'Failed Assessment' | 'Passed Credential' | 'Badge' | 'Permit' | 'Expired';
  payload: string;
  description: string;
}

const PRESET_PAYLOADS: PresetPayload[] = [
  {
    id: 'symbiomine-pkg-pass',
    name: 'SYMBIOMINE Worker Verification Package (83.33% PASS)',
    category: 'Worker Package',
    payload: JSON.stringify(SAMPLE_WORKER_PASS, null, 2),
    description: 'Full JSON spec • Rajesh Soren • Fire, Gas Leak & LOTO, Electrical with verified photo.'
  },
  {
    id: 'symbiomine-pkg-fail',
    name: 'SYMBIOMINE Worker Verification Package (61.67% FAIL)',
    category: 'Worker Package',
    payload: JSON.stringify(SAMPLE_WORKER_FAIL, null, 2),
    description: 'Full JSON spec • Nandan Negi • Failed modules & procedural weakness diagnostics.'
  },
  {
    id: 'fail-w104',
    name: 'W-104 Failed Assessment (64% FAIL • Gas Leak Weakness)',
    category: 'Failed Assessment',
    payload:
      'SYMBIOMINE::ASSESSMENT::WORKER:W-104::NAME:Rajesh Soren::DOMAIN:Gas Leak & Confined Space::SCORE:64%::STATUS:FAIL::WEAKNESS:Delay in gas monitor check (8s excess) & premature heading re-entry without auxiliary fan verification::ROLE:Continuous Miner Operator::SITE:Jharkhand Underground::BADGE:BDG-JH-9411',
    description: 'Critical deficiency flag: Blind Heading Ingress without secondary exhaust verification.'
  },
  {
    id: 'pass-w104',
    name: 'W-104 Qualified Credential (88% PASS • DGMS Valid)',
    category: 'Passed Credential',
    payload:
      'SYMBIOMINE::CERT-2026-GAS-W104::WORKER:W-104::NAME:Rajesh Soren::DOMAIN:Gas Leak & Confined Space::SCORE:88%::STATUS:PASS::ROLE:Continuous Miner Operator::SITE:Jharkhand Underground::SHA256:94e2a87b1c4298fc',
    description: 'Post-remediation certified credential. Full underground heading clearance granted.'
  },
  {
    id: 'fail-w119',
    name: 'W-119 Roof Bolting Failure (58% FAIL • Spacing Breach)',
    category: 'Failed Assessment',
    payload:
      'SYMBIOMINE::ASSESSMENT::WORKER:W-119::NAME:Nandan Negi::DOMAIN:Fall / Work-at-Height Safety::SCORE:58%::STATUS:FAIL::WEAKNESS:Excessive bolt spacing (> 1.2m) and improper resin capsule anchoring::ROLE:Roof Bolter & Support Tech::SITE:Dhanbad Surface',
    description: 'Ground support defect: Candidate failed roof strata inspection protocol.'
  },
  {
    id: 'pass-w101',
    name: 'W-101 LOTO Electrical Isolation Pass (94% PASS)',
    category: 'Passed Credential',
    payload:
      'SYMBIOMINE::CERT-2026-LOTO-W101::WORKER:W-101::NAME:Amitabh Roy::DOMAIN:LOTO::SCORE:94%::STATUS:PASS::ROLE:Electrical Isolation Tech::SITE:Jharkhand Underground::SHA256:e3b0c44298fc1c14',
    description: 'High-voltage zero-energy verification qualification token.'
  },
  {
    id: 'badge-w104',
    name: 'Worker Gate Clearance Badge (W-104 Rajesh Soren)',
    category: 'Badge',
    payload:
      'SYMBIOMINE::BADGE::W-104::RAJESH_SOREN::ROLE:MINER_OPERATOR::SHIFT:B::SITE:JHARKHAND_HEADING_9::SCORE:68%',
    description: 'Underground heading access authorization badge token.'
  },
  {
    id: 'cert-expired',
    name: 'W-118 Expired Fall Safety Credential (70% • Expired)',
    category: 'Expired',
    payload:
      'SYMBIOMINE::CERT-2025-FALL-W118::WORKER:W-118::NAME:Suraj Paswan::DOMAIN:Fall / Work-at-Height Safety::SCORE:70%::STATUS:EXPIRED::SHA256:12b0c44298fc1c14',
    description: 'Expired test credential to verify warning flags in QR scanner.'
  }
];

const COLOR_THEMES = [
  { name: 'Industrial Slate', dark: '#0f172a', light: '#ffffff' },
  { name: 'Safety Amber', dark: '#92400e', light: '#fef3c7' },
  { name: 'High-Contrast Warning', dark: '#000000', light: '#fef08a' },
  { name: 'Compliance Emerald', dark: '#064e3b', light: '#ecfdf5' },
  { name: 'Deep Carbon', dark: '#18181b', light: '#f4f4f5' }
];

export const QRCodeGeneratorModal: React.FC = () => {
  const {
    isGenerateQrModalOpen,
    setIsGenerateQrModalOpen,
    qrGeneratorData,
    setIsScanQrModalOpen,
    workers
  } = useApp();

  // Mode: 'presets' | 'builder' | 'raw'
  const [activeMode, setActiveMode] = useState<'presets' | 'builder' | 'raw'>('presets');

  const [payloadText, setPayloadText] = useState(PRESET_PAYLOADS[0].payload);
  const [selectedPresetId, setSelectedPresetId] = useState(PRESET_PAYLOADS[0].id);

  // Builder state
  const [builderOutcome, setBuilderOutcome] = useState<'PASS' | 'FAIL'>('FAIL');
  const [builderScore, setBuilderScore] = useState(64);
  const [builderWorkerId, setBuilderWorkerId] = useState('W-104');
  const [builderWorkerName, setBuilderWorkerName] = useState('Rajesh Soren');
  const [builderDomain, setBuilderDomain] = useState<SafetyDomain>('Gas Leak & Confined Space');
  const [builderWeakness, setBuilderWeakness] = useState(
    'Delay in multi-gas monitor check (8s excess) & premature heading re-entry without auxiliary fan verification'
  );
  const [builderViolations, setBuilderViolations] = useState(1);

  // QR rendering config
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [colorThemeIndex, setColorThemeIndex] = useState(0);
  const [customDarkColor, setCustomDarkColor] = useState('#0f172a');
  const [customLightColor, setCustomLightColor] = useState('#ffffff');
  const [useCustomColors, setUseCustomColors] = useState(false);
  const [qrSize, setQrSize] = useState(210);
  const [includeMargin, setIncludeMargin] = useState(true);
  const [computedHash, setComputedHash] = useState('');
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Sync initial payload if opened from an external trigger (like a certificate or worker)
  useEffect(() => {
    if (qrGeneratorData?.payload) {
      setPayloadText(qrGeneratorData.payload);
      setSelectedPresetId('custom');
      setActiveMode('raw');
    }
  }, [qrGeneratorData]);

  // Compute live SHA-256 hash when payload changes
  useEffect(() => {
    let isCancelled = false;
    CryptoVerificationService.computeSha256(payloadText).then(hash => {
      if (!isCancelled) {
        setComputedHash(hash);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [payloadText]);

  // Helper to re-generate payload from builder state
  const syncBuilderPayload = (
    outcome: 'PASS' | 'FAIL',
    score: number,
    wId: string,
    wName: string,
    domain: string,
    weakness: string
  ) => {
    const matchedWorker = workers.find(w => w.id === wId);
    const role = matchedWorker?.role || 'Continuous Miner Operator';
    const site = matchedWorker?.site || 'Jharkhand Underground';
    const badge = matchedWorker?.badgeNumber || 'BDG-JH-9411';

    let token = '';
    if (outcome === 'FAIL') {
      token = `SYMBIOMINE::ASSESSMENT::WORKER:${wId}::NAME:${wName}::DOMAIN:${domain}::SCORE:${score}%::STATUS:FAIL::WEAKNESS:${weakness}::ROLE:${role}::SITE:${site}::BADGE:${badge}`;
    } else {
      token = `SYMBIOMINE::CERT-2026-${domain.slice(0, 4).toUpperCase()}-${wId}::WORKER:${wId}::NAME:${wName}::DOMAIN:${domain}::SCORE:${score}%::STATUS:PASS::ROLE:${role}::SITE:${site}::SHA256:${computedHash.slice(0, 16)}`;
    }

    setPayloadText(token);
    setSelectedPresetId('custom');
  };

  const handleSelectPreset = (preset: PresetPayload) => {
    setSelectedPresetId(preset.id);
    setPayloadText(preset.payload);
  };

  const activeDark = useCustomColors ? customDarkColor : COLOR_THEMES[colorThemeIndex].dark;
  const activeLight = useCustomColors ? customLightColor : COLOR_THEMES[colorThemeIndex].light;

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payloadText);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleDownloadSvg = async () => {
    try {
      const svgString = await QRCode.toString(payloadText, {
        type: 'svg',
        margin: includeMargin ? 2 : 0,
        color: {
          dark: activeDark,
          light: activeLight
        },
        errorCorrectionLevel
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `symbiomine-qr-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export SVG QR Code:', err);
    }
  };

  const handleTestInScanner = () => {
    setIsGenerateQrModalOpen(false);
    setIsScanQrModalOpen(true);
  };

  if (!isGenerateQrModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider font-sans text-white">
                Inbuilt QR Code Generator &bull; Competency Token Studio
              </h3>
              <p className="text-[11px] text-slate-400">
                Encodes Pass/Fail Percentage, Procedural Weaknesses, Safety Domains, and SHA-256 Hashes
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGenerateQrModalOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split 6-cols / 6-cols layout */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-xs">
          {/* Left Column: 6-cols Configuration & Builder */}
          <div className="lg:col-span-6 space-y-4">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveMode('presets')}
                className={`flex-1 py-1.5 px-2 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeMode === 'presets'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Statutory Presets</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMode('builder');
                  syncBuilderPayload(
                    builderOutcome,
                    builderScore,
                    builderWorkerId,
                    builderWorkerName,
                    builderDomain,
                    builderWeakness
                  );
                }}
                className={`flex-1 py-1.5 px-2 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeMode === 'builder'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-amber-600" />
                <span>Pass/Fail Builder</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('raw')}
                className={`flex-1 py-1.5 px-2 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeMode === 'raw'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Raw Token / JSON</span>
              </button>
            </div>

            {/* TAB 1: Presets */}
            {activeMode === 'presets' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Select Statutory Demo Token:</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Includes Pass/Fail &amp; Weaknesses</span>
                </div>

                <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
                  {PRESET_PAYLOADS.map(preset => {
                    const isSelected = selectedPresetId === preset.id;
                    const isFail = preset.category === 'Failed Assessment' || preset.category === 'Expired';
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-300 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">{preset.name}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              isFail
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {preset.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">{preset.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: Interactive Assessment Builder */}
            {activeMode === 'builder' && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                {/* Outcome Toggle */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Assessment Outcome &amp; Result</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBuilderOutcome('FAIL');
                        const newScore = 64;
                        setBuilderScore(newScore);
                        syncBuilderPayload(
                          'FAIL',
                          newScore,
                          builderWorkerId,
                          builderWorkerName,
                          builderDomain,
                          builderWeakness
                        );
                      }}
                      className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        builderOutcome === 'FAIL'
                          ? 'bg-rose-100 border-rose-400 text-rose-900 ring-1 ring-rose-300'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>FAIL (&lt; 60% Benchmark)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBuilderOutcome('PASS');
                        const newScore = 88;
                        setBuilderScore(newScore);
                        syncBuilderPayload(
                          'PASS',
                          newScore,
                          builderWorkerId,
                          builderWorkerName,
                          builderDomain,
                          builderWeakness
                        );
                      }}
                      className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        builderOutcome === 'PASS'
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900 ring-1 ring-emerald-300'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>PASS (&ge; 60% Clearance)</span>
                    </button>
                  </div>
                </div>

                {/* Score Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-800">Pass / Fail Percentage Score</label>
                    <span
                      className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${
                        builderOutcome === 'PASS' ? 'text-emerald-800 bg-emerald-100' : 'text-rose-800 bg-rose-100'
                      }`}
                    >
                      {builderScore}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={builderScore}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setBuilderScore(val);
                      const outcome = val >= 60 ? 'PASS' : 'FAIL';
                      setBuilderOutcome(outcome);
                      syncBuilderPayload(
                        outcome,
                        val,
                        builderWorkerId,
                        builderWorkerName,
                        builderDomain,
                        builderWeakness
                      );
                    }}
                    className="w-full accent-amber-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>30% Critical Fail</span>
                    <span className="font-bold text-slate-800">Statutory Benchmark: 60%</span>
                    <span>100% Mastery</span>
                  </div>
                </div>

                {/* Personnel Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Worker Personnel</label>
                    <select
                      value={builderWorkerId}
                      onChange={e => {
                        const wId = e.target.value;
                        const w = workers.find(item => item.id === wId);
                        const wName = w?.name || 'Authorized Worker';
                        setBuilderWorkerId(wId);
                        setBuilderWorkerName(wName);
                        syncBuilderPayload(
                          builderOutcome,
                          builderScore,
                          wId,
                          wName,
                          builderDomain,
                          builderWeakness
                        );
                      }}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800"
                    >
                      {workers.slice(0, 15).map(w => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Safety Domain</label>
                    <select
                      value={builderDomain}
                      onChange={e => {
                        const dom = e.target.value as SafetyDomain;
                        setBuilderDomain(dom);
                        const defaultGap =
                          dom === 'Gas Leak & Confined Space'
                            ? 'Delay in multi-gas monitor check (8s excess) & premature heading entry without auxiliary fan verification'
                            : dom === 'LOTO'
                            ? 'Failure to execute residual energy bleed-off protocol before barrier removal'
                            : dom === 'Fall / Work-at-Height Safety'
                            ? 'Excessive bolt spacing (> 1.2m) and improper resin capsule anchoring'
                            : 'Omission of statutory pre-operational inspection checklist';
                        setBuilderWeakness(defaultGap);
                        syncBuilderPayload(
                          builderOutcome,
                          builderScore,
                          builderWorkerId,
                          builderWorkerName,
                          dom,
                          defaultGap
                        );
                      }}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800"
                    >
                      <option value="Gas Leak & Confined Space">Gas Leak &amp; Confined Space</option>
                      <option value="LOTO">LOTO (Lockout/Tagout)</option>
                      <option value="Fall / Work-at-Height Safety">Fall / Work-at-Height Safety</option>
                      <option value="Hazard Identification">Hazard Identification</option>
                      <option value="PPE & Equipment">PPE &amp; Equipment</option>
                      <option value="Fire & Emergency Response">Fire &amp; Emergency Response</option>
                    </select>
                  </div>
                </div>

                {/* If FAIL: Weakness description */}
                {builderOutcome === 'FAIL' && (
                  <div className="space-y-1">
                    <label className="font-bold text-rose-900 block flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Identified Procedural Weakness / Skill Gap</span>
                    </label>
                    <textarea
                      rows={2}
                      value={builderWeakness}
                      onChange={e => {
                        const val = e.target.value;
                        setBuilderWeakness(val);
                        syncBuilderPayload(
                          builderOutcome,
                          builderScore,
                          builderWorkerId,
                          builderWorkerName,
                          builderDomain,
                          val
                        );
                      }}
                      className="w-full bg-white border border-rose-300 rounded-lg p-2 text-xs text-rose-950 font-medium focus:ring-1 focus:ring-rose-500"
                      placeholder="Specify procedural mistake or violated checklist item..."
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Raw Token / JSON */}
            {activeMode === 'raw' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                    <FileCode2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Payload Data String</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">{payloadText.length} chars</span>
                </div>

                <textarea
                  rows={4}
                  value={payloadText}
                  onChange={e => {
                    setPayloadText(e.target.value);
                    setSelectedPresetId('custom');
                  }}
                  className="w-full p-2.5 font-mono text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all"
                  placeholder="Enter QR token payload or JSON object..."
                />
              </div>
            )}

            {/* Error Correction & Dimensions Accordion */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                  <Sliders className="w-3.5 h-3.5 text-slate-600" />
                  <span>Industrial Durability &amp; Error Correction</span>
                </label>
                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                  Level {errorCorrectionLevel} (30% Mine-Grade)
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                {(['L', 'M', 'Q', 'H'] as const).map(level => {
                  const isSelected = errorCorrectionLevel === level;
                  const labels = {
                    L: '7% (Low)',
                    M: '15% (Std)',
                    Q: '25% (High)',
                    H: '30% (Mining)'
                  };
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setErrorCorrectionLevel(level)}
                      className={`p-2 rounded border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-amber-400 border-slate-900 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-mono text-xs font-bold">{level}</div>
                      <div className="text-[10px] opacity-75">{labels[level]}</div>
                    </button>
                  );
                })}
              </div>

              {/* Theme Selector */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Color Palette</label>
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_THEMES.map((theme, i) => (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => {
                        setColorThemeIndex(i);
                        setUseCustomColors(false);
                      }}
                      className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                        !useCustomColors && colorThemeIndex === i
                          ? 'border-slate-900 bg-white font-bold ring-1 ring-slate-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-slate-300"
                        style={{ backgroundColor: theme.dark }}
                      />
                      <span>{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cryptographic SHA-256 Digest Box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SHA-256 Digest</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyPayload}
                  className="text-[10px] text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  {copiedPayload ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPayload ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-[10px] text-slate-700 break-all select-all">
                {computedHash || 'Computing SHA-256 ledger digest...'}
              </div>
            </div>
          </div>

          {/* Right Column: 6-cols Live Rendered QR & Direct Actions */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-5">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-mono text-slate-500 uppercase font-bold tracking-wider">
                Inbuilt Client-Side Render
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                {qrGeneratorData?.title || 'Operational QR Token'}
              </h4>
              {qrGeneratorData?.subtitle && (
                <p className="text-xs text-slate-600">{qrGeneratorData.subtitle}</p>
              )}
            </div>

            {/* Live Interactive QR Canvas */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <QRCodeView
                value={payloadText}
                size={qrSize}
                level={errorCorrectionLevel}
                fgColor={activeDark}
                bgColor={activeLight}
                includeMargin={includeMargin}
                showDownloadButton={false}
                showCopyButton={false}
                fileName={`symbiomine-token-${Date.now()}`}
              />
            </div>

            {/* Quick Actions Bar */}
            <div className="w-full space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG (Vector)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyPayload}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPayload ? 'Copied Token' : 'Copy Payload'}</span>
                </button>
              </div>

              {/* High-Impact Verification Bridge */}
              <button
                type="button"
                onClick={handleTestInScanner}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Verify in Optical QR Scanner &rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ECC Level {errorCorrectionLevel} &bull; SHA-256 Ledger Authenticated</span>
          </div>

          <button
            onClick={() => setIsGenerateQrModalOpen(false)}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold text-xs cursor-pointer transition-colors shadow-2xs"
          >
            Close Studio
          </button>
        </div>
      </div>
    </div>
  );
};
