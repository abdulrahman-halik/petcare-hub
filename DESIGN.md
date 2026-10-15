---
name: PetCare Hub
colors:
  primary: "#047857"
  primary-hover: "#065f46"
  primary-active: "#064e3b"
  secondary: "#065f46"
  accent: "#0d9488"
  neutral-light: "#f8fafc"
  neutral-dark: "#0f172a"
  surface: "#ffffff"
  error: "#ef4444"
  warning: "#f59e0b"
typography:
  fontFamily: Inter, sans-serif
  h1: { fontSize: "36px", fontWeight: 700, lineHeight: 1.2 }
  h2: { fontSize: "28px", fontWeight: 600, lineHeight: 1.3 }
  body: { fontSize: "16px", fontWeight: 400, lineHeight: 1.5 }
rounded:
  sm: "6px"
  md: "12px"
  lg: "16px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
---

# PetCare Hub Design System

## Overview
Warm, trustworthy, and modern pet wellness and e-commerce experience. Uses a solid light theme throughout with zero gradients for maximum readability, complemented by a rich darker emerald tone (`#047857`) for high-contrast standout buttons, interactive controls, and unified active/focus states.

## Colors & Themes
- **Layout & Surfaces (Solid Light):**
  - Body & Layout Shell: `#f8fafc` (`bg-slate-50`)
  - Cards & Sidebar: `#ffffff` (`bg-white`)
  - Accent / Hero / Banners: `#f0fdf4` (`bg-emerald-50`) with `#dcfce7` / `#e2e8f0` borders
  - Footer: `#f1f5f9` (`bg-slate-100`) with `#e2e8f0` borders
  - Gradients: STRICTLY FORBIDDEN per design refresh — all surfaces use solid tones.
- **Buttons (Standout Darker Tone):**
  - Primary Base: `#047857` (Emerald 700) with white text and crisp subtle shadow.
  - Primary Hover: `#065f46` (Emerald 800)
  - Primary Active: `#064e3b` (Emerald 900)
  - Focus Ring: `ring-2 ring-[#047857]/20`
  - Applied uniformly across the entire project, including the Login button in the Navbar.
- **Form Inputs & Interactive Fields:**
  - Background: `#f8fafc` (resting) / `#ffffff` (active/typing)
  - Default Border: `#e2e8f0` / `#cbd5e1`
  - Active & Focus States: Border transitions to `#047857` with `ring-2 ring-[#047857]/15`
  - Checkboxes & Radio: Accent color `#047857`
  - Links: `#047857` with `#065f46` on hover

## Typography
- Primary family: Inter / system sans-serif.
- Headings: Deep contrast `#0f172a` (Slate 900).
- Body copy: Legible `#334155` / `#475569` (Slate 700/600).

## UX & Interaction Consistency
- All interactive controls across login, register, checkout, dashboard, and public pages must share identical focus, active, and button styling.
- Maintain existing authenticated and guest functional paths without breaking navigation.
