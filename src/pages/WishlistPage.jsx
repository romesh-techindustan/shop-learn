import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getWishlist, removeFromWishlist, removeAllFromWishlist } from "../api/wishlist";
import { addToCart } from "../api/cart";
import { ProductCard } from "../components/ProductCard";
import "./CommercePages.css";

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        async function fetchWishlist() {
            try {
                const { response } = await getWishlist();
                if (isMounted) {
                    setWishlistItems(response.items || []);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    navigate("/auth/login");
                    return;
                }
                toast.error("Failed to load wishlist");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchWishlist();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    async function handleRemove(id) {
        try {
            await removeFromWishlist(id);
            setWishlistItems(wishlistItems.filter(item => item.id !== id));
            toast.success("Removed from wishlist");
        } catch {
            toast.error("Failed to remove item");
        }
    }

    async function handleClearWishlist() {
        try {
            await removeAllFromWishlist();
            setWishlistItems([]);
            toast.success("Wishlist cleared");
        } catch {
            toast.error("Failed to clear wishlist");
        }
    }

    async function handleAddToCart(item) {
        try {
            await addToCart({ productId: item.product.id, quantity: 1 });
            await removeFromWishlist(item.id);
            setWishlistItems((prev) => prev.filter((i) => i.id !== item.id));
            toast.success("Added to cart");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add to cart");
        }
    }

    async function handleMoveAllToCart() {
        if (wishlistItems.length === 0) return;

        try {
            await Promise.all(wishlistItems.map(item => addToCart({ productId: item.product.id, quantity: 1 })));
            await removeAllFromWishlist();
            setWishlistItems([]);
            toast.success("All items moved to cart");
        } catch (error) {
            toast.error("Some items failed to move to cart");
            const { response } = await getWishlist();
            setWishlistItems(response.items || []);
        }
    }

    return (
        <main className="ecommercePageWrapper">
            <div className="appContainer">
                <nav className="breadcrumbNav" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="breadcrumbSeparator">/</span>
                    <span className="breadcrumbCurrentPage">Wishlist ({wishlistItems.length})</span>
                </nav>

                <div className="orderPageHeader" style={{ marginBottom: "60px" }}>
                    <h1>Wishlist</h1>
                    <div style={{ display: "flex", gap: "16px" }}>
                        {wishlistItems.length > 0 && (
                            <>
                                <button className="commerce-button" onClick={handleMoveAllToCart}>
                                    Add All To Cart
                                </button>
                                <button className="commerce-button" onClick={handleClearWishlist}>
                                    Clear Wishlist
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>Loading wishlist...</div>
                ) : wishlistItems.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px" }}>
                        <p>Your wishlist is empty.</p>
                        <Link to="/" className="commerce-button commerce-button--primary">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "30px" }}>
                        {wishlistItems.map((item) => (
                            <ProductCard
                                key={item.id}
                                product={item.product}
                                isWishlisted={true}
                                onRemove={() => handleRemove(item.id)}
                                onAddToCart={() => handleAddToCart(item)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
