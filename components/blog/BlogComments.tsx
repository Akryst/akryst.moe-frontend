"use client";

import { useId, useState } from "react";
import { Icon } from "@iconify/react";

export function BlogComments({ slug }: { slug: string }) {
  const headingId = useId();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<{ id: string; name: string; content: string }[]>([]);

  return <section className="blog-comments" aria-labelledby={headingId}>
    <div className="blog-comments-heading"><h2 id={headingId}>Discussion</h2><span>{comments.length} comments</span></div>
    <p className="blog-comment-status">Local demo. Comments reset when you leave this page.</p>
    <form className="blog-comment-form" onSubmit={event => {
      event.preventDefault();
      if (!content.trim()) return;
      setComments(previous => [...previous, { id: crypto.randomUUID(), name: name.trim() || "Anonymous", content: content.trim() }]);
      setContent("");
    }}>
      <fieldset>
        <div className="blog-composer-header">
          <label className="blog-composer-name"><span className="sr-only">Name</span><input value={name} maxLength={50} onChange={event => setName(event.target.value)} placeholder="Anonymous" /></label>
        </div>
        <label className="blog-comment-label"><span className="sr-only">Your comment on {slug}</span>
          <textarea rows={3} required maxLength={1000} value={content} onChange={event => setContent(event.target.value)} placeholder="Leave a thought, a question, a little hello…" />
        </label>
        <div className="blog-comment-form-footer"><span>Visible in this preview only.</span><button type="submit" disabled={!content.trim()}>Post comment <Icon icon="lucide:arrow-up-right" width={16} /></button></div>
      </fieldset>
    </form>
    <div className="blog-comment-threads" aria-live="polite">
      {comments.map(comment => <article className="blog-comment" key={comment.id}><header><strong>{comment.name}</strong></header><p className="blog-comment-text">{comment.content}</p></article>)}
    </div>
  </section>;
}
