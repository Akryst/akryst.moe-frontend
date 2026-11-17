"use client";

import { useState, useEffect } from "react";

let cachedIsLowPerf: boolean | null = null;

function detectLowPerf(): boolean {
  if (cachedIsLowPerf !== null) return cachedIsLowPerf;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let isSoftwareRenderer = false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas.getContext(
        "experimental-webgl"
      ) as WebGLRenderingContext | null);

    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const renderer = gl.getParameter(
          debugInfo.UNMASKED_RENDERER_WEBGL
        ) as string;
        isSoftwareRenderer = /swiftshader|llvmpipe|software|microsoft basic/i.test(
          renderer
        );
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    } else isSoftwareRenderer = true;
  } catch {
    isSoftwareRenderer = true;
  }

  cachedIsLowPerf = prefersReduced || isSoftwareRenderer;
  return cachedIsLowPerf;
}

export function useReducedPerformance(): boolean {
  const [isLowPerf, setIsLowPerf] = useState(false);

  useEffect(() => {
    setIsLowPerf(detectLowPerf());
  }, []);

  return isLowPerf;
}
