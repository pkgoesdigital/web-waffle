import type { Metadata } from 'next'
import Image from 'next/image'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'U.S. Climate Alliance — Portfolio' }

const parent = { slug: 'tonic', title: 'Tonic Inc. Digital Consulting' }

export default function USClimateAlliancePage() {
  return (
    <PortfolioPage slug="us-climate-alliance" parent={parent}>
      <p>
        The U.S. Climate Alliance is a bipartisan coalition of governors committed
        to reducing greenhouse gas emissions and meeting the goals of the Paris
        Agreement. This engagement was a full site rebuild delivered in two months —
        15 screens were contracted, and 22 were delivered due to scope that expanded
        during discovery.
      </p>

      <Image
        src="/img/us-climate-alliance/homepage.webp"
        alt="U.S. Climate Alliance homepage showing the hero banner, coalition description, and population/economy statistics"
        width={3104}
        height={1974}
        sizes="(max-width: 860px) 100vw, 860px"
        style={{ width: '100%', height: 'auto' }}
      />

      <h2>Project Requirements</h2>
      <ul>
        <li>All screens matched Figma designs as closely as possible</li>
        <li>
          Resources and News &amp; Events sections filterable by multiple tags
        </li>
        <li>Fully responsive across desktop, tablet, and mobile; WCAG accessible</li>
        <li>Non-technical staff able to maintain content independently</li>
        <li>
          Policy Priorities page and individual priority pages update metrics on
          page load from the U.S. Climate Alliance Policy Database
        </li>
        <li>
          Homepage member slider updates dynamically on hover over the state graphic
        </li>
        <li>Member pages easily updated as the coalition grows</li>
        <li>All pre-existing content preserved; new content written to fill gaps</li>
        <li>Screen templates easily duplicated for future content needs</li>
      </ul>

      <h2>Stack &amp; Approach</h2>
      <p>
        Built on WordPress with Elementor as the page-building layer, giving the
        client a maintainable CMS without sacrificing design fidelity. Custom
        Elementor widgets handled the dynamic Policy Database integration and the
        interactive state-map member slider. A full library of Loom tutorial videos
        was recorded post-launch, empowering the client&rsquo;s team to manage
        content independently going forward.
      </p>

      <Image
        src="/img/us-climate-alliance/members-map.webp"
        alt="Alliance Members page showing an interactive state map with hover-driven member detail panel for Gov. Roy Cooper of North Carolina"
        width={3104}
        height={1974}
        sizes="(max-width: 860px) 100vw, 860px"
        style={{ width: '100%', height: 'auto' }}
      />

      <Image
        src="/img/us-climate-alliance/policy-priorities.webp"
        alt="Policy Priorities page showing 10 policy area tiles including GHG Targets, Buildings, Climate Finance, and Transportation"
        width={3104}
        height={1974}
        sizes="(max-width: 860px) 100vw, 860px"
        style={{ width: '100%', height: 'auto' }}
      />

      <Image
        src="/img/us-climate-alliance/policy-data-tables.webp"
        alt="Policy Priorities data tables showing live member counts per policy area, including GHG Targets & Governance and Buildings"
        width={2880}
        height={1666}
        sizes="(max-width: 860px) 100vw, 860px"
        style={{ width: '100%', height: 'auto' }}
      />

      <h2>What I Delivered</h2>
      <p>
        I was the sole engineer on this project. Deliverables included 22 responsive
        screen templates, REST integrations with the Alliance&rsquo;s Policy
        Database, a tag-based filtering system for resources and events, an
        interactive member roster with hover-driven state map, and a full
        content-management training package. The site launched on time within the
        two-month window.
      </p>

      <Image
        src="/img/us-climate-alliance/news-events.webp"
        alt="Latest From The Alliance section showing featured press releases and news articles with images"
        width={3104}
        height={1974}
        sizes="(max-width: 860px) 100vw, 860px"
        style={{ width: '100%', height: 'auto' }}
      />

      <Image
        src="/img/us-climate-alliance/member-page.webp"
        alt="Colorado member page showing the state hero banner and member-since information"
        width={2880}
        height={1666}
        sizes="(max-width: 860px) 100vw, 860px"
        style={{ width: '100%', height: 'auto' }}
      />
    </PortfolioPage>
  )
}
