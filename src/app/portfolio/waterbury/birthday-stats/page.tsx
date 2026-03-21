import type { Metadata } from 'next'
import Image from 'next/image'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'Birthday Stats — Portfolio' }

const parent = { slug: 'waterbury', title: 'The Waterbury Group' }

export default function BirthdayStatsPage() {
  return (
    <PortfolioPage slug="birthday-stats" parent={parent}>
      <p>
        Birthday Stats is a sports analytics proof of concept that surfaces NBA
        player statistics specifically tied to games played on a player&rsquo;s
        birthday. The client — non-technical, with a strong vision — wanted to
        explore whether real-time sports data could power a consumer-facing
        product, with room to grow into a full league tracker.
      </p>

      <h2>Architecture</h2>
      <p>
        The application is split across a React frontend and a Next.js backend,
        with both layers pulling data from an ETL pipeline hosted on AWS. Raw
        NBA stats are extracted, transformed, and loaded into an S3 bucket as
        compressed <code>.gz</code> files, which the Next.js API routes fetch
        and serve to the frontend on demand.
      </p>

      <h2>Frontend — Vite + React</h2>
      <p>
        The frontend is built with Vite and React, keeping the component layer
        focused on display logic without additional framework overhead. It
        handles the leaderboard views, player index, and birthday calendar —
        each driven by data fetched from the backend API routes.
      </p>

      <Image
        src="/img/birthday-stats/leaderboard.webp"
        alt="Birthday Stats leaderboard showing stat categories including Points, Rebounds, Assists, Steals, Blocks, and Field Goals with player rankings"
        width={1432}
        height={1522}
        sizes="(max-width: 860px) 100vw, 860px"
        style={{ width: '100%', height: 'auto' }}
      />

      <h2>Backend — Next.js + AWS S3</h2>
      <p>
        The Next.js layer handles server-side data fetching from the S3-hosted
        ETL output, transforming the compressed stat files into structured
        responses for the frontend. Player profile pages display birthday-specific
        career stats, season averages, and a +/- metric that measures how a
        player performs on their birthday relative to their season baseline.
      </p>

      <Image
        src="/img/birthday-stats/player-profile.webp"
        alt="Birthday Stats player profile for Nikola Jokic showing birthday stats, season averages, and a data pipeline message with an S3 path"
        width={1550}
        height={1172}
        sizes="(max-width: 860px) 100vw, 860px"
        style={{ width: '100%', height: 'auto' }}
      />
    </PortfolioPage>
  )
}
