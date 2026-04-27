import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addToWishlist } from "../api/wishlist";
import { formatPrice } from "../common/common";
import heartIcon from "../assets/icons/Wishlist.svg";
import ratingIcon from "../assets/icons/Vector.svg";
import viewIcon from "../assets/icons/view.svg";
import "./ProductCard.css";
import { buildAssetUrl } from "../common/constant";

const supportedThemes = new Set([
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
]);

function Rating({ rating, reviews }) {
    return (
        <div className="productRatingContainer" aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((value) => (
                <img
                    alt=""
                    className={`ratingStarIcon ${value > rating ? "isMutedState" : ""
                        }`}
                    key={value}
                    src={ratingIcon}
                />
            ))}
            <span className="ratingReviewCount">({reviews})</span>
        </div>
    );
}

export function ProductCard({ product, isAdding = false, onAddToCart, isWishlisted, onRemove }) {
    const themeName = supportedThemes.has(product.theme)
        ? product.theme
        : "rose";
    const canAddToCart = Boolean(product.id || product.showCart);
    const productLink = `/product/${product.id}`;

    async function handleWishlist() {
        try {
            await addToWishlist(product.id);
            toast.success("Added to wishlist!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add to wishlist");
        }
    }

    return (
        <article className="productCardWrapper">
            <div
                className={`productImageContainer home-product-card__media--${themeName}`}
            >
                {product.badge ? (
                    <span
                        className={`productStatusBadge ${product.badge === "NEW"
                            ? "productBadgeNew"
                            : ""
                            }`}
                    >
                        {product.badge}
                    </span>
                ) : null}

                <div className="productQuickActions">
                    {isWishlisted ? (
                        <div key={product.id} style={{ position: "relative" }}>
                            <button
                                onClick={onRemove}
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    backgroundColor: "#fff",
                                    borderRadius: "50%",
                                    width: "30px",
                                    height: "30px",
                                    display: "grid",
                                    placeItems: "center",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    border: "none",
                                    cursor: "pointer",
                                    zIndex: 5
                                }}
                                aria-label="Remove from wishlist"
                            >
                                ✕
                            </button>
                        </div>) : (<><button
                            aria-label={`Add ${product.name} to wishlist`}
                            onClick={handleWishlist}
                            type="button"
                        >
                            <img alt="" src={heartIcon} />
                        </button>
                            <button
                                aria-label={`Preview ${product.name}`}
                                type="button"
                            >
                                <img alt="" src={viewIcon} />
                            </button></>)
                    }

                </div>

                <Link to={productLink} className="productIllustrationBox productIllustrationImage">
                    <img
                        alt={product.name}
                        className="productMainImage"
                        src={buildAssetUrl(product.image)}
                    />
                </Link>

                {canAddToCart ? (
                    <button
                        className="addToCartButton"
                        disabled={isAdding}
                        onClick={() => onAddToCart?.(product)}
                        type="button"
                    >
                        {isAdding ? "Adding..." : "Add To Cart"}
                    </button>
                ) : null}
            </div>

            <div className="productDetailsSection">
                <h3>
                    <Link to={productLink}>{product.name}</Link>
                </h3>
                <div className="productPriceRow">
                    <span className="productCurrentPrice">
                        {formatPrice(product.price)}
                    </span>
                    {product.oldPrice ? (
                        <span className="productCurrentPrice productOldPrice">
                            {formatPrice(product.oldPrice)}
                        </span>
                    ) : null}
                </div>
                <Rating rating={product.rating} reviews={product.reviews} />
                {product.colors ? (
                    <div className="productColorSwatches">
                        {product.colors.map((color) => (
                            <span
                                className="colorSwatchCircle"
                                key={color}
                                style={{ background: color }}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        </article>
    );
}
