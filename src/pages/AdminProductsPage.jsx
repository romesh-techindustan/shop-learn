import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/AdminPages.css";
import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from "../api/products";
import { buildAssetUrl } from "../common/constant";
import { AdminSidebar } from "./AdminDashboardPage";

const PAGE_SIZE = 12;

const EMPTY_FORM = {
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    stock: "",
    image: null,
};

function getStoredUser() {
    try {
        const d = localStorage.getItem("userDetail");
        return d ? JSON.parse(d) : null;
    } catch {
        return null;
    }
}

/* ── Loading Spinner ────────────────────────────────────── */
function Spinner() {
    return (
        <div className="adminLoadingSpinner">
            <div className="adminSpinnerDot" />
            <div className="adminSpinnerDot" />
            <div className="adminSpinnerDot" />
            <span>Loading products…</span>
        </div>
    );
}

/* ── Confirm Delete Dialog ──────────────────────────────── */
function ConfirmDialog({ product, onConfirm, onCancel }) {
    return (
        <div className="adminModalBackdrop" onClick={onCancel}>
            <div
                className="adminModal adminConfirmDialog"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="adminModalHeader">
                    <h2>Delete Product</h2>
                    <button className="adminModalCloseBtn" onClick={onCancel}>
                        ✕
                    </button>
                </div>
                <div className="adminModalBody">
                    <div className="adminConfirmIcon">🗑️</div>
                    <p className="adminConfirmMessage">
                        Are you sure you want to delete{" "}
                        <strong>"{product.name}"</strong>?<br />
                        This action cannot be undone.
                    </p>
                </div>
                <div className="adminModalFooter">
                    <button
                        id="confirm-cancel-btn"
                        className="adminBtn adminBtn--ghost"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        id="confirm-delete-btn"
                        className="adminBtn adminBtn--danger"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Product Modal (Add / Edit) ─────────────────────────── */
function ProductModal({ product, onSave, onClose, saving }) {
    const isEdit = Boolean(product?.id);
    const fileRef = useRef(null);
    const [form, setForm] = useState(
        isEdit
            ? {
                  name: product.name || "",
                  description: product.description || "",
                  price: product.price ?? "",
                  originalPrice: product.originalPrice ?? "",
                  category: product.category || "",
                  stock: product.stock ?? "",
                  image: null,
              }
            : { ...EMPTY_FORM },
    );
    const [previewUrl, setPreviewUrl] = useState(
        isEdit ? buildAssetUrl(product.image || product.imageUrl) : "",
    );

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    function handleFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setForm((f) => ({ ...f, image: file }));
        setPreviewUrl(URL.createObjectURL(file));
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error("Product name is required");
            return;
        }
        if (!form.price) {
            toast.error("Price is required");
            return;
        }
        if (!form.category.trim()) {
            toast.error("Category is required");
            return;
        }
        onSave({ ...form, id: product?.id });
    }

    return (
        <div className="adminModalBackdrop" onClick={onClose}>
            <div
                className="adminModal"
                style={{ width: "min(680px, 100%)" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="adminModalHeader">
                    <h2>{isEdit ? "Edit Product" : "Add New Product"}</h2>
                    <button
                        id="product-modal-close"
                        className="adminModalCloseBtn"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="adminModalBody">
                        {/* Image Upload */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 20,
                                padding: "16px",
                                background: "#f8fafc",
                                borderRadius: 12,
                                border: "2px dashed rgba(0,0,0,0.1)",
                                cursor: "pointer",
                            }}
                            onClick={() => fileRef.current?.click()}
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Product preview"
                                    style={{
                                        width: 80,
                                        height: 80,
                                        objectFit: "contain",
                                        borderRadius: 8,
                                        background: "#fff",
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 8,
                                        background: "#e2e8f0",
                                        display: "grid",
                                        placeItems: "center",
                                        fontSize: "1.8rem",
                                        flexShrink: 0,
                                    }}
                                >
                                    🖼️
                                </div>
                            )}
                            <div>
                                <div
                                    style={{
                                        fontWeight: 600,
                                        fontSize: "0.875rem",
                                        color: "#0f172a",
                                    }}
                                >
                                    {previewUrl
                                        ? "Change Image"
                                        : "Upload Product Image"}
                                </div>
                                <div
                                    style={{
                                        fontSize: "0.78rem",
                                        color: "#94a3b8",
                                        marginTop: 4,
                                    }}
                                >
                                    Click to browse — JPG, PNG, WebP
                                </div>
                            </div>
                            <input
                                id="product-image-upload"
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleFile}
                            />
                        </div>

                        {/* Name */}
                        <div className="adminFormGroup">
                            <label htmlFor="product-name">Product Name *</label>
                            <input
                                id="product-name"
                                name="name"
                                placeholder="e.g. Sony WH-1000XM5"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="adminFormGroup">
                            <label htmlFor="product-description">
                                Description
                            </label>
                            <textarea
                                id="product-description"
                                name="description"
                                placeholder="Product description…"
                                value={form.description}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Price & Original Price */}
                        <div className="adminFormRow">
                            <div className="adminFormGroup">
                                <label htmlFor="product-price">
                                    Sale Price ($) *
                                </label>
                                <input
                                    id="product-price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={form.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="adminFormGroup">
                                <label htmlFor="product-original-price">
                                    Original Price ($)
                                </label>
                                <input
                                    id="product-original-price"
                                    name="originalPrice"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={form.originalPrice}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Category & Stock */}
                        <div className="adminFormRow">
                            <div className="adminFormGroup">
                                <label htmlFor="product-category">
                                    Category *
                                </label>
                                <input
                                    id="product-category"
                                    name="category"
                                    placeholder="e.g. Phones, Computers…"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="adminFormGroup">
                                <label htmlFor="product-stock">
                                    Stock Quantity
                                </label>
                                <input
                                    id="product-stock"
                                    name="stock"
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={form.stock}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="adminModalFooter">
                        <button
                            id="product-modal-cancel"
                            type="button"
                            className="adminBtn adminBtn--ghost"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            id={isEdit ? "product-save-btn" : "product-add-btn"}
                            type="submit"
                            className="adminBtn adminBtn--primary"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving…"
                                : isEdit
                                  ? "Save Changes"
                                  : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Admin Products Page ────────────────────────────────── */
export default function AdminProductsPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCat] = useState("");
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null); // null | "add" | { ...product }
    const [deleteTarget, setDelete] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const user = getStoredUser();
        const isAdmin = user?.isAdmin || user?.user?.isAdmin;
        if (!isAdmin) {
            navigate("/auth/login");
            return;
        }
        async function fetchProducts() {
            try {
                const { response } = await getProducts();
                const list = Array.isArray(response.items)
                    ? response.items
                    : response || [];
                setProducts(list);
            } catch (err) {
                if (err.response?.status === 401) {
                    navigate("/auth/login");
                    return;
                }
                toast.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    /* Unique categories from loaded products */
    const categories = useMemo(() => {
        const cats = [
            ...new Set(products.map((p) => p.category).filter(Boolean)),
        ].sort();
        return cats;
    }, [products]);

    /* Filtered + paginated */
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return products.filter((p) => {
            const matchesSearch =
                !q ||
                p.name?.toLowerCase().includes(q) ||
                p.category?.toLowerCase().includes(q);
            const matchesCat = !categoryFilter || p.category === categoryFilter;
            return matchesSearch && matchesCat;
        });
    }, [products, search, categoryFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageItems = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    /* Handlers */
    async function handleSave(formData) {
        setSaving(true);
        try {
            const payload = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (key === "id") return;
                if (key === "image" && val instanceof File) {
                    payload.append("image", val);
                } else if (val !== "" && val !== null && val !== undefined) {
                    payload.append(key, val);
                }
            });

            if (formData.id) {
                const { response } = await updateProduct(formData.id, payload);
                setProducts((prev) =>
                    prev.map((p) =>
                        p.id === formData.id ? { ...p, ...response } : p,
                    ),
                );
                toast.success("Product updated successfully");
            } else {
                const { response } = await createProduct(payload);
                setProducts((prev) => [response, ...prev]);
                toast.success("Product added successfully");
            }
            setModal(null);
        } catch {
            toast.error("Failed to save product");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        try {
            await deleteProduct(deleteTarget.id);
            setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
            toast.success("Product deleted");
        } catch {
            toast.error("Failed to delete product");
        } finally {
            setDelete(null);
        }
    }

    const imgSrc = (p) => buildAssetUrl(p.image || p.imageUrl || p.images?.[0]);

    return (
        <div className="adminLayout">
            <AdminSidebar />
            <div className="adminContent">
                {/* Top Bar */}
                <div className="adminTopBar">
                    <div className="adminTopBarLeft">
                        <h1>Product Management</h1>
                        <p>{filtered.length} products found</p>
                    </div>
                    <div className="adminTopBarRight">
                        <button
                            id="add-product-btn"
                            className="adminBtn adminBtn--primary"
                            onClick={() => setModal("add")}
                        >
                            + Add Product
                        </button>
                    </div>
                </div>

                <div className="adminPageBody">
                    <div className="adminPanel">
                        {/* Toolbar */}
                        <div className="adminToolbar">
                            <div className="adminToolbarFilters">
                                <div className="adminSearchBox">
                                    <span>🔍</span>
                                    <input
                                        id="admin-product-search"
                                        placeholder="Search products…"
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setPage(1);
                                        }}
                                    />
                                </div>

                                <select
                                    id="admin-product-category-filter"
                                    className="adminFilterSelect"
                                    value={categoryFilter}
                                    onChange={(e) => {
                                        setCat(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <span
                                style={{ fontSize: "0.8rem", color: "#94a3b8" }}
                            >
                                {products.length} total products
                            </span>
                        </div>

                        {/* Table */}
                        {loading ? (
                            <Spinner />
                        ) : pageItems.length === 0 ? (
                            <div className="adminEmptyState">
                                <span>📦</span>
                                <p>
                                    No products found
                                    {search ? " for your search" : ""}
                                </p>
                            </div>
                        ) : (
                            <div className="adminTableWrapper">
                                <table className="adminTable">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Original</th>
                                            <th>Stock</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageItems.map((product) => (
                                            <tr key={product.id}>
                                                <td>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 14,
                                                        }}
                                                    >
                                                        {imgSrc(product) ? (
                                                            <img
                                                                src={imgSrc(
                                                                    product,
                                                                )}
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="adminProductImage"
                                                            />
                                                        ) : (
                                                            <div
                                                                className="adminProductImage"
                                                                style={{
                                                                    display:
                                                                        "grid",
                                                                    placeItems:
                                                                        "center",
                                                                    fontSize:
                                                                        "1.4rem",
                                                                    color: "#cbd5e1",
                                                                }}
                                                            >
                                                                🛍️
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div
                                                                style={{
                                                                    fontWeight: 600,
                                                                    fontSize:
                                                                        "0.875rem",
                                                                    maxWidth: 200,
                                                                }}
                                                            >
                                                                {product.name}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    fontSize:
                                                                        "0.72rem",
                                                                    color: "#94a3b8",
                                                                    marginTop: 2,
                                                                }}
                                                            >
                                                                ID:{" "}
                                                                {product.id?.slice(
                                                                    0,
                                                                    8,
                                                                )}
                                                                …
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span
                                                        style={{
                                                            padding: "3px 10px",
                                                            borderRadius: 20,
                                                            background:
                                                                "rgba(99,102,241,0.1)",
                                                            color: "#6366f1",
                                                            fontSize: "0.78rem",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {product.category ||
                                                            "—"}
                                                    </span>
                                                </td>
                                                <td
                                                    style={{
                                                        fontWeight: 700,
                                                        color: "#db4444",
                                                    }}
                                                >
                                                    $
                                                    {Number(
                                                        product.price || 0,
                                                    ).toFixed(2)}
                                                </td>
                                                <td
                                                    style={{
                                                        color: "#94a3b8",
                                                        textDecoration:
                                                            "line-through",
                                                        fontSize: "0.82rem",
                                                    }}
                                                >
                                                    {product.originalPrice
                                                        ? `$${Number(product.originalPrice).toFixed(2)}`
                                                        : "—"}
                                                </td>
                                                <td>
                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                            color:
                                                                (product.stock ??
                                                                    product.countInStock ??
                                                                    0) > 0
                                                                    ? "#059669"
                                                                    : "#dc2626",
                                                        }}
                                                    >
                                                        {product.stock ??
                                                            product.countInStock ??
                                                            "—"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: 8,
                                                        }}
                                                    >
                                                        <button
                                                            id={`edit-product-${product.id}`}
                                                            className="adminBtn adminBtn--ghost adminBtn--sm"
                                                            onClick={() =>
                                                                setModal(
                                                                    product,
                                                                )
                                                            }
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <button
                                                            id={`delete-product-${product.id}`}
                                                            className="adminBtn adminBtn--danger adminBtn--sm"
                                                            onClick={() =>
                                                                setDelete(
                                                                    product,
                                                                )
                                                            }
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="adminPagination">
                                <button
                                    id="products-prev-page"
                                    className="adminPaginationBtn"
                                    disabled={currentPage === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    ‹ Prev
                                </button>
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1,
                                ).map((p) => (
                                    <button
                                        key={p}
                                        id={`products-page-${p}`}
                                        className={`adminPaginationBtn ${p === currentPage ? "active" : ""}`}
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    id="products-next-page"
                                    className="adminPaginationBtn"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Next ›
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add / Edit Modal */}
            {modal && (
                <ProductModal
                    product={modal === "add" ? null : modal}
                    onSave={handleSave}
                    onClose={() => setModal(null)}
                    saving={saving}
                />
            )}

            {/* Delete Confirm Dialog */}
            {deleteTarget && (
                <ConfirmDialog
                    product={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDelete(null)}
                />
            )}
        </div>
    );
}
