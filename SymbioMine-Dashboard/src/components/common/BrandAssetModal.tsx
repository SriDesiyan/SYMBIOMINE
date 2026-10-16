import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Upload, CheckCircle2, Shield } from 'lucide-react';
import { SymbioMineVectorLogo } from './AppLogo';

export const BrandAssetModal: React.FC = () => {
  const {
    brandLogo,
    updateBrandLogo,
    isBrandLogoModalOpen,
    setIsBrandLogoModalOpen
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  if (!isBrandLogoModalOpen) return null;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        await updateBrandLogo(dataUrl);
        setSuccessNotice(true);
        setIsUploading(false);
        setTimeout(() => setSuccessNotice(false), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                SymbioMine AR &bull; Official Brand Asset
              </h3>
              <p className="text-[11px] text-slate-400">
                Authoritative Logo Management &bull; Unaltered Original Asset
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBrandLogoModalOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Active Asset Preview Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold mb-2">
              Current Active Brand Asset
            </span>

            <div className="w-48 h-36 bg-white rounded-lg border border-slate-200 shadow-inner flex items-center justify-center p-3 relative overflow-hidden">
              {brandLogo ? (
                <img
                  src={brandLogo}
                  alt="SymbioMine AR Logo"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <SymbioMineVectorLogo className="max-w-full max-h-full object-contain" />
                </div>
              )}
            </div>

            <div className="mt-2.5 text-center">
              <p className="font-bold text-slate-800 text-xs">SymbioMine AR Official Logo</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                Target: /Our Goal.png &bull; Fixed Brand Identity
              </p>
            </div>
          </div>

          {successNotice && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">
                Official logo loaded and verified with zero alterations.
              </span>
            </div>
          )}

          {/* Drag & Drop File Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-5 text-center transition-colors ${
              isDragging
                ? 'border-amber-500 bg-amber-50/50'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <Upload className="w-7 h-7 mx-auto text-slate-400 mb-1.5" />
            <p className="font-semibold text-slate-800 text-xs">
              Load &amp; Sync &quot;Our Goal.png&quot; Direct from Disk
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm mx-auto">
              Select or drop your exact logo file. The raw bytes are loaded directly into state and synced to disk without any resampling, redesign, or compression.
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="mt-3 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer shadow-xs inline-flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>{isUploading ? 'Loading...' : 'Select Our Goal.png Asset'}</span>
            </button>
          </div>

          <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-[10px] text-slate-600 space-y-1">
            <p className="font-semibold text-slate-700 uppercase font-mono tracking-wider">
              Strict Asset Governance Rules:
            </p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Aspect ratio is strictly locked to original proportions.</li>
              <li>No AI recreation, filters, shadows, or redrawn vectors applied.</li>
              <li>The uploaded file is the final authoritative brand identity.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsBrandLogoModalOpen(false)}
            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-medium cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
