import { formatPrice } from "../common/common";
import heartIcon from "../assets/icons/Wishlist.svg";
import ratingIcon from "../assets/icons/Vector.svg";
import viewIcon from "../assets/icons/view.svg";
import "./ProductCard.css";
import { baseUrl } from "../common/constant";

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
        <div className="home-rating" aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((value) => (
                <img
                    alt=""
                    className={`home-rating__star-image ${
                        value > rating ? "is-muted" : ""
                    }`}
                    key={value}
                    src={ratingIcon}
                />
            ))}
            <span className="home-rating__count">({reviews})</span>
        </div>
    );
}

export function ProductCard({ product, isAdding = false, onAddToCart }) {
    console.log("jdgakjsjkasdhsk", baseUrl);
    const themeName = supportedThemes.has(product.theme)
        ? product.theme
        : "rose";
    const canAddToCart = Boolean(product.id || product.showCart);

    return (
        <article className="home-product-card">
            <div
                className={`home-product-card__media home-product-card__media--${themeName}`}
            >
                {product.badge ? (
                    <span
                        className={`home-product-card__badge ${
                            product.badge === "NEW"
                                ? "home-product-card__badge--new"
                                : ""
                        }`}
                    >
                        {product.badge}
                    </span>
                ) : null}

                <div className="home-product-card__quick-actions">
                    <button
                        aria-label={`Add ${product.name} to wishlist`}
                        type="button"
                    >
                        <img alt="" src={heartIcon} />
                    </button>
                    <button
                        aria-label={`Preview ${product.name}`}
                        type="button"
                    >
                        <img alt="" src={viewIcon} />
                    </button>
                </div>

                <div className="home-product-card__illustration home-product-card__illustration--image">
                    <img
                        alt={product.name}
                        className="home-product-card__image"
                        src={baseUrl + product.image}
                    />
                </div>

                {canAddToCart ? (
                    <button
                        className="home-product-card__cart"
                        disabled={isAdding}
                        onClick={() => onAddToCart?.(product)}
                        type="button"
                    >
                        {isAdding ? "Adding..." : "Add To Cart"}
                    </button>
                ) : null}
            </div>

            <div className="home-product-card__content">
                <h3>{product.name}</h3>
                <div className="home-product-card__price-row">
                    <span className="home-product-card__price">
                        {formatPrice(product.price)}
                    </span>
                    {product.oldPrice ? (
                        <span className="home-product-card__price home-product-card__price--old">
                            {formatPrice(product.oldPrice)}
                        </span>
                    ) : null}
                </div>
                <Rating rating={product.rating} reviews={product.reviews} />
                {product.colors ? (
                    <div className="home-product-card__swatches">
                        {product.colors.map((color) => (
                            <span
                                className="home-product-card__swatch"
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
