"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useReducedPerformance } from "@/hooks/useReducedPerformance";
import Image from "next/image";
import { Icon } from "@iconify/react";
import "./portfolio.css";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { projects } from "@/data/demo";
import { portfolioCategory, portfolioWebsiteUrl } from "@/lib/portfolioCategories";

interface Project {
  id: string;
  name: string;
  description: string;
  image: string;
  extraPhotos: string[];
  tags: string[];
  clientUrl?: string | null;
  clientLabel?: string | null;
  audio?: string | null;
  songName?: string | null;
}

const sections = [
  { id: "all", label: "All" },
  { id: "avatars", label: "Avatars" },
  { id: "web", label: "Web" },
] as const;

function coverName(id: string) {
  return "portfolio-cover-" + Array.from(id, (character) => character.codePointAt(0)?.toString(16)).join("-");
}

function ProjectEntry({ project }: { project: Project }) {
  const mode = portfolioCategory(project.tags);
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = [project.image, ...(project.extraPhotos ?? [])].filter(Boolean);
  const website = mode === "web" ? portfolioWebsiteUrl(project.clientUrl) : undefined;
  const current = photoIndex % Math.max(photos.length, 1);

  function stepPhoto(step: number) {
    setPhotoIndex((index) => (index + step + photos.length) % photos.length);
  }
  return (
    <article className="portfolio-workbench grid min-w-0 items-start gap-4">
      <div className="portfolio-frame relative mx-auto aspect-video w-full overflow-hidden bg-black/40" style={{ viewTransitionName: coverName("project-" + project.id) }}>
        {photos.length ? (
          <Image src={photos[current]} alt={project.name + (photos.length > 1 ? " — photo " + (current + 1) : "")} fill sizes="(min-width: 1152px) 620px, (min-width: 768px) 55vw, 100vw" className="object-contain" unoptimized />
        ) : <Icon icon="lucide:globe" width={40} className="absolute inset-0 m-auto text-[#96b8d7]" aria-hidden="true" />}
        {photos.length > 1 && (
          <div role="group" aria-label="Project photos" className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/85 to-transparent p-2 pt-5 sm:p-3 sm:pt-7">
            <button type="button" onClick={() => stepPhoto(-1)} aria-label="Previous photo" className="grid size-11 place-items-center rounded-full bg-black/70 text-white ring-1 ring-white/30 hover:bg-black focus-visible:outline focus-visible:outline-2">
              <Icon icon="lucide:chevron-left" width={20} aria-hidden="true" />
            </button>
            <span aria-live="polite" aria-atomic="true" className="rounded bg-black/70 px-2 py-1 font-mono text-xs tabular-nums text-white">{current + 1} / {photos.length}</span>
            <button type="button" onClick={() => stepPhoto(1)} aria-label="Next photo" className="grid size-11 place-items-center rounded-full bg-black/70 text-white ring-1 ring-white/30 hover:bg-black focus-visible:outline focus-visible:outline-2">
              <Icon icon="lucide:chevron-right" width={20} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      <div className="portfolio-notes min-w-0">
        <h3 className="font-sans tracking-tight break-words text-3xl font-bold leading-none lg:text-4xl">{project.name}</h3>
        <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-[#b3bec5]">{project.description}</p>
        {project.tags.length > 0 && <p className="mt-4 font-mono text-xs text-[#96b8d7]">{project.tags.join(" / ")}</p>}
        {project.clientUrl && <a className="mt-4 inline-block text-sm text-[#8dcfd7] underline underline-offset-4" href={website ?? project.clientUrl} target={website ? "_blank" : undefined} rel={website ? "noopener noreferrer" : undefined}>{project.clientLabel || (website ? "Open website in new tab" : "View project")}</a>}
        {project.audio && <audio className="mt-4 block w-full min-w-0 max-w-full" src={project.audio} aria-label={project.songName || "Project audio"} controls preload="none" />}
      </div>
    </article>
  );
}

export default function PortfolioPage() {
  const [section, setSection] = useState<(typeof sections)[number]["id"]>("all");
  const [selectedId, setSelectedId] = useState<string>();
  const reducedPerformance = useReducedPerformance();
  const drawer = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    function readSelection() {
      const params = new URLSearchParams(window.location.search);
      const category = sections.find(({ id }) => id === params.get("view"));
      setSection(category?.id ?? "all");
      setSelectedId(params.get("piece") ?? undefined);
    }
    readSelection();
    window.addEventListener("popstate", readSelection);
    return () => window.removeEventListener("popstate", readSelection);
  }, []);

  function select(view: typeof section, piece?: string) {
    function update() {
      setSection(view);
      setSelectedId(piece);
      const url = new URL(window.location.href);
      if (view === "all") url.searchParams.delete("view");
      else url.searchParams.set("view", view);
      if (piece) url.searchParams.set("piece", piece);
      else url.searchParams.delete("piece");
      window.history.replaceState(null, "", url);
    }

    if ((section === "all" || view === "all") && section !== view && !reducedPerformance && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && document.startViewTransition) {
      document.startViewTransition(() => flushSync(update));
    } else {
      update();
    }
  }

  const catalog = projects
    .flatMap((project) => {
      const category = portfolioCategory(project.tags);
      if (category !== "avatars" && category !== "web") return [];
      return [{
        id: "project-" + project.id,
        category,
        title: project.name,
        thumbnail: project.image || project.extraPhotos?.[0] || "",
        detail: <ProjectEntry project={project} />,
      }];
    });

  const entries = catalog.filter((entry) => entry.category === section);
  const selected = entries.find((entry) => entry.id === selectedId) ?? entries[0];

  const activeCategory = sections.findIndex(({ id }) => id === section);
  const index = (
    <>
      <nav aria-label="Portfolio categories" className="relative grid gap-0 pl-3">
        <span aria-hidden="true" className="absolute left-0 top-0 h-11 w-0.5 bg-[#8dcfd7] motion-safe:transition-transform motion-safe:duration-200" style={{ transform: "translateY(" + activeCategory * 100 + "%)" }} />
        {sections.map(({ id, label }) => (
          <button key={id} type="button" aria-pressed={section === id} onClick={() => select(id)} className="h-11 px-3 text-left text-sm text-white/65 hover:bg-white/5 aria-pressed:bg-white/10 aria-pressed:text-[#d3f0f3]">
            {label}
          </button>
        ))}
      </nav>
      <div role="group" aria-label="Choose a project" className="mt-4 space-y-1 border-t border-white/10 pt-3">
        {entries.map((entry) => (
          <button
            key={entry.id}
            type="button"
            aria-pressed={entry.id === selected?.id}
            onClick={() => { select(section, entry.id); drawer.current?.close(); }}
            className="flex min-h-12 w-full items-center gap-3 px-2 py-1.5 text-left text-sm text-white/70 hover:bg-white/5 aria-pressed:bg-white/10 aria-pressed:text-white"
          >
            <span className="relative aspect-video w-14 shrink-0 overflow-hidden bg-white/5">
              {entry.thumbnail ? <Image src={entry.thumbnail} alt="" fill sizes="56px" className="object-cover" unoptimized /> : <Icon icon="lucide:file" width={16} className="absolute inset-0 m-auto" aria-hidden="true" />}
            </span>
            <span className="min-w-0 break-words">{entry.title}</span>
          </button>
        ))}
        {!entries.length && <p className="px-2 py-2 text-sm text-white/60">No projects yet.</p>}
      </div>
    </>
  );

  return (
    <main className="relative min-h-screen z-[1] bg-[#0a141d]/70 text-[#f3f4f5]">
      <div className="mx-auto max-w-[100rem] px-4 pb-32 pt-24 sm:px-8 lg:pb-16 lg:pt-28">
        <header className="mb-4 flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
          <h1 className="font-sans text-3xl font-semibold tracking-tight sm:text-4xl">Portfolio</h1>
          <span className="font-mono text-xs text-white/55">{sections[activeCategory].label}</span>
        </header>
        {section === "all" ? (
          <section aria-label="All projects">
            <p className="mb-5 text-sm text-[#b3bec5]">stuff i made, edited, or spent way too long tweaking.</p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...sections.slice(1).flatMap(({ id }) => catalog.filter((entry) => entry.category === id).slice(0, 1)),
                ...sections.slice(1).flatMap(({ id }) => catalog.filter((entry) => entry.category === id).slice(1))].map((entry) => (
                <button key={entry.id} type="button" onClick={() => select(entry.category, entry.id)} className="group min-w-0 border border-white/10 bg-[#0a141d]/85 text-left hover:border-[#8dcfd7]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8dcfd7] lg:first:col-span-2 lg:first:row-span-2">
                  <span style={{ viewTransitionName: coverName(entry.id) }} className="relative grid aspect-video place-items-center overflow-hidden bg-[#14222b]">
                    {entry.thumbnail ? <Image src={entry.thumbnail} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" unoptimized /> : <Icon icon={entry.category === "web" ? "lucide:globe" : "lucide:film"} width={32} className="text-[#96b8d7]" aria-hidden="true" />}
                  </span>
                  <span className="flex min-h-16 items-center justify-between gap-3 px-4 py-3">
                    <span className="min-w-0 break-words font-semibold">{entry.title}</span>
                    <span className="font-mono text-xs text-[#96b8d7]">{entry.category}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ) : (
        <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
          <aside aria-label="Project index" className="hidden max-h-[72vh] overflow-y-auto bg-[#101b23] p-3 lg:block">
            {index}
          </aside>
          <section aria-label="Project preview" className="min-w-0">
            <button type="button" onClick={() => select("all")} className="mb-3 inline-flex min-h-11 items-center gap-2 text-sm text-[#8dcfd7]"><Icon icon="lucide:arrow-left" width={16} aria-hidden="true" /> all projects</button>
            {selected ? (
              <div key={selected.id}>{selected.detail}</div>
            ) : (
              <p role="status" className="grid aspect-video place-items-center bg-black/30 px-4 text-sm text-white/70">
                No projects published here yet.
              </p>
            )}

          </section>
        </div>
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/15 bg-[#101b23] px-4 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-2 lg:hidden">
        <button type="button" onClick={() => drawer.current?.showModal()} className="mx-auto flex min-h-12 w-full max-w-xl items-center gap-3 text-left" aria-haspopup="dialog">
          <Icon icon="lucide:panels-top-left" width={20} aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-[#8dcfd7]">{sections[activeCategory].label}</span>
            <span className="block truncate text-sm">{selected?.title ?? "Projects"}</span>
          </span>
          <span className="shrink-0 text-xs text-white/75">Browse</span>
        </button>
      </div>
      <dialog ref={drawer} aria-labelledby="portfolio-drawer-title" className="portfolio-drawer text-[#f3f4f5] lg:hidden">
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
          <h2 id="portfolio-drawer-title" className="font-sans text-xl font-semibold">Projects</h2>
          <button type="button" onClick={() => drawer.current?.close()} aria-label="Close project index" className="grid size-11 place-items-center">
            <Icon icon="lucide:x" width={20} aria-hidden="true" />
          </button>
        </div>
        {index}
      </dialog>
    </main>
  );
}
