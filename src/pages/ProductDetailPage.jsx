import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getProductById, getProductsByCategory } from "../api/products";
import { addToWishlist } from "../api/wishlist";
import { formatPrice } from "../common/common";
import { buildAssetUrl } from "../common/constant";
import { ProductCard } from "../components/ProductCard";

import "../css/ProductDetailPage.css";
import deliveryIcon from "../assets/icons/icon-delivery.svg";
import wishlistIcon from "../assets/icons/Wishlist.svg";
import ratingIcon from "../assets/icons/Vector.svg";

const ReturnIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
    </svg>
);

function RatingStars({ rating, reviews }) {
    return (
        <div
            className="productRatingRow"
            aria-label={`${rating} out of 5 stars`}
        >
            <div className="productStars">
                {[1, 2, 3, 4, 5].map((value) => (
                    <img
                        key={value}
                        src={ratingIcon}
                        alt=""
                        style={{ opacity: value > rating ? 0.3 : 1 }}
                    />
                ))}
            </div>
            <span className="productReviews">({reviews} Reviews)</span>
            <div className="productDividerVertical"></div>
            <span className="productStock">In Stock</span>
        </div>
    );
}

const fallbackSizes = ["XS", "S", "M", "L", "XL"];
const fallbackColors = ["#8FA0C0", "#E07575"];

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("M");
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            setLoading(true);
            try {
                const { response } = await getProductById(id);
                const fetchedProduct = response;

                if (!isMounted) return;

                setProduct(fetchedProduct);
                setActiveImage(fetchedProduct.image);
                if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
                    setSelectedColor(fetchedProduct.colors[0]);
                } else {
                    setSelectedColor(fallbackColors[0]);
                }

                if (fetchedProduct.category) {
                    const { response: related } = await getProductsByCategory(
                        fetchedProduct.category,
                    );
                    if (isMounted) {
                        setRelatedProducts(
                            related
                                .filter((p) => p.id !== fetchedProduct.id)
                                .slice(0, 4),
                        );
                    }
                }
            } catch (error) {
                console.error("Failed to fetch product details:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) {
        return (
            <div
                className="appContainer"
                style={{ padding: "100px 0", textAlign: "center" }}
            >
                Loading product details...
            </div>
        );
    }

    if (!product) {
        return (
            <div
                className="appContainer"
                style={{ padding: "100px 0", textAlign: "center" }}
            >
                Product not found.
            </div>
        );
    }

    const sizes = product.sizes || fallbackSizes;
    const colors = product.colors || fallbackColors;

    const handleDecrement = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    async function handleWishlist() {
        try {
            await addToWishlist(id);
            toast.success("Added to wishlist!");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to add to wishlist",
            );
        }
    }

    return (
        <div className="productDetailWrapper">
            <div className="appContainer">
                {/* Breadcrumbs */}
                <nav className="productBreadcrumb" aria-label="Breadcrumb">
                    <Link to="/account">Account</Link>
                    <span>/</span>
                    <Link to="/products">{product.category || "Gaming"}</Link>
                    <span>/</span>
                    <span className="active">{product.name}</span>
                </nav>

                <div className="productMainSection">
                    {/* Left: Main Image */}
                    <div className="productGallery">
                        <div className="productMainImageDisplay">
                            <img
                                src={buildAssetUrl(activeImage)}
                                alt={product.name}
                            />
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="productInfo">
                        <h1 className="productTitle">{product.name}</h1>
                        <RatingStars
                            rating={Math.round(
                                Number(product.averageRating ?? 0),
                            )}
                            reviews={Number(product.ratingCount ?? 0)}
                        />
                        <h2 className="productPrice">
                            {formatPrice(product.price)}
                        </h2>

                        <p className="productDescription">
                            {product.description ||
                                "PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive."}
                        </p>

                        <div className="productDivider"></div>

                        <div className="productOptionsRow">
                            <span>Colours:</span>
                            <div className="productColors">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        className={`productColorBtn ${selectedColor === color ? "selected" : ""}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setSelectedColor(color)}
                                        aria-label={`Select color ${color}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="productOptionsRow">
                            <span>Size:</span>
                            <div className="productSizes">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`productSizeBtn ${selectedSize === size ? "selected" : ""}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="productActions">
                            <div className="quantityControl">
                                <button
                                    onClick={handleDecrement}
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(
                                            Math.max(
                                                1,
                                                parseInt(e.target.value) || 1,
                                            ),
                                        )
                                    }
                                    aria-label="Quantity"
                                />
                                <button
                                    onClick={handleIncrement}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                            <button className="buyNowButton">Buy Now</button>
                            <button
                                className="wishlistButton"
                                aria-label="Add to wishlist"
                                onClick={handleWishlist}
                            >
                                <img src={wishlistIcon} alt="" />
                            </button>
                        </div>

                        <div className="deliveryInfoBox">
                            <div className="deliveryItem">
                                <div className="deliveryItemIcon">
                                    <img
                                        src={deliveryIcon}
                                        alt="Delivery Truck"
                                    />
                                </div>
                                <div className="deliveryItemContent">
                                    <h3 className="deliveryItemTitle">
                                        Free Delivery
                                    </h3>
                                    <p className="deliveryItemText">
                                        <u>
                                            Enter your postal code for Delivery
                                            Availability
                                        </u>
                                    </p>
                                </div>
                            </div>
                            <div className="deliveryItem">
                                <div className="deliveryItemIcon">
                                    <ReturnIcon />
                                </div>
                                <div className="deliveryItemContent">
                                    <h3 className="deliveryItemTitle">
                                        Return Delivery
                                    </h3>
                                    <p className="deliveryItemText">
                                        Free 30 Days Delivery Returns.{" "}
                                        <u>Details</u>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Items */}
                {console.log("relatedProducts.length", relatedProducts)}
                {relatedProducts.length > 0 && (
                    <div className="relatedItemsSection">
                        <div className="relatedItemsHeader">
                            <div className="relatedItemsIndicator"></div>
                            <h2 className="relatedItemsTitle">Related Item</h2>
                        </div>
                        <div className="relatedProductsGrid">
                            {relatedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
