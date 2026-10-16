/**
 * SYMBIOMINE Sample Worker Packages & Cryptographic Test Fixtures
 * Conforming strictly to the SYMBIOMINE Worker Verification Package specification.
 */

import { SymbiomineWorkerPackage, SymbiomineWorkerTransfer } from '../types';

// Valid 10x10 JFIF JPEG base64 string
export const SAMPLE_JPEG_BASE64 = 
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAAKAAoBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

// Exact SHA-256 hex digest of the above binary JPEG bytes
export const SAMPLE_JPEG_SHA256 = 
  'a59daea73fd1b5cda88e0b0008f558a85b819f159a68e7356dfb2030afda759a';

/**
 * Standard Passed Worker Verification Package
 * Conforms 100% to section 1 of the specification.
 */
export const SAMPLE_WORKER_PASS: SymbiomineWorkerPackage = {
  type: 'SYMBIOMINE_WORKER',
  version: 1,
  worker: {
    workerId: '9876543210',
    name: 'Rajesh Soren',
    mobile: '9876543210'
  },
  training: {
    module: 'Fire Safety, Gas Leak & LOTO, Electrical Safety',
    score: 250,
    totalScore: 300,
    percentage: 83.33,
    result: 'PASS',
    modules: [
      { id: 'M01', name: 'Fire Safety & Extinguisher', score: 80, isPassed: true },
      { id: 'M02', name: 'Gas Leak & Lockout Tagout', score: 90, isPassed: true },
      { id: 'M03', name: 'Electrical Safety & Zero Energy', score: 80, isPassed: true }
    ]
  },
  certificate: {
    certificateId: 'CERT-9876543210',
    status: 'VALID',
    completionDate: '2026-09-26',
    digitalSignature: 'SIG:ED25519-79adbf2c5e4a81d60f',
    canonicalSha256: 'SHA256:a59daea73fd1b5cda88e0b0008f558a85b819f159a68e7356dfb2030afda759a'
  },
  photo: {
    format: 'image/jpeg',
    photoId: 'PHOTO-9876543210',
    sha256: SAMPLE_JPEG_SHA256,
    data: SAMPLE_JPEG_BASE64
  },
  timestamp: 1758873600000,
  transferId: 'SM-TR-2026-9876543210'
};

/**
 * Failed Worker Verification Package
 * Demonstrates procedural weakness diagnostics, failed module flags, and remediation assignment.
 */
export const SAMPLE_WORKER_FAIL: SymbiomineWorkerPackage = {
  type: 'SYMBIOMINE_WORKER',
  version: 1,
  worker: {
    workerId: '9876543211',
    name: 'Nandan Negi',
    mobile: '9876543211'
  },
  training: {
    module: 'Fire Safety, Gas Leak & LOTO, Electrical Safety',
    score: 185,
    totalScore: 300,
    percentage: 61.67,
    result: 'FAIL',
    modules: [
      { id: 'M01', name: 'Fire Safety & Extinguisher', score: 75, isPassed: true },
      { id: 'M02', name: 'Gas Leak & Lockout Tagout', score: 40, isPassed: false },
      { id: 'M03', name: 'Electrical Safety & Zero Energy', score: 70, isPassed: false }
    ]
  },
  certificate: {
    certificateId: 'CERT-9876543211',
    status: 'UNDER_REVIEW',
    completionDate: '2026-09-26',
    digitalSignature: 'SIG:ED25519-c12480bf39a1',
    canonicalSha256: 'SHA256:a59daea73fd1b5cda88e0b0008f558a85b819f159a68e7356dfb2030afda759a'
  },
  photo: {
    format: 'image/jpeg',
    photoId: 'PHOTO-9876543211',
    sha256: SAMPLE_JPEG_SHA256,
    data: SAMPLE_JPEG_BASE64
  },
  timestamp: 1758873600000,
  transferId: 'SM-TR-2026-9876543211'
};

/**
 * Tampered Worker Verification Package
 * The SHA-256 digest has been tampered with to test cryptographic failure detection.
 */
export const SAMPLE_WORKER_TAMPERED: SymbiomineWorkerPackage = {
  ...SAMPLE_WORKER_PASS,
  worker: {
    workerId: '9876543299',
    name: 'Tampered Identity Profile',
    mobile: '9876543299'
  },
  photo: {
    format: 'image/jpeg',
    photoId: 'PHOTO-9876543299',
    sha256: '0000000000000000000000000000000000000000000000000000000000000000', // Forged hash
    data: SAMPLE_JPEG_BASE64
  }
};

/**
 * Pre-split chunked transfer pair for testing multi-chunk fail-safe
 */
export function getSampleTransferChunks(): [SymbiomineWorkerTransfer, SymbiomineWorkerTransfer] {
  const jsonStr = JSON.stringify(SAMPLE_WORKER_PASS);
  const midPoint = Math.floor(jsonStr.length / 2);
  const transferId = 'SM-TR-CHUNK-DEMO-01';

  const chunk1: SymbiomineWorkerTransfer = {
    type: 'SYMBIOMINE_WORKER_TRANSFER',
    version: 1,
    transferId,
    chunkIndex: 1,
    totalChunks: 2,
    payload: jsonStr.slice(0, midPoint)
  };

  const chunk2: SymbiomineWorkerTransfer = {
    type: 'SYMBIOMINE_WORKER_TRANSFER',
    version: 1,
    transferId,
    chunkIndex: 2,
    totalChunks: 2,
    payload: jsonStr.slice(midPoint)
  };

  return [chunk1, chunk2];
}
