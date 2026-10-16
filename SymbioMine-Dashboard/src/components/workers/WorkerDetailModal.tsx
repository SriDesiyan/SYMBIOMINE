import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SafetyDomain } from '../../types';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  UserCheck,
  QrCode
} from 'lucide-react';

export const WorkerDetailModal: React.FC = () => {
  const {
    selectedWorker,
    setSelectedWorker,
    assessments,
    certificates,
    remediationQueue,
    integrityFlags,
    syncRecords,
    assignTraining,
    setSelectedAssessment,
    openQrGenerator
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<number>(0);

  if (!selectedWorker) return null;

  const worker = selectedWorker;

  const subTabs = [
    'Competency Profile',
    'Assessment History',
    'Skill Gaps',
    'Failed Procedures',
    'Training History',
    'Certification',
    'Integrity Logs',
    'Sync Records'
  ];

  // Data related to this worker
  const workerAssessments = assessments.filter(a => a.workerId === worker.id);
  const workerCertificates = certificates.filter(c => c.workerId === worker.id);
  const workerRemediations = remediationQueue.filter(r => r.workerId === worker.id);
  const workerFlags = integrityFlags.filter(f => f.workerId === worker.id);
  const workerSyncs = syncRecords.filter(s => s.workerId === worker.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-start justify-between">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold text-base font-mono">
              {worker.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-white">{worker.name}</h3>
                <span className="font-mono text-xs text-amber-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-bold">
                  {worker.id}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Badge: {worker.badgeNumber}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-300">
                <span>{worker.role}</span>
                <span>&bull;</span>
                <span>{worker.department}</span>
                <span>&bull;</span>
                <span>{worker.site}</span>
                <span>&bull;</span>
                <span className="font-mono text-amber-300">{worker.shift}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const isFail = worker.overallScore < 60;
                const weakness = isFail
                  ? 'Procedural non-compliance flagged in current certification cycle'
                  : '';
                const payload = `SYMBIOMINE::BADGE::WORKER:${worker.id}::NAME:${worker.name}::ROLE:${worker.role}::BADGE:${worker.badgeNumber}::SITE:${worker.site}::DEPT:${worker.department}::SHIFT:${worker.shift}::SCORE:${worker.overallScore}%::STATUS:${isFail ? 'FAIL' : 'PASS'}${isFail ? `::WEAKNESS:${weakness}` : ''}`;
                openQrGenerator(
                  payload,
                  `Worker Badge QR: ${worker.name}`,
                  `Badge #${worker.badgeNumber} &bull; ${worker.role}`
                );
              }}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Generate Worker Identity & Safety Badge QR"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Badge QR</span>
            </button>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Overall Score</span>
              <span className="text-xl font-mono font-bold text-amber-400 tabular-nums">{worker.overallScore}%</span>
              <span className="block text-[10px] text-slate-300 font-medium">{worker.competencyLevel}</span>
            </div>
            <button
              onClick={() => setSelectedWorker(null)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 8 Sub-Tab Navigation Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 flex items-center gap-1 overflow-x-auto text-xs font-semibold">
          {subTabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(idx)}
              className={`py-2 px-3 whitespace-nowrap border-b-2 transition-colors cursor-pointer text-xs ${
                activeSubTab === idx
                  ? 'border-slate-900 text-slate-900 font-bold bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-5">
          {/* Sub-Tab 0: Competency Profile */}
          {activeSubTab === 0 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 font-sans">
                  Safety Domain Performance Breakdown
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {(Object.keys(worker.domainScores) as SafetyDomain[]).map(domain => {
                    const score = worker.domainScores[domain];
                    const isPass = score >= 60;
                    return (
                      <div key={domain} className="p-3 rounded border border-slate-200 bg-slate-50/70">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-slate-900">{domain}</span>
                          <span className={`text-xs font-mono font-bold tabular-nums ${isPass ? 'text-emerald-800' : 'text-rose-700'}`}>
                            {score}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded overflow-hidden">
                          <div
                            className={`h-full ${score >= 85 ? 'bg-emerald-700' : score >= 60 ? 'bg-amber-600' : 'bg-rose-600'}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                          <span>Pass Baseline: 60%</span>
                          <span>{isPass ? 'Statutory Pass' : 'Remediation Required'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Core Performance Dimensions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 font-sans">
                  Measured Operational Dimensions (Edge ML Sensor Telemetry)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Procedural Accuracy</span>
                    <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block tabular-nums">88.4%</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Hazard Recognition</span>
                    <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block tabular-nums">72.0%</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Avg Response Latency</span>
                    <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block tabular-nums">42s</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Critical Breaches</span>
                    <span className="text-base font-bold font-mono text-rose-700 mt-0.5 block tabular-nums">
                      {worker.overallScore < 60 ? '1 breach' : '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 1: Assessment History */}
          {activeSubTab === 1 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans">
                  Recorded Assessments ({workerAssessments.length})
                </h4>
                <span className="text-[11px] text-slate-500 font-mono">Recorded via Unity ARCore + LiteRT</span>
              </div>

              {workerAssessments.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-50 rounded border border-slate-200 text-xs">
                  No direct assessment records cached on local portal.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {workerAssessments.map(asm => (
                    <div key={asm.id} className="p-3.5 rounded border border-slate-200 bg-slate-50 hover:bg-white transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{asm.scenarioName}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                              Attempt {asm.attempt} of 3
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              asm.passed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}>
                              {asm.passed ? 'PASSED' : 'UNSUCCESSFUL'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Domain: {asm.domain} &bull; Timestamp: {asm.date} &bull; Duration: {asm.responseDurationSeconds}s
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-base font-mono font-bold tabular-nums ${asm.passed ? 'text-emerald-800' : 'text-rose-700'}`}>
                            {asm.score}%
                          </span>
                          <span className="block text-[10px] text-slate-400">Pass Baseline: {asm.passThreshold}%</span>
                        </div>
                      </div>

                      {asm.liteRtInsight && (
                        <div className="mt-2.5 p-2 bg-amber-50/80 border border-amber-200 rounded text-[11px] text-amber-950 flex items-start gap-2">
                          <Cpu className="w-3.5 h-3.5 text-amber-700 mt-0.5 shrink-0" />
                          <span>{asm.liteRtInsight}</span>
                        </div>
                      )}

                      <div className="mt-2.5 flex items-center justify-end">
                        <button
                          onClick={() => setSelectedAssessment(asm)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded hover:bg-slate-50 cursor-pointer shadow-2xs"
                        >
                          View Action Timeline &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub-Tab 2: Skill Gaps */}
          {activeSubTab === 2 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans">
                Empirical Skill Gaps Identified
              </h4>
              {worker.overallScore < 60 ? (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded space-y-2">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Gas Emergency Response Protocol &bull; Remediation Mandated</span>
                  </div>
                  <p className="text-xs text-rose-900 leading-relaxed">
                    LiteRT diagnostic highlights procedural hesitation during blind heading methane ingress.
                    Worker delayed auxiliary ventilation verification by 8 seconds and advanced before warning indicator cleared.
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={() => assignTraining(worker.id, 'SCN-GAS-04', 'Gas Emergency Response')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      Dispatch Module SCN-GAS-04
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 bg-emerald-50/40 border border-emerald-200 rounded">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-emerald-900">No Critical Skill Gaps Detected</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Worker maintains competency above the statutory 60% threshold in all domains.</p>
                </div>
              )}
            </div>
          )}

          {/* Sub-Tab 3: Failed Procedures */}
          {activeSubTab === 3 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans">
                Failed Procedure Audit Log
              </h4>
              {worker.overallScore < 60 ? (
                <div className="p-3.5 border border-slate-200 rounded space-y-1.5 text-xs bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">CR-04: Blind Heading Ingress Without Auxiliary Fan</span>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold rounded">CRITICAL BREACH</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Occurred at 09:31:22 during Scenario SCN-GAS-04. Candidate failed to wait for exhaust smoke-tube confirmation prior to approaching cutter face.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 p-4 bg-slate-50 rounded border border-slate-200 text-center">
                  No procedural failures recorded in current certification cycle.
                </p>
              )}
            </div>
          )}

          {/* Sub-Tab 4: Training History */}
          {activeSubTab === 4 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans">
                Remediation Policy Tracking (DGMS 3-Attempt Framework)
              </h4>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Attempt Policy Status:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {workerRemediations.length > 0 ? workerRemediations[0].status : 'Standard Operational Cadence'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] mt-2">
                  <div className="p-2 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500 block text-[10px]">Attempt 1</span>
                    <span className="font-bold text-slate-800">Completed</span>
                  </div>
                  <div className="p-2 bg-white border border-amber-300 rounded bg-amber-50/50">
                    <span className="text-amber-800 block text-[10px] font-semibold">Attempt 2</span>
                    <span className="font-bold text-amber-900">Targeted Remediation</span>
                  </div>
                  <div className="p-2 bg-white border border-slate-200 rounded">
                    <span className="text-slate-500 block text-[10px]">Attempt 3</span>
                    <span className="text-slate-400">Final Audit Reassessment</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 5: Certification */}
          {activeSubTab === 5 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans">
                Verified Cryptographic Credentials
              </h4>
              {workerCertificates.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded border border-slate-200 text-center text-slate-500 text-xs">
                  No active certificate issued. Candidate must successfully pass remediation reassessment (&ge; 60%) to mint credential.
                </div>
              ) : (
                workerCertificates.map(cert => (
                  <div key={cert.id} className="p-3.5 border border-slate-200 rounded bg-slate-50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{cert.moduleName}</span>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{cert.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const payload =
                              cert.qrPayload ||
                              `SYMBIOMINE::${cert.id}::${cert.workerId}::${cert.verificationStatus.toUpperCase()}::SHA256:${cert.sha256Hash}`;
                            openQrGenerator(payload, `Credential: ${cert.id}`, `${cert.workerName} (${cert.workerId})`);
                          }}
                          className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <QrCode className="w-3 h-3 text-amber-600" />
                          <span>Generate QR</span>
                        </button>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold rounded text-[10px]">
                          {cert.verificationStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 bg-white border border-slate-200 rounded font-mono text-[10px] break-all text-slate-600">
                      SHA-256: {cert.sha256Hash}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Sub-Tab 6: Integrity Logs */}
          {activeSubTab === 6 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans">
                Sensor &amp; Scenario Integrity Records
              </h4>
              {workerFlags.length === 0 ? (
                <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All biometric, optical, and randomized scenario tokens verified compliant.</span>
                </div>
              ) : (
                workerFlags.map(flag => (
                  <div key={flag.id} className="p-3 bg-amber-50 border border-amber-200 rounded text-xs space-y-1">
                    <span className="font-bold text-amber-900">{flag.flagType}</span>
                    <p className="text-amber-800 text-[11px]">{flag.description}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Sub-Tab 7: Sync Records */}
          {activeSubTab === 7 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans">
                Offline Tablet Ingestion Records
              </h4>
              {workerSyncs.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded border border-slate-200 text-slate-500 text-xs text-center">
                  Worker telemetry synchronized via local substation docking station.
                </div>
              ) : (
                workerSyncs.map(sync => (
                  <div key={sync.id} className="p-2.5 border border-slate-200 rounded flex items-center justify-between text-xs bg-slate-50">
                    <div>
                      <span className="font-bold text-slate-900">{sync.deviceId}</span>
                      <p className="text-[11px] text-slate-500">{sync.networkTransport} &bull; {sync.syncTimestamp}</p>
                    </div>
                    <span className="font-mono text-emerald-800 font-bold">{sync.status}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Statutory standard compliance record governed by DGMS Coal Mines Regulations.
          </span>
          <button
            onClick={() => setSelectedWorker(null)}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold cursor-pointer text-xs transition-colors shadow-2xs"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
