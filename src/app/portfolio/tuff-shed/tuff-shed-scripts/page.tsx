import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'Tuff Shed Scripts — Portfolio' }

const parent = { slug: 'tuff-shed', title: 'Tuff Shed' }

export default function TuffShedScriptsPage() {
  return (
    <PortfolioPage slug="tuff-shed-scripts" parent={parent}>
      <p>
        Alongside the main Tuff Shed platform, the team built a set of Python
        scripts for internal automation. Two projects stand out.
      </p>

      <h2>Semantic Document Classifier</h2>
      <p>
        The most interesting tool is a file organization utility that uses the{' '}
        <code>sentence-transformers</code> library (all-MiniLM-L6-v2) to
        semantically classify documents into configurable categories. It handles
        PDFs, Word documents, Excel files, and images via OCR with Tesseract,
        and logs every operation for transparency.
      </p>
      <p>
        It&rsquo;s a small project, but it captures a practical approach to
        automation — take a repetitive task, make it smart enough to handle edge
        cases, and keep it auditable. The tool eliminated hours of manual file
        sorting across the team.
      </p>

      <h2>AI Agent Project (Alpha)</h2>
      <p>
        This repo is also the foundation for an alpha-stage AI agent project
        currently in development. The goal is to build a Claude-powered AI agent
        that can eventually take on the responsibilities of a product manager —
        using the two years of context, documentation, API collections, and
        domain knowledge gathered throughout the Tuff Shed engagement.
      </p>
      <p>
        The first step is organizing and semantically analyzing all of that
        accumulated content — Postman collections for Nextworld APIs, test data
        objects from NetSuite, domain-specific JSON schemas — so that an agent
        has enough structured context to reason about the product and make
        informed decisions. It&rsquo;s early-stage work, but it represents an
        investment in AI-augmented product management and a belief that the best
        way to hand off institutional knowledge is to make it machine-readable.
      </p>
    </PortfolioPage>
  )
}
