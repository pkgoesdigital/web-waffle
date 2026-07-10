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
          I&rsquo;ve spent my career sitting at the intersection of engineering and product. This portfolio is a record of that: code I&rsquo;ve written and shipped, and writing that attempts to make sense of how products get built, how teams stay aligned, and how to stay honest about what the data is actually telling you.
        </p>

        <p>
          On the engineering side, I believe in fundamentals first. Before I
          dive into an unfamiliar codebase, I build something small to learn. This allows me an understanding of a system from the ground up - serving as my primer for problem solving in your stack. I find the most interesting engineering problems are the
          ones that sit right at the edge of &ldquo;this is a code
          problem&rdquo; and &ldquo;this is a process problem.&rdquo;
        </p>

        <p>
          On the product side, I think in systems and timelines. The work I
          find most meaningful is long-range: building roadmaps that flex with
          markets without losing their north star, doing scenario planning so
          teams aren&rsquo;t blindsided, and running cross-functional reviews
          where engineering, finance, ops, and sales are actually looking at the
          same picture. I care about&nbsp;
          <b>the space <em>between</em> metrics: what&rsquo;s happening in the
          gaps, and what that might mean for how a product evolves.</b>
        </p>

        <p>
          Underlying all of this is a belief that adaptability is a skill, not
          a trait. I believe you can get better at repositioning. You can get better at
          reading ambiguous situations and moving through them rather than
          waiting for certainty.
        </p>

        <p>
          Career aside, I&rsquo;m also a reader and a writer. I think
          the discipline of writing is one of the most underrated tools in
          any technical person&rsquo;s toolkit.{" "} I believe
          <em>&ldquo;Show, don&rsquo;t tell&rdquo;</em> applies to products as much as it
          does to prose.
        </p>

        <p>
          When I&rsquo;m not building things, I&rsquo;m probably cycling,
          working in a garden, hunting for the perfect espresso, or with my community.
        </p>

        <p>
          I believe better software can inspire better humans. I believe in
          failure, reflection, rebuilding, and confrontation — they make things
          more interesting and provide opportunities for growth.
        </p>

        <p>
          If something here resonates, I&rsquo;d love to connect. Find me at one of the links below.
        </p>
      </div>
    </div>
  );
}
