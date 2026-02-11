import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import content from "../content/wpContent.json";
import type { SiteContent } from "../types/content";
import { formatDate, sanitizeHtml } from "../utils/wp";

const site = content as SiteContent;

export default function WritingPost() {
  const { slug } = useParams();

  const pageOrPost = useMemo(() => {
    if (!slug) return null;
    const page = site.pages[slug];
    if (page) return { kind: "page" as const, ...page };
    const post = site.posts.find((p) => p.slug === slug);
    if (post) return { kind: "post" as const, ...post };
    return null;
  }, [slug]);

  if (!pageOrPost) {
    return (
      <div>
        <p>Post or Page content not found.</p>
        <Link to="/writing">Back to Writing</Link>
      </div>
    );
  }

  const html = sanitizeHtml((pageOrPost as any).contentHtml || "");

  return (
    <div>
      <p style={{ marginBottom: "1rem" }}>
        <Link to="/writing">← Writing</Link>
      </p>

      <h1>{pageOrPost.title}</h1>
      {"date" in pageOrPost ? (
        <p style={{ opacity: 0.7 }}>
          {formatDate((pageOrPost as any).date)}
          {(pageOrPost as any).status &&
          (pageOrPost as any).status !== "publish"
            ? ` (${(pageOrPost as any).status})`
            : ""}
        </p>
      ) : null}

      {html ? (
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p>(No content yet.)</p>
      )}
    </div>
  );
}
