import type { Metadata } from 'next'
import type { SimpleIcon } from 'simple-icons'
import {
  siTypescript, siJavascript, siPython, siPhp, siHtml5, siCss,
  siReact, siNextdotjs, siAngular,
  siRedux, siReactquery, siReactivex,
  siTailwindcss, siSass, siBootstrap, siCssmodules,
  siTurborepo, siVite, siWebpack,
  siNodedotjs, siExpress,
  siPostgresql, siMongodb, siNeo4j,
  siStoryblok, siGooglemaps, siGoogleanalytics, siSentry,
  siDocker, siRedis, siPnpm, siJenkins,
  siJest, siJasmine, siEslint, siPrettier,
  siWordpress, siElementor, siStrapi,
  siD3, siGraphql, siJquery,
} from 'simple-icons'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'
import IconBadge from '@/components/IconBadge/IconBadge'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Technical Summary — Portfolio' }

type SkillItem = { label: string; icon?: SimpleIcon }
type SkillCategory = { category: string; items: SkillItem[] }

const skills: SkillCategory[] = [
  {
    category: 'Languages',
    items: [
      { label: 'TypeScript', icon: siTypescript },
      { label: 'JavaScript', icon: siJavascript },
      { label: 'Python', icon: siPython },
      { label: 'PHP', icon: siPhp },
      { label: 'Java' },
      { label: 'HTML', icon: siHtml5 },
      { label: 'CSS', icon: siCss },
    ],
  },
  {
    category: 'Frameworks',
    items: [
      { label: 'React', icon: siReact },
      { label: 'React Native', icon: siReact },
      { label: 'Next.js', icon: siNextdotjs },
      { label: 'Angular', icon: siAngular },
    ],
  },
  {
    category: 'State Management',
    items: [
      { label: 'Redux', icon: siRedux },
      { label: 'React Query', icon: siReactquery },
      { label: 'React Context', icon: siReact },
      { label: 'RxJS', icon: siReactivex },
    ],
  },
  {
    category: 'Styling',
    items: [
      { label: 'Tailwind CSS', icon: siTailwindcss },
      { label: 'CSS Modules', icon: siCssmodules },
      { label: 'SASS', icon: siSass },
      { label: 'Bootstrap', icon: siBootstrap },
    ],
  },
  {
    category: 'Build Tools',
    items: [
      { label: 'Turborepo', icon: siTurborepo },
      { label: 'Vite', icon: siVite },
      { label: 'Webpack', icon: siWebpack },
      { label: 'Metro' },
      { label: 'Angular CLI', icon: siAngular },
    ],
  },
  {
    category: 'Backend',
    items: [
      { label: 'Node.js', icon: siNodedotjs },
      { label: 'Express', icon: siExpress },
      { label: 'DAPR' },
      { label: 'JasperReports' },
      { label: 'Jtwig' },
    ],
  },
  {
    category: 'Databases',
    items: [
      { label: 'PostgreSQL', icon: siPostgresql },
      { label: 'MongoDB', icon: siMongodb },
      { label: 'Neo4j', icon: siNeo4j },
      { label: 'NoSQL' },
    ],
  },
  {
    category: 'Integrations',
    items: [
      { label: 'Salesforce' },
      { label: 'Storyblok', icon: siStoryblok },
      { label: 'Google Maps', icon: siGooglemaps },
      { label: 'Google Analytics', icon: siGoogleanalytics },
      { label: 'OneSignal' },
      { label: 'Sentry', icon: siSentry },
      { label: 'iLevel' },
    ],
  },
  {
    category: 'Infrastructure',
    items: [
      { label: 'Azure' },
      { label: 'Docker', icon: siDocker },
      { label: 'Redis', icon: siRedis },
      { label: 'pnpm', icon: siPnpm },
      { label: 'Jenkins', icon: siJenkins },
      { label: 'Azure Pipelines' },
    ],
  },
  {
    category: 'AI / ML',
    items: [
      { label: 'sentence-transformers' },
      { label: 'Tesseract OCR' },
    ],
  },
  {
    category: 'Testing',
    items: [
      { label: 'Jest', icon: siJest },
      { label: 'Jasmine', icon: siJasmine },
      { label: 'ESLint', icon: siEslint },
      { label: 'Prettier', icon: siPrettier },
      { label: 'Karma' },
    ],
  },
  {
    category: 'CMS',
    items: [
      { label: 'WordPress', icon: siWordpress },
      { label: 'Elementor', icon: siElementor },
      { label: 'Storyblok', icon: siStoryblok },
      { label: 'Strapi', icon: siStrapi },
    ],
  },
  {
    category: 'Other',
    items: [
      { label: 'D3.js', icon: siD3 },
      { label: 'GraphQL', icon: siGraphql },
      { label: 'jQuery', icon: siJquery },
      { label: 'AG Grid' },
      { label: 'i18n' },
      { label: 'SCORM' },
      { label: 'Formik / Yup' },
    ],
  },
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

      <div className={styles.grid}>
        {skills.map(({ category, items }) => (
          <section key={category} className={styles.category}>
            <h3 className={styles.categoryHeading}>{category}</h3>
            <div className={styles.badges}>
              {items.map((item) => (
                <IconBadge key={item.label} label={item.label} icon={item.icon} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PortfolioPage>
  )
}
