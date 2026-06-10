import { Link, NavLink } from 'react-router-dom'
import { site } from '../config/site'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, signOut } = useAuth()
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand">
          <span className="brand__mark" aria-hidden>✎</span>
          {site.brand}
        </Link>
        <nav className="site-nav">
          <NavLink to="/curriculum">커리큘럼</NavLink>
          {user ? (
            <>
              <span className="site-nav__user mono">{user.email?.split('@')[0]}</span>
              <button className="btn btn-ghost btn-sm" onClick={signOut}>로그아웃</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">로그인</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
