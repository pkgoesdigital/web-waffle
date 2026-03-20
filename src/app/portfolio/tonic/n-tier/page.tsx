import type { Metadata } from 'next'
import PortfolioPage from '@/components/PortfolioPage/PortfolioPage'

export const metadata: Metadata = { title: 'N-Tier Financial Services — Portfolio' }

const parent = { slug: 'tonic', title: 'Tonic Inc. Digital Consulting' }

export default function NTierPage() {
  return (
    <PortfolioPage slug="n-tier" parent={parent}>
      <p>
        N-Tier Financial Services is a technology platform serving insurance
        professionals with tools for regulatory reporting and risk management.
        This five-week engagement was a ground-up website build — 12 responsive
        templates, a full content management system, and hands-on client training,
        all delivered with an in-house UI design team providing direction.
      </p>

      <h2>Stack &amp; Approach</h2>
      <p>
        The site was built on WordPress as the CMS with jQuery and JavaScript
        powering custom interactive behavior. The most technically interesting
        problem was the megamenu navigation: N-Tier&rsquo;s content hierarchy was
        deep enough that a standard dropdown couldn&rsquo;t cleanly surface
        sub-sections across their platform, solutions, and resources areas.
      </p>
      <p>
        A custom hover-driven megamenu was built using jQuery — each top-level
        nav item mapped to a panel of sub-navigation content, with the active panel
        swapping on <code>mouseover</code>. Sub-menu items were filtered out of
        the trigger set so only top-level items drove panel visibility:
      </p>
      <pre><code>{`navItems.forEach((navSelector) => {
  const triggers = menu.find(".menu-item").filter(function () {
    return !jQuery(this).parents(".jet-custom-nav__sub").length;
  });
  triggers.on("mouseover", function () {
    var myindex = triggers.index(this);
    hovers.hide();
    firstItem.hide();
    jQuery(hovers[myindex]).show();
  });
});`}</code></pre>

      <h2>What I Delivered</h2>
      <p>
        I was the sole engineer on this project. Deliverables included 12 fully
        responsive page templates, the custom megamenu solution, WordPress
        configuration covering whitepapers, analyst reports, webinars, articles,
        blog posts, events, and news, client training on content management,
        information architecture guidance, SEO recommendations, and QA. The site
        launched within the five-week timeline.
      </p>
    </PortfolioPage>
  )
}
