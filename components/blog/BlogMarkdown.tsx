import Markdown from "react-markdown";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { readBlogImageOptions, type EditableBlogImage } from "@/lib/blogImages";

export function BlogMarkdown({ content, onImageSelect, onImageOpen }: { content: string; onImageSelect?: (image: EditableBlogImage) => void; onImageOpen?: (src: string, alt: string) => void }) {
  return (
    <div className="blog-prose">
      <Markdown skipHtml components={{
        h1: ({ children }) => <h2>{children}</h2>,
        a: ({ href, children }) => href?.startsWith("/") && !href.startsWith("//")
          ? <TransitionLink href={href}>{children}</TransitionLink>
          : <a href={href} rel="noopener noreferrer">{children}</a>,
        img: ({ src, alt, title, node }) => {
          if (typeof src !== "string" || !src) return null;
          const options = readBlogImageOptions(title);
          const start = node?.position?.start.offset;
          const end = node?.position?.end.offset;
          const image = <img src={src} alt={alt ?? ""} title={title?.startsWith("blog-image:") ? undefined : title} loading="lazy" decoding="async" />;
          const editable = onImageSelect && start !== undefined && end !== undefined;
          return <span className="blog-image" role="figure" aria-label={options.caption || alt || undefined}
            data-align={options.align} style={{ width: options.width === "full" ? "100%" : options.width }}>
            {editable ? <button type="button" className="blog-image-edit" aria-label={`Edit image: ${alt || "Untitled image"}`}
              onClick={() => onImageSelect({ ...options, src, alt: alt ?? "", start, end })}>{image}<span className="blog-image-edit-hint">Edit image</span></button> : onImageOpen ? <button type="button" className="blog-image-edit" aria-label={`Enlarge image: ${alt || "Case evidence"}`} onClick={() => onImageOpen(src, alt ?? "")}>{image}</button> : image}
            {options.caption && <span className="blog-image-caption">{options.caption}</span>}
          </span>;
        },
      }}>{content}</Markdown>
    </div>
  );
}
