import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { useApp } from '../../context/AppContext';
import { CryptoVerificationService, VerificationResult } from '../../services/cryptoService';
import { AppLogo } from '../common/AppLogo';
import {
  SAMPLE_WORKER_PASS,
  SAMPLE_WORKER_FAIL,
  SAMPLE_WORKER_TAMPERED,
  getSampleTransferChunks
} from '../../services/samplePackages';
import {
  X,
  Camera,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  QrCode,
  Copy,
  Check,
  Upload,
  UserCheck,
  AlertOctagon,
  Cpu,
  ArrowRight,
  Layers,
  Phone,
  Flame,
  Zap,
  Award,
  Database,
  Calendar,
  FileCheck
} from 'lucide-react';

export const QRScannerModal: React.FC = () => {
  const {
    isScanQrModalOpen,
    setIsScanQrModalOpen,
    certificates,
    workers,
    assessments,
    remediationQueue,
    assignTraining,
    setSelectedWorker,
    runDemoStep,
    demoStep,
    openQrGenerator,
    saveWorkerVerificationRecord
  } = useApp();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [assignedTrainingSuccess, setAssignedTrainingSuccess] = useState(false);
  const [persistedNotice, setPersistedNotice] = useState<string | null>(null);

  // Field test presets covering SYMBIOMINE Worker Packages, Multi-Chunk Transfers, and Legacy tokens
  const sampleTestQRs = [
    {
      label: 'SYMBIOMINE Worker: 83.33% PASS (Verified Photo SHA-256)',
      tag: 'SYMBIOMINE_WORKER',
      description: 'Full JSON spec • Rajesh Soren • Extinguisher, Gas & LOTO, Electrical',
      payload: JSON.stringify(SAMPLE_WORKER_PASS, null, 2)
    },
    {
      label: 'SYMBIOMINE Worker: 61.67% FAIL (Deficiencies & Restricted)',
      tag: 'FAIL_DIAGNOSTICS',
      description: 'Full JSON spec • Nandan Negi • M02 Gas Leak Deficit & Remediation',
      payload: JSON.stringify(SAMPLE_WORKER_FAIL, null, 2)
    },
    {
      label: 'Photo Cryptographic Mismatch (Forged SHA-256 Digest)',
      tag: 'SECURITY_ALERT',
      description: 'Tampered photo hash trigger ✕ PHOTO VERIFICATION FAILED',
      payload: JSON.stringify(SAMPLE_WORKER_TAMPERED, null, 2)
    },
    {
      label: 'Chunked Transfer: Chunk 1 of 2 (SM-TR-CHUNK-DEMO-01)',
      tag: 'MULTI_CHUNK',
      description: 'Tests chunk buffering fail-safe (Capture chunk 1 first)',
      payload: JSON.stringify(getSampleTransferChunks()[0], null, 2)
    },
    {
      label: 'Chunked Transfer: Chunk 2 of 2 (SM-TR-CHUNK-DEMO-01)',
      tag: 'MULTI_CHUNK',
      description: 'Tests multi-chunk concatenation (Completes assembly)',
      payload: JSON.stringify(getSampleTransferChunks()[1], null, 2)
    },
    {
      label: 'Legacy Mobile Lookup: 9876543210 (Backward Compatible)',
      tag: 'LEGACY_FORMAT',
      description: 'Tests backward compatibility via plain 10-digit mobile number',
      payload: '9876543210'
    },
    {
      label: 'W-104 Legacy Assessment Token (64% FAIL • Blind Heading)',
      tag: 'TOKENIZED',
      description: 'Procedural failure with auxiliary fan omission',
      payload:
        'SYMBIOMINE::ASSESSMENT::WORKER:W-104::NAME:Rajesh Soren::DOMAIN:Gas Leak & Confined Space::SCORE:64%::STATUS:FAIL::WEAKNESS:Delay in gas monitor check (8s excess) & premature heading re-entry without auxiliary fan verification::ROLE:Continuous Miner Operator::SITE:Jharkhand Underground::BADGE:BDG-JH-9411'
    },
    {
      label: 'W-101 LOTO Electrical Pass (94% PASS • Specialist)',
      tag: 'TOKENIZED',
      description: 'Zero energy verification & lockout mastery',
      payload:
        'SYMBIOMINE::CERT-2026-LOTO-W101::WORKER:W-101::NAME:Amitabh Roy::DOMAIN:LOTO::SCORE:94%::STATUS:PASS::ROLE:Electrical Isolation Tech::SITE:Jharkhand Underground::SHA256:e3b0c44298fc1c14'
    }
  ];

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    setVerificationResult(null);
    setAssignedTrainingSuccess(false);
    setPersistedNotice(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not accessible in this browser context.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        scanFrame();
      }
    } catch (err: any) {
      console.warn('Webcam start error:', err);
      setCameraError(err.message || 'Camera permissions unavailable in preview context.');
      setCameraActive(false);
    }
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        // QR Code detected!
        handleVerifyPayload(code.data);
        stopCamera();
        return;
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  const handleVerifyPayload = async (payload: string) => {
    setIsVerifying(true);
    setAssignedTrainingSuccess(false);
    setPersistedNotice(null);

    // Cryptographic verification handshake simulation
    await new Promise(r => setTimeout(r, 380));

    const result = await CryptoVerificationService.verifyQrPayload(
      payload,
      certificates,
      workers,
      assessments,
      remediationQueue
    );

    setVerificationResult(result);
    setIsVerifying(false);

    // If it's a complete verification (not an interim chunk buffer), persist to database/state!
    if (!result.isChunkTransfer) {
      saveWorkerVerificationRecord(result);
      setPersistedNotice(
        `Audit record persisted for primary key: ${result.workerId || result.mobile || 'W-RECORD'}`
      );
    }

    // If in demo scenario, advance step
    if (demoStep >= 16) {
      runDemoStep(19);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleVerifyPayload(code.data);
          } else {
            setCameraError('No readable QR code pattern detected in uploaded image file.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAssignRemediation = () => {
    if (!verificationResult) return;
    const moduleId = verificationResult.assignedRemediation || 'SCN-GAS-04';
    const skillGap = verificationResult.weakness || 'Atmospheric Ventilation & Gas Detection Gap';
    assignTraining(verificationResult.workerId, moduleId, skillGap);
    setAssignedTrainingSuccess(true);
  };

  const getModuleIcon = (moduleName: string) => {
    const lower = moduleName.toLowerCase();
    if (lower.includes('fire') || lower.includes('extinguisher')) {
      return <Flame className="w-3.5 h-3.5 text-amber-500" />;
    }
    if (lower.includes('electrical') || lower.includes('zero energy')) {
      return <Zap className="w-3.5 h-3.5 text-yellow-500" />;
    }
    if (lower.includes('gas') || lower.includes('loto')) {
      return <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />;
    }
    return <Award className="w-3.5 h-3.5 text-indigo-500" />;
  };

  useEffect(() => {
    if (isScanQrModalOpen) {
      startCamera();
    } else {
      stopCamera();
      setVerificationResult(null);
      setAssignedTrainingSuccess(false);
      setPersistedNotice(null);
    }
    return () => {
      stopCamera();
    };
  }, [isScanQrModalOpen]);

  if (!isScanQrModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AppLogo size="sm" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white flex items-center gap-1.5">
                SymbioMine <span className="text-amber-400">[AR]</span> &bull; Optical QR Decoder
              </h3>
              <p className="text-[11px] text-slate-400">
                SHA-256 Photo Cryptographic Integrity &bull; Multi-Chunk Assembly &bull; DGMS Benchmark
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                stopCamera();
                openQrGenerator();
              }}
              className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-400 rounded border border-slate-700 font-medium cursor-pointer transition-colors"
            >
              Open Generator
            </button>

            <button
              onClick={() => setIsScanQrModalOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Optical Scanner Feed / Standby Area */}
          <div className="relative rounded-lg overflow-hidden bg-slate-950 aspect-video flex items-center justify-center border border-slate-300 shadow-inner">
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Target reticle when live camera active */}
            {cameraActive && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 border border-amber-400/80 rounded relative animate-pulse">
                  <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400" />
                  <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400" />
                  <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400" />
                </div>
                <div className="absolute bottom-2 text-center text-white/95 text-[10px] bg-black/80 px-2.5 py-0.5 rounded font-mono">
                  Align SYMBIOMINE QR token in frame
                </div>
              </div>
            )}

            {!cameraActive && !isVerifying && !verificationResult && (
              <div className="text-center p-5 text-slate-400 space-y-2">
                <Camera className="w-8 h-8 mx-auto text-slate-500" />
                <p className="text-xs text-slate-200 font-semibold">Optical Sensor Standby</p>
                {cameraError ? (
                  <p className="text-[11px] text-rose-400 max-w-sm mx-auto">{cameraError}</p>
                ) : (
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    Activate camera scanner, upload a QR code image, or execute an instant test payload below.
                  </p>
                )}

                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={startCamera}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-md text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Activate Optical Feed
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-md text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload QR Image</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {isVerifying && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-white gap-2">
                <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
                <p className="text-xs font-mono text-slate-200">
                  Ingesting Package &bull; Decoding Binary Photo &bull; Computing SHA-256 Digest...
                </p>
              </div>
            )}
          </div>

          {/* Multi-Chunk Ingest State */}
          {verificationResult?.isChunkTransfer && verificationResult.chunkInfo && (
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-950 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-700 animate-bounce" />
                  <div>
                    <h4 className="text-xs font-bold uppercase font-mono text-amber-900">
                      Multi-Chunk QR Transfer In Progress
                    </h4>
                    <p className="text-[11px] text-amber-800">
                      Transfer ID: <span className="font-mono font-bold">{verificationResult.chunkInfo.transferId}</span>
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-200 font-mono font-bold text-xs text-amber-900 border border-amber-300">
                  Chunk {verificationResult.chunkInfo.current} / {verificationResult.chunkInfo.total}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-amber-800">
                  <span>Buffered Chunks: {verificationResult.chunkInfo.receivedCount} of {verificationResult.chunkInfo.total}</span>
                  <span>{Math.round((verificationResult.chunkInfo.receivedCount / verificationResult.chunkInfo.total) * 100)}%</span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${(verificationResult.chunkInfo.receivedCount / verificationResult.chunkInfo.total) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                <span className="font-bold">Awaiting missing chunk(s): </span>
                <span className="font-mono font-bold">Chunk {verificationResult.chunkInfo.missing.join(', ')}</span>.
                {' '}Scan or upload the remaining QR chunk to trigger automatic payload concatenation and photo reconstruction.
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    CryptoVerificationService.clearChunkBuffers(verificationResult.chunkInfo?.transferId);
                    setVerificationResult(null);
                  }}
                  className="px-2.5 py-1 text-[11px] text-slate-600 hover:text-slate-800 underline cursor-pointer"
                >
                  Reset Transfer Buffer
                </button>
                <button
                  onClick={startCamera}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-xs cursor-pointer shadow-xs"
                >
                  Scan Next Chunk
                </button>
              </div>
            </div>
          )}

          {/* Full Verification Result Display */}
          {verificationResult && !verificationResult.isChunkTransfer && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* Persistence Alert Banner */}
              {persistedNotice && (
                <div className="px-3 py-2 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Database className="w-3.5 h-3.5 text-emerald-700" />
                    <span>✓ Worker record &amp; compliance audit trail automatically persisted to database.</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700">Primary Key Active</span>
                </div>
              )}

              {/* 1. Pass / Fail Percentage Banner */}
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                  verificationResult.outcome === 'PASS'
                    ? 'bg-emerald-950 text-white border-emerald-700'
                    : 'bg-rose-950 text-white border-rose-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white shadow-md ${
                      verificationResult.outcome === 'PASS' ? 'bg-emerald-700' : 'bg-rose-700'
                    }`}
                  >
                    {verificationResult.outcome === 'PASS' ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : (
                      <AlertOctagon className="w-7 h-7" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded border ${
                          verificationResult.outcome === 'PASS'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {verificationResult.outcome === 'PASS'
                          ? 'STATUTORY PASS — CLEARANCE GRANTED'
                          : 'COMPETENCY DEFICIT — FAILED ASSESSMENT'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {verificationResult.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold mt-1 text-white tracking-tight">
                      {verificationResult.outcome === 'PASS'
                        ? `${verificationResult.workerName} Qualified in ${verificationResult.domain}`
                        : `${verificationResult.workerName} Below Pass Threshold in ${verificationResult.domain}`}
                    </h4>

                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Statutory Benchmark: {verificationResult.passThreshold}% &bull; Completion: {verificationResult.completionDate || verificationResult.assessmentDate}
                    </p>
                  </div>
                </div>

                {/* Score & Progress Callout */}
                <div className="sm:text-right shrink-0 bg-black/30 p-2.5 rounded-lg border border-white/10 sm:min-w-[130px]">
                  <span className="text-[10px] font-mono text-slate-300 uppercase block font-semibold">
                    {verificationResult.totalScore !== undefined
                      ? `Score: ${verificationResult.totalScore} / ${verificationResult.maxScore || 300}`
                      : 'Aggregate Score'}
                  </span>
                  <div
                    className={`text-3xl font-mono font-black tabular-nums ${
                      verificationResult.outcome === 'PASS' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {verificationResult.scorePercentage}%
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        verificationResult.outcome === 'PASS' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, verificationResult.scorePercentage))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Worker Identity & Reconstructed Profile Photo with SHA-256 Verification Badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Reconstructed Profile Photo */}
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-slate-300 bg-slate-900 shadow-md flex items-center justify-center">
                      {verificationResult.photoUrl ? (
                        <img
                          src={verificationResult.photoUrl}
                          alt={verificationResult.workerName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-2 text-slate-400 text-[10px]">
                          <UserCheck className="w-8 h-8 mx-auto text-slate-500 mb-1" />
                          <span>No Embedded Photo</span>
                        </div>
                      )}

                      {/* Photo verification overlay icon */}
                      {verificationResult.isPhotoVerified !== undefined && (
                        <div
                          className={`absolute top-1 right-1 p-0.5 rounded-full ${
                            verificationResult.isPhotoVerified ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                          }`}
                        >
                          {verificationResult.isPhotoVerified ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-500 mt-1 font-mono">
                      {verificationResult.photoId || 'PHOTO ID'}
                    </span>
                  </div>

                  {/* Worker Details & Cryptographic Hash Validation Badge */}
                  <div className="flex-1 space-y-2 text-xs">
                    {/* Verification Badge */}
                    <div>
                      {verificationResult.isPhotoVerified ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold font-mono text-[11px]">
                          <ShieldCheck className="w-4 h-4 text-emerald-700" />
                          <span>✓ PHOTO INTEGRITY VERIFIED (SHA-256 MATCH)</span>
                        </div>
                      ) : verificationResult.photoSha256Expected ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 text-rose-900 border border-rose-300 font-bold font-mono text-[11px]">
                          <ShieldAlert className="w-4 h-4 text-rose-700" />
                          <span>✕ PHOTO VERIFICATION FAILED (DIGEST MISMATCH)</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-200 text-slate-800 font-mono text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                          <span>STANDARD CREDENTIAL VERIFIED</span>
                        </div>
                      )}
                    </div>

                    {/* Worker Attributes Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">Worker Name</span>
                        <span className="font-bold text-slate-900 text-xs">{verificationResult.workerName}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">Worker ID</span>
                        <span className="font-mono font-bold text-slate-800">{verificationResult.workerId}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">Mobile Number</span>
                        <span className="font-mono text-slate-800 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{verificationResult.mobile || '9876543210'}</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">Certificate ID</span>
                        <span className="font-mono text-slate-800 font-semibold">{verificationResult.certId || 'CERT-REG'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">Certificate Status</span>
                        <span
                          className={`font-semibold px-1.5 py-0.2 rounded text-[10px] inline-block font-mono ${
                            verificationResult.status === 'VALID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {verificationResult.status}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">Completion Date</span>
                        <span className="text-slate-800 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{verificationResult.completionDate || verificationResult.assessmentDate}</span>
                        </span>
                      </div>
                    </div>

                    {/* Photo SHA-256 Digest Box */}
                    <div className="p-2 bg-white rounded border border-slate-200 mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-500 font-bold uppercase">
                          {verificationResult.isPhotoVerified ? 'Computed Binary Photo SHA-256:' : 'Cryptographic Hash Analysis:'}
                        </span>
                        <span className={verificationResult.isPhotoVerified ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                          {verificationResult.isPhotoVerified ? 'VALID MATCH' : verificationResult.photoSha256Expected ? 'HASH MISMATCH' : 'CANONICAL'}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-800 break-all select-all bg-slate-50 p-1.5 rounded">
                        {verificationResult.photoSha256Calculated || verificationResult.sha256Hash}
                      </div>

                      {verificationResult.isPhotoVerified === false && verificationResult.photoSha256Expected && (
                        <div className="text-[10px] text-rose-700 font-mono pt-1">
                          <span className="font-bold">Expected: </span>
                          <span className="break-all">{verificationResult.photoSha256Expected}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Individual Training Modules Breakdown */}
              {verificationResult.trainingModules && verificationResult.trainingModules.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-xs font-bold text-slate-800 uppercase font-sans flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-slate-600" />
                      <span>Statutory Training Modules ({verificationResult.trainingModules.length})</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">
                      DGMS Passing Mark: 60%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {verificationResult.trainingModules.map((mod, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                          mod.isPassed
                            ? 'bg-white border-slate-200'
                            : 'bg-rose-50/70 border-rose-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {getModuleIcon(mod.name)}
                            <span className="font-bold text-slate-900 text-xs truncate" title={mod.name}>
                              {mod.name}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 block">ID: {mod.id}</span>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100">
                          <span className="text-xs font-mono font-bold text-slate-800">
                            Score: {mod.score}%
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                              mod.isPassed
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-200 text-rose-900'
                            }`}
                          >
                            {mod.isPassed ? '✓ PASSED' : '✕ DEFICIT'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. IF FAILED: Explicit Weakness & Skill Gaps Box */}
              {verificationResult.outcome === 'FAIL' && (
                <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 text-rose-950 space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-rose-200 pb-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-rose-900 text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                      <span className="uppercase font-mono tracking-wide">
                        Critical Safety Weakness &amp; Identified Gaps
                      </span>
                    </div>

                    {verificationResult.criticalViolations !== undefined && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-200 text-rose-900 border border-rose-300">
                        {verificationResult.criticalViolations} Critical Breaches Logged
                      </span>
                    )}
                  </div>

                  {/* Primary Weakness */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-rose-800 font-mono block">
                      Primary Procedural Weakness
                    </span>
                    <p className="text-xs font-semibold text-rose-950 bg-rose-100/70 p-2.5 rounded-lg border border-rose-200 leading-snug">
                      {verificationResult.weakness}
                    </p>
                  </div>

                  {/* Failed Procedures */}
                  {verificationResult.failedProcedures && verificationResult.failedProcedures.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-rose-800 font-mono block">
                        Failed Safety Checkpoints
                      </span>
                      <ul className="space-y-1">
                        {verificationResult.failedProcedures.map((proc, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-1.5 text-[11px] text-rose-900 font-medium"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                            <span>{proc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* LiteRT Diagnostic Inference */}
                  {verificationResult.liteRtInsight && (
                    <div className="p-2.5 bg-white/80 rounded-lg border border-rose-200 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-700 font-mono uppercase">
                        <Cpu className="w-3.5 h-3.5 text-amber-700" />
                        <span>LiteRT On-Device Sensor Insight</span>
                      </div>
                      <p className="text-[11px] text-slate-700 italic">
                        {verificationResult.liteRtInsight}
                      </p>
                    </div>
                  )}

                  {/* Operational Restriction */}
                  {verificationResult.operationalRestriction && (
                    <div className="p-2.5 bg-rose-100 rounded-lg border border-rose-300 text-[11px] font-bold text-rose-950">
                      {verificationResult.operationalRestriction}
                    </div>
                  )}

                  {/* Mandatory Action & Remediation */}
                  <div className="pt-2 border-t border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-rose-800 font-mono block">
                        Required Corrective Action
                      </span>
                      <p className="text-[11px] text-rose-900 font-semibold">
                        {verificationResult.assignedRemediation || 'Targeted Simulator Remediation'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAssignRemediation}
                      disabled={assignedTrainingSuccess}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                        assignedTrainingSuccess
                          ? 'bg-emerald-700 text-white cursor-default'
                          : 'bg-rose-900 hover:bg-rose-800 text-amber-300'
                      }`}
                    >
                      {assignedTrainingSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Training Dispatched to Headset!</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>Assign Remediation Training Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Test Presets Panel */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Standard Field Verification Presets (SYMBIOMINE Packages &amp; Multi-Chunk):</span>
              <span className="text-[10px] font-normal text-slate-500">1-click test fixture</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {sampleTestQRs.map((test, i) => (
                <button
                  key={i}
                  onClick={() => handleVerifyPayload(test.payload)}
                  className="text-left px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-800 transition-colors cursor-pointer shadow-2xs group"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 truncate group-hover:text-amber-800">
                      {test.label}
                    </span>
                    <span className="text-[9px] font-mono px-1 rounded bg-slate-200 text-slate-700 shrink-0">
                      {test.tag}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{test.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>DGMS Rule 29 Metalliferous Mines Safety Verification Protocol</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setVerificationResult(null);
                setPersistedNotice(null);
                startCamera();
              }}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer"
            >
              Scan New Code
            </button>
            <button
              onClick={() => setIsScanQrModalOpen(false)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
