"use client";

import { m } from "framer-motion";

export function Footer() {
  return (
    <m.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="footer-wrap"
    >
      <div className="footer-inner">
        <p className="footer-text">
          © {new Date().getFullYear()} akryst. All rights reserved.
        </p>
      </div>
    </m.footer>
  );
}
