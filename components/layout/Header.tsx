"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/ui/TransitionLink";

const NAV_LINKS = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog",      label: "Blog" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [headerVisible, setHeaderVisible] = useState(!isHome);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHome) setHeaderVisible(true);
  }, [isHome]);

  useEffect(() => {
    const onScroll = () => {
      if (isHome && window.scrollY < window.innerHeight) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className="header-pill-wrap"
        style={{
          transform: headerVisible ? "translateY(0)" : "translateY(-140%)",
          transition: "transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <m.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="header-pill"
        >
          <TransitionLink href="/" className="header-home-btn" aria-label="Home">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </TransitionLink>

          <nav className="header-pill-nav" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <TransitionLink
                key={link.href}
                href={link.href}
                className={`header-nav-text${pathname.startsWith(link.href) ? " header-nav-text--active" : ""}`}
              >
                {link.label}
              </TransitionLink>
            ))}
          </nav>

          <button
            className="header-burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={`burger-line${menuOpen ? " burger-line--open-top" : ""}`} />
            <span className={`burger-line${menuOpen ? " burger-line--open-mid" : ""}`} />
            <span className={`burger-line${menuOpen ? " burger-line--open-bot" : ""}`} />
          </button>
        </m.div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mobile-menu"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link, i) => (
              <m.div
                key={link.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <TransitionLink
                  href={link.href}
                  className={`mobile-menu-link${pathname.startsWith(link.href) ? " mobile-menu-link--active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </TransitionLink>
              </m.div>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
