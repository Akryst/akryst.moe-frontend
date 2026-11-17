"use client";

import { ReactNode } from "react";
import { usePageTransition } from "@/components/ui/PageTransition";

interface TransitionLinkProps {
  href: string;
  children?: ReactNode;
  className?: string;
  "aria-label"?: string;
  onClick?: () => void;
}

export function TransitionLink({ href, children, className, onClick, ...props }: TransitionLinkProps) {
  const { navigateTo, isTransitioning } = usePageTransition();

  const handleClick = (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onClick?.();
    if (!isTransitioning) {
      navigateTo(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
