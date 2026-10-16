import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, AlertCircle } from 'lucide-react';

export interface QRCodeViewProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  darkColor?: string;
  lightColor?: string;
  fgColor?: string;
  bgColor?: string;
  includeMargin?: boolean;
  className?: string;
  showDownloadButton?: boolean;
  showCopyButton?: boolean;
  fileName?: string;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  value,
  size = 180,
  level = 'M',
  darkColor,
  lightColor,
  fgColor,
  bgColor,
  includeMargin = true,
  className = '',
  showDownloadButton = false,
  showCopyButton = false,
  fileName = 'symbiomine-qr-code'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const effectiveDark = darkColor || fgColor || '#0f172a';
  const effectiveLight = lightColor || bgColor || '#ffffff';

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    try {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: includeMargin ? 2 : 0,
          color: {
            dark: effectiveDark,
            light: effectiveLight
          },
          errorCorrectionLevel: level
        },
        err => {
          if (err) {
            console.error('Inbuilt QR code render error:', err);
            setError(err.message || 'Failed to render QR Code');
          } else {
            setError(null);
          }
        }
      );
    } catch (err: any) {
      setError(err?.message || 'Error creating QR code');
    }
  }, [value, size, level, darkColor, lightColor, includeMargin]);

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download QR code PNG:', err);
    }
  };

  const handleCopyPayload = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs flex items-center justify-center relative overflow-hidden"
        style={{ minWidth: size + 24, minHeight: size + 24 }}
      >
        <canvas ref={canvasRef} className="rounded-xs max-w-full h-auto block" />

        {error && (
          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-3 text-center">
            <AlertCircle className="w-5 h-5 text-rose-600 mb-1" />
            <span className="text-[11px] font-semibold text-rose-900">QR Generation Error</span>
            <span className="text-[10px] text-slate-500 mt-0.5">{error}</span>
          </div>
        )}
      </div>

      {(showDownloadButton || showCopyButton) && (
        <div className="flex items-center gap-2 mt-2.5">
          {showDownloadButton && (
            <button
              onClick={handleDownloadPng}
              type="button"
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5"
              title="Download QR code as high-resolution PNG"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download PNG</span>
            </button>
          )}

          {showCopyButton && (
            <button
              onClick={handleCopyPayload}
              type="button"
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5"
              title="Copy QR payload text to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copied ? 'Copied' : 'Copy Payload'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
