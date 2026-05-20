# Patrick Wang — Portfolio Build Guide
# Paste these into Cursor one at a time. Run `npm run dev` after each.

---

## PROMPT 1 — Project Setup

```
Create a Next.js 14 App Router project with TypeScript and Tailwind CSS.

Install these exact packages:
  @splinetool/react-spline
  @splinetool/runtime
  gsap
  @gsap/react
  framer-motion
  lenis
  clsx

In tailwind.config.ts, add these custom values:
  colors:
    bg: "#0a0b0f"
    ink: "#f2efe4"
    dim: "rgba(242,239,228,0.5)"
    accent: "#ff5b1f"
  fontFamily:
    display: ["Instrument Serif", "Georgia", "serif"]
    mono: ["JetBrains Mono", "ui-monospace", "monospace"]

In app/layout.tsx:
  - Load "Instrument Serif" (ital 0;1, wt 400) and "JetBrains Mono" (wt 300 400 500)
    via next/font/google
  - Set <body> bg-bg text-ink cursor-none overflow-x-hidden
  - Add a fixed grain overlay: a <div> with a repeating SVG noise texture,
    opacity-5, mix-blend-mode overlay, pointer-events-none, z-[9999]
  - Add <SmoothScroll> and <Cursor> as children (create stubs for now)

Create this file structure:
  app/
    layout.tsx
    page.tsx
    projects/page.tsx
    about/page.tsx
  components/
    Hero.tsx
    Nav.tsx
    Cursor.tsx
    SmoothScroll.tsx
    SplineScene.tsx
    SectionReveal.tsx
    Marquee.tsx
    ProjectCard.tsx
    Footer.tsx
  lib/
    fonts.ts
    utils.ts
```

---

## PROMPT 2 — Smooth Scroll + Lenis

```
In components/SmoothScroll.tsx:

Create a client component that initializes Lenis smooth scroll with:
  - duration: 1.2
  - easing: (t) => 1 - Math.pow(1 - t, 3)
  - orientation: "vertical"
  - smoothWheel: true

Wire it to GSAP ScrollTrigger using:
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

Export a <SmoothScroll> wrapper component that provides lenis via context.
Also export a useLenis() hook that returns the lenis instance.

This component wraps {children} and renders nothing of its own visually.
```

---

## PROMPT 3 — Custom Cursor

```
In components/Cursor.tsx:

Create a custom cursor with two elements:
  1. A 6px solid circle in color #ff5b1f — this tracks the mouse exactly
     with zero delay (transform updated directly on mousemove)
  2. A 28px ring (border 1px solid #f2efe4) that follows with lerp factor 0.12,
     updated in a requestAnimationFrame loop

Behavior:
  - On hover over any element with [data-cursor="view"], the ring grows to 
    56px and shows the text "VIEW" centered inside in JetBrains Mono 9px
  - On hover over any [data-cursor="drag"], ring grows to 56px and shows "DRAG"
  - On hover over any [data-cursor="link"], ring grows to 44px
  - On mousedown, the dot scales to 0.5, ring scales to 0.85
  - When cursor leaves window, both elements fade to opacity 0

Use mix-blend-mode: difference on the ring only.

On touch devices (window.matchMedia("(hover: none)")), render null entirely.
Set cursor: none on the body in globals.css.
```

---

## PROMPT 4 — Spline Hero Section

IMPORTANT CONTEXT: The Spline scene is a robot arm that tracks and reacts 
to the user's mouse position in real time. This means:
  - The Spline canvas MUST receive real mouse events — never block it with overlays
  - All text overlays must have pointer-events: none
  - The scene should be position: fixed so mouse coords are relative to 
    the full viewport, not a clipped container
  - Text lives on the LEFT side only so the arm has visual room to move

```
In components/SplineScene.tsx:

Create a client component that lazy-loads the Spline scene.
Import Spline from '@splinetool/react-spline/next'
Scene URL: "https://prod.spline.design/FHGgmCVy4XQ0m51o/scene.splinecode"

- The Spline component must be position: fixed, inset: 0, width: 100vw, 
  height: 100vh, z-index: 0
- This ensures mouse events are always relative to the full window so the 
  arm tracks correctly regardless of scroll position
- Wrap in React Suspense with a fallback loader:
    A full-screen #0a0b0f div with a percentage counter counting 0-100 
    over 2s (setInterval), Instrument Serif italic 120px #ff5b1f centered.
- Once loaded, fade scene in: opacity 0 → 1 over 0.8s
- DO NOT put any div on top of the Spline canvas. No wrappers with 
  pointer-events that could intercept mouse movement.
- Export a second component <SplinePlaceholder /> that holds the scroll 
  height: a div with height: 100svh and pointer-events: none, position: relative,
  z-index: 1. This is what sits in the DOM flow while the scene is fixed.

In components/Hero.tsx:

Build a full-viewport hero. Structure:
  <section> (position: relative, height: 100svh, z-index: 1, pointer-events: none)
    <SplineScene />       ← fixed background, receives all mouse events
    <SplinePlaceholder /> ← holds scroll height in DOM flow
    <div> overlay         ← pointer-events: none, all text lives here

OVERLAY LAYOUT (position: fixed, inset: 0, z-index: 10, pointer-events: none):
  All children also pointer-events: none EXCEPT <Nav />

  Top left (position: fixed, top: 28px, left: 28px):
    • Flex row, gap: 12px, items-center
    • 8px square bg-accent, animation: blink 1.6s steps(2) infinite
    • "PW / IOE · MICHIGAN" JetBrains Mono 11px tracking-[0.2em] uppercase text-dim

  Top right (position: fixed, top: 28px, right: 28px):
    • <Nav /> — pointer-events: auto (the only clickable overlay element)

  Bottom left (position: fixed, bottom: 28px, left: 28px, max-width: 520px):
    • "/ INTERACTIVE PORTFOLIO" mono 10px text-accent uppercase tracking-[0.3em] mb-4
    • H1: Instrument Serif, clamp(44px, 7vw, 108px), line-height 0.92, 
      letter-spacing -0.03em
        Line 1: "Industrial &"
        Line 2: "Operations" (italic)  
        Line 3: "Engineer." 
      The word "Operations" wraps in <em> styled italic #ff5b1f
    • Thin horizontal rule: width 180px, height 1px, bg rgba(242,239,228,0.2), mt-8

  Bottom right (position: fixed, bottom: 28px, right: 28px):
    • "MOVE CURSOR →" mono 9px text-dim tracking-[0.3em] uppercase
    • The → pulses in text-accent, subtle left-right translation 4px, 2s loop
    • Below it on a new line: "ARM #5621554481" mono 8px opacity-30 tracking-[0.2em]
      (references the robot arm — spec sheet aesthetic, very igloo.inc)

⚠️  IMPORTANT — BEFORE RUNNING THIS PROMPT:
Patrick must open the Spline scene editor and DELETE the baked-in text objects:
"AUTOMATION MACHINES", "ROBOTIC ARM #5621554481", "INTELLIGENT MOTION",
"FOLLOWING MOVEMENT", "CHANGE YOUR IDEAS WHAT ROBOTS CAN DO"
These will conflict with the overlay. In Spline: click each text in the scene 
outliner → Backspace/Delete. The scene URL auto-updates on save.

GSAP entrance animation (useEffect, runs once after Spline loads):
  Use a ref on the overlay div. Target all direct text children.
  gsap.fromTo(targets, 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 1.2 }
  )
  
  For the H1: wrap each word (not char — words look better at large size) in 
  a span with overflow: hidden, then animate the inner span from 
  y: "110%" to y: "0%", stagger 0.1s, duration 0.8s, ease: "power4.out", delay: 1.0

On mobile (max-width: 768px): 
  H1 font-size clamp(32px, 9vw, 56px)
  Hide bottom-right hint
  Bottom-left padding: 20px
```

---

## PROMPT 5 — Nav

```
In components/Nav.tsx:

A horizontal nav bar of 4 links.
Items: [{ label: "INDEX", href: "/" }, { label: "WORK", href: "/projects" }, 
        { label: "ABOUT", href: "/about" }, { label: "CONTACT", href: "#contact" }]

Style:
  - JetBrains Mono, 11px, letter-spacing 0.2em, uppercase, text-dim
  - Each link: relative, overflow-hidden
  - On hover: the text slides up out of view (translateY -100%) while a 
    duplicate below slides up into view (translateY 0). This is the 
    "text slot machine" hover effect. Use CSS clip + transform.
  - Add a small orange square before the active/hovered item
  - pointer-events-auto, gap-8 between items

Use Next.js <Link> for each item.
Add data-cursor="link" to each link.
```

---

## PROMPT 6 — Section Reveal Component

```
In components/SectionReveal.tsx:

A client component for scroll-triggered content sections.

Props:
  index: string        // e.g. "/ 01"
  eyebrow: string      // e.g. "ABOUT"
  headline: string     // main display heading
  body: string         // paragraph text
  align?: "left"|"right"  // default "left"
  accentWord?: string  // a word in the headline to make italic orange

Behavior:
  - Uses GSAP ScrollTrigger: trigger is the section element
  - On enter: 
    1. The eyebrow/index fade in (opacity 0→1, y 8px→0, duration 0.6s)
    2. The headline characters reveal via clipPath from bottom 
       (each char wrapped in a span with overflow-hidden parent)
       stagger 0.025s, duration 0.65s, ease "power4.out"
    3. Body text fades in with slight blur: filter blur(4px)→blur(0), 
       opacity 0→1, duration 0.8s, delay 0.3s

Layout:
  - Section: min-height 60vh, display flex, align-items center, px-7 md:px-16
  - Max width 900px
  - Index: mono 10px tracking-[0.3em] text-accent uppercase, mb-3
  - Eyebrow: mono 10px text-dim uppercase tracking-widest, mb-4
  - Headline: Instrument Serif, font-size clamp(42px, 6vw, 96px), 
    line-height 0.95, letter-spacing -0.025em, mb-8
  - Body: Instrument Serif italic 20px text-dim line-height 1.6, max-width 600px

accentWord: wrap any occurrence of this word in <em> with color #ff5b1f font-style italic.
```

---

## PROMPT 7 — Projects Grid

```
In components/ProjectCard.tsx:

A card component for a project. Props:
  index: string     // "001", "002", etc.
  title: string
  tags: string[]    // e.g. ["IOE", "Engineering"]
  status: "live"|"wip"|"soon"
  href?: string

Style (the "reserved slot" look while projects are empty):
  - Border: 1px solid rgba(242,239,228,0.12)
  - Background: transparent
  - On hover: border-color transitions to #ff5b1f, translateX(6px)
  - Padding: 28px 32px
  - Index: mono 10px text-accent tracking-widest, mb-3
  - Title: Instrument Serif 28px, mb-2
  - Tags: flex row gap-2, each tag is mono 9px text-dim uppercase 
    border border-dim/20 px-2 py-1
  - Status badge: "WIP" / "SOON" in mono 9px, orange for wip, dim for soon
  - Add data-cursor="view" to the card

Create a projects section in app/page.tsx with a grid of 3 cards:
  { index: "001", title: "Project Reserved", tags: ["IOE", "Systems"], status: "soon" }
  { index: "002", title: "Project Reserved", tags: ["Entrepreneurship"], status: "soon" }
  { index: "003", title: "Project Reserved", tags: ["Build", "Ship"], status: "soon" }

Section heading above the grid:
  "/ 02 — WORK" in mono 10px accent
  "Projects." in Instrument Serif 72px
  A horizontal rule 1px opacity-10 below it

Grid: CSS grid, 1 col mobile, 2 col md, 3 col lg, gap-4
```

---

## PROMPT 8 — Marquee Strip

```
In components/Marquee.tsx:

A horizontally auto-scrolling strip.
Content (repeat 4x): "IOE · ENTREPRENEURSHIP · MICHIGAN · BUILDING · AVAILABLE TO COLLABORATE · "
Font: JetBrains Mono 11px tracking-[0.2em] uppercase text-dim
Speed: 40 seconds per full cycle

Implementation:
  - Two copies of the text side by side
  - CSS animation: translateX(0) → translateX(-50%), linear, infinite, 40s
  - Pause on hover (animation-play-state: paused)
  - Border-top and border-bottom: 1px solid rgba(242,239,228,0.08)
  - Height: 44px, overflow-hidden

Place this strip between the hero and the About section in app/page.tsx.
```

---

## PROMPT 9 — Contact + Footer

```
In components/Footer.tsx:

A contact section + footer combined. id="contact"

Top half — contact section (min-height 60vh, flex items-center):
  Left side:
    - "/ 04 — CONTACT" mono label
    - Giant "Let's talk." in Instrument Serif, clamp(64px, 10vw, 140px), 
      italic on "talk"
    - Below: Instrument Serif italic 18px text-dim:
      "Cold notes, collabs, interesting problems — all welcome."
  Right side (flex col gap-4):
    - LinkedIn button: border 1px ink, px-6 py-4, mono 11px uppercase tracking-wider
      href="https://linkedin.com/in/YOUR_LINKEDIN" target="_blank"
      Add the LinkedIn SVG icon (24x24). Hover: bg-accent, border-accent.
      Add data-cursor="link" and class="magnetic"
    - Email button: same style
      href="mailto:YOUR_EMAIL"
      Add data-cursor="link" and class="magnetic"

Bottom bar (border-top 1px opacity-10, py-6 px-7 md:px-16):
  Left: "© 2025 Patrick Wang" mono 10px text-dim
  Right: "Built with Next.js + Spline" mono 10px text-dim

Replace YOUR_LINKEDIN and YOUR_EMAIL with placeholders Patrick fills in.
```

---

## PROMPT 10 — Magnetic Buttons + Polish

```
Add these final polish details:

1. MAGNETIC BUTTONS
In a useEffect in layout.tsx or a MagneticButton wrapper component:
  - For any element with class "magnetic", on mousemove within 80px of center:
    compute offset from element center, multiply by 0.35, apply as 
    translate via GSAP quickTo (duration 0.4, ease "power3.out")
  - On mouseleave: animate back to translate(0,0)

2. PAGE TRANSITIONS
Wrap app/layout.tsx children in Framer Motion AnimatePresence.
On route change, a full-screen #0a0b0f div slides:
  - Exit: y: 0 → y: -100%  (duration 0.6s, ease [0.76, 0, 0.24, 1])
  - Enter: y: 100% → y: 0  (duration 0.6s, same ease)
  - New page content fades in after transition: delay 0.5s

3. SCROLL PROGRESS LINE
A 2px horizontal line at very top of viewport (position fixed, z-50)
Background: linear-gradient(to right, #ff5b1f, #ff8a50)
Width: driven by scroll progress (0% to 100%)
Use useScroll from framer-motion OR a window scroll event listener.

4. "AVAILABLE" STATUS
In the top nav or hero top-left, add a blinking indicator:
  "AVAILABLE FOR PROJECTS" — JetBrains Mono 9px text-accent tracking-widest
  preceded by a 6px circle that pulses (scale 1 → 1.5 → 1, opacity 1 → 0 → 1, 2s loop)
```

---

## PROMPT 11 — Meta + SEO + Favicon

```
In app/layout.tsx, add full Next.js metadata:

export const metadata: Metadata = {
  title: { default: "Patrick Wang", template: "%s — Patrick Wang" },
  description: "Industrial & Operations Engineering + Entrepreneurship at University of Michigan. Building things worth building.",
  openGraph: {
    title: "Patrick Wang",
    description: "IOE + Entrepreneurship @ Michigan",
    url: "https://YOUR_DOMAIN.com",
    siteName: "Patrick Wang",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Patrick Wang",
    description: "IOE + Entrepreneurship @ Michigan",
  },
  robots: { index: true, follow: true },
}

Create a simple favicon: in app/icon.tsx, render a 32x32 canvas with 
a solid #ff5b1f square and white "PW" text in 12px monospace.
(Or use a simple SVG favicon in app/icon.svg)
```

---

## ORDER TO BUILD IN

1. Prompt 1 → get the project running: `npm run dev` → see blank page ✓
2. Prompt 2 (Lenis) → page scrolls smoothly ✓  
3. Prompt 4 (Hero + Spline) → most important thing on screen ✓
4. Prompt 3 (Cursor) → add polish ✓
5. Prompt 5 (Nav) → navigation works ✓
6. Prompt 6 (SectionReveal) → scroll animations ✓
7. Prompt 8 (Marquee) → strip between sections ✓
8. Prompt 7 (Projects) → fill the page ✓
9. Prompt 9 (Contact/Footer) → complete the page ✓
10. Prompt 10 (Polish) → make it memorable ✓
11. Prompt 11 (Meta) → prep for deployment ✓

## DEPLOYMENT

When done, push to GitHub and deploy on Vercel:
- `vercel --prod` or connect repo at vercel.com
- Add your domain in Vercel dashboard
- Environment: no env vars needed (Spline URL is public)
