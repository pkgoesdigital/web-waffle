import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Technical Summary — Portfolio' }

const skills = [
  { category: 'Languages', items: 'TypeScript, JavaScript, PHP, Python, C#, F#, Java, HTML, CSS' },
  { category: 'Frameworks', items: 'React, React Native, Next.js (App Router and Pages Router), Angular, ASP.NET Core' },
  { category: 'State Management', items: 'Redux, Jotai, React Query, React Context, RxJS' },
  { category: 'Styling', items: 'Tailwind CSS, CSS Modules, SASS, Bootstrap' },
  { category: 'Build Tools', items: 'Turborepo, Vite, Metro, Webpack, Angular CLI' },
  { category: 'Backend', items: 'Node.js, Express, DAPR, JasperReports, Jtwig' },
  { category: 'Databases', items: 'PostgreSQL, MongoDB, Neo4j, NoSQL' },
  { category: 'Integrations', items: 'Salesforce, Storyblok CMS, Google Maps/Places/Analytics, OneSignal, Sentry, Threekit, Logik, iLevel' },
  { category: 'Infrastructure', items: 'Azure, Docker, Kubernetes, Helm, Redis, pnpm workspaces, Jenkins, Azure Pipelines' },
  { category: 'AI / ML', items: 'sentence-transformers, Tesseract OCR' },
  { category: 'Testing', items: 'Jest, Jasmine, Karma, ESLint, Prettier, end-to-end and unit testing via CI/CD' },
  { category: 'CMS', items: 'WordPress, Elementor, Storyblok, Strapi' },
  { category: 'Other', items: 'SCORM, Formik/Yup, D3.js, i18n, JasperReports XML, GraphQL, jQuery, AG Grid' },
]

export default function TechnicalSummaryPage() {
  return (
    <PortfolioPage slug="technical-summary">
      <p>
        A full-stack generalist with depth in the JavaScript/TypeScript ecosystem
        and working experience across Python, C#, and Java. I care more about
        picking the right tool for the job than advocating for any particular
        stack.
      </p>

      <table className={styles.table}>
        <tbody>
          {skills.map(({ category, items }) => (
            <tr key={category} className={styles.row}>
              <td className={styles.category}>{category}</td>
              <td className={styles.items}>{items}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PortfolioPage>
  )
}
