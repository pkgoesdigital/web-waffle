import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className="page-header">
        <h1>About</h1>
        <p>
          Full Stack Builder | Business Intelligence Product Manager |
          Enterprise Product Manager | Software Engineer | Analytics Nerd |
          Writer | Activist
        </p>
      </div>

      <div className="prose">
        <p>
          I'm a software engineer and product manager — and I've spent my career sitting at the intersection. This portfolio is a record of that: code I've written and shipped, and writing that attempts to make sense of how products get built, how teams stay aligned, and how to stay honest about what the data is actually telling you.
        </p>

        <p>
          On the engineering side, I believe in fundamentals first. Before I
          dive into an unfamiliar codebase, I build something small. Not to
          waste time — but because understanding a system from the ground up
          changes how you read it. My technical interests lean toward data:
          Python, SQL, and the overlap between statistical thinking and product
          intuition. I find the most interesting engineering problems are the
          ones that sit right at the edge of &ldquo;this is a code
          problem&rdquo; and &ldquo;this is a process problem.&rdquo;
        </p>

        <p>
        I also, avoid acronyms most of the time :) they tend to cause more confusion than provide clarity.
        </p>

        <p>
          On the product side, I think in systems and timelines. The work I
          find most meaningful is long-range: building roadmaps that flex with
          markets without losing their north star, doing scenario planning so
          teams aren&rsquo;t blindsided, and running cross-functional reviews
          where engineering, finance, ops, and sales are actually looking at the
          same picture. I care about OKRs that are sharp enough to mean
          something — three goals, three owners, no sprawl. And I care about&nbsp;
          <b>the space <em>between</em> metrics: what&rsquo;s happening in the
          gaps, and what that might mean for how a product grows.</b>
        </p>

        <p>
          Underlying all of this is a belief that adaptability is a skill, not
          a trait. You can get better at repositioning. You can get better at
          reading ambiguous situations and moving through them rather than
          waiting for certainty. I&rsquo;ve tried to do that across every role
          I&rsquo;ve held, and I&rsquo;ve tried to document that thinking here.
        </p>

        <p>
          I&rsquo;m also a reader and a writer — not just in a professional
          sense. I keep notebooks. I collect quotes that reorient me. I think
          the discipline of writing, of actually committing an idea to the page
          and asking whether it holds up, is one of the most underrated tools in
          any technical person&rsquo;s toolkit.{" "}
          <em>Show, don&rsquo;t tell</em> applies to products as much as it
          does to prose.
        </p>

        <p>
          When I&rsquo;m not building things, I&rsquo;m probably cycling,
          working in a garden, hunting for the perfect espresso in Denver, or
          working through an ever-growing list of films I&rsquo;ve been meaning
          to watch.
        </p>

        <p>
          I believe better software can inspire better humans. I believe in
          failure, reflection, rebuilding, and confrontation — they make things
          more interesting and provide opportunities for growth.
        </p>
        <blockquote>
          &ldquo;The only way out, is through.&rdquo; &mdash; my therapist
        </blockquote>

        <p>
          If something here resonates — a project, an article, a way of
          thinking about a problem — I&rsquo;d love to connect. Find me at one of the links below.
        </p>
      </div>
    </div>
  );
}
