"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { usePageTransition } from "@/components/ui/PageTransition";

export function NotFoundClient() {
  const [visible, setVisible] = useState(true);
  const { navigateTo } = usePageTransition();

  useEffect(() => {
    const id = setInterval(() => setVisible((v) => !v), 600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const go = () => navigateTo("/");
    window.addEventListener("keydown", go);
    window.addEventListener("pointerdown", go);
    return () => {
      window.removeEventListener("keydown", go);
      window.removeEventListener("pointerdown", go);
    };
  }, [navigateTo]);

  return (
    <div className="nf-root">
      <div className="nf-overlay" aria-hidden />
      <div className="nf-scanlines" aria-hidden />
      <div className="nf-content">
        <m.p
          className="nf-code"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          ERROR · 404
        </m.p>
        <m.h1
          className="nf-title"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          GAME
          <br />
          OVER
        </m.h1>
        <m.p
          className="nf-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          this page doesn&apos;t exist
        </m.p>
        <m.p
          className="nf-prompt"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 0.5 : 0 }}
          transition={{ duration: 0.15 }}
          style={{ marginTop: 48 }}
        >
          press any key to return
        </m.p>
      </div>
    </div>
  );
}
