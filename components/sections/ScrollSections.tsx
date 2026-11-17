"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { TransitionLink } from "@/components/ui/TransitionLink";

import { profile, tracks, guestMessages } from "@/data/demo";

const TECH_STACK = [
  { icon: "logos:javascript",               label: "JavaScript" },
  { icon: "logos:typescript-icon",          label: "TypeScript" },
  { icon: "devicon:csharp",                 label: "C#" },
  { icon: "logos:python",                   label: "Python" },
  { icon: "logos:nextjs-icon",              label: "Next.js" },
  { icon: "logos:react",                    label: "React" },
  { icon: "logos:nodejs-icon",              label: "Node.js" },
  { icon: "logos:tailwindcss-icon",         label: "Tailwind" },
  { icon: "logos:framer",                   label: "Framer Motion" },
  { icon: "simple-icons:prisma",            label: "Prisma" },
  { icon: "logos:sqlite",                   label: "SQLite" },
  { icon: "simple-icons:threedotjs",        label: "Three.js" },
  { icon: "logos:unity",                    label: "Unity" },
  { icon: "logos:blender",                  label: "Blender" },
  { icon: "logos:adobe-after-effects",      label: "After Effects" },
  { icon: "logos:adobe-premiere",           label: "Premiere Pro" },
  { icon: "skill-icons:photoshop",          label: "Photoshop" },
  { icon: "skill-icons:lightroom",          label: "Lightroom Classic" },
];

interface GuestMessage {
  id: string;
  name: string;
  website?: string | null;
  message: string;
  timestamp: string;
  likes: number;
  liked?: boolean;
  ownerLiked?: boolean;
  reply?: string | null;
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function relativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return rtf.format(-m, "minute");
  const h = Math.floor(m / 60);
  if (h < 24) return rtf.format(-h, "hour");
  const d = Math.floor(h / 24);
  if (d < 30) return rtf.format(-d, "day");
  return new Date(ts).toLocaleDateString("en-US", { timeZone: "UTC" });
}

const SOCIALS = [
  { label: "github",    icon: "simple-icons:github",    url: "https://github.com/akryst",                                             handle: "akryst" },
  { label: "instagram", icon: "simple-icons:instagram",  url: "https://www.instagram.com/akrysto",                                     handle: "akrysto" },
  { label: "twitter",   icon: "simple-icons:x",          url: "https://twitter.com/Akryst_",                                           handle: "Akryst_" },
  { label: "twitch",    icon: "simple-icons:twitch",     url: "https://twitch.tv/akryst_",                                             handle: "akryst_" },
  { label: "steam",     icon: "simple-icons:steam",      url: "https://steamcommunity.com/id/Anti-kryst/",                             handle: "anti-kryst" },
  { label: "vrchat",    icon: "simple-icons:vrchat",     url: "https://vrchat.com/home/user/usr_3644022f-4da6-4438-973a-0eb31527a121", handle: "akryst" },
  { label: "ko-fi",     icon: "simple-icons:kofi",       url: "https://ko-fi.com/akryst",                                              handle: "akryst" },
  { label: "vgen",      icon: "mdi:brush",               url: "https://vgen.co/akryst",                                                handle: "akryst" },
];

const STATUS_LABELS: Record<string, string> = {
  online: "online",
  idle: "away",
  dnd: "do not disturb",
  offline: "offline",
};


function PreviewLink({ children, href, image, caption }: { children: React.ReactNode; href: string; image: string | null; caption: string }) {
  const content = <>{children}{image && <span className="bio-preview" aria-hidden="true"><Image src={image} alt="" width={192} height={128} unoptimized /><span>{caption}</span></span>}</>;
  return href.startsWith("/") ? (
    <TransitionLink href={href} className="bio-link">{content}</TransitionLink>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className="bio-link">{content}</a>
  );
}

export function AboutPanel() {
  const [tab, setTab] = useState("me");
  const lanyard = profile;
  const avatar = lanyard?.discord_user.avatar;

  return (
    <div className="home-panel-content about-panel">
      <div className="panel-tabs" role="tablist" aria-label="About me sections">
        {[{ id: "me", label: "about me" }, { id: "music", label: "music" }].map(item => (
          <button key={item.id} id={`about-tab-${item.id}`} role="tab" tabIndex={tab === item.id ? 0 : -1} aria-selected={tab === item.id} aria-controls={`about-${item.id}`} onClick={() => setTab(item.id)} onKeyDown={event => {
            const tabs = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button") ?? []);
            const index = tabs.indexOf(event.currentTarget);
            const next = event.key === "ArrowRight" ? (index + 1) % tabs.length : event.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : -1;
            if (next >= 0) { event.preventDefault(); tabs[next].click(); tabs[next].focus(); }
          }}>{item.label}</button>
        ))}
      </div>
      <div className="panel-tab-content" role="tabpanel" id={`about-${tab}`} aria-labelledby={`about-tab-${tab}`}>
        {tab === "me" && (
          <>
            <div className="bio-intro">
              {avatar && <Image src={avatar} alt="" width={42} height={42} unoptimized className="bio-avatar" />}
              <div><h2>hey, i&apos;m akryst.</h2><span className="bio-status"><span className={`status-dot status-${lanyard?.discord_status ?? "offline"}`} />{STATUS_LABELS[lanyard?.discord_status ?? "offline"]} on discord</span></div>
            </div>
            <div className="bio-prose">
              <p>i&apos;ve 26, i&apos;m a mostly self-taught avatar editor. sometimes i make stuff with <PreviewLink href="/portfolio" image="/preview.webp" caption="avatar edits · unity">unity &amp; vr</PreviewLink>, and this is my little corner of the internet.</p>
              <p>i&apos;ve worked for <PreviewLink href="https://strawbunnyvr.com/" image="/preview.webp" caption="strawbunnyvr · vrchat avatars">strawbunnyvr</PreviewLink> and on projects like <PreviewLink href="https://github.com/Akryst/moonlight-ps4" image="/preview.webp" caption="moonlight-ps4 on github">moonlight-ps4</PreviewLink> and <PreviewLink href="https://github.com/Akryst/Unity-Discord-RPC" image="/preview.webp" caption="unity discord rpc">unity discord rpc</PreviewLink>, along with other projects on <PreviewLink href="https://github.com/Akryst" image="/preview.webp" caption="akryst on github">github</PreviewLink>.</p>
              <p>when i&apos;m not editing, i&apos;m gaming, working, or doing anything to keep myself distracted.</p>
            </div>
            <div className="bio-tools" aria-label="Tools I use">
              {TECH_STACK.map(tool => <span key={tool.label} className="bio-tool" tabIndex={0} aria-label={tool.label}><Icon icon={tool.icon} width={19} /><span className="bio-tool-label">{tool.label}</span></span>)}
            </div>
            <div className="bio-socials" aria-label="Find me online">
              {SOCIALS.map(social => <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={`${social.label}: ${social.handle}`} title={social.label}><Icon icon={social.icon} width={18} /></a>)}
            </div>
          </>
        )}
        {tab === "music" && (
          <div className="music-panel">
            <div className="panel-section-heading"><h2>on repeat.</h2><span>sample listening</span></div>

            <div className="music-track-list" style={{ maxHeight: "380px", overflowY: "auto" }}>
              {tracks.map((track, i) => {
                const searchQuery = encodeURIComponent(`${track.artist} ${track.name}`);
                const spotifyUrl = `https://open.spotify.com/search/${searchQuery}`;
                const youtubeMusicUrl = `https://music.youtube.com/search?q=${searchQuery}`;

                return (
                  <div key={`${track.name}-${i}`} className="music-track" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    {track.image ? <Image src={track.image} alt="" width={48} height={48} unoptimized /> : <span className="music-art-placeholder"><Icon icon="simple-icons:lastdotfm" width={20} /></span>}
                    <span className="music-track-info">
                      <strong>{track.name}</strong>
                      <span>{track.artist}</span>
                      <small>{track.nowPlaying ? "● now playing" : track.date ? relativeTime(new Date(track.date).toISOString()) : "recently played"}</small>
                    </span>
                    <div style={{ display: "flex", gap: "8px", marginLeft: "auto", opacity: 0.5 }}>
                      <a href={spotifyUrl} target="_blank" rel="noopener noreferrer" aria-label="Search on Spotify" style={{ color: "inherit", transition: "opacity 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "1"} onMouseLeave={(e) => e.currentTarget.style.opacity = "0.5"}>
                        <Icon icon="simple-icons:spotify" width={16} />
                      </a>
                      <a href={youtubeMusicUrl} target="_blank" rel="noopener noreferrer" aria-label="Search on YouTube Music" style={{ color: "inherit", transition: "opacity 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "1"} onMouseLeave={(e) => e.currentTarget.style.opacity = "0.5"}>
                        <Icon icon="simple-icons:youtubemusic" width={16} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function GuestbookPanel() {
  const [messages, setMessages] = useState<GuestMessage[]>(guestMessages);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  return <div className="home-panel-content guestbook-panel">
    <div className="guestbook-heading"><h2>leave a little hello.</h2><span>{messages.length} messages</span></div>
    <p className="panel-caption">Local demo. Messages reset when this panel closes.</p>
    {showForm ? <form className="panel-form panel-form--guestbook" onSubmit={event => {
      event.preventDefault();
      if (!message.trim()) return;
      setMessages(previous => [{
        id: crypto.randomUUID(), name: name.trim() || "anonymous", message: message.trim(),
        timestamp: new Date().toISOString(), likes: 0, liked: false,
      }, ...previous]);
      setMessage("");
      setShowForm(false);
    }}>
      <label htmlFor="demo-gb-name">your name <span>(optional)</span></label>
      <input id="demo-gb-name" value={name} onChange={event => setName(event.target.value)} maxLength={50} placeholder="anonymous" />
      <label htmlFor="demo-gb-message">your message</label>
      <textarea id="demo-gb-message" value={message} onChange={event => setMessage(event.target.value)} maxLength={200} rows={3} required autoFocus placeholder="say something nice…" />
      <div className="panel-form-actions">
        <button className="panel-action" type="submit" disabled={!message.trim()}>add to preview</button>
        <button className="panel-text-button" type="button" onClick={() => setShowForm(false)}>cancel</button>
      </div>
    </form> : <>
      <div className="guestbook-scroll" aria-live="polite">
        {messages.map(entry => <article className="guestbook-entry" key={entry.id}>
          <div className="guestbook-entry-meta">
            <span className="gb-author">{entry.name}</span>
            <time dateTime={entry.timestamp}>{relativeTime(entry.timestamp)}</time>
            <button className="panel-text-button gb-like-btn" type="button" aria-pressed={!!entry.liked} aria-label={`Like message from ${entry.name}`} onClick={() => setMessages(previous => previous.map(item => item.id === entry.id ? {
              ...item, liked: !item.liked, likes: item.likes + (item.liked ? -1 : 1),
            } : item))}><span className={entry.liked ? "guestbook-heart-active" : ""}>{entry.liked ? "♥" : "♡"}</span>{entry.likes}</button>
          </div>
          <p className="guestbook-entry-message">{entry.message}</p>
        </article>)}
      </div>
      <div className="guestbook-footer"><button type="button" className="guestbook-compose-button" onClick={() => setShowForm(true)}><span>leave a message</span><span aria-hidden="true">→</span></button></div>
    </>}
  </div>;
}
