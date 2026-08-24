import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/api/axiosClient";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";
import StoreHeader from "@/components/StoreHeader";
import StoreFooter from "@/components/StoreFooter";
import PageLoader from "@/components/PageLoader";

const BACKEND_URL = "http://localhost:5000";

export default function Home() {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [addingId, setAddingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    Promise.all([axiosClient.get("/products"), axiosClient.get("/categories")])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      })
      .catch((err) => console.error("Failed to load storefront data:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || String(p.category_id) === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      setMessage({ type: "error", text: "Please log in to add items to your cart." });
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    setAddingId(product.id);
    try {
      await addToCart(product, 1);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Could not add to cart." });
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StoreHeader categories={categories} />

      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28 text-center">
          <span className="inline-block text-xs font-semibold tracking-wider uppercase text-gray-400 mb-4">
            New season, new picks
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Shop the collection
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-base sm:text-lg mb-8">
            Quality clothes and shoes, picked for you. Browse the catalog below and add
            what you like to your cart.
          </p>
          <a
            href="#catalog"
            className="inline-block bg-black text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Start shopping
          </a>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-6 py-6 flex gap-3 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c.id}
                id={`category-${c.id}`}
                onClick={() => setCategoryFilter(String(c.id))}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  categoryFilter === String(c.id)
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {c.name}
              </button>
            ))}
            {categoryFilter !== "all" && (
              <button
                onClick={() => setCategoryFilter("all")}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-gray-700"
              >
                Clear filter
              </button>
            )}
          </div>
        </section>
      )}

      {message && (
        <div
          className={`px-6 py-2 text-sm text-center ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <main id="catalog" className="max-w-6xl mx-auto px-6 py-10 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight">
            {categoryFilter === "all"
              ? "All products"
              : categories.find((c) => String(c.id) === categoryFilter)?.name || "Products"}
          </h2>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm w-48 sm:w-64"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-16">Loading products…</div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 py-16">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center text-3xl text-gray-300 font-bold">
                  {product.image_url ? (
                    <img
                      src={`${BACKEND_URL}${product.image_url}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    product.name.charAt(0)
                  )}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{product.category_name || "Uncategorized"}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm">${product.price}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={product.stock <= 0 || addingId === product.id}
                    className="w-full bg-black text-white rounded-md py-1.5 text-xs font-medium disabled:opacity-50 hover:bg-gray-800 transition-colors"
                  >
                    {addingId === product.id ? "Adding…" : "Add to cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <StoreFooter categories={categories} />
      <CartDrawer />
    </div>
  );
}
