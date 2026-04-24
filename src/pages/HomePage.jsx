import { Link } from "react-router-dom";
import bookselfImage from "../assets/bookself.png";
import bootImage from "../assets/boot.png";
import cameraImage from "../assets/camera.png";
import catImage from "../assets/cat.png";
import chairImage from "../assets/chair.png";
import cosmeticImage from "../assets/cosmetic.png";
import gameBoyImage from "../assets/GP11.png";
import laptopImage from "../assets/ideapad-gaming.png";
import userServiceIcon from "../assets/icons/Icon-Customer-service.svg";
import secureServiceIcon from "../assets/icons/Icon-secure.svg";
import deliveryServiceIcon from "../assets/icons/icon-delivery.svg";
import appleLogo from "../assets/icons/1200px-Apple_gray_logo 1.svg";
import cameraCategoryIcon from "../assets/icons/Category-Camera.svg";
import cellphoneIcon from "../assets/icons/Category-CellPhone.svg";
import computerIcon from "../assets/icons/Category-Computer.svg";
import gamepadCategoryIcon from "../assets/icons/Category-Gamepad.svg";
import headphoneIcon from "../assets/icons/Category-Headphone.svg";
import smartwatchIcon from "../assets/icons/Category-SmartWatch.svg";
import arrowRightIcon from "../assets/icons/icons arrow-right.svg";
import iPhoneImage from "../assets/iphone.png";
import jacketImage from "../assets/jacket.png";
import jblImage from "../assets/JBL_BOOMBOX.png";
import joystickImage from "../assets/joystick.png";
import keyboardImage from "../assets/keyboard.png";
import bagImage from "../assets/Light-Gucci-Savoy-medium-duffle-bag.png";
import coatImage from "../assets/Light-The-North-Face-x-Gucci-coat.png";
import monitorImage from "../assets/monitor.png";
import toyCarImage from "../assets/New-Mercedes-Benz-Gtr.png";
import perfumeImage from "../assets/perfume.png";
import ps5Image from "../assets/ps5-playstation.png";
import speakerImage from "../assets/speaker-three.png";
import womenImage from "../assets/women.png";
import wooferImage from "../assets/woofer.png";
import { ProductCard } from "../components/ProductCard";
import CountdownTimer from "../components/home/CountdownTimer";
import SectionEyebrow from "../components/home/SectionEyebrow";
import SectionHeader from "../components/home/SectionHeader";
import "./HomePage.css";

const heroCategories = [
    { label: "Woman's Fashion", nested: true },
    { label: "Men's Fashion", nested: true },
    { label: "Electronics" },
    { label: "Home & Lifestyle" },
    { label: "Medicine" },
    { label: "Sports & Outdoor" },
    { label: "Baby's & Toys" },
    { label: "Groceries & Pets" },
    { label: "Health & Beauty" },
];

const browseCategories = [
    { label: "Phones", image: cellphoneIcon },
    { label: "Computers", image: computerIcon },
    { label: "SmartWatch", image: smartwatchIcon },
    { label: "Camera", image: cameraCategoryIcon },
    { label: "HeadPhones", image: headphoneIcon },
    { label: "Gaming", image: gamepadCategoryIcon },
];

const flashSaleProducts = [
    {
        name: "HAVIT HV-G92 Gamepad",
        price: 120,
        oldPrice: 160,
        rating: 5,
        reviews: 88,
        badge: "-40%",
        theme: "rose",
        image: joystickImage,
    },
    {
        name: "AK-900 Wired Keyboard",
        price: 960,
        oldPrice: 1160,
        rating: 4,
        reviews: 75,
        badge: "-35%",
        theme: "neon",
        showCart: true,
        image: keyboardImage,
    },
    {
        name: "IPS LCD Gaming Monitor",
        price: 370,
        oldPrice: 400,
        rating: 5,
        reviews: 99,
        badge: "-30%",
        theme: "ember",
        image: monitorImage,
    },
    {
        name: "S-Series Comfort Chair",
        price: 375,
        oldPrice: 400,
        rating: 5,
        reviews: 99,
        badge: "-25%",
        theme: "sand",
        image: chairImage,
    },
    {
        name: "V8 Wired Controller",
        price: 140,
        oldPrice: 190,
        rating: 4,
        reviews: 64,
        badge: "-20%",
        theme: "slate",
        image: joystickImage,
    },
];

const bestSellingProducts = [
    {
        name: "The North Coat",
        price: 260,
        oldPrice: 360,
        rating: 5,
        reviews: 65,
        theme: "rose",
        image: coatImage,
    },
    {
        name: "Gucci Duffle Bag",
        price: 960,
        oldPrice: 1160,
        rating: 4,
        reviews: 65,
        theme: "cocoa",
        image: bagImage,
    },
    {
        name: "RGB Liquid CPU Cooler",
        price: 160,
        oldPrice: 170,
        rating: 4,
        reviews: 65,
        theme: "violet",
        image: wooferImage,
    },
    {
        name: "Small BookShelf",
        price: 360,
        rating: 5,
        reviews: 65,
        theme: "brass",
        image: bookselfImage,
    },
];

const exploreProducts = [
    {
        name: "Breed Dry Dog Food",
        price: 100,
        rating: 3,
        reviews: 35,
        theme: "midnight",
        image: catImage,
    },
    {
        name: "CANON EOS DSLR Camera",
        price: 360,
        rating: 4,
        reviews: 95,
        theme: "slate",
        image: cameraImage,
        showCart: true,
    },
    {
        name: "ASUS FHD Gaming Laptop",
        price: 700,
        rating: 5,
        reviews: 325,
        theme: "aqua",
        image: laptopImage,
    },
    {
        name: "Curology Product Set",
        price: 500,
        rating: 4,
        reviews: 145,
        theme: "sand",
        image: cosmeticImage,
    },
    {
        name: "Kids Electric Car",
        price: 960,
        rating: 5,
        reviews: 65,
        theme: "rose",
        image: toyCarImage,
        badge: "NEW",
        colors: ["#111111", "#db4444"],
    },
    {
        name: "Jr. Zoom Soccer Cleats",
        price: 1160,
        rating: 4,
        reviews: 35,
        theme: "citrus",
        image: bootImage,
        colors: ["#eef267", "#db4444"],
    },
    {
        name: "GP11 Shooter USB Gamepad",
        price: 660,
        rating: 5,
        reviews: 55,
        theme: "noir",
        image: gameBoyImage,
        badge: "NEW",
        colors: ["#111111", "#db4444"],
    },
    {
        name: "Quilted Satin Jacket",
        price: 660,
        rating: 4,
        reviews: 55,
        theme: "midnight",
        image: jacketImage,
        colors: ["#184a47", "#db4444"],
    },
];

const services = [
    {
        title: "FREE AND FAST DELIVERY",
        description: "Free delivery for all orders over $140",
        icon: deliveryServiceIcon,
    },
    {
        title: "24/7 CUSTOMER SERVICE",
        description: "Friendly 24/7 customer support",
        icon: userServiceIcon,
    },
    {
        title: "MONEY BACK GUARANTEE",
        description: "We return money within 30 days",
        icon: secureServiceIcon,
    },
];

const flashTimerValues = [
    { label: "Days", value: "03" },
    { label: "Hours", value: "23" },
    { label: "Minutes", value: "19" },
    { label: "Seconds", value: "56" },
];

const featureTimerValues = [
    { label: "Hours", value: "23" },
    { label: "Days", value: "05" },
    { label: "Minutes", value: "59" },
    { label: "Seconds", value: "35" },
];

const featuredArrivals = [
    {
        title: "PlayStation 5",
        description: "Black and White version of the PS5 coming out on sale.",
        image: ps5Image,
        imageAlt: "PlayStation 5 console",
        variant: "tall",
    },
    {
        title: "Women's Collections",
        description: "Featured woman collections that give you another vibe.",
        image: womenImage,
        imageAlt: "Women's collection campaign",
        variant: "wide",
    },
    {
        title: "Speakers",
        description: "Amazon wireless speakers",
        image: speakerImage,
        imageAlt: "Portable speakers",
    },
    {
        title: "Perfume",
        description: "GUCCI INTENSE OUD EDP",
        image: perfumeImage,
        imageAlt: "Perfume bottle",
    },
];

function HomePage() {
    return (
        <main className="home-page">
            <section className="home-page__hero">
                <div className="app-shell__container home-page__hero-grid">
                    <aside
                        aria-label="Product Categories"
                        className="home-page__sidebar"
                    >
                        {heroCategories.map((category) => (
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
                                        src={arrowRightIcon}
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
                            <Link className="home-page__hero-cta" to="/auth/sign-up">
                                Shop Now
                                <img alt="" src={arrowRightIcon} />
                            </Link>
                        </div>

                        <div className="home-page__hero-artwork">
                            <img alt="iPhone 14" src={iPhoneImage} />
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

            <section className="home-page__section">
                <div className="app-shell__container">
                    <SectionEyebrow>Today&apos;s</SectionEyebrow>
                    <SectionHeader
                        navigationLabel="products"
                        timerItems={flashTimerValues}
                        title="Flash Sales"
                    />

                    <div className="home-product-grid home-product-grid--flash">
                        {flashSaleProducts.map((product) => (
                            <ProductCard key={product.name} product={product} />
                        ))}
                    </div>

                    <div className="home-page__center-action">
                        <Link className="home-page__primary-link" to="/auth/sign-up">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            <section className="home-page__section home-page__section--bordered">
                <div className="app-shell__container">
                    <SectionEyebrow>Categories</SectionEyebrow>
                    <SectionHeader
                        navigationLabel="categories"
                        title="Browse By Category"
                    />

                    <div className="home-category-grid">
                        {browseCategories.map((category) => (
                            <article className="home-category-card" key={category.label}>
                                <img alt="" src={category.image} />
                                <h3>{category.label}</h3>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="home-page__section home-page__section--bordered">
                <div className="app-shell__container">
                    <SectionEyebrow>This Month</SectionEyebrow>
                    <SectionHeader
                        actionLabel="View All"
                        actionTo="/auth/sign-up"
                        title="Best Selling Products"
                    />

                    <div className="home-product-grid home-product-grid--best">
                        {bestSellingProducts.map((product) => (
                            <ProductCard key={product.name} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="home-page__section">
                <div className="app-shell__container">
                    <div className="home-feature-banner">
                        <div className="home-feature-banner__copy">
                            <p>Categories</p>
                            <h2>Enhance Your Music Experience</h2>
                            <CountdownTimer
                                className="home-feature-banner__timer"
                                itemClassName="home-feature-banner__timer-item"
                                items={featureTimerValues}
                                valueFirst
                            />
                            <Link className="home-feature-banner__button" to="/auth/sign-up">
                                Buy Now!
                            </Link>
                        </div>

                        <div className="home-feature-banner__art">
                            <div className="home-feature-banner__glow" />
                            <img alt="JBL speaker" src={jblImage} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-page__section">
                <div className="app-shell__container">
                    <SectionEyebrow>Our Products</SectionEyebrow>
                    <SectionHeader
                        navigationLabel="products"
                        title="Explore Our Products"
                    />

                    <div className="home-product-grid home-product-grid--explore">
                        {exploreProducts.map((product) => (
                            <ProductCard key={product.name} product={product} />
                        ))}
                    </div>

                    <div className="home-page__center-action">
                        <Link className="home-page__primary-link" to="/auth/sign-up">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            <section className="home-page__section">
                <div className="app-shell__container">
                    <SectionEyebrow>Featured</SectionEyebrow>
                    <SectionHeader single title="New Arrival" />

                    <div className="home-arrival-grid">
                        {featuredArrivals.map((item) => (
                            <Link
                                className={
                                    item.variant
                                        ? `home-arrival-card home-arrival-card--${item.variant}`
                                        : "home-arrival-card"
                                }
                                key={item.title}
                                to="/auth/sign-up"
                            >
                                <div className="home-arrival-card__content">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    <span>Shop Now</span>
                                </div>

                                <div className="home-arrival-card__art">
                                    <img alt={item.imageAlt} src={item.image} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="home-page__section home-page__section--services">
                <div className="app-shell__container">
                    <div className="home-service-grid">
                        {services.map((service) => (
                            <article className="home-service-card" key={service.title}>
                                <div className="home-service-card__icon">
                                    <span>
                                        <img alt="" src={service.icon} />
                                    </span>
                                </div>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default HomePage;
