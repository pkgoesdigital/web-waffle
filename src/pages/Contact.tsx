import content from "../content/wpContent.json";
import type { SiteContent } from "../types/content";
import SocialLinks from "../components/SocialLinks";

const site = content as SiteContent;

export default function Contact() {
  return (
    <div>
      <h1>Contact</h1>

      <p>
        Ask questions, connect, or exchange dad jokes. The simplest way to reach
        me is through LinkedIn.
      </p>
    </div>
  );
}
