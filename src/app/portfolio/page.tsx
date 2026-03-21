import type { Metadata } from "next";
import Link from "next/link";
import { portfolioSections } from "@/data/portfolio-sections";
import { getCardColor } from "@/lib/colors";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "A detailed look at the projects and roles that shaped my career as a full-stack developer and technical product manager.",
};

export default function PortfolioHomePage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Portfolio</h1>
        <p>
          I&rsquo;m a full-stack developer who enjoys building
          products with tangible, measureable outcomes. My work portfolio spans B2B and
          B2C technologies — from enterprise ERP platforms to personal utilities
          and mobile apps. For a full list of languages, frameworks, and tools,
          see the{' '}
          <Link href="/portfolio/technical-summary">Technical Summary</Link>.
        </p>
      </div>

      <nav className={styles.toc} aria-label="Portfolio sections">
        <h2 className={styles.tocTitle}>Contents</h2>
        <ol className={styles.tocList}>
          {portfolioSections.map((section, i) => (
            <li key={section.slug} className={styles.tocItem}>
              <Link
                href={`/portfolio/${section.slug}`}
                className={styles.tocLink}
              >
                <span className={styles.tocNumber}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.tocText}>
                  <span className={styles.tocSectionTitle}>
                    {section.title}
                  </span>
                  {section.period && (
                    <span className={styles.tocPeriod}>{section.period}</span>
                  )}
                </span>
              </Link>

            </li>
          ))}
        </ol>
      </nav>

      <section className={styles.grid}>
        {portfolioSections.map((section, i) => (
          <Link
            key={section.slug}
            href={`/portfolio/${section.slug}`}
            className={styles.card}
            style={{ backgroundColor: getCardColor(i) }}
          >
            <span className={styles.cardNumber}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className={styles.cardTitle}>{section.title}</h3>
            {section.period && (
              <p className={styles.cardPeriod}>{section.period}</p>
            )}
            <p className={styles.cardDescription}>{section.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
