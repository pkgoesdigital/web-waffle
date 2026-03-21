import type { Metadata } from 'next'
import Image from 'next/image'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'Kula App — Portfolio' }

const parent = { slug: 'tonic', title: 'Tonic Inc. Digital Consulting' }

export default function KulaPage() {
  return (
    <PortfolioPage slug="kula" parent={parent}>
      <p>
        Kula is a cross-platform mobile app built in React Native targeting both
        iOS and Android. It features user authentication, child profile
        management, activity tracking, a favorites system, and push notifications
        via OneSignal.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        <Image
          src="/img/kula/kula-home.webp"
          alt="Kula home screen showing child profile for Suzi with age-range tabs and monthly activity content"
          width={1125}
          height={2436}
          sizes="(max-width: 640px) 50vw, 430px"
          style={{ width: '100%', height: 'auto' }}
        />
        <Image
          src="/img/kula/kula-activity-detail.webp"
          alt="Kula activity detail screen showing Month 10 development summary for a 14-year-old child profile"
          width={1125}
          height={2436}
          sizes="(max-width: 640px) 50vw, 430px"
          style={{ width: '100%', height: 'auto' }}
        />
        <Image
          src="/img/kula/kula-activity-modal.webp"
          alt="Kula activity modal displaying Year 14 Month 10 guidance content for caregivers"
          width={1125}
          height={2436}
          sizes="(max-width: 640px) 50vw, 430px"
          style={{ width: '100%', height: 'auto' }}
        />
        <Image
          src="/img/kula/kula-resources.webp"
          alt="Kula Resources tab showing USA and Canada support organizations including the National Children's Advocacy Center"
          width={1125}
          height={2436}
          sizes="(max-width: 640px) 50vw, 430px"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      <h2>Architecture</h2>
      <p>
        State is managed through Redux with <code>redux-persist</code> for
        offline-capable storage, and navigation uses React Navigation with a
        tab-based layout and native stack screens. The app is styled with SASS
        and includes Font Awesome iconography, carousel components, and
        Reanimated-powered animations.
      </p>

      <h2>What I Learned</h2>
      <p>
        This project sharpened my understanding of native module bridging,
        platform-specific build tooling (CocoaPods, Gradle), and the particular
        challenges of mobile state management — especially around persistence
        and rehydration across app restarts.
      </p>
      <p>
        Kula was one of two mobile apps I built for non-profit organizations,
        demonstrating technical aptitude through on-the-job learning of React
        Native. Both apps shipped to their respective user bases and remain in
        use.
      </p>
    </PortfolioPage>
  )
}
