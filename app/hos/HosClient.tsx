"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { cases as entries } from "@/data/demo";
import { hosNotePreview } from "@/lib/hos";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import { TransitionLink } from "@/components/ui/TransitionLink";

function siteUrl(value: string) {
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    return ["https:", "http:"].includes(url.protocol) ? url : null;
  } catch { return null; }
}

function CaseNotes({ content, hasComparison, onImageOpen }: { content: string; hasComparison: boolean; onImageOpen: (src: string, alt: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const preview = hosNotePreview(content);
  if (!preview.collapsed && !(hasComparison && preview.image)) return <BlogMarkdown content={content} onImageOpen={onImageOpen} />;
  return <>
    {!expanded && preview.text && <p className="hos-note-preview">{preview.text}</p>}
    {!expanded && !hasComparison && preview.image && <BlogMarkdown content={preview.image} onImageOpen={onImageOpen} />}
    <details className="hos-note-details" onToggle={event => setExpanded(event.currentTarget.open)}>
      <summary>{expanded ? "show less" : "show more"}<Icon icon="mdi:chevron-down" width={15} /></summary>
      <BlogMarkdown content={content} onImageOpen={onImageOpen} />
    </details>
  </>;
}

export function HosClient() {

  const [image, setImage] = useState({ src: "", alt: "" });
  const dialog = useRef<HTMLDialogElement>(null);
  const initialAnchorApplied = useRef(false);

  useEffect(() => {
    if (!entries.length || initialAnchorApplied.current) return;
    initialAnchorApplied.current = true;
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: "start" });
  }, [entries]);

  function enlarge(src: string, alt: string) {
    setImage({ src, alt });
    dialog.current?.showModal();
  }

  return <main className="hos-page">
    <div className="hos-shell">
      <TransitionLink href="/" className="hos-back"><Icon icon="mdi:arrow-left" width={16} /> back home</TransitionLink>
      <header className="hos-heading">
        <h1>Hall of Shame</h1>
      </header>

      <section aria-label="Case archive">
        <div className="hos-archive-bar">
          <span className="hos-count">{`${entries.length} case${entries.length === 1 ? "" : "s"}`}</span>
        </div>
        {entries.map(entry => {
            const url = siteUrl(entry.url);
            return <article className="hos-case" key={entry.id} id={`case-${entry.id}`} data-status={entry.status}>
              <header className="hos-case-heading">
                <h2>{url ? <a href={url.href} target="_blank" rel="noopener noreferrer">{url.hostname}<Icon icon="mdi:open-in-new" width={14} /></a> : entry.url}</h2>
                <time dateTime={entry.detected}>{entry.detected}</time>
                {["removed", "resolved"].includes(entry.status) && <span className="hos-status">{entry.status}</span>}
              </header>
              {entry.notes && <div className="hos-notes"><CaseNotes content={entry.notes} hasComparison={Boolean(entry.screenshot || entry.originalScreenshot)} onImageOpen={enlarge} /></div>}
              {(entry.originalScreenshot || entry.screenshot) && <section className={`hos-comparison${entry.originalScreenshot && entry.screenshot ? "" : " hos-comparison--single"}`} aria-label="Evidence comparison">
                {[{ src: entry.originalScreenshot, label: "Original · akryst.moe" }, { src: entry.screenshot, label: `Recorded site · ${url?.hostname ?? entry.url}` }].filter(item => item.src).map(item => <figure key={item.label}>
                  {entry.originalScreenshot && entry.screenshot && <figcaption>{item.label}</figcaption>}
                  <button type="button" onClick={() => enlarge(item.src, item.label)} aria-label={`Enlarge ${item.label}`}>
                    <img src={item.src} alt={item.label} loading="lazy" decoding="async" />
                  </button>
                </figure>)}
              </section>}
            </article>;
          })}
      </section>
      <footer className="hos-footer">akryst.moe · inspired by <a href="https://schuh.wtf" target="_blank" rel="noopener noreferrer">schuh ᶻ 𝘇 𐰁</a></footer>
    </div>
    <dialog className="hos-lightbox" ref={dialog} aria-label="Enlarged case evidence" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <button className="hos-lightbox-close" type="button" onClick={() => dialog.current?.close()} aria-label="Close image"><Icon icon="mdi:close" width={24} /></button>
      {image.src && <figure><img src={image.src} alt={image.alt} /><figcaption>{image.alt || "Case evidence"} · Escape to close <a href={image.src} target="_blank" rel="noopener noreferrer">Open full image <Icon icon="mdi:open-in-new" /></a></figcaption></figure>}
    </dialog>
  </main>;
}
