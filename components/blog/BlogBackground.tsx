"use client";

import { useReducedPerformance } from "@/hooks/useReducedPerformance";

export function BlogBackground() {
  const reduced = useReducedPerformance();
  return <div aria-hidden="true" className={`blog-background${reduced ? " blog-background--still" : ""}`} />;
}
