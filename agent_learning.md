# Agent Learning & Architecture Knowledge: Logic Craft IT Platform

This document captures technical patterns, architectural decisions, hardware permission rules, and deployment learnings for the **Logic Craft IT** web platform and its integrated application suite.

---

## 1. Hardware Permission Requirements for Embedded Web Apps
* **Context**: When embedding real-time voice applications (like Vaacha AI Voice Translator) inside an iframe container (`/vaacha`), modern web browsers (Chrome, Safari, Edge) block hardware access by default.
* **Pattern**: Always pass explicit permission directives to the `<iframe>` tag:
  ```jsx
  <iframe
    src="https://ai-translator-woad-three.vercel.app/"
    allow="microphone; autoplay; clipboard-write; encrypted-media; camera; display-capture;"
    sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"
  />
  ```
* **Outcome**: Guarantees real-time Web Audio API and WebSockets speech recognition work without throwing browser permission exceptions.

---

## 2. Zero-Cost Domain Auto-Sync Architecture
* **Context**: Serving sub-applications (like Vaacha) under your primary brand domain (`https://www.logiccraftit.com/vaacha`) without purchasing additional domains or setting up complex DNS proxies.
* **Pattern**: Build a React Router route `/vaacha` hosting a branded wrapper page around the Vercel production URL (`https://ai-translator-woad-three.vercel.app/`).
* **Benefit**:
  1. Every new deployment pushed to Vercel instantly updates on `logiccraftit.com/vaacha` automatically.
  2. Sub-applications retain the parent brand domain in the browser address bar.
  3. Fulfills Apple App Store & Google Play Console requirements for App URLs and Privacy URLs (`https://www.logiccraftit.com/privacy`).

---

## 3. Legal & App Store Compliance Patterns
* **Multi-Product Privacy Policy**: Maintain a centralized Master Privacy Policy at `/privacy` covering both AI Voice Translators (ephemeral audio streams, zero public AI model training retention) and enterprise software systems (OTP authentication, multi-currency billing in INR/USD/CAD/GBP/EUR/AUD, Supabase encrypted databases, Stripe/Razorpay gateways).
* **Account & Data Deletion Standard**: Google Play Console & Apple App Store policies require explicit account deletion instructions within the Privacy Policy. Include a dedicated highlight box specifying contact methods (`logiccraftit@gmail.com`), subject line (`Account Deletion Request`), purged data scope (credentials, history, bookmarks), and SLA turnaround time (e.g. 7 business days).
* **Navigation Index**: Implement a sticky sidebar with smooth section jumping to ensure high usability and instant auditing during app store reviews.

---

## 4. Windows PowerShell Build & Command Rules
* **Execution Policy**: On Windows PowerShell systems where `npm.ps1` script execution is restricted, invoke build and git commands via `cmd.exe /c "npm run build"` or `cmd.exe /c "git status"`.
* **Git Commit Escaping**: Avoid unescaped ampersands (`&`) in PowerShell git commit messages. Use clean, plain-text commit strings.
