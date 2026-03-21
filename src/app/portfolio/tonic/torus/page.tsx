import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'Torus Transforms — Portfolio' }

const parent = { slug: 'tonic', title: 'Tonic Inc. Digital Consulting' }

export default function TorusPage() {
  return (
    <PortfolioPage slug="torus" parent={parent}>
      <p>
        Torus bridges gaps between people and communities by facilitating
        transformative experiences of language and culture exchange. This
        eight-week engagement was the beta build of a multilingual mobile app
        designed to help users find comprehensive, translated information about
        COVID-19 in Dari, Russian, and Thai.
      </p>

      <h2>The Project</h2>
      <p>
        The app was built in React Native, targeting both iOS and Android, with
        a focus on localization and accessibility for non-English-speaking
        communities navigating public health information during the pandemic.
        Content was translated and managed through the CMS layer, with push
        notifications used to surface updated guidance.
      </p>
      <p>
        During the submission process, both the Google Play Store and Apple App
        Store restricted the publication of apps centered on COVID-19 information,
        which required a pivot: the beta launched as a mobile web application
        instead of a native install. The project subsequently moved into a second
        development iteration.
      </p>

      <h2>My Role</h2>
      <p>
        Working alongside the lead mobile engineer, I built out the application
        screens, implemented routing, configured push notifications, handled
        localization for the three target languages, and prepared the app for
        submission to both stores. This was the second of two React Native mobile
        apps I delivered at Tonic — the platform-specific knowledge from Kula
        carried directly into this engagement.
      </p>

      <h2>Technical Highlights</h2>
      <ul>
        <li>React Native — cross-platform iOS and Android</li>
        <li>Localization for Dari, Russian, and Thai</li>
        <li>Push notifications for content updates</li>
        <li>React Navigation for screen routing</li>
        <li>
          App store submission for both Google Play and Apple App Store; launched
          as mobile web after platform COVID-19 publishing restrictions
        </li>
      </ul>
    </PortfolioPage>
  )
}
