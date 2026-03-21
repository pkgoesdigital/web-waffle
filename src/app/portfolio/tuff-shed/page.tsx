import type { Metadata } from 'next'
import Link from 'next/link'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'
import { portfolioSections } from '@/data/portfolio-sections'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Tuff Shed — Portfolio' }

export default function TuffShedPage() {
  const section = portfolioSections.find((s) => s.slug === 'tuff-shed')

  return (
    <PortfolioPage slug="tuff-shed">
      <p>
        Tuff Shed&rsquo;s data platform sits at the center of a distributed system spanning legacy ERP, cloud infrastructure,
        and a modern digital storefront. The core work involves designing and maintaining the pipelines, models, and services
        that keep operational and fiscal data clean, accessible, and in sync across the stack.
      </p>

      <h2>Frontend Monorepo</h2>
      <p>
        The monorepo is built on Next.js with TypeScript and orchestrated by
        Turborepo and pnpm workspaces. The team built and maintains a shared UI
        component library of 75+ components consumed across all applications,
        along with a shared helpers package that abstracts integrations with
        Salesforce, Storyblok CMS, Google Maps and Places, and analytics. The
        system uses Jotai for lightweight state management, Formik and Yup for
        form validation, and DAPR for inter-service communication.
      </p>
      <p>
        The architecture keeps six distinct applications aligned through shared
        packages, consistent TypeScript configuration, and a unified design
        system built on Tailwind CSS. It&rsquo;s the kind of codebase where a
        new teammate can spin up any app and immediately recognize the patterns.
      </p>

      <h2>Backend Services</h2>
      <p>
        The backend is a .NET 9.0 microservices architecture with 13 services —
        including a DataMigrationService, NextworldService, SalesforceService,
        JdeService (for JD Edwards legacy integration), and HomeDepotService —
        all communicating via DAPR sidecars. Infrastructure runs on Azure with
        Redis caching, SQL Server and MongoDB databases, and Docker Compose for
        local development.
      </p>
      <p>
        The team built RESTful APIs in C# using ASP.NET Core with proper MVC
        patterns — 28 controllers, DTOs, repository abstraction, and polymorphic
        domain models with inheritance hierarchies. The Bogus library is used for
        realistic test data generation, and defensive programming patterns
        maximize backward compatibility in production hot patches.
      </p>

      <h2>Promotions Engine</h2>
      <p>
        Beyond the core monorepo, the team designed and maintains a
        configuration-driven promotion rules engine that powers the
        company&rsquo;s discount and offer system. The engine supports six
        distinct promotion types — percentage-off, free upgrades, buy-X-get-Y,
        tiered spend thresholds, and location-specific product discounts — all
        defined declaratively in CSV-based rule files versioned in Git and
        deployed via CI/CD. The rules span multiple dimensions including building
        type, product series, and store location, making the system flexible
        enough to support diverse marketing strategies without code changes.
      </p>

      <h2>ERP Migration</h2>
      <p>
        As part of the Tuff Shed engagement, the team also initiated a
        large-scale data cleaning and migration effort to support an ERP
        implementation with Nextworld. The migration scripts — a collection of
        Python Jupyter notebooks running on Azure ML compute instances — handled
        the ETL pipeline for moving fiscal and operational data from JD Edwards
        into the new system. The work involved reading CSVs from Azure Blob
        Storage, handling legacy cp1252 character encoding, cleaning over a
        million GL transaction records across five partitioned files, and
        processing dimension tables for chart of accounts, suppliers, serial
        tags, and company structure.
      </p>
      <p>
        The DataMigrationService in the core monorepo (28 controllers, 40
        orchestration classes, and 18 embedded CSV seed files totaling over 1.1
        million records) was built to ingest and transform that cleaned data. The
        JD Edwards-to-Nextworld migration was ultimately canceled when the
        business relationship with Nextworld soured — but the DataMigrationService
        remains in place today, serving as the broader data infrastructure for
        ongoing migration and integration needs across the platform.
      </p>

      {section?.children && section.children.length > 0 && (
        <div className={styles.projects}>
          <h2>Projects</h2>
          <ul className={styles.projectList}>
            {section.children.map((child) => (
              <li key={child.slug}>
                <Link href={`/portfolio/tuff-shed/${child.slug}`} className={styles.projectLink}>
                  <span className={styles.projectTitle}>{child.title}</span>
                  <span className={styles.projectDescription}>{child.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PortfolioPage>
  )
}
