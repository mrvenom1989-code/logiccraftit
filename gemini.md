\# Cinematic Landing Page Builder: Logic Craft IT



\## Role



Act as a World-Class Senior Creative Technologist and Lead Frontend Engineer. You are tasked with building a high-fidelity, cinematic "1:1 Pixel Perfect" landing page for \*\*Logic Craft IT\*\*. Every site you produce should feel like a digital instrument — every scroll intentional, every animation weighted and professional. Eradicate all generic AI patterns.



\## Agent Flow — MUST FOLLOW



When this file is loaded into a fresh project, do not ask any questions. Immediately execute the build for \*\*Logic Craft IT\*\* based on the strict parameters and design system outlined below. Do not over-discuss. Build.



\### Brand Context (Hardcoded)

1\. \*\*Brand Name:\*\* Logic Craft IT

2\. \*\*One-Line Purpose:\*\* Engineering the future of enterprise through intelligent AI automations, bespoke custom software, and scalable IT solutions.

3\. \*\*Key Value Propositions:\*\*

&#x20;  \* Intelligent AI Automations (Eliminating manual bottlenecks)

&#x20;  \* Bespoke Custom Software (Built for specific operational needs)

&#x20;  \* Scalable IT Infrastructure (Future-proof digital foundations)

4\. \*\*Primary CTA:\*\* "Deploy Your Solution" or "Schedule a Consultation"



\---



\## Aesthetic System: "Deep Cyber Luxe" 



This design system defines the modern, tech-focused, dark navy/black aesthetic for Logic Craft IT.



\- \*\*Identity:\*\* A high-end server room meets a futuristic AI research laboratory. Professional, commanding, and infinitely scalable.

\- \*\*Palette:\*\* - Void Black `#05050A` (Primary Background)

&#x20; - Deep Navy `#0A1128` (Secondary Background / Cards)

&#x20; - Electric Cyan `#00E5FF` (Accent / CTA / Highlights)

&#x20; - Ice White `#F8FAFC` (Text / Headings)

&#x20; - Slate Gray `#8B949E` (Muted Text)

\- \*\*Typography:\*\* - Headings: `"Space Grotesk"` (tight tracking, technical but bold). 

&#x20; - Body/Drama: `"Inter"` (Clean, highly legible). 

&#x20; - Data/Tech elements: `"JetBrains Mono"`.

\- \*\*Image Mood:\*\* server racks, abstract glowing neural networks, dark glass reflections, futuristic UI data visualizations, dark blue ambient lighting. (Source from Unsplash using these keywords).

\- \*\*Hero line pattern:\*\* "Engineering the" (Bold Sans) / "Intelligent Future." (Massive Sans-Serif Italic with Cyan accent).



\---



\## Fixed Design System (NEVER CHANGE)



These rules are what make the output premium.



\### Visual Texture

\- Implement a global CSS noise overlay using an inline SVG `<feTurbulence>` filter at \*\*0.04 opacity\*\* to eliminate flat digital gradients and give a raw, metallic feel.

\- Use a `rounded-\[1.5rem]` to `rounded-\[2rem]` radius system for all containers. 

\- Use subtle glowing drop-shadows `shadow-\[0\_0\_30px\_rgba(0,229,255,0.1)]` for hover states on key elements.



\### Micro-Interactions

\- All buttons must have a \*\*"magnetic" feel\*\*: subtle `scale(1.03)` on hover with `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.

\- Buttons use `overflow-hidden` with a sliding Electric Cyan background `<span>` layer for color transitions on hover.

\- Links and interactive elements get a `translateY(-1px)` lift on hover.



\### Animation Lifecycle

\- Use `gsap.context()` within `useEffect` for ALL animations. Return `ctx.revert()` in the cleanup function.

\- Default easing: `power3.out` for entrances, `power2.inOut` for morphs.

\- Stagger value: `0.08` for text, `0.15` for cards/containers.



\---



\## Component Architecture (NEVER CHANGE STRUCTURE)



\### A. NAVBAR — "The Floating Island"

A `fixed` pill-shaped container, horizontally centered.

\- \*\*Morphing Logic:\*\* Transparent with Ice White text at hero top. Transitions to `bg-\[#0A1128]/80 backdrop-blur-xl` with a subtle Cyan border when scrolled past the hero. Use `IntersectionObserver` or ScrollTrigger.

\- Contains: Logo ("Logic Craft IT" as bold text), 3 nav links (Automations, Software, Solutions), CTA button (Cyan accent).



\### B. HERO SECTION — "The Opening Shot"

\- `100dvh` height. Full-bleed background image (abstract neural net or dark server room) with a heavy \*\*Navy-to-Void-Black gradient overlay\*\* (`bg-gradient-to-t`).

\- \*\*Layout:\*\* Content pushed to the \*\*bottom-left third\*\* using flex + padding.

\- \*\*Typography:\*\* First part "Engineering the" in Space Grotesk. Second part "Intelligent Future." in massive Space Grotesk Italic (3-5x size difference, with "Intelligent" colored in Electric Cyan).

\- \*\*Animation:\*\* GSAP staggered `fade-up` (y: 40 → 0, opacity: 0 → 1) for all text parts and CTA.



\### C. FEATURES — "Interactive Functional Artifacts"

Three cards derived from the 3 value propositions. These must feel like \*\*functional software micro-UIs\*\*. 



\*\*Card 1 — "AI Automations" (Neural Shuffler):\*\* 3 overlapping cards that cycle vertically using `array.unshift(array.pop())` logic every 3 seconds. The cards display syntax-highlighted AI logic snippets in JetBrains Mono:

\- Card A: `from langchain import AgentExecutor` (Python/LangChain)

\- Card B: `model.compile(optimizer='adam')` (TensorFlow)

\- Card C: `torch.nn.Sequential(...)` (PyTorch)



\*\*Card 2 — "Custom Software" (Telemetry Typewriter):\*\* A monospace live-text feed that types out a multi-stack build sequence representing high-performance software: 

`> cargo build --release`

`> Compiling logic\_core \[Rust]`

`> npm run build`

`> Next.js compiled successfully`

`> Deployment optimal.` 

(Include a blinking Cyan cursor at the end).



\*\*Card 3 — "IT Solutions" (Infrastructure Scheduler):\*\* An interactive deployment topology grid. An animated SVG cursor drags a 'Docker' container icon into an empty 'Kubernetes' node cell. The node pulses Electric Cyan upon placement, and a miniature status bar fills up indicating "Pod Deployed \& Scaled." 



All cards: `bg-\[#0A1128]` surface, subtle border `border-slate-800`, `rounded-\[2rem]`. 



\### D. PHILOSOPHY — "The Manifesto"

\- Full-width section with Void Black background.

\- A parallaxing abstract tech texture image at low opacity (10%).

\- \*\*Typography:\*\* - "Most agencies focus on: temporary patches." (neutral, smaller).

&#x20; - "We engineer: scalable digital dominance." (massive, bold, Cyan keyword).

\- \*\*Animation:\*\* GSAP `SplitText`-style reveal.



\### E. PROTOCOL — "Sticky Stacking Archive"

3 full-screen cards that stack on scroll, detailing the process.

\- \*\*Stacking Interaction:\*\* Using GSAP ScrollTrigger with `pin: true`. As a new card scrolls into view, the card underneath scales to `0.9`, blurs to `20px`, and fades to `0.5`.

\- \*\*Process Steps:\*\*

&#x20; 1. \*\*Audit \& Architecture:\*\* (Scanning horizontal laser-line over a grid).

&#x20; 2. \*\*Development \& Training:\*\* (Pulsing waveform / data processing animation).

&#x20; 3. \*\*Deployment \& Scaling:\*\* (Rotating geometric server-node motif).



\### F. FINAL CTA — "The Terminal"

\- Deep Navy background.

\- A massive, clean prompt: "Ready to scale your logic?"

\- Single large CTA button: "Schedule a Consultation".



\### G. FOOTER

\- Void Black background, `rounded-t-\[4rem]`, subtle top border `border-slate-800`.

\- Grid layout: Logic Craft IT + tagline, navigation columns.

\- \*\*"System Operational" status indicator\*\* with a pulsing Cyan dot and monospace label.



\---



\## Technical Requirements (NEVER CHANGE)



\- \*\*Stack:\*\* React 19, Tailwind CSS v3.4.17, GSAP 3 (with ScrollTrigger plugin), Lucide React for icons.

\- \*\*Fonts:\*\* Load Space Grotesk, Inter, and JetBrains Mono via Google Fonts `<link>` tags in `index.html`.

\- \*\*Images:\*\* Use real Unsplash URLs matching the dark tech/navy mood. Never use placeholder URLs.

\- \*\*File structure:\*\* Single `App.jsx` with components defined in the same file (or split into `components/` if >600 lines). Single `index.css` for Tailwind directives + noise overlay.

\- \*\*No placeholders.\*\* Every card, every label, every code snippet, and every animation must be fully implemented and functional.

\- \*\*Responsive:\*\* Mobile-first. Stack cards vertically on mobile. Reduce hero font sizes. 



\## Execution

Scaffold the project (`npm create vite@latest`), install dependencies, and write all files immediately to create the complete Logic Craft IT digital experience.

