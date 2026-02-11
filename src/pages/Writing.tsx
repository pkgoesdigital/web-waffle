import { Link } from "react-router-dom";
import content from "../content/wpContent.json";
import type { SiteContent, WpPost } from "../types/content";
import { formatDate } from "../utils/wp";

const site = content as SiteContent;

function PostRow({ post }: { post: WpPost }) {
  return (
    <li style={{ marginBottom: ".5rem" }}>
      <Link to={`/writing/${post.slug}`}>{post.title}</Link>{" "}
      <span style={{ opacity: 0.7 }}>
        — {formatDate(post.date)}
        {post.status !== "publish" ? ` (${post.status})` : ""}
      </span>
    </li>
  );
}

export default function Writing() {
  const featuredPages = [
    site.pages["lessons-in-product-management"],
    site.pages["lessons-in-mental-health"],
    site.pages["lessons-in-job-searching"],
  ].filter(Boolean);

  return (
    <div>
      <h1>Writing</h1>

      {featuredPages.length ? (
        <>
          <h2>Highlights</h2>
          <ul>
            {featuredPages.map((p) => (
              <li key={p!.slug}>
                <Link to={`/writing/${p!.slug}`}>{p!.title}</Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h2 style={{ marginTop: "2rem" }}>Posts</h2>
      {site.posts.length ? (
        <ul style={{ paddingLeft: "1.2rem" }}>
          {site.posts.map((p) => (
            <PostRow key={p.id} post={p} />
          ))}
        </ul>
      ) : (
        <p>No posts found in the export yet.</p>
      )}
    </div>
  );
}
