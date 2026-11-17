"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";

interface TransitionContextType {
  navigateTo: (href: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateTo: () => {},
  isTransitioning: false,
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const DURATION = 0.55;

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phase, setPhase] = useState<"idle" | "cover" | "reveal">("idle");


  const navigateTo = useCallback(
    (href: string) => {
      if (isTransitioning) return;

      setIsTransitioning(true);
      setPhase("cover");

      setTimeout(() => {
        router.push(href);

        setTimeout(() => {
          setPhase("reveal");

          setTimeout(() => {
            setPhase("idle");
            setIsTransitioning(false);
          }, (DURATION + 0.1) * 1000);
        }, 250);
      }, DURATION * 1000 + 50);
    },
    [router, isTransitioning]
  );

  return (
    <LazyMotion features={domAnimation}>
    <TransitionContext.Provider value={{ navigateTo, isTransitioning }}>
      {children}

      <AnimatePresence>
        {phase !== "idle" && (
          <>
            {/* Diagonal sweep panel — crosses left → right */}
            <m.div
              className="fixed z-[9998] bg-[#19191e]"
              style={{
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                skewX: "-15deg",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: phase === "cover" ? "0%" : "100%" }}
              transition={{ duration: DURATION, ease: EASE }}
            />

            {/* Logo en el centro, aparece cuando las cortinas se encuentran */}
            <m.div
              className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: phase === "cover" ? 1 : 0,
                scale: phase === "cover" ? 1 : 0.9,
              }}
              transition={{
                duration: 0.25,
                delay: phase === "cover" ? DURATION * 0.6 : 0,
              }}
            >
              <span className="font-display text-5xl text-white">akryst</span>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
    </LazyMotion>
  );
}
