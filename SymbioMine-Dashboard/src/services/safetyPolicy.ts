/**
 * SYMBIOMINE Regulatory Safety & AI Governance Policy Engine
 * Enforces deterministic compliance boundaries outside LLM reasoning.
 * Shared across client-side agents and server-side MCP execution pipelines.
 */

export interface SafetyEvaluationResult {
  allowed: boolean;
  policyCode?: string;
  refusalReason?: string;
  category?: 'REGULATORY_LOCK' | 'TELEMETRY_INTEGRITY' | 'CRYPTO_GOVERNANCE' | 'NON_ACCUSATORY' | 'PROMPT_INJECTION';
}

export const REGULATORY_CONSTANTS = {
  STATUTORY_PASS_THRESHOLD: 60,
  REGULATORY_CODE: 'DGMS Coal Mines Regulations 2017',
  POLICY_LOCK_ACTIVE: true,
  MAX_QUERY_LENGTH: 2000,
  MIN_QUERY_LENGTH: 2
} as const;

/**
 * Adversarial injection patterns and jailbreak attempts
 */
const INJECTION_PATTERNS = [
  /\bignore\s+(all\s+)?(previous|prior)\s+(instructions|prompts|rules)\b/i,
  /\b(system\s+prompt|instructions?)\s+(leak|reveal|show|print|output)\b/i,
  /\bjailbreak\b/i,
  /\bdan\s+mode\b/i,
  /\bdeveloper\s+mode\s+(enabled|active|on)\b/i,
  /\bpretend\s+you\s+(are|have)\s+(no\s+rules|unrestricted|god\s+mode)\b/i,
  /\bbypass\s+(all\s+)?(safety|guardrails?|filters?|rules?)\b/i,
  /\bdisregard\s+(the\s+)?(regulations?|guidelines?|dgms)\b/i,
  /\bacting\s+as\s+(an\s+unconstrained|a\s+rogue)\b/i
];

/**
 * Evaluates any user or agent query against strict industrial safety boundaries
 */
export function evaluateSafetyPolicy(query: string): SafetyEvaluationResult {
  if (!query || typeof query !== 'string') {
    return {
      allowed: false,
      policyCode: 'POLICY_INVALID_INPUT',
      category: 'REGULATORY_LOCK',
      refusalReason: 'Query must be a valid, non-empty text string.'
    };
  }

  const trimmed = query.trim();
  if (trimmed.length < REGULATORY_CONSTANTS.MIN_QUERY_LENGTH) {
    return {
      allowed: false,
      policyCode: 'POLICY_QUERY_TOO_SHORT',
      category: 'REGULATORY_LOCK',
      refusalReason: 'Query length is too short for operational processing.'
    };
  }

  if (trimmed.length > REGULATORY_CONSTANTS.MAX_QUERY_LENGTH) {
    return {
      allowed: false,
      policyCode: 'POLICY_PAYLOAD_TOO_LARGE',
      category: 'REGULATORY_LOCK',
      refusalReason: `Query exceeds maximum permitted operational payload (${REGULATORY_CONSTANTS.MAX_QUERY_LENGTH} characters).`
    };
  }

  const q = trimmed.toLowerCase();

  // 1. Adversarial Prompt Injection & Jailbreak Defense
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(q)) {
      return {
        allowed: false,
        policyCode: 'SEC_ADVERSARIAL_INJECTION_DETECTED',
        category: 'PROMPT_INJECTION',
        refusalReason:
          'Security Interception: Adversarial instruction override or jailbreak pattern detected. The SymbioMine AI Safety kernel operates in an immutable, read-only supervisory posture.'
      };
    }
  }

  // 2. Regulatory Pass Threshold Alteration Lock (DGMS CMR 2017)
  if (
    q.includes('change threshold') ||
    q.includes('modify pass mark') ||
    q.includes('lower score requirement') ||
    q.includes('reduce pass mark') ||
    q.includes('set pass mark') ||
    q.includes('change pass mark') ||
    q.includes('adjust pass mark') ||
    q.includes('lower pass cutoff')
  ) {
    return {
      allowed: false,
      policyCode: 'POLICY_CMR_SEC_60_LOCKED',
      category: 'REGULATORY_LOCK',
      refusalReason:
        'Regulatory Boundary Lock (DGMS CMR 2017): The 60% pass mark is a non-negotiable statutory standard. The AI agent is strictly barred from modifying, negotiating, or lowering competency thresholds. Changes require formal Directorate General of Mines Safety approval and Safety Committee sign-off.'
    };
  }

  // 3. Empirical Telemetry & Score Override Guard
  if (
    q.includes('force pass') ||
    q.includes('override pass') ||
    q.includes('give him pass') ||
    q.includes('mark him as passed') ||
    q.includes('override fail') ||
    q.includes('alter score') ||
    q.includes('falsify score') ||
    q.includes('fake result')
  ) {
    return {
      allowed: false,
      policyCode: 'POLICY_DETERMINISTIC_EVAL_GUARD',
      category: 'TELEMETRY_INTEGRITY',
      refusalReason:
        'Deterministic Decision Guard: PASS/FAIL outcomes are computed strictly from empirical AR/VR telemetry and LiteRT edge inference logs. The AI agent has zero authority to override empirical scores or grant unearned passing statuses.'
    };
  }

  // 4. Autonomous Certificate Minting Guard
  if (
    q.includes('issue certificate directly') ||
    q.includes('grant certificate without test') ||
    q.includes('bypass assessment') ||
    q.includes('mint certificate') ||
    q.includes('create certificate directly') ||
    q.includes('forge certificate')
  ) {
    return {
      allowed: false,
      policyCode: 'POLICY_CRYPTO_ISSUANCE_GUARD',
      category: 'CRYPTO_GOVERNANCE',
      refusalReason:
        'Cryptographic Issuance Guard: Digital certificates require empirical assessment completion (Score >= 60%) and dual-authorization digital signature from the certified human safety supervisor. Autonomous issuance by AI is strictly blocked.'
    };
  }

  // 5. Non-Accusatory Integrity Protocol
  if (
    q.includes('is he cheating') ||
    q.includes('accuse him of cheating') ||
    q.includes('who is the cheater') ||
    q.includes('punish worker') ||
    q.includes('discipline worker')
  ) {
    return {
      allowed: false,
      policyCode: 'POLICY_NON_ACCUSATORY_INTEGRITY',
      category: 'NON_ACCUSATORY',
      refusalReason:
        'Non-Accusatory Protocol: The platform records sensor anomalies objectively as "Integrity Flags" for supervisor review. The AI assistant never makes accusations, moral judgments, or disciplinary determinations regarding workers. Audit determinations rest solely with certified human supervisors.'
    };
  }

  return { allowed: true };
}
