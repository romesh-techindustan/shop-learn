import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../api/cart";
import { getProducts } from "../api/products";
import bootImage from "../assets/boot.png";
import cameraImage from "../assets/camera.png";
import chairImage from "../assets/chair.png";
import cosmeticImage from "../assets/cosmetic.png";
import gameBoyImage from "../assets/GP11.png";
import jacketImage from "../assets/jacket.png";
import joystickImage from "../assets/joystick.png";
import keyboardImage from "../assets/keyboard.png";
import bagImage from "../assets/Light-Gucci-Savoy-medium-duffle-bag.png";
import coatImage from "../assets/Light-The-North-Face-x-Gucci-coat.png";
import monitorImage from "../assets/monitor.png";
import wooferImage from "../assets/woofer.png";
import { ProductCard } from "../components/ProductCard";
import SectionEyebrow from "../components/home/SectionEyebrow";
import "./CommercePages.css";
import "./HomePage.css";
import "./ProductsPage.css";

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
    bootImage,
    cosmeticImage,
    gameBoyImage,
    jacketImage,
];

const categoryOptions = [
    { label: "All Categories", value: "" },
    { label: "T-Shirts", value: "tshirt" },
    { label: "Shirts", value: "shirt" },
    { label: "Jeans", value: "jeans" },
    { label: "Jackets", value: "jacket" },
    { label: "Shoes", value: "shoes" },
    { label: "Accessories", value: "accessories" },
];

function normalizeApiProduct(product, index) {
    return {
        ...product,
        image:
            product.image ||
            productFallbackImages[index % productFallbackImages.length],
        price: Number(product.price ?? 0),
        rating: 5,
        reviews: Number(product.stock ?? 0),
        theme: productThemes[index % productThemes.length],
        showCart: true,
        colors: product.color ? [product.color] : undefined,
    };
}

function getApiErrorMessage(error) {
    return error.response?.data?.message || "Something went wrong";
}

function ProductsPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [addingProductId, setAddingProductId] = useState("");

    const productCountLabel = useMemo(() => {
        const total = pagination?.totalItems ?? products.length;

        return `${total} product${total === 1 ? "" : "s"}`;
    }, [pagination, products.length]);

    useEffect(() => {
        let isMounted = true;

        async function loadProducts() {
            try {
                const params = {
                    limit: 100,
                    page,
                };

                if (search) {
                    params.search = search;
                }

                if (category) {
                    params.category = category;
                }

                const { response } = await getProducts(params);
                const apiProducts = response?.items ?? [];

                if (isMounted) {
                    setProducts(apiProducts.map(normalizeApiProduct));
                    setPagination(response?.pagination ?? null);
                }
            } catch (error) {
                if (isMounted) {
                    setProducts([]);
                    setPagination(null);
                }

                toast.error(getApiErrorMessage(error));
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadProducts();

        return () => {
            isMounted = false;
        };
    }, [category, page, search]);

    async function handleAddToCart(product) {
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

    function handleSearchSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        setPage(1);
        setSearch(searchInput.trim());
    }

    function handleCategoryChange(event) {
        setIsLoading(true);
        setPage(1);
        setCategory(event.target.value);
    }

    return (
        <main className="products-page home-page">
            <section className="products-page__section">
                <div className="app-shell__container">
                    <nav className="commerce-breadcrumb" aria-label="Breadcrumb">
                        <Link to="/">Home</Link>
                        <span className="commerce-breadcrumb__divider">/</span>
                        <span className="commerce-breadcrumb__current">
                            Products
                        </span>
                    </nav>

                    <SectionEyebrow>Products</SectionEyebrow>
                    <div className="products-page__header">
                        <div>
                            <h1>All Products</h1>
                            <p>{productCountLabel}</p>
                        </div>

                        <div className="products-page__controls">
                            <form
                                className="products-page__search"
                                onSubmit={handleSearchSubmit}
                            >
                                <input
                                    aria-label="Search products"
                                    onChange={(event) =>
                                        setSearchInput(event.target.value)
                                    }
                                    placeholder="Search products"
                                    type="search"
                                    value={searchInput}
                                />
                                <button type="submit">Search</button>
                            </form>

                            <label className="products-page__select">
                                <span className="navbar__sr-only">
                                    Filter by category
                                </span>
                                <select
                                    onChange={handleCategoryChange}
                                    value={category}
                                >
                                    {categoryOptions.map((option) => (
                                        <option
                                            key={option.value || "all"}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="products-page__status">
                            Loading products...
                        </div>
                    ) : null}

                    {!isLoading && products.length === 0 ? (
                        <div className="products-page__status">
                            No products found.
                        </div>
                    ) : null}

                    <div className="home-product-grid home-product-grid--explore products-page__grid">
                        {products.map((product) => (
                            <ProductCard
                                isAdding={addingProductId === product.id}
                                key={product.id}
                                onAddToCart={handleAddToCart}
                                product={product}
                            />
                        ))}
                    </div>

                    {pagination?.totalPages > 1 ? (
                        <div
                            className="products-page__pagination"
                            aria-label="Product pages"
                        >
                            <button
                                className="commerce-button"
                                disabled={page <= 1 || isLoading}
                                onClick={() => {
                                    setIsLoading(true);
                                    setPage((currentPage) => currentPage - 1);
                                }}
                                type="button"
                            >
                                Previous
                            </button>
                            <span>
                                Page {pagination.page} of{" "}
                                {pagination.totalPages}
                            </span>
                            <button
                                className="commerce-button"
                                disabled={
                                    page >= pagination.totalPages || isLoading
                                }
                                onClick={() => {
                                    setIsLoading(true);
                                    setPage((currentPage) => currentPage + 1);
                                }}
                                type="button"
                            >
                                Next
                            </button>
                        </div>
                    ) : null}
                </div>
            </section>
        </main>
    );
}

export default ProductsPage;
