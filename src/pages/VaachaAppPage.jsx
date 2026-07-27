import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  RotateCw, 
  Shield, 
  Mic, 
  Activity,
  Globe,
  Maximize2
} from 'lucide-react';

const VAACHA_VERCEL_URL = "https://ai-translator-woad-three.vercel.app/";

const VaachaAppPage = () => {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setIsLoading(true);
    setKey((prev) => prev + 1);
  };

  return (
    <div className="h-screen w-screen bg-void-black text-slate-200 flex flex-col overflow-hidden relative font-sans selection:bg-electric-cyan selection:text-void-black">
      {/* Background SVG Noise Overlay */}
      <div className="noise-overlay" style={{ filter: 'url(#noiseFilterVaacha)' }} />
      <svg className="sr-only">
        <filter id="noiseFilterVaacha">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
      </svg>

      {/* Embedded Application Header Control Bar */}
      <header className="h-16 bg-[#05050A]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-30 flex-shrink-0">
        
        {/* Left: Branding & Back Navigation */}
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-ice-white bg-[#0A1128] hover:bg-[#0A1128]/80 border border-slate-800 hover:border-electric-cyan/40 px-3 py-1.5 rounded-full transition-all duration-300 shadow-sm"
            title="Return to Logic Craft IT"
          >
            <ArrowLeft size={14} className="text-electric-cyan" />
            <span className="hidden sm:inline">Logic Craft IT</span>
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <img 
              src="/vaachalogobg.png" 
              alt="Vaacha Logo" 
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-md" 
            />
            <span className="font-display font-bold text-sm sm:text-base text-ice-white tracking-tight flex items-center gap-1.5">
              <span>Vaacha AI <span className="text-electric-cyan">Translator</span></span>
            </span>
          </div>
        </div>

        {/* Center Status Badge (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 bg-[#0A1128]/80 border border-slate-800 px-3 py-1 rounded-full font-mono text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-electric-cyan animate-ping" />
          <span className="text-electric-cyan font-semibold">LIVE DEPLOYMENT</span>
          <span className="text-slate-600">|</span>
          <Activity size={12} className="text-electric-cyan" />
          <span>v2.4.0 (Auto-Sync)</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleRefresh}
            className="p-2 sm:px-3 sm:py-1.5 font-mono text-xs text-slate-400 hover:text-ice-white bg-[#0A1128] hover:bg-slate-800/60 border border-slate-800 rounded-lg sm:rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
            title="Refresh Live Application"
          >
            <RotateCw size={13} className={`text-electric-cyan ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Refresh</span>
          </button>

          <Link
            to="/privacy"
            className="p-2 sm:px-3 sm:py-1.5 font-mono text-xs text-slate-400 hover:text-electric-cyan bg-[#0A1128] border border-slate-800 rounded-lg sm:rounded-full flex items-center gap-1.5 transition-all"
            title="View Privacy Policy"
          >
            <Shield size={13} className="text-electric-cyan" />
            <span className="hidden md:inline">Privacy</span>
          </Link>

          <a
            href={VAACHA_VERCEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs font-semibold text-void-black bg-electric-cyan hover:bg-cyan-300 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:scale-[1.02] cursor-pointer"
            title="Open direct Vercel URL in new tab"
          >
            <span>Standalone</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </header>

      {/* Main Container: Live Embedded Frame */}
      <div className="flex-1 relative w-full h-full bg-void-black">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-void-black/95 backdrop-blur-md">
            <div className="w-12 h-12 rounded-full border-2 border-slate-800 border-t-electric-cyan animate-spin mb-4" />
            <div className="font-mono text-xs text-electric-cyan tracking-wider uppercase animate-pulse flex items-center gap-2">
              <Globe size={14} />
              Connecting to Vaacha AI Live Engine...
            </div>
            <div className="font-mono text-[10px] text-slate-600 mt-2">
              Target: {VAACHA_VERCEL_URL}
            </div>
          </div>
        )}

        {/* Embedded Iframe with Microphone & Audio Permissions */}
        <iframe
          key={key}
          ref={iframeRef}
          src={VAACHA_VERCEL_URL}
          title="Vaacha AI Translator Live Application"
          className="w-full h-full border-0 relative z-10"
          onLoad={() => setIsLoading(false)}
          allow="microphone; autoplay; clipboard-write; encrypted-media; camera; display-capture;"
          sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"
        />
      </div>
    </div>
  );
};

export default VaachaAppPage;
