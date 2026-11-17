import type { Metadata } from "next";
import { Icon } from "@iconify/react";
import { posts } from "@/data/demo";
import { formatBlogDate } from "@/lib/blog";
import { TransitionLink } from "@/components/ui/TransitionLink";


const description = "Notes on VRChat avatars, Unity, web development and the things I make.";
export const metadata: Metadata = {
  title: "Blog — akryst", description,
  alternates: { canonical: "/blog" },
  openGraph: { title: "Blog — akryst", description, url: "/blog", type: "website" },
  twitter: { card: "summary_large_image", title: "Blog — akryst", description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, noimageindex: false, "max-image-preview": "large" } },
};

export default async function BlogPage() {
  return (
    <main className="blog-shell">
      <header className="blog-heading">
        <p className="blog-eyebrow">akryst / notes & experiments</p>
        <h1>Blog<span>.</span></h1>
        <p>{description}</p>
      </header>
      {posts.length ? <div className="blog-list">
        {posts.map((post) => (
          <article key={post.id}>
            <TransitionLink href={`/blog/${post.slug}`} className="blog-entry">
              <div>
                <time dateTime={post.publishedAt!.toISOString()}>{formatBlogDate(post.publishedAt!)}</time>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <span className="blog-read">Read article <Icon icon="lucide:arrow-up-right" width={15} aria-hidden="true" /></span>
              </div>
              {post.coverImage && <img src={post.coverImage} alt="" loading="lazy" width={360} height={240} />}
            </TransitionLink>
          </article>
        ))}
      </div> : <div className="blog-empty"><h2>Nothing published yet.</h2><p>New notes and projects will appear here.</p></div>}
    </main>
  );
}
