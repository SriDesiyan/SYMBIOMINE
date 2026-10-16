/**
 * SYMBIOMINE — Dashboard analytics model.
 *
 * Workforce aggregates are DERIVED from the worker roster (see deriveWorkforceMetrics).
 * Everything under "SEED / DEMO" below is demo data kept in one place so it can be
 * swapped for backend aggregates without touching any view.
 *
 * Assessment standard: 5 questions x 20 marks = 100 marks. PASS >= 60 marks (60%).
 */
import type { Worker } from '../types';

export const PASS_MARK = 60;
export const QUESTIONS_PER_MODULE = 5;
export const MARKS_PER_QUESTION = 20;

export interface WorkforceMetrics {
  total: number;
  excellent: number;
  proficient: number;
  competent: number;
  remediationRequired: number; // score < 60
  certified: number;
  inRemediation: number; // pipeline (< 60 plus failed >= 1 module attempt)
  meanScore: number;
  passRate: number; // % at/above pass mark
  certificationRate: number;
  remediationRate: number;
}

const pct = (n: number, d: number) => (d === 0 ? 0 : Math.round((n / d) * 1000) / 10);

export function deriveWorkforceMetrics(workers: Worker[]): WorkforceMetrics {
  const total = workers.length;
  const excellent = workers.filter(w => w.overallScore >= 90).length;
  const proficient = workers.filter(w => w.overallScore >= 80 && w.overallScore < 90).length;
  const competent = workers.filter(w => w.overallScore >= PASS_MARK && w.overallScore < 80).length;
  const remediationRequired = workers.filter(w => w.overallScore < PASS_MARK).length;
  const certified = workers.filter(
    w => w.certificationStatus === 'Valid' || w.certificationStatus === 'Expiring Soon'
  ).length;
  const inRemediation = workers.filter(w => w.trainingStatus === 'Remediation Pending').length;
  const meanScore = total === 0 ? 0 : Math.round((workers.reduce((s, w) => s + w.overallScore, 0) / total) * 10) / 10;
  return {
    total,
    excellent,
    proficient,
    competent,
    remediationRequired,
    certified,
    inRemediation,
    meanScore,
    passRate: pct(total - remediationRequired, total),
    certificationRate: pct(certified, total),
    remediationRate: pct(inRemediation, total)
  };
}

/* ====================== SEED / DEMO DATA ====================== */

export type RiskSeverity = 'Critical' | 'High' | 'Medium';

export interface DomainPerformance {
  domain: string;
  avgScore: number;
  passRate: number;
  breaches: number;
  trend30d: number; // percentage-point change vs prior 30 days
  /** last 6 weekly mean scores, oldest -> newest (sparkline) */
  weekly: number[];
}

export const DOMAIN_PERFORMANCE: DomainPerformance[] = [
  { domain: 'Fire & Emergency Response', avgScore: 84.6, passRate: 90.0, breaches: 6, trend30d: 4.2, weekly: [79, 80, 82, 83, 84, 84.6] },
  { domain: 'Electrical Safety / LOTO', avgScore: 74.2, passRate: 72.0, breaches: 14, trend30d: -3.5, weekly: [78, 77, 76, 75, 74.8, 74.2] },
  { domain: 'Gas Leak & Confined Space', avgScore: 71.4, passRate: 64.2, breaches: 19, trend30d: -12.4, weekly: [82, 80, 78, 75, 73, 71.4] },
  { domain: 'PPE & Equipment', avgScore: 86.8, passRate: 92.0, breaches: 4, trend30d: 2.1, weekly: [83, 84, 85, 86, 86.4, 86.8] },
  { domain: 'Hazard Identification', avgScore: 82.1, passRate: 86.0, breaches: 8, trend30d: 1.4, weekly: [80, 80.6, 81, 81.5, 82, 82.1] },
  { domain: 'Fall / Work-at-Height Safety', avgScore: 79.3, passRate: 82.0, breaches: 9, trend30d: -0.8, weekly: [80, 80.2, 79.8, 79.6, 79.5, 79.3] }
];

export interface ModulePerformance {
  id: string;
  name: string;
  short: string;
  avgScore: number;
  passRate: number;
  remediation: number;
  trend: number;
}

export const MODULE_PERFORMANCE: ModulePerformance[] = [
  { id: 'MOD-01', name: 'Fire Safety & Extinguisher', short: 'Fire Safety', avgScore: 86, passRate: 90, remediation: 5, trend: 4.2 },
  { id: 'MOD-02', name: 'Gas Leak & Lockout Tagout', short: 'Gas & LOTO', avgScore: 82, passRate: 85, remediation: 8, trend: 2.1 },
  { id: 'MOD-03', name: 'Electrical Safety & Zero Energy', short: 'Electrical Safety', avgScore: 74, passRate: 72, remediation: 14, trend: -3.5 }
];

export interface SkillDeficit {
  rank: number;
  skill: string;
  module: string;
  workers: number;
  severity: RiskSeverity;
  change: string;
}

export const SKILL_DEFICITS: SkillDeficit[] = [
  { rank: 1, skill: 'Gas Emergency Response', module: 'Gas Leak & Lockout Tagout', workers: 34, severity: 'Critical', change: '-12% vs previous audit' },
  { rank: 2, skill: 'PPE Selection & Fit', module: 'PPE & Equipment', workers: 21, severity: 'High', change: '-3% vs previous audit' },
  { rank: 3, skill: 'LOTO Verification', module: 'Electrical Safety & Zero Energy', workers: 17, severity: 'Medium', change: '+4% vs previous audit' }
];

export interface OperationalEvent {
  time: string;
  type: 'critical' | 'warning' | 'success' | 'info';
  title: string;
  detail: string;
}

export const OPERATIONAL_EVENTS: OperationalEvent[] = [
  { time: '09:42', type: 'critical', title: 'Gas Leak scenario failed', detail: 'W-104 · Methane ingress · fan check omitted' },
  { time: '09:18', type: 'warning', title: 'Assessment restarted twice', detail: 'W-118 · Integrity review opened' },
  { time: '08:55', type: 'success', title: 'Credential issued', detail: 'W-131 · Fire Safety & Extinguisher · 92%' },
  { time: '08:31', type: 'info', title: 'Mesh sync complete', detail: '148 / 150 devices reconciled' },
  { time: '08:05', type: 'success', title: 'Remediation passed', detail: 'W-127 · Re-assessment 78% (attempt 2)' }
];

export interface RemediationStage {
  key: string;
  label: string;
  count: number;
  tone: 'slate' | 'red' | 'orange' | 'amber' | 'green';
}

/** 48 cases: 20 pending + 18 active + 10 re-assessed (8 passed, 2 escalated). */
export const REMEDIATION_FUNNEL: RemediationStage[] = [
  { key: 'failed', label: 'Failed / Flagged', count: 48, tone: 'red' },
  { key: 'remediation', label: 'Targeted Remediation', count: 38, tone: 'orange' },
  { key: 'reassess', label: 'Re-assessment', count: 10, tone: 'amber' },
  { key: 'certified', label: 'Passed', count: 8, tone: 'green' },
  { key: 'escalated', label: 'Escalated', count: 2, tone: 'red' }
];

export const REMEDIATION_ATTEMPTS = [
  { attempt: 'Attempt 1', count: 30 },
  { attempt: 'Attempt 2', count: 12 },
  { attempt: 'Attempt 3', count: 6 }
];

export const REMEDIATION_STATUS = { pending: 20, active: 18, completed: 10 };

export const CYCLE_TREND = {
  passRateDelta: 4.2, // vs previous assessment cycle
  certificationDelta: 4.2,
  meanDelta: 1.4,
  remediationDelta: -2.0
};

export const AI_STATUS = {
  agent: 'Online',
  mcp: 'Connected',
  tools: 12,
  lastSync: '2 min ago'
};
