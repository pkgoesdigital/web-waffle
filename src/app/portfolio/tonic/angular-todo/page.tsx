import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'Angular Todo App — Portfolio' }

const parent = { slug: 'tonic', title: 'Tonic Inc. Digital Consulting' }

export default function AngularTodoPage() {
  return (
    <PortfolioPage slug="angular-todo" parent={parent}>
      <p>
        A task management SPA built with Angular 11, TypeScript, Bootstrap 5,
        and NgBootstrap. Built as a coding challenge, it demonstrates
        component-based Angular architecture with RxJS observables for state
        management, Karma/Jasmine testing infrastructure, and
        production-optimized build configuration.
      </p>

      <h2>Context</h2>
      <p>
        This project represents another framework in my toolkit alongside React
        and React Native. Angular&rsquo;s opinionated structure — dependency
        injection, decorators, the module system — is a useful counterpoint to
        React&rsquo;s flexibility. Understanding both makes it easier to reason
        about the architectural trade-offs each one makes.
      </p>
      <p>
        The challenge led directly to the consulting role at Tonic, where the
        breadth of framework experience proved immediately useful across the
        variety of client projects.
      </p>
    </PortfolioPage>
  )
}
