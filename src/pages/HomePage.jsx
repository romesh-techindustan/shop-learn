import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../api/cart";
import { getCategories, getProducts } from "../api/products";
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
import { categoryData } from "../common/constant";
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

function formatCategoryLabel(category) {
    return category
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

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

const productThemes = [
    "rose",
    "neon",
    "ember",
    "sand",
    "mint",
    "cocoa",
    "aqua",
    "brass",
    "slate",
    "violet",
    "citrus",
    "midnight",
    "noir",
];

const productFallbackImages = [
    joystickImage,
    keyboardImage,
    monitorImage,
    chairImage,
    coatImage,
    bagImage,
    wooferImage,
    cameraImage,
    laptopImage,
    cosmeticImage,
    bootImage,
    jacketImage,
];

function normalizeApiProduct(product, index) {
    return {
        ...product,
        image:
            product.image ||
            productFallbackImages[index % productFallbackImages.length],
        price: Number(product.price ?? 0),
        rating: Math.round(Number(product.averageRating ?? 0)),
        reviews: Number(product.ratingCount ?? 0),
        theme: productThemes[index % productThemes.length],
        showCart: true,
        colors: product.color ? [product.color] : undefined,
    };
}

function getSectionProducts(apiProducts, start, length, fallbackProducts) {
    const sectionProducts = apiProducts.slice(start, start + length);

    return sectionProducts.length ? sectionProducts : fallbackProducts;
}

function getApiErrorMessage(error) {
    return error.response?.data?.message || "Something went wrong";
}

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

const heroSlides = [
    {
        eyebrow: "iPhone 14 Series",
        title: "Up to 10% off Voucher",
        image: iPhoneImage,
        logo: appleLogo,
        link: "/products"
    },
    {
        eyebrow: "PlayStation 5",
        title: "The Ultimate Gaming Experience",
        image: ps5Image,
        link: "/products"
    },
    {
        eyebrow: "Smart Laptops",
        title: "Unleash Your Productivity",
        image: laptopImage,
        link: "/products"
    },
    {
        eyebrow: "Audio Experience",
        title: "Immersive Sound Everywhere",
        image: jblImage,
        link: "/products"
    },
    {
        eyebrow: "Fashion Trends",
        title: "Step Into Style Today",
        image: womenImage,
        link: "/products"
    }
];

function HomePage() {
    const navigate = useNavigate();
    const [apiProducts, setApiProducts] = useState([]);
    const [addingProductId, setAddingProductId] = useState("");
    const [apiCategories, setApiCategories] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function loadProducts() {
            try {
                const { response } = await getProducts({ limit: 12 });
                const products = response?.items ?? [];

                if (isMounted) {
                    setApiProducts(products.map(normalizeApiProduct));
                }
            } catch {
                if (isMounted) {
                    setApiProducts([]);
                }
            }
        }

        async function loadCategories() {
            try {
                const { response } = await getCategories();

                if (isMounted) {
                    setApiCategories(response ?? []);
                }
            } catch {
                if (isMounted) {
                    setApiCategories([]);
                }
            }
        }

        loadProducts();
        loadCategories();

        return () => {
            isMounted = false;
        };
    }, []);
    const flashProducts = getSectionProducts(
        apiProducts,
        0,
        5,
        flashSaleProducts,
    );
    const bestProducts = getSectionProducts(
        apiProducts,
        5,
        4,
        bestSellingProducts,
    );
    const exploreProductsList = getSectionProducts(
        apiProducts,
        0,
        8,
        exploreProducts,
    );
    const browseCategories = apiCategories.length
        ? apiCategories.slice(0, 6).map((category, index) => ({
            label: formatCategoryLabel(category),
            image: categoryData[index % categoryData.length].image,
        }))
        : categoryData;

    async function handleAddToCart(product) {
        if (!product.id) {
            toast.info("This product is not available from the backend yet.");
            return;
        }

        const payload = {
            productId: product.id,
            quantity: 1,
        };

        if (product.color) {
            payload.selectedColor = product.color;
        }

        if (product.size) {
            payload.selectedSize = product.size;
        }

        setAddingProductId(product.id);

        try {
            await addToCart(payload);
            toast.success("Added to cart");
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("Log in to add items to your cart");
                navigate("/auth/login");
                return;
            }

            toast.error(getApiErrorMessage(error));
        } finally {
            setAddingProductId("");
        }
    }

    return (
        <main className="homePageWrapper">
            <section className="homePageHeroSection">
                <div className="appContainer homeHeroGrid">
                    <aside
                        aria-label="Product Categories"
                        className="homeHeroSidebar"
                    >
                        {apiCategories.map((category) => (
                            <button
                                className="homeSidebarLink"
                                key={category}
                                type="button"
                            >
                                <span style={{ textTransform: 'capitalize' }}>{category}</span>
                                {category.nested ? (
                                    <img
                                        alt=""
                                        className="homeSidebarArrowIcon"
                                        src={arrowRightIcon}
                                    />
                                ) : null}
                            </button>
                        ))}
                    </aside>

                    <div className="homeHeroBanner">
                        <div className="homeHeroCopy">
                            <p className="homeHeroEyebrow">
                                {heroSlides[currentSlide].logo && <img alt="" src={heroSlides[currentSlide].logo} />}
                                {heroSlides[currentSlide].eyebrow}
                            </p>
                            <h1>{heroSlides[currentSlide].title}</h1>
                            <Link
                                className="homeHeroCallToAction"
                                to={heroSlides[currentSlide].link}
                            >
                                Shop Now
                                <img alt="" src={arrowRightIcon} />
                            </Link>
                        </div>

                        <div className="homeHeroArtwork">
                            <img
                                key={currentSlide} // Force re-animation on slide change
                                alt={heroSlides[currentSlide].eyebrow}
                                src={heroSlides[currentSlide].image}
                                style={{
                                    animation: "heroFadeIn 0.8s ease-out forwards"
                                }}
                            />
                        </div>

                        <div
                            className="homeHeroPaginationDots"
                            aria-label="Hero Slides"
                        >
                            {heroSlides.map((_, index) => (
                                <span
                                    key={index}
                                    className={currentSlide === index ? "is-active" : ""}
                                    onClick={() => setCurrentSlide(index)}
                                    style={{ cursor: "pointer" }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="homePageSection">
                <div className="appContainer">
                    <SectionEyebrow>Today&apos;s</SectionEyebrow>
                    <SectionHeader
                        navigationLabel="products"
                        timerItems={flashTimerValues}
                        title="Flash Sales"
                    />

                    <div className="home-product-grid home-product-grid--flash">
                        {flashProducts.map((product) => (
                            <ProductCard
                                isAdding={addingProductId === product.id}
                                key={product.id || product.name}
                                onAddToCart={handleAddToCart}
                                product={product}
                            />
                        ))}
                    </div>

                    <div className="homePageCenterAction">
                        <Link
                            className="homePrimaryLink"
                            to="/products"
                        >
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            <section className="homePageSection homePageSectionBordered">
                <div className="appContainer">
                    <SectionEyebrow>Categories</SectionEyebrow>
                    <SectionHeader
                        navigationLabel="categories"
                        title="Browse By Category"
                    />

                    <div className="home-category-grid">
                        {browseCategories.map((category) => (
                            <article
                                className="categoryCardBox"
                                key={category.label}
                            >
                                <img alt="" src={category.image} />
                                <h3>{category.label}</h3>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="homePageSection homePageSectionBordered">
                <div className="appContainer">
                    <SectionEyebrow>This Month</SectionEyebrow>
                    <SectionHeader
                        actionLabel="View All"
                        actionTo="/products"
                        title="Best Selling Products"
                    />

                    <div className="home-product-grid home-product-grid--best">
                        {bestProducts.map((product) => (
                            <ProductCard
                                isAdding={addingProductId === product.id}
                                key={product.id || product.name}
                                onAddToCart={handleAddToCart}
                                product={product}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="homePageSection">
                <div className="appContainer">
                    <div className="featureBannerWrapper">
                        <div className="featureBannerCopy">
                            <p>Categories</p>
                            <h2>Enhance Your Music Experience</h2>
                            <CountdownTimer
                                className="featureBannerTimer"
                                itemClassName="featureBannerTimerItem"
                                items={featureTimerValues}
                                valueFirst
                            />
                            <Link
                                className="featureBannerButton"
                                to="/auth/sign-up"
                            >
                                Buy Now!
                            </Link>
                        </div>

                        <div className="featureBannerImage">
                            <div className="featureBannerGlowEffect" />
                            <img alt="JBL speaker" src={jblImage} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="homePageSection">
                <div className="appContainer">
                    <SectionEyebrow>Our Products</SectionEyebrow>
                    <SectionHeader
                        navigationLabel="products"
                        title="Explore Our Products"
                    />

                    <div className="home-product-grid home-product-grid--explore">
                        {exploreProductsList.map((product) => (
                            <ProductCard
                                isAdding={addingProductId === product.id}
                                key={product.id || product.name}
                                onAddToCart={handleAddToCart}
                                product={product}
                            />
                        ))}
                    </div>

                    <div className="homePageCenterAction">
                        <Link
                            className="homePrimaryLink"
                            to="/products"
                        >
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            <section className="homePageSection">
                <div className="appContainer">
                    <SectionEyebrow>Featured</SectionEyebrow>
                    <SectionHeader single title="New Arrival" />

                    <div className="home-arrival-grid">
                        {featuredArrivals.map((item) => (
                            <Link
                                className={
                                    item.variant
                                        ? `arrivalCardContainer home-arrival-card--${item.variant}`
                                        : "arrivalCardContainer"
                                }
                                key={item.title}
                                to="/auth/sign-up"
                            >
                                <div className="arrivalCardContent">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    <span>Shop Now</span>
                                </div>

                                <div className="arrivalCardImage">
                                    <img alt={item.imageAlt} src={item.image} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="homePageSection homePageServicesSection">
                <div className="appContainer">
                    <div className="home-service-grid">
                        {services.map((service) => (
                            <article
                                className="homeServiceCardWrapper"
                                key={service.title}
                            >
                                <div className="homeServiceCardIcon">
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
