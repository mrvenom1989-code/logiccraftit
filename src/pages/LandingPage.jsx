import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, Database, Server, Cpu, Layers, Box, Code, Rocket, ChevronRight, Mail } from 'lucide-react';
import Button from '../components/Button';
import InquiryModal from '../components/InquiryModal';

gsap.registerPlugin(ScrollTrigger);

const Navbar = ({ onOpenModal }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-4 pointer-events-none">
      <nav className={`pointer-events-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 max-w-5xl w-full ${scrolled ? 'bg-[#0A1128]/80 backdrop-blur-xl border border-electric-cyan/40 shadow-[0_0_30px_rgba(0,229,255,0.1)]' : 'bg-transparent border border-transparent'}`}>
        <div className="font-display font-bold text-xl tracking-tight text-ice-white flex items-center gap-2 cursor-pointer link-lift">
          <img src="/logiccraftitlogo1.png" alt="Logic Craft IT Logo" className="w-8 h-8 object-contain" />
          <span>Logic Craft <span className="text-electric-cyan">IT</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-sans text-sm font-medium text-slate-300">
          {['Automations', 'Software', 'Portfolio', 'Solutions'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-electric-cyan transition-colors link-lift">
              {item}
            </a>
          ))}
        </div>
        
        <div className="hidden md:block">
          <Button primary={true} className="py-2 px-6 text-sm" onClick={onOpenModal}>Deploy Your Solution</Button>
        </div>
      </nav>
    </div>
  );
};

const Hero = ({ onOpenModal }) => {
  const heroRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-element", 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: "power3.out", delay: 0.2 }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-[100dvh] w-full flex items-end pb-24 lg:pb-32 px-6 lg:px-16 overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=100&w=3500" 
          alt="Server background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void-black via-[#05050a]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-void-black/90 via-[#05050a]/40 to-transparent h-48"></div>
        <div className="absolute inset-0 bg-void-black/20 mix-blend-multiply"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl pt-32">
        <h1 className="flex flex-col gap-2">
          <span className="hero-element font-display font-medium text-3xl md:text-5xl lg:text-6xl text-slate-gray tracking-tight">
            Engineering the
          </span>
          <span className="hero-element font-display font-bold italic text-5xl md:text-7xl lg:text-[6.5rem] leading-[1.1] text-ice-white tracking-widest">
            <span className="text-electric-cyan">Intelligent</span> Future.
          </span>
        </h1>
        <p className="hero-element mt-6 font-sans text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Engineering the future of enterprise through intelligent AI automations, bespoke custom software, and scalable IT solutions.
        </p>
        <div className="hero-element mt-10 flex flex-wrap gap-4">
          <Button onClick={onOpenModal}>Deploy Your Solution</Button>
          <Button primary={false} onClick={() => document.getElementById('automations')?.scrollIntoView({ behavior: 'smooth' })}>Explore Architecture</Button>
        </div>
      </div>
    </section>
  );
};

const NeuralShuffler = () => {
  const [cards, setCards] = useState([
    { id: 1, lang: 'Python/LangChain', code: 'from langchain import AgentExecutor', color: 'from-blue-500/20' },
    { id: 2, lang: 'TensorFlow', code: "model.compile(optimizer='adam')", color: 'from-orange-500/20' },
    { id: 3, lang: 'PyTorch', code: 'torch.nn.Sequential(...)', color: 'from-red-500/20' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const newCards = [...prev];
        const last = newCards.pop();
        newCards.unshift(last);
        return newCards;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-64 w-full flex items-center justify-center perspective-[1000px] mt-6">
      {cards.map((card, i) => {
        const isFront = i === 0;
        const yOffset = i * -20;
        const scale = 1 - (i * 0.05);
        const zIndex = 10 - i;
        const opacity = 1 - (i * 0.3);

        return (
          <div 
            key={card.id}
            className="absolute top-1/2 left-1/2 -transform-x-1/2 -transform-y-1/2 w-full max-w-[280px] p-5 rounded-2xl border border-slate-800 bg-[#0A1128]/95 backdrop-blur-md shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex flex-col gap-3"
            style={{
              transform: `translate(-50%, calc(-50% + ${yOffset}px)) scale(${scale})`,
              zIndex,
              opacity
            }}
          >
            <div className="flex items-center justify-between text-xs font-sans text-slate-400">
              <span className="flex items-center gap-1.5"><Cpu size={14} className="text-electric-cyan"/> {card.lang}</span>
              <span className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse"></span>
            </div>
            <div className={`font-mono text-sm text-ice-white bg-void-black/50 p-3 rounded-lg border border-slate-800/50 bg-gradient-to-r ${card.color} to-transparent`}>
              {card.code}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TelemetryTypewriter = () => {
  const lines = [
    "> cargo build --release",
    "> Compiling logic_core [Rust]",
    "> npm run build",
    "> Next.js compiled successfully",
    "> Deployment optimal."
  ];
  
  const [visibleLines, setVisibleLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      const timeout = setTimeout(() => {
        setVisibleLines([]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
      }, 5000);
      return () => clearTimeout(timeout);
    }

    const currentLine = lines[currentLineIndex];
    
    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setCurrentCharIndex(prev => prev + 1);
      }, 30 + Math.random() * 40);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setVisibleLines(prev => [...prev, currentLine]);
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex]);

  const currentTyping = lines[currentLineIndex]?.substring(0, currentCharIndex) || "";

  return (
    <div className="w-full bg-[#05050A] rounded-2xl border border-slate-800 p-5 mt-6 font-mono text-sm leading-relaxed h-64 flex flex-col shadow-inner relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800/80">
        <Terminal size={14} className="text-slate-500" />
        <span className="text-xs text-slate-500">server_telemetry.log</span>
      </div>
      <div className="flex-1 overflow-auto text-slate-300 flex flex-col gap-1">
        {visibleLines.map((line, i) => (
          <div key={i} className={line.includes("optimal") ? "text-electric-cyan font-medium" : ""}>
            {line}
          </div>
        ))}
        {currentLineIndex < lines.length && (
          <div>
            {currentTyping}
            <span className="inline-block w-2 bg-electric-cyan ml-1 animate-pulse h-4 align-middle"></span>
          </div>
        )}
      </div>
    </div>
  );
};

const InfrastructureScheduler = () => {
  const [deployed, setDeployed] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDeployed(false);
      setTimeout(() => setDeployed(true), 1500);
    }, 5000);
    
    setTimeout(() => setDeployed(true), 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-64 mt-6 bg-[#05050A] rounded-2xl border border-slate-800 p-5 relative overflow-hidden group">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="flex justify-between items-center z-10 relative mb-8">
        <h4 className="text-xs font-sans text-slate-400 flex items-center gap-2">
          <Database size={14}/> Topology Status
        </h4>
        <div className={`text-[10px] font-mono px-2 py-1 rounded-sm border ${deployed ? 'border-electric-cyan/30 text-electric-cyan bg-electric-cyan/10' : 'border-slate-700 text-slate-500 bg-slate-800/40'}`}>
          {deployed ? 'SCALED' : 'PENDING'}
        </div>
      </div>
      
      <div className="relative w-full h-full flex items-center justify-between px-4 z-10 pb-8">
        {/* Source Box */}
        <div className="w-16 h-16 rounded-xl border border-slate-700 bg-slate-900 flex items-center justify-center relative">
          <Box className="text-slate-400 opacity-50" size={24}/>
          
          {/* Animated Package */}
          <div className={`absolute inset-0 m-auto w-12 h-12 bg-deep-navy border border-electric-cyan rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all duration-1000 ease-in-out ${deployed ? 'translate-x-[160px] opacity-0 scale-50' : 'translate-x-0 opacity-100 scale-100'}`}>
             <Box className="text-electric-cyan" size={20} />
          </div>
        </div>
        
        {/* Connection Line */}
        <div className="flex-1 h-[1px] bg-slate-800 relative mx-4">
          <div className={`h-full bg-gradient-to-r from-electric-cyan to-transparent absolute top-0 left-0 transition-all duration-1000 ease-in-out w-full origin-left ${deployed ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}></div>
        </div>
        
        {/* Target Node */}
        <div className={`w-20 h-20 rounded-xl border-dashed border-2 flex flex-col items-center justify-center gap-2 transition-all duration-500 ${deployed ? 'border-electric-cyan border-solid bg-[#0A1128] shadow-[0_0_20px_rgba(0,229,255,0.15)]' : 'border-slate-800 bg-void-black'}`}>
          <Server size={20} className={deployed ? "text-electric-cyan" : "text-slate-600"}/>
          {deployed && (
            <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-electric-cyan animate-[pulse_1.5s_ease-in-out_infinite]"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.feature-card', 
        { y: 50, opacity: 0 },
        { 
          y: 0, opacity: 1, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="automations" ref={containerRef} className="py-24 px-6 lg:px-16 w-full max-w-7xl mx-auto z-10 relative">
      <div className="mb-16">
        <h2 className="font-display font-medium text-3xl md:text-5xl text-ice-white flex items-center gap-4">
          <Layers className="text-electric-cyan" size={40} />
          Functional Artifacts
        </h2>
        <p className="font-sans text-slate-400 mt-4 max-w-2xl text-lg">
          No generic patterns. Each solution is a bespoke architecture designed to eliminate bottlenecks and enforce scale.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="feature-card bg-[#0A1128] rounded-[2rem] border border-slate-800 p-8 hover:shadow-[0_0_30px_rgba(0,229,255,0.05)] transition-shadow duration-500 flex flex-col hover:-translate-y-1">
          <div className="w-12 h-12 bg-void-black border border-slate-800 rounded-2xl flex items-center justify-center mb-6">
            <Cpu className="text-electric-cyan" size={24} />
          </div>
          <h3 className="font-display text-2xl font-semibold mb-3">AI Automations</h3>
          <p className="font-sans text-slate-400 text-sm leading-relaxed mb-6 flex-1">
            Eliminating manual bottlenecks through custom inference endpoints, agentic workflows, and self-optimizing pipelines.
          </p>
          <NeuralShuffler />
        </div>

        <div className="feature-card bg-[#0A1128] rounded-[2rem] border border-slate-800 p-8 hover:shadow-[0_0_30px_rgba(0,229,255,0.05)] transition-shadow duration-500 flex flex-col hover:-translate-y-1">
          <div className="w-12 h-12 bg-void-black border border-slate-800 rounded-2xl flex items-center justify-center mb-6">
            <Code className="text-electric-cyan" size={24} />
          </div>
          <h3 className="font-display text-2xl font-semibold mb-3">Bespoke Software</h3>
          <p className="font-sans text-slate-400 text-sm leading-relaxed mb-6 flex-1">
            Built from scratch for specific operational needs. No bloated monoliths; just high-performance functional logic.
          </p>
          <TelemetryTypewriter />
        </div>

        <div className="feature-card bg-[#0A1128] rounded-[2rem] border border-slate-800 p-8 hover:shadow-[0_0_30px_rgba(0,229,255,0.05)] transition-shadow duration-500 flex flex-col hover:-translate-y-1">
          <div className="w-12 h-12 bg-void-black border border-slate-800 rounded-2xl flex items-center justify-center mb-6">
            <Server className="text-electric-cyan" size={24} />
          </div>
          <h3 className="font-display text-2xl font-semibold mb-3">Scalable IT</h3>
          <p className="font-sans text-slate-400 text-sm leading-relaxed mb-6 flex-1">
            Future-proof digital foundations. Dynamic clustering, edge deployments, and unbreakable cloud infrastructure.
          </p>
          <InfrastructureScheduler />
        </div>
      </div>
    </section>
  );
};

const Philosophy = () => {
  const philRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Very basic split-text-like reveal without external plugin
      gsap.fromTo('.phil-text', 
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.1, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: philRef.current,
            start: "top 60%"
          }
        }
      );
      
      gsap.to('.phil-bg', {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: philRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      })
    }, philRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={philRef} className="relative w-full py-40 bg-void-black overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=100&w=3500" alt="Abstract Tech" className="phil-bg w-full h-[120%] object-cover object-center -mt-10" />
      </div>
      
      <div className="relative z-10 px-6 lg:px-16 w-full max-w-5xl">
        <h2 className="font-sans font-medium text-slate-500 text-xl md:text-3xl mb-8 phil-text tracking-wide">
          Most agencies focus on: <br className="md:hidden"/> <span className="line-through decoration-slate-700">temporary patches.</span>
        </h2>
        <h3 className="font-display font-bold text-4xl md:text-6xl lg:text-[5.5rem] leading-[1.1] text-ice-white -ml-1">
           <span className="phil-text inline-block">We engineer:</span><br/>
           <span className="phil-text inline-block text-electric-cyan">scalable digital</span><br/>
           <span className="phil-text inline-block">dominance.</span>
        </h3>
      </div>
    </section>
  );
};

const ProtocolArchive = () => {
  return (
    <div id="solutions" className="w-full relative bg-void-black px-6 py-32 max-w-6xl mx-auto flex flex-col gap-6 lg:gap-24">
      {/* Introduction text for context before stack */}
      <div className="mb-8">
        <h2 className="font-display font-medium text-3xl md:text-5xl text-ice-white flex items-center gap-4">
           Protocol Execution
        </h2>
      </div>

      {/* Card 1 */}
      <div className="sticky top-24 w-full bg-deep-navy border border-slate-800 rounded-[2rem] p-8 lg:p-16 shadow-2xl z-10 flex flex-col justify-center min-h-[50vh]">
        <div className="font-mono text-electric-cyan mb-4">Phase_01</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Audit & Architecture</h2>
        <p className="font-sans text-xl text-slate-400 max-w-2xl leading-relaxed">
          We reverse-engineer your current state to locate inefficiencies. Then, we architect a pristine digital foundation.
        </p>
        
        {/* Abstract Animation */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 hidden lg:flex items-center justify-center opacity-50">
          <div className="absolute inset-0 border border-slate-800 rounded-full [background:radial-gradient(circle_at_center,transparent_0%,rgba(0,229,255,0.05)_100%)]"></div>
          <div className="w-1 h-32 bg-electric-cyan shadow-[0_0_15px_#00E5FF] animate-[spin_4s_linear_infinite] rounded-full"></div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="sticky top-32 w-full bg-[#080d20] border border-slate-800 rounded-[2rem] p-8 lg:p-16 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] z-20 flex flex-col justify-center min-h-[50vh]">
        <div className="font-mono text-electric-cyan mb-4">Phase_02</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Development & Training</h2>
        <p className="font-sans text-xl text-slate-400 max-w-2xl leading-relaxed">
          Models are fine-tuned, and concurrent pipelines are implemented. Code is compiled, tested, and forged for zero-downtime execution.
        </p>
        
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 hidden lg:flex items-center justify-center opacity-50 gap-2">
           {[...Array(8)].map((_, i) => (
             <div key={i} className="w-4 bg-slate-800 rounded-full h-full" style={{
               animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
               height: `${Math.max(20, Math.random() * 100)}%`
             }}></div>
           ))}
        </div>
      </div>

      {/* Card 3 */}
      <div className="sticky top-40 w-full bg-[#0A1128] border border-electric-cyan/20 rounded-[2rem] p-8 lg:p-16 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] z-30 flex flex-col justify-center min-h-[50vh]">
        <div className="font-mono text-electric-cyan mb-4">Phase_03</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Deployment & Scaling</h2>
        <p className="font-sans text-xl text-slate-400 max-w-2xl leading-relaxed">
          The system goes live. Built-in telemetry handles elastic scaling, load balancing, and self-healing deployments.
        </p>
        
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 hidden lg:flex items-center justify-center opacity-50">
           <div className="w-48 h-48 border border-electric-cyan border-dashed rounded-full animate-[spin_10s_linear_infinite] flex items-center justify-center">
              <div className="w-32 h-32 bg-void-black border border-slate-700 rounded-full flex items-center justify-center">
                 <Rocket className="text-electric-cyan" size={32} />
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};

const CTA = ({ onOpenModal }) => {
  return (
    <section className="py-32 px-6 bg-deep-navy relative overflow-hidden flex items-center justify-center flex-col text-center border-t border-slate-800/50">
       <img src="/logiccraftit.png" alt="Logic Craft IT Branding Narrative" className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-luminosity pointer-events-none" />
       <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-deep-navy/50 to-transparent pointer-events-none"></div>
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-electric-cyan/20 blur-[150px] rounded-[100%] pointer-events-none mix-blend-screen opacity-50"></div>
       
       <h2 className="font-display font-medium text-4xl md:text-6xl lg:text-[5rem] text-ice-white mb-12 tracking-tight relative z-10 max-w-4xl">
         Ready to scale your logic?
       </h2>
       
       <Button onClick={onOpenModal} className="text-lg px-12 py-5 shadow-[0_0_40px_rgba(0,229,255,0.2)]" primary={true}>
          Schedule a Consultation <ChevronRight size={20} className="inline group-hover:translate-x-1 transition-transform" />
       </Button>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-void-black border-t border-slate-800 rounded-t-[4rem] relative z-40 px-6 pt-20 pb-8 mt-[-2rem]">
       <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8 border-b border-slate-800/60 pb-16">
          
          <div className="max-w-sm">
             <div className="font-display font-bold text-2xl tracking-tight text-ice-white flex items-center gap-3 mb-6">
               <img src="/logiccraftitlogo1.png" alt="Logic Craft IT Logo" className="w-10 h-10 object-contain" />
               <span>Logic Craft <span className="text-electric-cyan">IT</span></span>
             </div>
             <p className="text-slate-500 font-sans leading-relaxed mb-8">
               Engineering bespoke software and intelligent automations for the world's most ambitious teams.
             </p>
             <div className="flex items-center gap-3 border border-slate-800 rounded-full py-2 px-4 w-fit bg-[#0A1128]/50">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-electric-cyan"></span>
                </span>
                <span className="font-mono text-xs text-slate-400">System Operational</span>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-12 lg:gap-24">
             <div className="flex flex-col gap-4">
                <div className="font-display text-electric-cyan font-semibold text-sm mb-2">Protocol</div>
                <a href="#" className="font-sans text-slate-400 hover:text-ice-white transition-colors text-sm link-lift">Automations</a>
                <a href="#" className="font-sans text-slate-400 hover:text-ice-white transition-colors text-sm link-lift">Custom Software</a>
                <a href="#" className="font-sans text-slate-400 hover:text-ice-white transition-colors text-sm link-lift">Infrastructure</a>
             </div>
             <div className="flex flex-col gap-4">
                <div className="font-display text-electric-cyan font-semibold text-sm mb-2">Contact</div>
                <a href="mailto:logiccraftit@gmail.com" className="font-sans text-slate-400 hover:text-ice-white transition-colors text-sm link-lift flex items-center gap-2">
                  <Mail size={14} className="text-electric-cyan" />
                  logiccraftit@gmail.com
                </a>
                <a href="#" className="font-sans text-slate-400 hover:text-ice-white transition-colors text-sm link-lift">Deploy Project</a>
                <a href="#" className="font-sans text-slate-400 hover:text-ice-white transition-colors text-sm link-lift">Consultation</a>
                <a href="#" className="font-sans text-slate-400 hover:text-ice-white transition-colors text-sm link-lift">GitHub Arc</a>
             </div>
          </div>
          
       </div>
       
       <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs font-mono text-slate-600 pt-8">
          <div>© {new Date().getFullYear()} Logic Craft IT.</div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <a href="#" className="hover:text-electric-cyan transition-colors">Privacy</a>
            <a href="#" className="hover:text-electric-cyan transition-colors">Terms</a>
          </div>
       </div>
    </footer>
  );
};

const PORTFOLIO_PROJECTS = [
  {
    id: 'ayurved-clinic',
    title: 'Ayurved Clinic Management',
    tagline: 'ELECTRONIC HEALTH RECORDS & CLINICAL WORKFLOW',
    category: 'Clinic Suites',
    description: 'A comprehensive, high-fidelity ERP system engineered for Ayurvedic clinics. It integrates patient scheduling, secure electronic medical records (EHR), inventory control for natural remedies, and diagnostic reporting panels.',
    stack: ['React', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'Express'],
    features: [
      'Interactive patient appointment scheduling system',
      'Electronic Health Records (EHR) with customizable medical templates',
      'Inventory tracking for remedies, herbs, and formulas',
      'Treatment plan orchestrator and billing compiler'
    ],
    folder: 'ayurved clinic management',
    images: [
      '/ayurved clinic management/ayurved clinic management.png',
      '/ayurved clinic management/ayurved clinic management 1.png',
      '/ayurved clinic management/ayurved clinic management 2.png',
      '/ayurved clinic management/ayurved clinic management 3.png',
      '/ayurved clinic management/ayurved clinic management 4.png',
      '/ayurved clinic management/ayurved clinic management 5.png',
      '/ayurved clinic management/ayurved clinic management 6.png',
      '/ayurved clinic management/ayurved clinic management 7.png',
      '/ayurved clinic management/ayurved clinic management 8.png',
      '/ayurved clinic management/ayurved clinic management 9.png',
      '/ayurved clinic management/ayurved clinic management 10.png',
      '/ayurved clinic management/ayurved clinic management 11.png',
      '/ayurved clinic management/ayurved clinic management 12.png'
    ]
  },
  {
    id: 'solar-management',
    title: 'Solar Installation Project Management',
    tagline: 'INFRASTRUCTURE ORCHESTRATION & CRM',
    category: 'Software Systems',
    description: 'A command center interface tailored for solar installers to oversee panel deployment schedules, tracking project milestones, routing field crews, and generating project health analytics.',
    stack: ['React', 'TypeScript', 'Supabase', 'Leaflet', 'Tailwind CSS'],
    features: [
      'Milestone tracking with visual gantt and kanban interfaces',
      'Field crew geolocation and dispatch coordinator',
      'Solar array layout configuration tracker',
      'Dynamic project billing and document compiler'
    ],
    folder: 'solar installation project management',
    images: [
      '/solar installation project management/solar installation project management.png',
      '/solar installation project management/solar installation project management1.png',
      '/solar installation project management/solar installation project management2.png',
      '/solar installation project management/solar installation project management3.png',
      '/solar installation project management/solar installation project management4.png',
      '/solar installation project management/solar installation project management5.png',
      '/solar installation project management/solar installation project management6.png',
      '/solar installation project management/solar installation project management7.png',
      '/solar installation project management/solar installation project management8.png',
      '/solar installation project management/solar installation project management9.png',
      '/solar installation project management/solar installation project management10.png',
      '/solar installation project management/solar installation project management11.png',
      '/solar installation project management/solar installation project management12.png',
      '/solar installation project management/solar installation project management13.png',
      '/solar installation project management/solar installation project management14.png',
      '/solar installation project management/solar installation project management15.png',
      '/solar installation project management/solar installation project management16.png'
    ]
  },
  {
    id: 'homeopathy-clinic',
    title: 'Homeopathy Clinic Management',
    tagline: 'HOLISTIC EHR & REPERTORIZATION ENGINE',
    category: 'Clinic Suites',
    description: 'A custom, specialized EHR platform designed for homeopathic practitioners. It implements patient logs, inventory management, and case repertorization lookup matrices.',
    stack: ['React', 'Vite', 'Supabase', 'Tailwind CSS', 'PostgreSQL'],
    features: [
      'Advanced repertory mapping for case analysis',
      'Patient history logs and symptom cataloging',
      'Remedy inventory and dilution level tracker',
      'Secure prescription compiler and scheduler'
    ],
    folder: 'homeopathy clinic management',
    images: [
      '/homeopathy clinic management/homeopathy clinic management.png',
      '/homeopathy clinic management/homeopathy clinic management 1.png',
      '/homeopathy clinic management/homeopathy clinic management 2.png',
      '/homeopathy clinic management/homeopathy clinic management 3.png',
      '/homeopathy clinic management/homeopathy clinic management 4.png',
      '/homeopathy clinic management/homeopathy clinic management 5.png',
      '/homeopathy clinic management/homeopathy clinic management 6.png',
      '/homeopathy clinic management/homeopathy clinic management 7.png',
      '/homeopathy clinic management/homeopathy clinic management 8.png',
      '/homeopathy clinic management/homeopathy clinic management 9.png',
      '/homeopathy clinic management/homeopathy clinic management 10.png'
    ]
  },
  {
    id: 'price-update',
    title: 'Automated Item Price Update',
    tagline: 'RETAIL TELEMETRY & AUTOMATION ENGINE',
    category: 'Automations',
    description: 'An automated pricing engine designed to scrape, analyze, and sync item prices across multiple e-commerce nodes and databases. It minimizes manual catalog operations and keeps price sheets accurate.',
    stack: ['Node.js', 'Puppeteer', 'PostgreSQL', 'Redis', 'Docker'],
    features: [
      'Real-time price scraping engine with headless browser automation',
      'Multi-node price sync cron tasks',
      'Price discrepancy alerting and threshold triggers',
      'Detailed log dashboard in monospace visual feedback'
    ],
    folder: 'automated item price update',
    images: [
      '/automated item price update/automated item price update.png',
      '/automated item price update/automated item price update1.png'
    ]
  },
  {
    id: 'google-reviews',
    title: 'Google Reviews Reporting',
    tagline: 'SENTIMENT ENGINE & AUTOMATED REPORTING',
    category: 'Automations',
    description: 'A business intelligence compiler that aggregates customer feedback from Google Business profiles, classifies sentiment, and auto-generates scheduled PDF performance summaries for stakeholder review.',
    stack: ['Python', 'Flask', 'Google Business API', 'OpenAI API', 'Tailwind CSS'],
    features: [
      'Review aggregator and synchronization scheduler',
      'GPT-powered customer sentiment classification and summary engine',
      'PDF layout engine for elegant review telemetry sheets',
      'Automated email reporter and client feedback logs'
    ],
    folder: 'google reviews reporting',
    images: [
      '/google reviews reporting/google reviews reporting.png',
      '/google reviews reporting/google reviews reporting1.png',
      '/google reviews reporting/google reviews reporting2.png'
    ]
  }
];

const Portfolio = ({ onOpenProject }) => {
  const [filter, setFilter] = useState('All');
  const sectionRef = useRef(null);

  const categories = ['All', 'Clinic Suites', 'Automations', 'Software Systems'];

  const filteredProjects = filter === 'All' 
    ? PORTFOLIO_PROJECTS 
    : PORTFOLIO_PROJECTS.filter(p => p.category === filter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.portfolio-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [filter]);

  return (
    <section id="portfolio" ref={sectionRef} className="py-24 px-6 lg:px-16 w-full max-w-7xl mx-auto z-10 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="font-display font-medium text-3xl md:text-5xl text-ice-white flex items-center gap-4">
            <Code className="text-electric-cyan" size={40} />
            System Archive
          </h2>
          <p className="font-sans text-slate-400 mt-4 max-w-2xl text-lg">
            A production registry of our custom-engineered systems, telemetry engines, and enterprise solutions.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 bg-[#0A1128]/60 p-1.5 rounded-full border border-slate-800/80 w-fit">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-sans font-medium transition-all duration-300 pointer-events-auto cursor-pointer ${filter === cat ? 'bg-electric-cyan text-void-black font-semibold shadow-[0_0_15px_rgba(0,229,255,0.25)]' : 'text-slate-400 hover:text-ice-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className="portfolio-card group bg-[#0A1128] rounded-[2rem] border border-slate-800 overflow-hidden hover:border-electric-cyan/40 hover:shadow-[0_0_30px_rgba(0,229,255,0.08)] transition-all duration-500 flex flex-col cursor-pointer"
            onClick={() => onOpenProject(project)}
          >
            <div className="relative aspect-[16/10] w-full bg-void-black border-b border-slate-800/80 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-7 bg-void-black/80 backdrop-blur-md flex items-center justify-between px-4 border-b border-slate-800/40 z-20">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                </div>
                <div className="text-[10px] font-mono text-slate-600 truncate max-w-[150px]">
                  {project.id}.logiccraft.it
                </div>
                <div className="w-10" />
              </div>
              
              <img
                src={encodeURI(project.images[0])}
                alt={project.title}
                className="w-full h-full object-cover pt-7 opacity-85 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-transparent to-transparent pointer-events-none z-10" />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-electric-cyan tracking-wider uppercase bg-electric-cyan/10 border border-electric-cyan/20 px-2.5 py-0.5 rounded-full">
                  {project.category}
                </span>
                <h3 className="font-display text-xl font-bold text-ice-white mt-4 mb-2 group-hover:text-electric-cyan transition-colors">
                  {project.title}
                </h3>
                <p className="font-sans text-xs text-slate-500 font-medium tracking-wide mb-3">
                  {project.tagline}
                </p>
                <p className="font-sans text-slate-400 text-xs leading-relaxed mb-6 line-clamp-3">
                  {project.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.stack.slice(0, 3).map(tech => (
                    <span key={tech} className="font-mono text-[10px] text-slate-400 bg-void-black/60 px-2 py-0.5 rounded-md border border-slate-800/80">
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > 3 && (
                    <span className="font-mono text-[10px] text-slate-500 px-2 py-0.5">
                      +{project.stack.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center text-xs font-semibold text-electric-cyan font-sans group-hover:translate-x-1 transition-transform">
                  Explore Architecture <ChevronRight size={14} className="ml-1" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const SystemArchiveViewer = ({ project, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    gsap.fromTo(modalRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
    );

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  const handleNext = () => {
    setActiveImageIndex(prev => (prev + 1) % project.images.length);
  };

  const handlePrev = () => {
    setActiveImageIndex(prev => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-void-black/90 backdrop-blur-md">
      <div className="absolute inset-0 cursor-default" onClick={onClose} />
      
      <div 
        ref={modalRef}
        className="relative w-full max-w-6xl bg-[#0A1128] border border-slate-800 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,229,255,0.15)] flex flex-col-reverse lg:flex-row overflow-hidden max-h-[90vh] z-10"
      >
        {/* Left Panel: Project Details */}
        <div className="lg:w-2/5 p-6 md:p-10 border-t lg:border-t-0 lg:border-r border-slate-800 flex flex-col justify-between overflow-y-auto custom-scrollbar flex-1 min-h-0">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-mono text-electric-cyan tracking-wider uppercase bg-electric-cyan/10 border border-electric-cyan/20 px-3 py-1 rounded-full">
                {project.category}
              </span>
            </div>
            
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ice-white mb-2 leading-tight">
              {project.title}
            </h2>
            <p className="font-sans text-[11px] text-slate-500 font-semibold tracking-widest mb-6">
              {project.tagline}
            </p>
            
            <div className="border-t border-slate-800/80 my-4" />
            
            <p className="font-sans text-slate-300 text-sm leading-relaxed mb-6">
              {project.description}
            </p>
            
            <h4 className="font-display font-semibold text-xs text-electric-cyan uppercase tracking-wider mb-3">
              Core Architecture & Features
            </h4>
            <ul className="flex flex-col gap-2.5 mb-6">
              {project.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 font-sans text-xs text-slate-400 leading-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan mt-1.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="border-t border-slate-800/80 my-4" />
            
            <h4 className="font-display font-semibold text-xs text-slate-500 uppercase tracking-wider mb-3">
              Compiled Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.stack.map(tech => (
                <span key={tech} className="font-mono text-xs text-ice-white bg-void-black px-3 py-1 rounded-md border border-slate-800/80">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Immersive Gallery */}
        <div className="lg:w-3/5 bg-void-black/60 flex flex-col justify-between relative overflow-hidden h-[45vh] md:h-[50vh] lg:h-auto flex-shrink-0 border-b lg:border-b-0 border-slate-800">
          <div className="flex items-center justify-between px-5 py-3 lg:px-6 lg:py-4 border-b border-slate-800/60 bg-void-black/40">
            <span className="font-mono text-[10px] sm:text-xs text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-electric-cyan rounded-full animate-pulse" />
              SYSTEM_PREVIEW_RECORDS: {activeImageIndex + 1} / {project.images.length}
            </span>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-ice-white font-mono text-xs border border-slate-800/80 rounded-full px-4 py-1.5 bg-[#0A1128]/50 hover:border-electric-cyan/40 hover:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all duration-300 cursor-pointer"
            >
              Exit View
            </button>
          </div>

          <div className="flex-1 relative flex items-center justify-center p-6 min-h-0 bg-void-black/90">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none z-10" />
            
            <img 
              src={encodeURI(project.images[activeImageIndex])} 
              alt={`${project.title} - Screenshot ${activeImageIndex + 1}`}
              className="max-w-full max-h-[25vh] md:max-h-[35vh] lg:max-h-[60vh] object-contain rounded-lg border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all duration-500"
            />
            
            {project.images.length > 1 && (
              <>
                <button 
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-800 bg-[#0A1128]/90 text-ice-white flex items-center justify-center hover:border-electric-cyan/40 hover:text-electric-cyan transition-all duration-300 z-20 hover:scale-105 cursor-pointer text-sm"
                >
                  &larr;
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-800 bg-[#0A1128]/90 text-ice-white flex items-center justify-center hover:border-electric-cyan/40 hover:text-electric-cyan transition-all duration-300 z-20 hover:scale-105 cursor-pointer text-sm"
                >
                  &rarr;
                </button>
              </>
            )}
          </div>

          <div className="p-3 border-t border-slate-800 bg-void-black/60 flex items-center gap-3 overflow-x-auto custom-scrollbar">
            {project.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`relative flex-shrink-0 w-14 h-9 sm:w-16 sm:h-10 rounded border overflow-hidden transition-all duration-300 cursor-pointer ${activeImageIndex === index ? 'border-electric-cyan scale-105 shadow-[0_0_10px_rgba(0,229,255,0.3)]' : 'border-slate-800 opacity-60 hover:opacity-100'}`}
              >
                <img 
                  src={encodeURI(image)} 
                  alt={`Thumb ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  return (
    <div className="relative bg-void-black text-slate-200">
      {/* Noise filter and overlay container */}
      <div className="noise-overlay" style={{ filter: 'url(#noiseFilter)' }} />
      <svg className="sr-only">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
      </svg>

      <Navbar onOpenModal={() => setIsModalOpen(true)} />
      <main>
        <Hero onOpenModal={() => setIsModalOpen(true)} />
        <Features />
        <Philosophy />
        <Portfolio onOpenProject={setActiveProject} />
        <ProtocolArchive />
        <CTA onOpenModal={() => setIsModalOpen(true)} />
      </main>
      <Footer />
      <InquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {activeProject && <SystemArchiveViewer project={activeProject} onClose={() => setActiveProject(null)} />}
    </div>
  );
};

export default LandingPage;
