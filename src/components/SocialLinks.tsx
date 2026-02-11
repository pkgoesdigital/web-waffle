import type { SocialLink } from '../types/content'

export default function SocialLinks({ links }: { links: SocialLink[] }) {
  if (!links?.length) return null
  return (
    <ul className="social-icons">
      {links.map((l) => (
        <li key={l.href}>
          <a href={l.href} target="_blank" rel="noreferrer">
            {l.img ? <img src={l.img} alt="" /> : l.label ?? l.href}
          </a>
        </li>
      ))}
    </ul>
  )
}
