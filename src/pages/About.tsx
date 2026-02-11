import content from "../content/wpContent.json";
import type { SiteContent } from "../types/content";
import { sanitizeHtml, stripEmpty } from "../utils/wp";

const site = content as SiteContent;

const legacyBlurb = [
  `I believe better software can inspire better humans. I believe in failure and conflict - they make things more interesting and provide opportunities for growth. I believe in listening to those who differ from ourselves.`,
  `I believe in process, even when it's messy and untamed. I believe in the space between humans and technology, and I believe we can make it better.`,
];

export default function About() {
  const wp = site.pages["about"];
  const wpHtml = wp?.contentHtml ? sanitizeHtml(wp.contentHtml) : "";

  return (
    <div>
      <h1>About</h1>
      <div>
        <p>
          Full Stack Builder | Business Intelligence Product Manager |
          Enterprise Product Manager | Software Engineer | Analytics Nerd |
          Writer | Activist
        </p>
      </div>
      {stripEmpty(wpHtml) ? (
        <div className="prose" dangerouslySetInnerHTML={{ __html: wpHtml }} />
      ) : null}

      <div className="prose">
        {legacyBlurb.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </div>
  );
}
