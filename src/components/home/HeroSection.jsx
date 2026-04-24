import { Link } from "react-router-dom";

function HeroSection({
    categories,
    appleLogo,
    arrowIcon,
    heroImage,
    heroImageAlt,
    to,
}) {
    return (
        <section className="home-page__hero">
            <div className="app-shell__container home-page__hero-grid">
                <aside
                    aria-label="Product Categories"
                    className="home-page__sidebar"
                >
                    {categories.map((category) => (
                        <button
                            className="home-page__sidebar-link"
                            key={category.label}
                            type="button"
                        >
                            <span>{category.label}</span>
                            {category.nested ? (
                                <img
                                    alt=""
                                    className="home-page__sidebar-arrow"
                                    src={arrowIcon}
                                />
                            ) : null}
                        </button>
                    ))}
                </aside>

                <div className="home-page__hero-banner">
                    <div className="home-page__hero-copy">
                        <p className="home-page__hero-kicker">
                            <img alt="" src={appleLogo} />
                            iPhone 14 Series
                        </p>
                        <h1>Up to 10% off Voucher</h1>
                        <Link className="home-page__hero-cta" to={to}>
                            Shop Now
                            <img alt="" src={arrowIcon} />
                        </Link>
                    </div>

                    <div className="home-page__hero-artwork">
                        <img alt={heroImageAlt} src={heroImage} />
                    </div>

                    <div className="home-page__hero-dots" aria-label="Hero Slides">
                        <span />
                        <span />
                        <span className="is-active" />
                        <span />
                        <span />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
