import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import StoreHeader from "@/components/StoreHeader";
import StoreFooter from "@/components/StoreFooter";
import CartDrawer from "@/components/CartDrawer";
import PageLoader from "@/components/PageLoader";

const BACKEND_URL = "http://localhost:5000";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    setMessage(null);

    Promise.all([
      axiosClient.get(`/products/${id}`),
      axiosClient.get("/categories"),
    ])
      .then(([productRes, categoriesRes]) => {
        setProduct(productRes.data);
        setCategories(categoriesRes.data);
      })
      .catch((err) => console.error("Failed to load product:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setMessage({ type: "error", text: "Please log in to add items to your cart." });
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    setAdding(true);
    setMessage(null);
    try {
      await addToCart(product, quantity);
      setMessage({ type: "success", text: `Added ${quantity} × ${product.name} to your cart.` });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Could not add to cart." });
    } finally {
      setAdding(false);
    }
  };

if (loading) {
  return <PageLoader message="Loading products…" />;
}

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <p>Product not found.</p>
        <button onClick={() => navigate("/")} className="text-sm underline">
          Back to shop
        </button>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StoreHeader categories={categories} />

      <main className="max-w-6xl mx-auto px-6 py-8 flex-1 w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="aspect-square bg-white border rounded-lg flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img
                src={`${BACKEND_URL}${product.image_url}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl text-gray-200 font-bold">
                {product.name.charAt(0)}
              </span>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              {product.name}
            </h1>

            {product.category_name && (
              <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full mb-4">
                {product.category_name}
              </span>
            )}

            <p className="text-3xl font-bold mb-4">${product.price}</p>

            {product.description && (
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            )}

            <div className="flex items-center gap-2 mb-6 text-sm">
              <span className="text-gray-500">Stock:</span>
              <span
                className={`font-medium px-2 py-0.5 rounded-full ${
                  outOfStock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}
              >
                {outOfStock ? "Out of stock" : `${product.stock} in stock`}
              </span>
            </div>

            {message && (
              <div
                className={`text-sm rounded-md px-3 py-2 mb-4 ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            {!outOfStock && (
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center gap-1 border rounded-md">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={outOfStock || adding}
              className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-md text-sm font-semibold disabled:opacity-50 hover:bg-gray-800 transition-colors"
            >
              {outOfStock ? "Out of stock" : adding ? "Adding…" : "Add to cart"}
            </button>
          </div>
        </div>
      </main>

      <StoreFooter categories={categories} />
      <CartDrawer />
    </div>
  );
}
