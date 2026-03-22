import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'ERP Migration — Portfolio' }

const parent = { slug: 'tuff-shed', title: 'Tuff Shed' }

export default function ErpMigrationPage() {
  return (
    <PortfolioPage slug="erp-migration" parent={parent}>
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
    </PortfolioPage>
  )
}
