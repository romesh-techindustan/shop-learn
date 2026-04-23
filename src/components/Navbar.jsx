import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'contact', label: 'Contact' },
  { id: 'about', label: 'About' },
  { id: 'sign-up', label: 'Sign Up', to: '/auth/sign-up' },
]

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm9 3-4.35-4.35"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function Navbar() {
  const { pathname } = useLocation()
  const activeItem = pathname.startsWith('/auth/sign-up') ? 'sign-up' : ''

  return (
    <div className="navbar">
      <div className="navbar__promo">
        <div className="app-shell__container navbar__promo-inner">
          <p className="navbar__promo-text">
            Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
            <button className="navbar__text-link" type="button">
              ShopNow
            </button>
          </p>
          <button className="navbar__language" type="button">
            English
            <span aria-hidden="true">▾</span>
          </button>
        </div>
      </div>

      <header className="navbar__header">
        <div className="app-shell__container navbar__header-inner">
          <Link className="navbar__brand" to="/auth/sign-up">
            Exclusive
          </Link>

          <nav aria-label="Primary" className="navbar__nav">
            {navItems.map((item) =>
              item.to ? (
                <Link
                  aria-current={activeItem === item.id ? 'page' : undefined}
                  className={`navbar__nav-link ${
                    activeItem === item.id ? 'navbar__nav-link--active' : ''
                  }`}
                  key={item.id}
                  to={item.to}
                >
                  {item.label}
                </Link>
              ) : (
                <button className="navbar__nav-link" key={item.id} type="button">
                  {item.label}
                </button>
              ),
            )}
          </nav>

          <label className="navbar__search">
            <span className="navbar__sr-only">Search products</span>
            <input
              aria-label="Search products"
              placeholder="What are you looking for?"
              type="text"
            />
            <SearchIcon />
          </label>
        </div>
      </header>
    </div>
  )
}

export default Navbar
