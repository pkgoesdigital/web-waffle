export type ChildSection = {
  slug: string
  title: string
  description: string
}

export type PortfolioSection = {
  slug: string
  title: string
  period?: string
  description: string
  children?: ChildSection[]
}

export const portfolioSections: PortfolioSection[] = [
  {
    slug: 'tuff-shed',
    title: 'Tuff Shed',
    period: 'Apr 2024 – Present',
    description:
      'Technical product manager on internal tooling projects, business intelligence, and data infrastructure.',
    children: [
      {
        slug: 'internal-tools',
        title: 'Tuff Shed Internal Tools',
        description:
          'Internal Python automation tooling including a semantic document classifier and an early-stage Claude-powered AI agent project built on accumulated product context.',
      },
    ],
  },
  {
    slug: 'waterbury',
    title: 'The Waterbury Group',
    period: 'Jan 2024 – May 2024',
    description:
      'Technical product management for web application builds - established architecture, defined scope, and paved the development path for outsourced development.',
    children: [
      {
        slug: 'advance-nc',
        title: 'Advance NC - Custom Wordpress Site + Interactive Content',
        description:
          'Interactive web content and SCORM-packaged online courses for workforce development, covering Advanced Materials and Biotech sector spotlights.',
      },
      {
        slug: 'birthday-stats',
        title: 'Birthday Stats - Application Concept + React/Vite Setup',
        description:
          'Concept and technical setup for a React/Vite web application visualizing birth date statistics, including data sourcing, component architecture, and deployment configuration.',
      },
    ],
  },
  { 
    slug: 'tonic',
    title: 'Tonic Inc. Digital Consulting',
    period: 'Nov 2021 – Dec 2023',
    description:
      'Full stack web and mobile engineer across a range of clients — from private equity dashboards to non-profit mobile apps, and marketing integrations.',
    children: [
      {
        slug: 'kula',
        title: 'Kula App - React Native Mobile App',
        description:
          'Cross-platform React Native mobile app with authentication, activity tracking, push notifications, and Redux-powered offline storage. Built for a non-profit client.',
      },
      {
        slug: 'torus',
        title: 'Torus Transforms - React Native Mobile App',
        description:
          'React Native mobile app providing multilingual COVID-19 information in Dari, Russian, and Thai. Launched as a mobile web app after app store publishing restrictions.',
      },
      {
        slug: 'us-climate-alliance',
        title: 'U.S. Climate Alliance - Custom WordPress Site, embedded React Applications + REST API trips',
        description:
          'WordPress/Elementor site rebuild for a bipartisan governor coalition — 22 responsive templates, Policy Database integration, interactive member map, and client training.',
      },
      {
        slug: 'lexisnexis',
        title: 'LexisNexis TPU Assessment - Custom JavaScript Tool',
        description:
          'Interactive risk assessment tool for insurance underwriting professionals built with HTML, CSS, JavaScript, and PHP. Embeddable, tablet-responsive, with URL-parameter lead scoring.',
      },
      {
        slug: 'n-tier',
        title: 'N-Tier Financial Services - Custom WordPress Build',
        description:
          'WordPress site build with 12 responsive templates and a custom jQuery megamenu for regulatory reporting and risk management content. Sole engineer, five weeks.',
      },
      {
        slug: 'warburg-pincus',
        title: 'Warburg Pincus — Quill Application',
        description:
          'Internal React + AG Grid dashboard application for 300+ private equity deal professionals. Ten data visualizations, real-time state updates, and iLevel integration.',
      },
      {
        slug: 'doublecheck',
        title: 'DoubleCheck - Bootstrap/Angular Tabular Templates',
        description:
          'Bootstrap/Angular-compatible front-end templates for tabular transaction data, built to unblock the client\'s Angular team before an internal deadline.',
      },
      {
        slug: 'angular-todo',
        title: 'Angular Todo App - Code challenge demo',
        description:
          'A task management SPA built with Angular 11, TypeScript, and RxJS as a coding challenge. Led directly to the consulting role at Tonic.',
      },
    ],
  },
  {
    slug: 'nextworld',
    title: 'Nextworld',
    period: 'Jun 2019 – Nov 2021',
    description:
      'Enterprise reporting and analytics engineering on a SaaS ERP platform. First professional role — promoted from Associate to Software Engineer within three months.',
  },
  {
    slug: 'personal-website',
    title: 'Personal Website',
    description:
      'This site — Next.js 15 App Router, markdown-driven content, D3.js visualizations, and CSS Modules. Designed to be lightweight, content-first, and easy to extend.',
  },
  {
    slug: 'technical-summary',
    title: 'Technical Summary',
    description:
      'Languages, frameworks, tools, and integrations across the full stack.',
  },
  {
    slug: 'miscellaneous',
    title: 'Miscellaneous',
    description:
      'Interactive demos built for this site — an animated Watchmaker clock and a D3.js data visualization.',
  },
]
