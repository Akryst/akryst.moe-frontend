import { cache } from "react";
import type { Metadata } from "next";
import { Icon } from "@iconify/react";
import { notFound } from "next/navigation";
import { posts } from "@/data/demo";
import { formatBlogDate, serializeJsonLd } from "@/lib/blog";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import { BlogComments } from "@/components/blog/BlogComments";
import { TransitionLink } from "@/components/ui/TransitionLink";

export function generateStaticParams() {
  return posts.map(({ slug }) => ({ slug }));
}

const getPost = cache(async (slug: string) => {
  const post = posts.find(post => post.slug === slug);
  if (!post) notFound();
  return post;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  const images = [post.coverImage ?? "/opengraph-image.png"];
  return {
    title: `${post.title} — akryst`, description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title, description: post.excerpt, type: "article", url: `/blog/${post.slug}`, images,
      publishedTime: post.publishedAt!.toISOString(), modifiedTime: post.updatedAt.toISOString(),
      authors: ["https://akryst.moe"],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, noimageindex: false, "max-image-preview": "large" } },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  const url = `https://akryst.moe/blog/${post.slug}`;
  const schema = {
    "@context": "https://schema.org", "@type": "BlogPosting", "@id": `${url}#article`,
    headline: post.title, description: post.excerpt,
    image: `https://akryst.moe${post.coverImage ?? "/opengraph-image.png"}`,
    datePublished: post.publishedAt!.toISOString(), dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: "akryst", url: "https://akryst.moe" },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  return (
    <main className="blog-shell blog-article-shell">
      <TransitionLink href="/blog" className="blog-back"><Icon icon="lucide:arrow-left" width={15} aria-hidden="true" />All posts</TransitionLink>
      <article>
        <header className="blog-article-heading">
          <p className="blog-eyebrow">akryst / <time dateTime={post.publishedAt!.toISOString()}>{formatBlogDate(post.publishedAt!)}</time></p>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          {post.updatedAt.getTime() - post.publishedAt!.getTime() > 86400000 &&
            <small>Updated <time dateTime={post.updatedAt.toISOString()}>{formatBlogDate(post.updatedAt)}</time></small>}
        </header>
        {post.coverImage && <img className="blog-cover" src={post.coverImage} alt={post.title} fetchPriority="high" />}
        <BlogMarkdown content={post.content} />
      </article>
      <footer className="blog-footer"><span>Written by akryst</span><TransitionLink href="/blog">More posts<Icon icon="lucide:arrow-up-right" width={15} aria-hidden="true" /></TransitionLink></footer>
      <BlogComments key={post.id} slug={post.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
    </main>
  );
}
