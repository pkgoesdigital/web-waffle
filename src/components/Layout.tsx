import { Outlet, Link } from "react-router-dom";
import content from "../content/wpContent.json";
import type { SiteContent } from "../types/content";
import SocialLinks from "./SocialLinks";
import NavBar from "./NavBar";

const site = content as SiteContent;

export default function Layout() {
  return (
    <>
      <header>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Paula Klimas
        </Link>
        <div>
          <SocialLinks links={site.socialLinks} />
        </div>
        <NavBar />
      </header>

      <div className="page">
        <Outlet />
      </div>

      <footer>
        <div>
          <SocialLinks links={site.socialLinks} />
        </div>
      </footer>
    </>
  );
}
