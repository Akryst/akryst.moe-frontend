"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { usePageTransition } from "@/components/ui/PageTransition";
import { useReducedPerformance } from "@/hooks/useReducedPerformance";
import { AboutPanel, GuestbookPanel } from "@/components/sections/ScrollSections";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { SettingsPanel } from "@/components/ui/BackgroundSettings";

import { homeMessage } from "@/data/demo";

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
const NAME = "akryst";

function GlitchName({ reduced }: { reduced: boolean }) {
  const [display, setDisplay] = useState(NAME.split(""));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runGlitch = useCallback(() => {
    const iterations = 4;
    let count = 0;

    const tick = () => {
      const indices = Array.from({ length: Math.floor(Math.random() * 3) + 2 }, () =>
        Math.floor(Math.random() * NAME.length)
      );
      setDisplay(NAME.split("").map((ch, i) =>
        indices.includes(i)
          ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          : ch
      ));
      count++;
      if (count < iterations) {
        timerRef.current = setTimeout(tick, 120);
      } else {
        setDisplay(NAME.split(""));
        timerRef.current = setTimeout(runGlitch, 3000 + Math.random() * 2000);
      }
    };

    timerRef.current = setTimeout(tick, 60);
  }, []);

  useEffect(() => {
    if (reduced) { setDisplay(NAME.split("")); return; }
    timerRef.current = setTimeout(runGlitch, 3000 + Math.random() * 2000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [runGlitch, reduced]);

  return (
    <div className="hero-name-glitch">
      {display.map((ch, i) => (
        <span
          key={i}
          className={ch !== NAME[i] ? "glitch-char--active" : ""}
        >
          {ch}
        </span>
      ))}
    </div>
  );
}

const MENU_ITEMS = [
  { label: "About Me", view: "about", href: "#about" },
  { label: "Portfolio", view: null, href: "/portfolio" },
  { label: "Blog", view: null, href: "/blog" },
  { label: "Guestbook", view: "guestbook", href: "#guestbook" },
  { label: "Settings", view: "settings", href: "#settings" },
] as const;

const MENU_COLORS = [
  "rgba(255, 255, 255, 0.6)",
  "rgba(59, 130, 246, 0.7)",
  "rgba(236, 72, 153, 0.6)",
  "rgba(168, 85, 247, 0.6)",
  "rgba(34, 197, 94, 0.6)",
];

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const { navigateTo } = usePageTransition();
  const isLowPerf = useReducedPerformance();
  const [view, setView] = useState<"menu" | "about" | "guestbook" | "settings">("menu");
  const panelRef = useRef<HTMLElement>(null);
  const lastPanelIndex = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const topleftRef = useRef<HTMLDivElement>(null);
  const menuRef    = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;
  const inViewRef = useRef(false);

  useEffect(() => {
    if (isLowPerf || view !== "menu") return;
    const STIFFNESS = 0.07;
    const DAMPING   = 0.78;
    const layers = [
      { ref: topleftRef, max: 20 },
      { ref: menuRef,    max: 9  },
    ];
    const states = layers.map(() => ({ cx: 0, cy: 0, vx: 0, vy: 0 }));
    let targetX = 0, targetY = 0;
    let rafId: number;
    let running = true;

    const onMove = (e: MouseEvent) => {
      targetX = -((e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2));
      targetY = -((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2));
    };
    const onLeave = () => { targetX = 0; targetY = 0; };

    const tick = () => {
      if (!running) return;
      layers.forEach(({ ref, max }, i) => {
        const s = states[i];
        const tx = targetX * max;
        const ty = targetY * max;
        s.vx = s.vx * DAMPING + (tx - s.cx) * STIFFNESS;
        s.vy = s.vy * DAMPING + (ty - s.cy) * STIFFNESS;
        s.cx += s.vx;
        s.cy += s.vy;
        if (ref.current) {
          ref.current.style.transform = `translate(${s.cx.toFixed(2)}px, ${s.cy.toFixed(2)}px)`;
        }
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [isLowPerf, view]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { inViewRef.current = entry.isIntersecting; },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMenuKeyDown = (e: KeyboardEvent) => {
      if (!inViewRef.current || isEditableTarget(e.target)) return;
      if (view !== "menu") {
        if (e.key === "Escape") { e.preventDefault(); setView("menu"); }
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const controls = Array.from(menuRef.current?.querySelectorAll<HTMLElement>("button, a") ?? []);
        const focusedIndex = controls.indexOf(document.activeElement as HTMLElement);
        const current = focusedIndex >= 0 ? focusedIndex : activeIndexRef.current;
        const next = e.key === "ArrowDown" ? (current + 1) % MENU_ITEMS.length : (current <= 0 ? MENU_ITEMS.length - 1 : current - 1);
        setActiveIndex(next);

        menuRef.current?.querySelectorAll<HTMLElement>("button, a")[next]?.focus();
      } else if (e.key === "Enter" && activeIndexRef.current >= 0 && !(e.target instanceof HTMLElement && e.target.closest("button, a"))) {
        e.preventDefault();
        const index = activeIndexRef.current;
        const item = MENU_ITEMS[index];
        if (item.view) { lastPanelIndex.current = index; setView(item.view); }
        else navigateTo(item.href);
      }
    };
    window.addEventListener("keydown", handleMenuKeyDown);
    return () => window.removeEventListener("keydown", handleMenuKeyDown);
  }, [view, navigateTo]);


  return (
    <section id="home" ref={sectionRef} className={`hero-section home-screen${view !== "menu" ? " home-screen--panel" : ""}`}>

      {view === "menu" ? (
        <m.div
          key="hero-topleft-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div ref={topleftRef} className="hero-topleft">
            <GlitchName reduced={isLowPerf} />
            <m.p
              className="hero-tagline"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              avatar editor · unity · vr
            </m.p>
          </div>
        </m.div>
      ) : (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="hero-topleft">
            <GlitchName reduced={isLowPerf} />
            <p className="hero-tagline">avatar editor · unity · vr</p>
          </div>
        </m.div>
      )}

      <AnimatePresence mode="wait" initial={true}>
      {view === "menu" ? (
      <m.div key="menu" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: isLowPerf ? 0 : 0.22 }} className="hero-menu-stage" onAnimationComplete={() => {
        if (view === "menu") menuRef.current?.querySelectorAll<HTMLElement>("button, a")[lastPanelIndex.current]?.focus({ preventScroll: true });
      }}>
      <nav ref={menuRef} className="hero-menu" aria-label="Main navigation">
        <m.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.35, delay: 0.4 }}
          style={{ originX: 0 }}
          className="hero-menu-rule"
        />

        {MENU_ITEMS.map((item, i) => {
          const isActive = activeIndex === i;
          const inner = (
            <m.div
              id={`hero-menu-item-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.45 + i * 0.06 }}
              onMouseEnter={() => { setActiveIndex(i);  }}
              onMouseLeave={() => setActiveIndex(-1)}
              onFocus={() => setActiveIndex(i)}
              className={`hero-menu-item${isActive ? " hero-menu-item--active" : ""}`}
            >
              <AnimatePresence>
                {isActive && (
                  <m.span
                    key="bar"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0 }}
                    transition={{ duration: 0.12 }}
                    className="hero-menu-bar"
                    style={{ background: MENU_COLORS[i] }}
                  />
                )}
              </AnimatePresence>
              <span className={`hero-menu-label${isActive ? " hero-menu-label--active" : ""}`}>
                {item.label}
              </span>
              <m.span
                animate={{ x: isActive ? 0 : -8, opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.12 }}
                className="hero-menu-arrow"
              >
                ▶
              </m.span>
            </m.div>
          );

          if (item.view) {
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => { lastPanelIndex.current = i; setView(item.view); }}
                aria-controls="hero-content-panel"
                aria-expanded={false}
                className="hero-menu-item-btn"
              >
                {inner}
              </button>
            );
          }
          return (
            <TransitionLink key={item.href} href={item.href} >
              {inner}
            </TransitionLink>
          );
        })}

        <m.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.35, delay: 0.8 }}
          style={{ originX: 0 }}
          className="hero-menu-rule"
        />
      </nav>
      <p className="hero-menu-hint">choose somewhere to stay a while.</p>
      </m.div>
      ) : (
        <m.section
          key={view}
          id="hero-content-panel"
          ref={panelRef}
          className="hero-content-panel"
          tabIndex={-1}
          aria-labelledby="hero-panel-title"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: isLowPerf ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => panelRef.current?.focus({ preventScroll: true })}
        >
          <div className="hero-panel-header">
            <button className="panel-back" onClick={() => { setView("menu"); }} aria-label="Back to main menu">← <span>menu</span></button>
            <h1 id="hero-panel-title">{view === "about" ? "about me" : view}</h1>
          </div>
          {view === "about" ? <AboutPanel /> : view === "guestbook" ? <GuestbookPanel /> : <SettingsPanel />}
        </m.section>
      )}
      </AnimatePresence>

      {(
        <m.div
          className="hero-counter-fixed"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
        >
          {homeMessage && <m.div
            className="hero-notice"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
          >
            MESSAGE: {homeMessage}
          </m.div>}
          <div className="hero-counter-row">
            <span className="hero-counter-badge">frontend demo</span>
            <span className="hero-counter-sep">/</span>
            <span className="hero-counter-version">v2.5</span>
          </div>
        </m.div>
      )}

    </section>
  );
}
