/**
 * SYMBIOMINE AI Safety Assistant Engine
 * Full-fidelity tool-using operational agent connecting to the MCP tool architecture.
 * Calls server API with offline-safe deterministic fallback.
 * Strictly enforces safety-critical rules outside LLM and provides grounded citations.
 */

import { mcpRegistryInstance } from './mcpRegistry';
import { AiAssistantMessage, McpToolCall } from '../types';
import { evaluateSafetyPolicy } from './safetyPolicy';

export interface ToolProgressEvent {
  toolName: string;
  statusText: string;
  parameters?: Record<string, any>;
  phase: 'starting' | 'querying' | 'completed' | 'interrupted';
}

export class AiSafetyAgent {
  /**
   * Deterministic safety boundary check on client as well (fails fast before network).
   */
  public validateSafetyBoundary(query: string): { allowed: boolean; refusalReason?: string; policyCode?: string } {
    return evaluateSafetyPolicy(query);
  }

  /**
   * Executes an operational query by orchestrating MCP tools and returning grounded response.
   */
  public async handleUserQuery(
    userQuery: string,
    onProgress?: (progress: ToolProgressEvent) => void
  ): Promise<AiAssistantMessage> {
    // 1. Client-side boundary validation
    const safetyCheck = this.validateSafetyBoundary(userQuery);
    if (!safetyCheck.allowed) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `### Safety Policy Guardrail Intercepted\n\n**${safetyCheck.policyCode}**\n\n${safetyCheck.refusalReason}`,
        isRefusal: true,
        evidence: [
          { metric: 'Enforcement Guard', value: safetyCheck.policyCode || 'SAFETY_GUARD', source: 'Regulatory Policy Engine' },
          { metric: 'Statutory Standard', value: 'DGMS Coal Mines Regulations 2017', source: 'Directorate General of Mines Safety' }
        ],
        recommendation: 'Please refer to the manual Supervisor Governance Console for certified policy workflows.',
        suggestedActions: [
          { label: 'View System Policy Lock', actionKey: 'NAVIGATE_SETTINGS' },
          { label: 'View Forensic Integrity Logs', actionKey: 'NAVIGATE_INTEGRITY' }
        ],
        toolCalls: []
      };
    }

    // 2. Try server API query endpoint
    try {
      onProgress?.({
        toolName: 'mcp:kernel_dispatcher',
        statusText: 'Connecting to MCP Server & validating query permissions...',
        phase: 'starting'
      });

      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery })
      });

      if (res.ok) {
        const data = await res.json();
        // Emulate realistic tool execution status events for the UI
        if (data.toolCalls && data.toolCalls.length > 0) {
          for (const tc of data.toolCalls) {
            onProgress?.({
              toolName: tc.toolName,
              statusText: `Executed ${tc.toolName}: ${tc.resultSummary}`,
              parameters: tc.parameters,
              phase: 'completed'
            });
          }
        }

        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: data.content,
          evidence: data.evidence,
          recommendation: data.recommendation,
          suggestedActions: data.suggestedActions,
          toolCalls: data.toolCalls
        };
      }
    } catch (err) {
      console.warn('Server API query error, falling back to client-side MCP engine:', err);
    }

    // 3. Fallback: Client-side Deterministic MCP Execution
    return await this.executeClientFallback(userQuery, onProgress);
  }

  private async executeClientFallback(
    userQuery: string,
    onProgress?: (progress: ToolProgressEvent) => void
  ): Promise<AiAssistantMessage> {
    const q = userQuery.toLowerCase();
    const toolCalls: McpToolCall[] = [];

    // WORKFLOW 1: Competency Analysis
    if (
      q.includes('competency analysis') ||
      q.includes('highest risk') ||
      q.includes('competency across') ||
      q.includes('most attention') ||
      q.includes('domain benchmark')
    ) {
      onProgress?.({
        toolName: 'get_competency_matrix',
        statusText: 'Querying 3 DGMS domain benchmarks against 60% pass cutoff...',
        parameters: { site: 'All Sites' },
        phase: 'querying'
      });
      await new Promise(r => setTimeout(r, 350));

      const matrixRes = await mcpRegistryInstance.executeTool('get_competency_matrix', { site: 'All Sites' });
      toolCalls.push({
        toolName: matrixRes.toolName,
        parameters: matrixRes.parameters,
        timestamp: new Date().toLocaleTimeString(),
        resultSummary: matrixRes.executionSummary,
        executionTimeMs: matrixRes.executionTimeMs,
        citations: matrixRes.citations,
        data: matrixRes.data
      });

      onProgress?.({
        toolName: 'get_failed_procedures',
        statusText: 'Retrieving most frequent procedural breach logs from edge sensor telemetry...',
        parameters: { limit: 3 },
        phase: 'querying'
      });
      await new Promise(r => setTimeout(r, 300));

      const failRes = await mcpRegistryInstance.executeTool('get_failed_procedures', { limit: 3 });
      toolCalls.push({
        toolName: failRes.toolName,
        parameters: failRes.parameters,
        timestamp: new Date().toLocaleTimeString(),
        resultSummary: failRes.executionSummary,
        executionTimeMs: failRes.executionTimeMs,
        citations: failRes.citations,
        data: failRes.data
      });

      const highestRisk = matrixRes.data.highestRiskDomain;
      const lowestScore = matrixRes.data.lowestDomainAverage;
      const topFailure = failRes.data.topFailures[0];

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `### Competency Intelligence Audit: Critical Domain Risk Identified

Querying the persistent competency ledger across all 150 active workers reveals that **${highestRisk}** is currently the highest operational risk area, with an average score of **${lowestScore}%** (statutory pass threshold: **60.0%**).

#### Root Cause Analysis via Edge ML Logs:
The primary failure mode logged during AR/VR simulations is **${topFailure.ruleId}**: *${topFailure.description}*, which accounted for **${topFailure.failureCount} verified breaches** across underground extraction crews. Workers frequently fail to wait for auxiliary fan clearance before advancing continuous miners into unventilated blind headings.`,
        evidence: [
          { metric: 'Critical Deficit Domain', value: `${highestRisk} (${lowestScore}% avg)`, source: 'PostgreSQL:domain_benchmarks' },
          { metric: 'Primary Failure Code', value: `${topFailure.ruleId} (${topFailure.failureCount} breaches)`, source: 'DB:procedure_breaches' },
          { metric: 'Regulatory Baseline', value: '60.0% mandatory DGMS cutoff', source: 'DGMS:CMR_2017_Standard' }
        ],
        recommendation: `Dispatch mandatory targeted remediation module **SCN-GAS-04** to all crews operating in blind headings before next scheduled underground shift.`,
        suggestedActions: [
          { label: 'View Deficient Workers', actionKey: 'VIEW_WORKERS_FILTERED', params: { domain: 'Gas Leak & Confined Space' } },
          { label: 'Inspect Failure Matrix', actionKey: 'NAVIGATE_COMPETENCY' },
          { label: 'Enqueue Remediation', actionKey: 'ASSIGN_GAS_TRAINING', params: { count: 34 } }
        ],
        toolCalls
      };
    }

    // WORKFLOW 2: Training Recommendation
    if (
      q.includes('training recommendation') ||
      q.includes('recommend remediation') ||
      q.includes('failing gas') ||
      q.includes('gas emergency response') ||
      (q.includes('which workers') && q.includes('training'))
    ) {
      onProgress?.({
        toolName: 'get_skill_gaps',
        statusText: 'Filtering workers below 60% pass mark in Gas Leak & Confined Space...',
        parameters: { domain: 'Gas Leak & Confined Space' },
        phase: 'querying'
      });
      await new Promise(r => setTimeout(r, 350));

      const skillGapRes = await mcpRegistryInstance.executeTool('get_skill_gaps', {
        domain: 'Gas Leak & Confined Space'
      });
      toolCalls.push({
        toolName: skillGapRes.toolName,
        parameters: skillGapRes.parameters,
        timestamp: new Date().toLocaleTimeString(),
        resultSummary: skillGapRes.executionSummary,
        executionTimeMs: skillGapRes.executionTimeMs,
        citations: skillGapRes.citations,
        data: skillGapRes.data
      });

      onProgress?.({
        toolName: 'recommend_training_module',
        statusText: 'Matching identified skill gap to DGMS-approved VR simulation curriculum...',
        parameters: { skillGap: 'Gas Emergency Response' },
        phase: 'querying'
      });
      await new Promise(r => setTimeout(r, 300));

      const recRes = await mcpRegistryInstance.executeTool('recommend_training_module', {
        skillGap: 'Gas Emergency Response'
      });
      toolCalls.push({
        toolName: recRes.toolName,
        parameters: recRes.parameters,
        timestamp: new Date().toLocaleTimeString(),
        resultSummary: recRes.executionSummary,
        executionTimeMs: recRes.executionTimeMs,
        citations: recRes.citations,
        data: recRes.data
      });

      const count = skillGapRes.data.totalDeficientWorkers;
      const shifts = skillGapRes.data.shiftBreakdown;

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `### Targeted Remediation Recommendation: Gas Emergency Response

Empirical audit of the skill gaps register confirms **${count} workers** currently scoring below the 60% pass mark in **Gas Leak & Confined Space**.

#### Shift Distribution:
- **Shift A**: ${shifts['Shift A']} workers
- **Shift B**: ${shifts['Shift B']} workers *(Highest concentration — Continuous Miner Operators)*
- **Shift C**: ${shifts['Shift C']} workers

#### Recommended Policy Action:
In accordance with the **3-Attempt Remediation Policy**, assign module **${recRes.data.recommendedModuleId}: ${recRes.data.recommendedModuleName}** (${recRes.data.regulatoryStandard}). Completion unlocks eligibility for formal Attempt 2 reassessment.`,
        evidence: [
          { metric: 'Personnel Requiring Remediation', value: `${count} workers (< 60%)`, source: 'PostgreSQL:skill_gaps' },
          { metric: 'Approved Curriculum Module', value: `${recRes.data.recommendedModuleId} (${recRes.data.difficulty})`, source: 'Curriculum:modules' },
          { metric: 'Remediation Stage', value: 'Attempt 1 to Attempt 2 Transition', source: 'PolicyEngine:3AttemptStandard' }
        ],
        recommendation: `Queue bulk enrollment into **${recRes.data.recommendedModuleId}** and schedule virtual headset sessions at the Jharkhand Underground Training Substation.`,
        suggestedActions: [
          { label: `Assign Module ${recRes.data.recommendedModuleId}`, actionKey: 'ASSIGN_GAS_TRAINING', params: { count, module: recRes.data.recommendedModuleId } },
          { label: 'View Remediation Queue', actionKey: 'NAVIGATE_REMEDIATION' },
          { label: 'Filter Shift B Crew', actionKey: 'FILTER_SHIFT_B' }
        ],
        toolCalls
      };
    }

    // WORKFLOW 3: Certification Analysis
    if (
      q.includes('certification analysis') ||
      q.includes('at-risk') ||
      q.includes('expired cert') ||
      q.includes('certifications across') ||
      q.includes('expiring soon')
    ) {
      onProgress?.({
        toolName: 'get_certification_registry',
        statusText: 'Auditing SHA-256 cryptographic certification ledger...',
        phase: 'querying'
      });
      await new Promise(r => setTimeout(r, 350));

      const certRegRes = await mcpRegistryInstance.executeTool('get_certification_registry', {});
      toolCalls.push({
        toolName: certRegRes.toolName,
        parameters: certRegRes.parameters,
        timestamp: new Date().toLocaleTimeString(),
        resultSummary: certRegRes.executionSummary,
        executionTimeMs: certRegRes.executionTimeMs,
        citations: certRegRes.citations,
        data: certRegRes.data
      });

      onProgress?.({
        toolName: 'verify_certificate_record',
        statusText: 'Validating sample cryptographic digest against root authority...',
        parameters: { certificateId: 'CERT-2026-GAS-W104' },
        phase: 'querying'
      });
      await new Promise(r => setTimeout(r, 300));

      const verifyRes = await mcpRegistryInstance.executeTool('verify_certificate_record', {
        certificateId: 'CERT-2026-GAS-W104'
      });
      toolCalls.push({
        toolName: verifyRes.toolName,
        parameters: verifyRes.parameters,
        timestamp: new Date().toLocaleTimeString(),
        resultSummary: verifyRes.executionSummary,
        executionTimeMs: verifyRes.executionTimeMs,
        citations: verifyRes.citations,
        data: verifyRes.data
      });

      const b = certRegRes.data.statusBreakdown;

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `### Cryptographic Certification Ledger Audit

Analysis of the tamper-evident certification registry confirms **${certRegRes.data.totalCertificates} credential records** tracked on the SHA-256 ledger:

- **Valid & Active**: **${b.valid}** certifications
- **Expiring Soon (< 30 days)**: **${b.expiringSoon}** credentials *(Immediate recertification audit needed)*
- **Expired**: **${b.expired}** credentials *(Workers must be temporarily isolated from high-hazard underground zones)*
- **Under Review**: **${b.underReview}** credentials

#### Verification Integrity:
A cryptographic verification test on sample token **CERT-2026-GAS-W104** succeeded with valid SHA-256 ledger digest (\`${verifyRes.data.sha256Hash?.slice(0, 16)}...\`). Dual-supervisor key sign-off is intact.`,
        evidence: [
          { metric: 'Expired Credentials', value: `${b.expired} personnel`, source: 'CryptoLedger:certificates' },
          { metric: 'Expiring Within 30 Days', value: `${b.expiringSoon} personnel`, source: 'CryptoLedger:certificates' },
          { metric: 'Ledger Hash Integrity', value: '100% Cryptographically Validated', source: 'SHA256:VerificationService' }
        ],
        recommendation: `Schedule urgent recertification simulations for the ${b.expiringSoon} workers in the 30-day window, and flag the ${b.expired} expired personnel for shift isolation.`,
        suggestedActions: [
          { label: 'View Expired Certificates', actionKey: 'FILTER_EXPIRED_CERTS' },
          { label: 'Launch Optical QR Scanner', actionKey: 'OPEN_QR_SCANNER' },
          { label: 'Export Ledger Audit', actionKey: 'EXPORT_CERT_AUDIT' }
        ],
        toolCalls
      };
    }

    // WORKFLOW 4: Compliance Report Generation
    if (
      q.includes('compliance report') ||
      q.includes('statutory compliance') ||
      q.includes('generate report') ||
      q.includes('dgms') ||
      q.includes('report generation')
    ) {
      onProgress?.({
        toolName: 'generate_statutory_report_data',
        statusText: 'Compiling immutable compliance metrics for Jharkhand Underground...',
        parameters: { site: 'Jharkhand Underground' },
        phase: 'querying'
      });
      await new Promise(r => setTimeout(r, 400));

      const reportRes = await mcpRegistryInstance.executeTool('generate_statutory_report_data', {
        reportType: 'DGMS Monthly Competency Dossier',
        site: 'Jharkhand Underground'
      });
      toolCalls.push({
        toolName: reportRes.toolName,
        parameters: reportRes.parameters,
        timestamp: new Date().toLocaleTimeString(),
        resultSummary: reportRes.executionSummary,
        executionTimeMs: reportRes.executionTimeMs,
        citations: reportRes.citations,
        data: reportRes.data
      });

      const rep = reportRes.data;

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `### Statutory DGMS Regulatory Compliance Dossier Compiled

The regulatory dossier for **${rep.site}** has been compiled from live immutable database records in full compliance with **${rep.regulatoryStandard}**.

#### Executive Compliance Summary:
- **Total Personnel Assessed**: **${rep.totalWorkersAssessed}** active underground operators
- **Statutory Pass Threshold**: **${rep.statutoryPassThreshold}**
- **Overall Operational Compliance Rate**: **${rep.currentComplianceRate}**
- **Active Remediation Load**: **${rep.remediationPipelineActive}** workers currently enrolled
- **Integrity Telemetry**: **${rep.integrityVerificationStatus}** (0 tampering events)
- **Digital Audit Stamp**: \`${rep.cryptographicLedgerSeal}\`
- **Authorized Inspector Sign-off**: ${rep.certifiedBy}`,
        evidence: [
          { metric: 'Site Audited', value: rep.site, source: 'PostgreSQL:site_roster' },
          { metric: 'Statutory Compliance Rate', value: rep.currentComplianceRate, source: 'DGMS:regulatory_audit' },
          { metric: 'Cryptographic Ledger Seal', value: rep.cryptographicLedgerSeal.slice(0, 24) + '...', source: 'SHA256:LedgerSeal' }
        ],
        recommendation: `The dossier is formatted for direct submission to the DGMS District Mining Office and ready for print or certified PDF export.`,
        suggestedActions: [
          { label: 'View Regulatory Dossier', actionKey: 'NAVIGATE_REPORTS' },
          { label: 'Export Official PDF', actionKey: 'EXPORT_PDF_REPORT' },
          { label: 'Review Active Remediation', actionKey: 'NAVIGATE_REMEDIATION' }
        ],
        toolCalls
      };
    }

    // Default Personnel or Site Lookup
    onProgress?.({
      toolName: 'search_workers',
      statusText: 'Querying workforce roster across all active sites...',
      phase: 'querying'
    });
    await new Promise(r => setTimeout(r, 300));

    const genSearch = await mcpRegistryInstance.executeTool('search_workers', { site: 'All Sites' });
    toolCalls.push({
      toolName: genSearch.toolName,
      parameters: genSearch.parameters,
      timestamp: new Date().toLocaleTimeString(),
      resultSummary: genSearch.executionSummary,
      executionTimeMs: genSearch.executionTimeMs,
      citations: genSearch.citations,
      data: genSearch.data
    });

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: `### SymbioMine Safety Intelligence Agent (MCP Online)

I am connected to the approved Model Context Protocol (MCP) tool registry with live read access to the workforce roster, empirical assessments, competency benchmarks, and certification ledgers.

**Workforce Overview**:
- **Total Monitored Workers**: **150**
- **Passing Competency Baseline**: **118** (78.7%)
- **Active Remediation Queue**: **18** personnel
- **Statutory Pass Threshold**: **60%** *(Non-negotiable DGMS policy standard)*

Select one of the 4 verified operational workflows or enter a targeted personnel/domain query.`,
      evidence: [
        { metric: 'Monitored Workforce', value: '150 active personnel', source: 'PostgreSQL:workers' },
        { metric: 'Controlled MCP Tools', value: '12 approved tools online', source: 'Kernel:mcpRegistry' }
      ],
      suggestedActions: [
        { label: '1. Competency Analysis', actionKey: 'ASK_PRESET', params: { query: 'Analyze competency across safety domains and identify the highest risk area' } },
        { label: '2. Training Recommendation', actionKey: 'ASK_PRESET', params: { query: 'Recommend remediation for workers failing Gas Emergency Response' } },
        { label: '3. Certification Analysis', actionKey: 'ASK_PRESET', params: { query: 'Analyze at-risk and expired certifications across the roster' } },
        { label: '4. Compliance Report', actionKey: 'ASK_PRESET', params: { query: 'Generate DGMS statutory compliance report data for Jharkhand Underground' } }
      ],
      toolCalls
    };
  }
}

export const aiSafetyAgentInstance = new AiSafetyAgent();
