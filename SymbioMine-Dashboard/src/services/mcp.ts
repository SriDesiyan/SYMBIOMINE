/**
 * SYMBIOMINE MCP (Model Context Protocol) Server Simulation
 * Exposes approved operational tools with strict safety governance.
 */

import {
  INITIAL_WORKERS,
  INITIAL_ASSESSMENTS,
  INITIAL_REMEDIATION_QUEUE,
  INITIAL_CERTIFICATES,
  INITIAL_INTEGRITY_FLAGS,
  SCENARIO_MODULES,
  DOMAIN_BENCHMARKS,
  MOST_FREQUENT_FAILED_PROCEDURES,
  INITIAL_SYNC_RECORDS
} from './demoData';
import { Worker, AssessmentRecord, RemediationQueueItem, SafetyDomain } from '../types';

export interface McpToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, { type: string; description: string; required?: boolean }>;
  isSafetyCritical: boolean;
}

export const APPROVED_MCP_TOOLS: McpToolDefinition[] = [
  {
    name: 'get_worker_profile',
    description: 'Retrieve verified competency profile, shift, site, and domain performance for a specific worker ID.',
    parameters: {
      workerId: { type: 'string', description: 'Worker ID (e.g. W-104)', required: true }
    },
    isSafetyCritical: false
  },
  {
    name: 'get_assessment_results',
    description: 'Retrieve real-time and historical assessment records, timeline actions, and LiteRT ML inference results.',
    parameters: {
      workerId: { type: 'string', description: 'Optional worker ID filter' },
      domain: { type: 'string', description: 'Safety domain filter' },
      limit: { type: 'number', description: 'Maximum number of records to return' }
    },
    isSafetyCritical: false
  },
  {
    name: 'get_skill_gaps',
    description: 'Retrieve workers with identified competency skill gaps below approved pass thresholds across sites.',
    parameters: {
      domain: { type: 'string', description: 'Specific safety domain (e.g. Gas Leak & Confined Space)' },
      site: { type: 'string', description: 'Mine site filter' }
    },
    isSafetyCritical: false
  },
  {
    name: 'get_failed_procedures',
    description: 'Retrieve ranking of most frequently failed procedural steps based on empirical frequency metrics.',
    parameters: {
      limit: { type: 'number', description: 'Rank limit (default 5)' }
    },
    isSafetyCritical: false
  },
  {
    name: 'get_training_modules',
    description: 'List approved training modules and VR/AR scenario configurations.',
    parameters: {
      domain: { type: 'string', description: 'Safety domain' }
    },
    isSafetyCritical: false
  },
  {
    name: 'get_certification_status',
    description: 'Retrieve verified digital certificate registry, validity statuses, and expiration timelines.',
    parameters: {
      workerId: { type: 'string', description: 'Worker ID' }
    },
    isSafetyCritical: false
  },
  {
    name: 'get_integrity_flags',
    description: 'Retrieve non-accusatory integrity flags, interaction anomalies, and sensor verification logs.',
    parameters: {
      status: { type: 'string', description: 'Flag status (Open Flag, Under Review, Cleared)' }
    },
    isSafetyCritical: false
  },
  {
    name: 'get_site_statistics',
    description: 'Compute overall workforce metrics, pass rates, and active remediation load for a specific mine site or all sites.',
    parameters: {
      site: { type: 'string', description: 'Site name or All Sites' }
    },
    isSafetyCritical: false
  },
  {
    name: 'get_competency_trends',
    description: 'Retrieve historical score progression across domains, sites, and shifts.',
    parameters: {
      domain: { type: 'string', description: 'Safety domain' }
    },
    isSafetyCritical: false
  },
  {
    name: 'get_training_history',
    description: 'Retrieve remediation queue items, attempt tracking (3-attempt policy), and assignment records.',
    parameters: {
      workerId: { type: 'string', description: 'Worker ID' }
    },
    isSafetyCritical: false
  },
  {
    name: 'generate_competency_report',
    description: 'Aggregate verified numerical data from database for regulatory reporting.',
    parameters: {
      reportType: { type: 'string', description: 'Monthly Competency, Skill Gap, Integrity', required: true },
      site: { type: 'string', description: 'Site filter' }
    },
    isSafetyCritical: false
  },
  {
    name: 'recommend_training',
    description: 'Provide rule-based remediation module recommendation according to identified skill gap.',
    parameters: {
      skillGap: { type: 'string', description: 'Identified competency gap name', required: true }
    },
    isSafetyCritical: false
  }
];

export class McpServer {
  private workers: Worker[] = [...INITIAL_WORKERS];
  private assessments: AssessmentRecord[] = [...INITIAL_ASSESSMENTS];
  private remediationQueue: RemediationQueueItem[] = [...INITIAL_REMEDIATION_QUEUE];

  // Tool execution dispatcher
  public async executeTool(toolName: string, params: Record<string, any>): Promise<{ data: any; executionSummary: string }> {
    switch (toolName) {
      case 'get_worker_profile': {
        const worker = this.workers.find(w => w.id === params.workerId) || this.workers[0];
        return {
          data: worker,
          executionSummary: `Retrieved verified profile for ${worker.name} (${worker.id}) — ${worker.site}, ${worker.shift}`
        };
      }

      case 'get_assessment_results': {
        let results = [...this.assessments];
        if (params.workerId) {
          results = results.filter(a => a.workerId === params.workerId);
        }
        if (params.domain) {
          results = results.filter(a => a.domain === params.domain);
        }
        return {
          data: results.slice(0, params.limit || 10),
          executionSummary: `Queried ${results.length} assessment records from persistent assessment log.`
        };
      }

      case 'get_skill_gaps': {
        const domain = params.domain || 'Gas Leak & Confined Space';
        // Find workers with domain score < 60 (pass mark)
        const failingWorkers = this.workers.filter(w => {
          const score = w.domainScores[domain as SafetyDomain];
          return score !== undefined && score < 60;
        });

        return {
          data: {
            domain,
            totalAffectedWorkers: failingWorkers.length,
            workers: failingWorkers.slice(0, 18).map(w => ({
              id: w.id,
              name: w.name,
              site: w.site,
              shift: w.shift,
              domainScore: w.domainScores[domain as SafetyDomain],
              role: w.role
            }))
          },
          executionSummary: `Identified ${failingWorkers.length} workers below threshold in ${domain}.`
        };
      }

      case 'get_failed_procedures': {
        const limit = params.limit || 5;
        return {
          data: MOST_FREQUENT_FAILED_PROCEDURES.slice(0, limit),
          executionSummary: `Ranked top ${limit} procedural failure modes by empirical frequency.`
        };
      }

      case 'get_training_modules': {
        let modules = [...SCENARIO_MODULES];
        if (params.domain) {
          modules = modules.filter(m => m.domain === params.domain);
        }
        return {
          data: modules,
          executionSummary: `Loaded ${modules.length} approved VR/AR training scenario modules.`
        };
      }

      case 'get_certification_status': {
        let certs = [...INITIAL_CERTIFICATES];
        if (params.workerId) {
          certs = certs.filter(c => c.workerId === params.workerId);
        }
        return {
          data: certs,
          executionSummary: `Verified ${certs.length} cryptographic certificates in certification register.`
        };
      }

      case 'get_integrity_flags': {
        let flags = [...INITIAL_INTEGRITY_FLAGS];
        if (params.status) {
          flags = flags.filter(f => f.status === params.status);
        }
        return {
          data: flags,
          executionSummary: `Retrieved ${flags.length} sensor/interaction integrity records for supervisor review.`
        };
      }

      case 'get_site_statistics': {
        const total = this.workers.length;
        const certified = this.workers.filter(w => w.certificationStatus === 'Valid').length;
        const attention = this.workers.filter(w => w.trainingStatus === 'Remediation Pending').length;
        const avgScore = (this.workers.reduce((acc, w) => acc + w.overallScore, 0) / total).toFixed(1);

        return {
          data: {
            site: params.site || 'All Sites',
            totalWorkers: total,
            certifiedWorkers: certified,
            attentionRequired: attention,
            averageCompetency: avgScore,
            activeRemediationAttempts: this.remediationQueue.length
          },
          executionSummary: `Computed site statistics: ${total} workers, ${certified} certified, avg score ${avgScore}%.`
        };
      }

      case 'get_competency_trends': {
        return {
          data: DOMAIN_BENCHMARKS,
          executionSummary: `Aggregated 5-period competency trend lines across 6 safety domains.`
        };
      }

      case 'get_training_history': {
        let queue = [...this.remediationQueue];
        if (params.workerId) {
          queue = queue.filter(q => q.workerId === params.workerId);
        }
        return {
          data: queue,
          executionSummary: `Retrieved ${queue.length} active remediation items under the 3-attempt policy.`
        };
      }

      case 'generate_competency_report': {
        return {
          data: {
            reportType: params.reportType || 'Monthly Competency Report',
            generatedAt: new Date().toISOString(),
            totalWorkersAudited: 150,
            overallComplianceRate: '88.4%',
            domainBreakdown: DOMAIN_BENCHMARKS
          },
          executionSummary: `Compiled structured report data from PostgreSQL database records.`
        };
      }

      case 'recommend_training': {
        const gap = params.skillGap || 'Gas Emergency Response';
        const module = SCENARIO_MODULES.find(m => m.name.toLowerCase().includes('gas')) || SCENARIO_MODULES[0];
        return {
          data: {
            skillGap: gap,
            recommendedModule: module.name,
            moduleId: module.id,
            difficulty: module.difficulty,
            estimatedDurationMinutes: 25,
            passThreshold: module.passThreshold
          },
          executionSummary: `Matched skill gap "${gap}" with approved module ${module.id} (${module.name}).`
        };
      }

      default:
        throw new Error(`MCP tool "${toolName}" is not recognized or approved.`);
    }
  }

  public updateWorkerState(workers: Worker[]) {
    this.workers = workers;
  }

  public updateRemediationState(queue: RemediationQueueItem[]) {
    this.remediationQueue = queue;
  }
}

export const mcpServerInstance = new McpServer();
