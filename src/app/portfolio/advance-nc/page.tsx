import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'Advance NC — Portfolio' }

export default function AdvanceNcPage() {
  return (
    <PortfolioPage slug="advance-nc">
      <p>
        For Advance NC, I developed interactive web content including custom
        Elementor widgets for WordPress — career sliders, county filter
        components — and SCORM-packaged online courses covering sector spotlights
        in Advanced Materials and Biotech.
      </p>

      <h2>SCORM Courses</h2>
      <p>
        The SCORM packages are built for LMS deployment and follow the 1.2
        specification for broad compatibility. Additional educational content
        included courses developed for Emily Griffith Technical College. The
        courses are still deployed and in active use across multiple learning
        management systems.
      </p>

      <h2>Instructional Design</h2>
      <p>
        This work sits at the intersection of development and instructional
        design — building interactive experiences where the measure of success is
        whether someone actually learns something. It required thinking carefully
        about information hierarchy, pacing, and interactivity in ways that pure
        application development doesn&rsquo;t always demand.
      </p>
    </PortfolioPage>
  )
}
