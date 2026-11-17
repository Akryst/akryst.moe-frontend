"use client";

import { m, AnimatePresence } from "framer-motion";
import { useReducedPerformance } from "@/hooks/useReducedPerformance";
import { useState } from "react";

export function SplashScreen({ onEnter }: { onEnter: () => void }) {
  const [visible, setVisible] = useState(true);
  const reduced = useReducedPerformance();
  return <AnimatePresence onExitComplete={onEnter}>
    {visible && <m.button type="button" className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-5 bg-black text-white" onClick={() => setVisible(false)} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.6 }} aria-label="Enter the site">
      <span className="font-display text-6xl tracking-tight">akryst</span>
      <span className="font-mono text-xs tracking-widest">click / tap to continue</span>
    </m.button>}
  </AnimatePresence>;
}
