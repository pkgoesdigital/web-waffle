import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'Kula App — Portfolio' }

export default function KulaPage() {
  return (
    <PortfolioPage slug="kula">
      <p>
        Kula is a cross-platform mobile app built in React Native targeting both
        iOS and Android. It features user authentication, child profile
        management, activity tracking, a favorites system, and push notifications
        via OneSignal.
      </p>

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
