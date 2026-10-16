/**
 * SYMBIOMINE High-Performance In-Memory Database Indexing & Validation Engine
 * Provides O(1) multi-key indexed lookups and strict MCP parameter schema validation.
 */

import { Worker, AssessmentRecord, Certificate, IntegrityFlagRecord, RemediationQueueItem, SiteLocation } from '../types';

export class DatabaseIndexManager {
  private workerById = new Map<string, Worker>();
  private workersBySite = new Map<string, Worker[]>();
  private workersByShift = new Map<string, Worker[]>();
  private assessmentById = new Map<string, AssessmentRecord>();
  private assessmentsByWorkerId = new Map<string, AssessmentRecord[]>();
  private certificateById = new Map<string, Certificate>();
  private certificatesByWorkerId = new Map<string, Certificate[]>();
  private integrityFlagById = new Map<string, IntegrityFlagRecord>();
  private remediationByWorkerId = new Map<string, RemediationQueueItem>();

  constructor(
    workers: Worker[] = [],
    assessments: AssessmentRecord[] = [],
    certificates: Certificate[] = [],
    integrityFlags: IntegrityFlagRecord[] = [],
    remediationQueue: RemediationQueueItem[] = []
  ) {
    this.reindexAll(workers, assessments, certificates, integrityFlags, remediationQueue);
  }

  public reindexAll(
    workers: Worker[],
    assessments: AssessmentRecord[],
    certificates: Certificate[],
    integrityFlags: IntegrityFlagRecord[],
    remediationQueue: RemediationQueueItem[]
  ): void {
    // 1. Index Workers
    this.workerById.clear();
    this.workersBySite.clear();
    this.workersByShift.clear();

    for (const w of workers) {
      this.workerById.set(w.id.toUpperCase(), w);

      // Site index
      const siteList = this.workersBySite.get(w.site) || [];
      siteList.push(w);
      this.workersBySite.set(w.site, siteList);

      // Shift index
      const shiftList = this.workersByShift.get(w.shift) || [];
      shiftList.push(w);
      this.workersByShift.set(w.shift, shiftList);
    }

    // 2. Index Assessments
    this.assessmentById.clear();
    this.assessmentsByWorkerId.clear();

    for (const a of assessments) {
      this.assessmentById.set(a.id, a);

      const workerAsms = this.assessmentsByWorkerId.get(a.workerId.toUpperCase()) || [];
      workerAsms.push(a);
      this.assessmentsByWorkerId.set(a.workerId.toUpperCase(), workerAsms);
    }

    // 3. Index Certificates
    this.certificateById.clear();
    this.certificatesByWorkerId.clear();

    for (const c of certificates) {
      this.certificateById.set(c.id, c);

      const workerCerts = this.certificatesByWorkerId.get(c.workerId.toUpperCase()) || [];
      workerCerts.push(c);
      this.certificatesByWorkerId.set(c.workerId.toUpperCase(), workerCerts);
    }

    // 4. Index Integrity Flags
    this.integrityFlagById.clear();
    for (const f of integrityFlags) {
      this.integrityFlagById.set(f.id, f);
    }

    // 5. Index Remediation Queue
    this.remediationByWorkerId.clear();
    for (const r of remediationQueue) {
      this.remediationByWorkerId.set(r.workerId.toUpperCase(), r);
    }
  }

  // O(1) Lookups
  public getWorker(id: string): Worker | undefined {
    return this.workerById.get(id.toUpperCase());
  }

  public getWorkersBySite(site: string): Worker[] {
    if (site === 'All Sites' || !site) {
      return Array.from(this.workerById.values());
    }
    return this.workersBySite.get(site) || [];
  }

  public getAssessment(id: string): AssessmentRecord | undefined {
    return this.assessmentById.get(id);
  }

  public getAssessmentsForWorker(workerId: string): AssessmentRecord[] {
    return this.assessmentsByWorkerId.get(workerId.toUpperCase()) || [];
  }

  public getCertificate(id: string): Certificate | undefined {
    return this.certificateById.get(id);
  }

  public getCertificatesForWorker(workerId: string): Certificate[] {
    return this.certificatesByWorkerId.get(workerId.toUpperCase()) || [];
  }

  public getIntegrityFlag(id: string): IntegrityFlagRecord | undefined {
    return this.integrityFlagById.get(id);
  }

  public getRemediationForWorker(workerId: string): RemediationQueueItem | undefined {
    return this.remediationByWorkerId.get(workerId.toUpperCase());
  }
}

/**
 * Validates tool parameters against known schemas
 */
export function validateMcpParameters(
  toolName: string,
  params: Record<string, any>
): { valid: boolean; error?: string } {
  if (!params || typeof params !== 'object') {
    return { valid: false, error: 'Parameters must be a structured JSON object.' };
  }

  switch (toolName) {
    case 'get_worker_profile':
      if (!params.workerId || typeof params.workerId !== 'string') {
        return { valid: false, error: 'Missing required string parameter: workerId (e.g. "W-104")' };
      }
      if (params.workerId.length > 50) {
        return { valid: false, error: 'workerId exceeds maximum allowed length (50 characters).' };
      }
      break;

    case 'search_workers':
      if (params.minScore !== undefined) {
        const min = Number(params.minScore);
        if (isNaN(min) || min < 0 || min > 100) {
          return { valid: false, error: 'minScore must be a number between 0 and 100.' };
        }
      }
      if (params.maxScore !== undefined) {
        const max = Number(params.maxScore);
        if (isNaN(max) || max < 0 || max > 100) {
          return { valid: false, error: 'maxScore must be a number between 0 and 100.' };
        }
      }
      break;

    case 'get_assessment_detail':
      if (!params.assessmentId || typeof params.assessmentId !== 'string') {
        return { valid: false, error: 'Missing required string parameter: assessmentId' };
      }
      break;

    case 'verify_certificate_record':
      if (!params.certificateId || typeof params.certificateId !== 'string') {
        return { valid: false, error: 'Missing required string parameter: certificateId' };
      }
      break;

    case 'generate_statutory_report_data':
      if (!params.reportType || typeof params.reportType !== 'string') {
        return { valid: false, error: 'Missing required string parameter: reportType' };
      }
      break;
  }

  return { valid: true };
}
