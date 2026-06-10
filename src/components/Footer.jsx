import { Link } from 'react-router-dom'
import { site, footerLinks } from '../config/site'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <div className="brand brand--footer">{site.brand}</div>
          <p className="site-footer__tag">{site.tagline}</p>
        </div>
        <nav className="site-footer__links">
          {footerLinks.map((l) => (
            <Link key={l.to} to={l.to}>{l.label}</Link>
          ))}
          <a href={`mailto:${site.contact}`}>{site.contact}</a>
        </nav>
      </div>
      <div className="container site-footer__base mono">
        © {site.brand} · DreamIT Biz — 학습사이트 아트디렉션 템플릿
      </div>
    </footer>
  )
}
