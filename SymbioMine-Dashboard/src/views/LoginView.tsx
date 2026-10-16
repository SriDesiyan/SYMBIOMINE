import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppLogo } from '../components/common/AppLogo';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  KeyRound,
  X
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useApp();

  const [emailOrId, setEmailOrId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrId.trim()) {
      setErrorMessage('Please enter your Admin ID or Authorized Email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your Security Password / PIN.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await login(emailOrId.trim(), password, rememberMe);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setErrorMessage('An unexpected authentication error occurred. Please contact system administrator.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a1120] flex flex-col justify-between relative overflow-hidden font-sans text-slate-100 select-none">
      {/* Background industrial lighting gradients */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Banner: Enterprise Security Status */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <AppLogo size="sm" />
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-black tracking-tight text-white text-sm sm:text-base font-sans">
                SymbioMine
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand text-white font-bold uppercase tracking-wider">
                AR
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Industrial Safety Operations Command
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1 rounded">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Statutory RBAC &bull; Authorized Personnel Only</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Card Header with Authoritative Branding */}
          <div className="p-7 border-b border-slate-800 text-center relative bg-gradient-to-b from-slate-800/40 to-transparent">
            <div className="flex justify-center mb-4">
              <AppLogo size="lg" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-1.5">
              <h1 className="text-2xl font-black text-white tracking-tight">
                SymbioMine
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand text-white font-bold uppercase tracking-wider">
                AR
              </span>
            </div>

            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
              Web Admin Dashboard
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Authorized Industrial Safety Personnel Authentication
            </p>
          </div>

          {/* Form Body */}
          <div className="p-7 space-y-4">
            {/* Error Notification */}
            {errorMessage && (
              <div
                role="alert"
                className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Admin ID / Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="admin-id">
                  Admin ID / Authorized Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-id"
                    type="text"
                    value={emailOrId}
                    onChange={e => setEmailOrId(e.target.value)}
                    placeholder="e.g. ADM-001 or admin@symbiomine.ar"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password / PIN */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300" htmlFor="admin-password">
                    Security Password / PIN
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter administrative password or PIN"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-colors font-mono"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Session */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Remember Session</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">30m timeout</span>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-brand hover:bg-brand-light disabled:opacity-50 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>SIGN IN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Credentials */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Quick Demo Access:
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-semibold">
                  PIN: Symbio@2026
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setEmailOrId('superadmin@symbiomine.ar');
                    setPassword('Symbio@2026');
                    setErrorMessage(null);
                  }}
                  className="p-2 rounded bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>Super Admin</span>
                    <span className="text-[9px] font-mono text-amber-500 font-normal">Auto-fill &rarr;</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">superadmin@symbiomine.ar</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmailOrId('admin@symbiomine.ar');
                    setPassword('Symbio@2026');
                    setErrorMessage(null);
                  }}
                  className="p-2 rounded bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>Administrator</span>
                    <span className="text-[9px] font-mono text-amber-500 font-normal">Auto-fill &rarr;</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">admin@symbiomine.ar</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmailOrId('training@symbiomine.ar');
                    setPassword('Symbio@2026');
                    setErrorMessage(null);
                  }}
                  className="p-2 rounded bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>Training Admin</span>
                    <span className="text-[9px] font-mono text-amber-500 font-normal">Auto-fill &rarr;</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">training@symbiomine.ar</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmailOrId('auditor@symbiomine.ar');
                    setPassword('Symbio@2026');
                    setErrorMessage(null);
                  }}
                  className="p-2 rounded bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>Auditor</span>
                    <span className="text-[9px] font-mono text-amber-500 font-normal">Auto-fill &rarr;</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">auditor@symbiomine.ar</div>
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="pt-2.5 border-t border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 font-mono">
                Secure 256-Bit SSL/TLS &bull; Cryptographic Session Protection &bull; DGMS Standard
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Statutory Protocol Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <KeyRound className="w-4 h-4" />
                <span>Administrative Password Recovery</span>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <p>
                In compliance with statutory mine safety governance standards, automated password reset links are restricted for administrative accounts.
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <p className="font-semibold text-white">Statutory Recovery Procedure:</p>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-400 text-[11px]">
                  <li>Contact your Directorate Super Admin.</li>
                  <li>Verify official ID and security clearance.</li>
                  <li>Super Admin will issue a temporary, single-use reset credential via the Admin Management console.</li>
                </ol>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Protocol Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-3 text-center text-[10px] text-slate-400 font-mono z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>SymbioMine AR &bull; Industrial Safety Intelligence &bull; Production Release</span>
        <span>Authorized Access Governed by Coal Mines Regulations (CMR) 2017</span>
      </footer>
    </div>
  );
};
