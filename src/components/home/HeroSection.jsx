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
        <section className="homePageHeroSection">
            <div className="appContainer homeHeroGrid">
                <aside
                    aria-label="Product Categories"
                    className="homeHeroSidebar"
                >
                    {categories.map((category) => (
                        <button
                            className="homeSidebarLink"
                            key={category.label}
                            type="button"
                        >
                            <span>{category.label}</span>
                            {category.nested ? (
                                <img
                                    alt=""
                                    className="homeSidebarArrowIcon"
                                    src={arrowIcon}
                                />
                            ) : null}
                        </button>
                    ))}
                </aside>

                <div className="homeHeroBanner">
                    <div className="homeHeroCopy">
                        <p className="homeHeroEyebrow">
                            <img alt="" src={appleLogo} />
                            iPhone 14 Series
                        </p>
                        <h1>Up to 10% off Voucher</h1>
                        <Link className="homeHeroCallToAction" to={to}>
                            Shop Now
                            <img alt="" src={arrowIcon} />
                        </Link>
                    </div>

                    <div className="homeHeroArtwork">
                        <img alt={heroImageAlt} src={heroImage} />
                    </div>

                    <div className="homeHeroPaginationDots" aria-label="Hero Slides">
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
