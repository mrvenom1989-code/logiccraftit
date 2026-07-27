import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Mic, 
  Lock, 
  FileText, 
  Database, 
  Cpu, 
  Server, 
  Eye, 
  UserCheck, 
  Globe, 
  ArrowLeft, 
  Mail, 
  ChevronRight, 
  CheckCircle2,
  Terminal,
  Zap,
  Activity
} from 'lucide-react';

const SECTIONS = [
  { id: 'overview', title: '1. Overview & Scope', icon: Shield },
  { id: 'data-collection', title: '2. Information We Collect', icon: Database },
  { id: 'voice-ai-data', title: '3. AI & Voice Translation Data', icon: Mic },
  { id: 'product-permissions', title: '4. Device & App Permissions', icon: Cpu },
  { id: 'data-usage', title: '5. How We Use Information', icon: Zap },
  { id: 'third-party-services', title: '6. Third-Party AI & Infrastructure', icon: Server },
  { id: 'data-security', title: '7. Data Security & Retention', icon: Lock },
  { id: 'user-rights', title: '8. Your Privacy Rights & Choices', icon: UserCheck },
  { id: 'children-privacy', title: '9. Children\'s Privacy', icon: Eye },
  { id: 'contact', title: '10. Policy Updates & Contact Us', icon: Mail },
];

const PrivacyPolicyPage = () => {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-void-black text-slate-200 relative selection:bg-electric-cyan selection:text-void-black font-sans">
      {/* Noise Filter Background */}
      <div className="noise-overlay" style={{ filter: 'url(#noiseFilterPolicy)' }} />
      <svg className="sr-only">
        <filter id="noiseFilterPolicy">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
      </svg>

      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-[#05050A]/85 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/logiccraftitlogo1.png" 
              alt="Logic Craft IT Logo" 
              className="w-9 h-9 object-contain group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-ice-white tracking-tight leading-none">
                Logic Craft <span className="text-electric-cyan">IT</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500 tracking-wider">
                ENTERPRISE LEGAL PROTOCOL
              </span>
            </div>
          </Link>

          <Link 
            to="/" 
            className="flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-ice-white bg-[#0A1128] hover:bg-[#0A1128]/80 border border-slate-800 hover:border-electric-cyan/40 px-4 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.1)]"
          >
            <ArrowLeft size={14} className="text-electric-cyan" />
            <span>Return to Home</span>
          </Link>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-[#0A1128]/60 via-void-black to-void-black py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-electric-cyan/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 text-electric-cyan font-mono text-xs mb-6">
            <Shield size={13} />
            <span>GLOBAL PRIVACY & DATA GOVERNANCE</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-ice-white tracking-tight mb-4">
            Master Privacy Policy
          </h1>
          <p className="font-sans text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed mb-6">
            This Master Privacy Policy applies to all applications, software platforms, AI voice translation systems, clinic management tools, and digital solutions engineered by <strong className="text-ice-white">Logic Craft IT</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-slate-500">
            <span className="flex items-center gap-1.5 bg-[#0A1128] px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" />
              Effective Date: July 27, 2026
            </span>
            <span className="flex items-center gap-1.5 bg-[#0A1128] px-3 py-1.5 rounded-lg border border-slate-800">
              <Activity size={13} className="text-electric-cyan" />
              Version: 2.4.0 (Universal Product Coverage)
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Sticky Navigation Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-[#0A1128]/70 backdrop-blur-md border border-slate-800 rounded-[1.5rem] p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <div className="font-display font-semibold text-xs text-electric-cyan uppercase tracking-wider mb-4 px-2 flex items-center justify-between">
                <span>Navigation Index</span>
                <Terminal size={14} />
              </div>
              
              <nav className="flex flex-col gap-1">
                {SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs text-left transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-electric-cyan/15 text-electric-cyan border border-electric-cyan/30 shadow-[0_0_15px_rgba(0,229,255,0.1)]'
                          : 'text-slate-400 hover:text-ice-white hover:bg-slate-800/40 border border-transparent'
                      }`}
                    >
                      <Icon size={15} className={isActive ? 'text-electric-cyan' : 'text-slate-500'} />
                      <span className="truncate">{sec.title}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-5 border-t border-slate-800/80 px-2">
                <div className="text-[11px] font-mono text-slate-500 mb-2">Need a custom DPA or clarification?</div>
                <a 
                  href="mailto:logiccraftit@gmail.com" 
                  className="font-sans text-xs text-electric-cyan hover:underline flex items-center gap-1.5"
                >
                  <Mail size={12} /> logiccraftit@gmail.com
                </a>
              </div>
            </div>
          </aside>

          {/* Policy Body Document */}
          <main className="lg:col-span-8 flex flex-col gap-10">

            {/* Section 1: Overview & Scope */}
            <section id="overview" className="bg-[#0A1128]/50 border border-slate-800 rounded-[2rem] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-electric-cyan mb-2">
                <Shield size={22} />
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ice-white">1. Overview & Scope</h2>
              </div>
              <p className="font-sans text-slate-300 text-sm leading-relaxed">
                Welcome to <strong className="text-ice-white">Logic Craft IT</strong> ("Company", "we", "us", or "our"). This Privacy Policy explains how we collect, process, disclose, and safeguard user data across our entire suite of software products and services.
              </p>
              <p className="font-sans text-slate-300 text-sm leading-relaxed">
                Whether you use our flagship <strong className="text-electric-cyan">AI Voice Translator Platforms (e.g., Vaacha)</strong>, specialized management systems (such as Ayurved or Homeopathy Clinic Suites, Solar Installation PM), automated business intelligence pipelines, or custom web and mobile applications, this policy governs your privacy rights and data protections.
              </p>
              <div className="bg-void-black/80 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-400 space-y-2">
                <div className="text-electric-cyan font-semibold flex items-center gap-2">
                  <CheckCircle2 size={14} /> Universal Compliance Guarantee
                </div>
                <p className="font-sans text-slate-400 text-xs">
                  This privacy policy is formatted to satisfy mandatory store requirements for Google Play Console, Apple App Store, Web deployment hosts, and enterprise API integration partners.
                </p>
              </div>
            </section>

            {/* Section 2: Information We Collect */}
            <section id="data-collection" className="bg-[#0A1128]/50 border border-slate-800 rounded-[2rem] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-electric-cyan mb-2">
                <Database size={22} />
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ice-white">2. Information We Collect</h2>
              </div>
              <p className="font-sans text-slate-300 text-sm leading-relaxed">
                Depending on which Logic Craft IT product or service you interact with, we may collect the following types of information:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-void-black/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="font-mono text-xs text-electric-cyan uppercase tracking-wider block font-semibold">A. User Input & Media</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Voice audio feeds, speech transcripts, input text strings, document uploads, and images provided directly for translation or workflow execution.
                  </p>
                </div>
                <div className="bg-void-black/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="font-mono text-xs text-electric-cyan uppercase tracking-wider block font-semibold">B. Account, OTP & Multi-Currency Billing</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Name, email address, 6-digit OTP verification codes (cached temporarily during signup), preferred currency (INR, USD, CAD, GBP, EUR, AUD), and transaction invoices via Stripe/Razorpay.
                  </p>
                </div>
                <div className="bg-void-black/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="font-mono text-xs text-electric-cyan uppercase tracking-wider block font-semibold">C. Technical & Diagnostic Logs</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Device model, OS version, IP address, browser type, network latency, app crash logs, and session statistics.
                  </p>
                </div>
                <div className="bg-void-black/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="font-mono text-xs text-electric-cyan uppercase tracking-wider block font-semibold">D. Application State & Storage</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Local device cache, session tokens, language preference choices, and offline database state saved locally on your device.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: AI & Voice Translation Specific Data */}
            <section id="voice-ai-data" className="bg-[#0A1128]/50 border border-electric-cyan/30 rounded-[2rem] p-6 sm:p-8 space-y-4 relative overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.05)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-electric-cyan/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 text-electric-cyan mb-2">
                <Mic size={22} />
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ice-white">3. AI & Voice Translation Data Handling</h2>
              </div>
              
              <div className="inline-block px-3 py-1 rounded-md bg-electric-cyan/10 text-electric-cyan font-mono text-xs mb-2">
                SPECIAL SECTION FOR VAACHA & AI VOICE TRANSLATION APPS
              </div>

              <p className="font-sans text-slate-300 text-sm leading-relaxed">
                For applications utilizing real-time voice translation, speech recognition (STT), or text-to-speech synthesis (TTS):
              </p>

              <div className="space-y-3 font-sans text-sm text-slate-300">
                <div className="flex items-start gap-3 bg-void-black/80 border border-slate-800 p-4 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-electric-cyan mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-ice-white font-semibold block mb-1">Ephemeral Audio Processing</strong>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Microphone audio streams are converted into digital buffers in-memory solely for real-time speech translation and transcription. Audio buffers are immediately overwritten and purged from volatile RAM once translated.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-void-black/80 border border-slate-800 p-4 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-electric-cyan mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-ice-white font-semibold block mb-1">Zero Public Model Training Policy</strong>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      We strictly enforce zero-retention policies on third-party AI endpoints (e.g. OpenAI API enterprise agreements). Your voice, transcriptions, and translated content are <strong className="text-ice-white">NEVER</strong> sold, analyzed for profiling, or used to train public foundation AI models.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-void-black/80 border border-slate-800 p-4 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-electric-cyan mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-ice-white font-semibold block mb-1">Local History & Export Control</strong>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Any translation history saved within the app remains stored locally on your device or in your private encrypted account database. You retain 100% ownership and can clear local history at any time.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Device & App Permissions */}
            <section id="product-permissions" className="bg-[#0A1128]/50 border border-slate-800 rounded-[2rem] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-electric-cyan mb-2">
                <Cpu size={22} />
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ice-white">4. Device & App Permissions</h2>
              </div>
              <p className="font-sans text-slate-300 text-sm leading-relaxed">
                To deliver full functionality, our products may request explicit runtime permissions on your mobile or web browser device:
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="border border-slate-800 rounded-xl p-3.5 bg-void-black/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-ice-white font-bold flex items-center gap-2">
                    <Mic size={14} className="text-electric-cyan" /> RECORD_AUDIO / Microphone Access
                  </span>
                  <span className="text-slate-400 font-sans text-xs">Required for live voice capture in AI translation tools.</span>
                </div>

                <div className="border border-slate-800 rounded-xl p-3.5 bg-void-black/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-ice-white font-bold flex items-center gap-2">
                    <Globe size={14} className="text-electric-cyan" /> INTERNET / Network Access
                  </span>
                  <span className="text-slate-400 font-sans text-xs">Required to transmit encrypted translation payloads and sync cloud data.</span>
                </div>

                <div className="border border-slate-800 rounded-xl p-3.5 bg-void-black/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-ice-white font-bold flex items-center gap-2">
                    <Database size={14} className="text-electric-cyan" /> READ / WRITE Storage
                  </span>
                  <span className="text-slate-400 font-sans text-xs">Required to export translation transcripts, PDF reports, or local system backups.</span>
                </div>
              </div>
            </section>

            {/* Section 5: How We Use Information */}
            <section id="data-usage" className="bg-[#0A1128]/50 border border-slate-800 rounded-[2rem] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-electric-cyan mb-2">
                <Zap size={22} />
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ice-white">5. How We Use Collected Information</h2>
              </div>
              <ul className="space-y-2.5 font-sans text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <ChevronRight size={16} className="text-electric-cyan mt-0.5 flex-shrink-0" />
                  <span><strong>Core Application Services:</strong> To execute speech-to-text conversion, language translation, clinic appointment scheduling, automated price updates, and reporting tasks requested by the user.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight size={16} className="text-electric-cyan mt-0.5 flex-shrink-0" />
                  <span><strong>System Diagnostics & Maintenance:</strong> To debug operational failures, optimize voice processing latency, and maintain infrastructure uptime.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight size={16} className="text-electric-cyan mt-0.5 flex-shrink-0" />
                  <span><strong>Security & Compliance:</strong> To detect malicious access attempts, prevent unauthorized scraping, and fulfill legal obligations.</span>
                </li>
              </ul>
            </section>

            {/* Section 6: Third-Party AI & Infrastructure */}
            <section id="third-party-services" className="bg-[#0A1128]/50 border border-slate-800 rounded-[2rem] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-electric-cyan mb-2">
                <Server size={22} />
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ice-white">6. Third-Party AI & Infrastructure Services</h2>
              </div>
              <p className="font-sans text-slate-300 text-sm leading-relaxed">
                Logic Craft IT partners with industry-leading infrastructure and AI engine providers to process user requests securely:
              </p>
              <ul className="list-disc list-inside space-y-2 font-sans text-xs text-slate-400 pl-2">
                <li><strong className="text-ice-white">AI Language & Speech Models:</strong> OpenAI API, WebRTC audio dispatchers (operating under zero data retention enterprise contracts).</li>
                <li><strong className="text-ice-white">Cloud Infrastructure & Hosting:</strong> Render, Vercel, Supabase (PostgreSQL encrypted at rest via AES-256).</li>
                <li><strong className="text-ice-white">Payment Processing:</strong> Razorpay / Stripe (PCI-DSS Compliant level 1 gateways).</li>
              </ul>
            </section>

            {/* Section 7: Data Security & Retention */}
            <section id="data-security" className="bg-[#0A1128]/50 border border-slate-800 rounded-[2rem] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-electric-cyan mb-2">
                <Lock size={22} />
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ice-white">7. Data Security & Retention</h2>
              </div>
              <p className="font-sans text-slate-300 text-sm leading-relaxed">
                We implement robust physical, technical, and administrative controls:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-sans text-xs">
                <div className="bg-void-black/60 border border-slate-800 p-4 rounded-xl">
                  <div className="font-mono text-electric-cyan font-bold mb-1">Encrypted In Transit</div>
                  <p className="text-slate-400">All data transfers use TLS 1.3 / HTTPS encryption to prevent eavesdropping.</p>
                </div>
                <div className="bg-void-black/60 border border-slate-800 p-4 rounded-xl">
                  <div className="font-mono text-electric-cyan font-bold mb-1">Encrypted At Rest</div>
                  <p className="text-slate-400">Database records and user settings are protected using AES-256 standards.</p>
                </div>
              </div>
            </section>

            {/* Section 8: User Rights & Choices */}
            <section id="user-rights" className="bg-[#0A1128]/50 border border-slate-800 rounded-[2rem] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-electric-cyan mb-2">
                <UserCheck size={22} />
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ice-white">8. Your Privacy Rights & Choices</h2>
              </div>
              <p className="font-sans text-slate-300 text-sm leading-relaxed">
                Regardless of your geographic region (GDPR, CCPA, or Indian IT Rules 2011), Logic Craft IT extends the following data rights to all users:
              </p>
              <div className="space-y-2 font-mono text-xs text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800/80 py-2">
                  <span>• Right to Access & Export Data</span>
                  <span className="text-electric-cyan">Supported</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/80 py-2">
                  <span>• Right to Delete Account & Records</span>
                  <span className="text-electric-cyan">Supported</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/80 py-2">
                  <span>• Revoke Microphone / Permission Access</span>
                  <span className="text-electric-cyan">Via Device Settings</span>
                </div>
              </div>
            </section>

            {/* Section 9: Children's Privacy */}
            <section id="children-privacy" className="bg-[#0A1128]/50 border border-slate-800 rounded-[2rem] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-electric-cyan mb-2">
                <Eye size={22} />
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ice-white">9. Children's Privacy</h2>
              </div>
              <p className="font-sans text-slate-300 text-sm leading-relaxed">
                Our services are not directed to children under 13 (or under 16 in certain jurisdictions). We do not knowingly collect personal data or audio feeds from children. If you become aware that a child has provided us with personal data, please contact us immediately for prompt deletion.
              </p>
            </section>

            {/* Section 10: Policy Updates & Contact Us */}
            <section id="contact" className="bg-gradient-to-br from-[#0A1128] to-void-black border border-electric-cyan/40 rounded-[2rem] p-6 sm:p-8 space-y-4 shadow-[0_0_30px_rgba(0,229,255,0.1)]">
              <div className="flex items-center gap-3 text-electric-cyan mb-2">
                <Mail size={22} />
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ice-white">10. Policy Updates & Contact Us</h2>
              </div>
              <p className="font-sans text-slate-300 text-sm leading-relaxed">
                We may update this Master Privacy Policy periodically to reflect new software features, legal requirements, or AI technology upgrades. Changes take effect upon posting to this page.
              </p>
              
              <div className="bg-void-black/90 border border-slate-800 p-5 rounded-2xl space-y-3 mt-4">
                <div className="font-display font-semibold text-ice-white text-base">Logic Craft IT — Data Privacy Officer</div>
                <div className="font-mono text-xs text-slate-400 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-electric-cyan" />
                    <span>Official Contact: <a href="mailto:logiccraftit@gmail.com" className="text-electric-cyan hover:underline">logiccraftit@gmail.com</a></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-electric-cyan" />
                    <span>Website: <a href="https://www.logiccraftit.com/" target="_blank" rel="noreferrer" className="text-electric-cyan hover:underline">www.logiccraftit.com</a></span>
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="border-t border-slate-800 bg-void-black py-8 mt-16 text-center font-mono text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} Logic Craft IT. All Rights Reserved.</div>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-electric-cyan transition-colors">Home</Link>
            <Link to="/privacy" className="text-electric-cyan font-bold">Privacy Policy</Link>
            <a href="mailto:logiccraftit@gmail.com" className="hover:text-electric-cyan transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;
