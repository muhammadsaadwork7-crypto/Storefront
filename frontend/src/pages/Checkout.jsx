import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import StoreHeader from "@/components/StoreHeader";
import StoreFooter from "@/components/StoreFooter";
import PageLoader from "@/components/PageLoader";

const BACKEND_URL = "http://localhost:5000";

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingName, setShippingName] = useState(user?.name || "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setPlacing(true);
    try {
      const res = await axiosClient.post("/orders", {
        status: "pending",
        payment_method: paymentMethod,
        shipping_name: shippingName,
        shipping_address: shippingAddress,
        shipping_phone: shippingPhone,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: Number(item.price),
        })),
      });
      await clearCart();
      setPlacedOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Could not place your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  // Order confirmation view
  if (placedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <StoreHeader categories={[]} />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white border rounded-lg shadow-sm p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Order confirmed!</h1>
            <p className="text-sm text-gray-500 mb-6">
              Order #{placedOrder.id} has been placed for ${Number(placedOrder.total_amount).toFixed(2)}.
              We'll ship it to {placedOrder.shipping_address}.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-black text-white rounded-md px-6 py-2.5 text-sm font-semibold"
            >
              Continue shopping
            </button>
          </div>
        </main>
        <StoreFooter categories={[]} />
      </div>
    );
  }

  // Empty cart guard
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <StoreHeader categories={[]} />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <button onClick={() => navigate("/")} className="text-sm underline">
              Back to shop
            </button>
          </div>
        </main>
        <StoreFooter categories={[]} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StoreHeader categories={[]} />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-10 w-full">
        <h1 className="text-2xl font-bold tracking-tight mb-1 text-center">Checkout</h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Review your order and enter delivery details.
        </p>

        <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold mb-4">Order summary</h2>
          <div className="flex flex-col gap-3 mb-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                  {item.image_url ? (
                    <img
                      src={`${BACKEND_URL}${item.image_url}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-300 font-bold text-sm">{item.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty {item.quantity} × ${item.price}</p>
                </div>
                <span className="text-sm font-medium">
                  ${(item.quantity * item.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between text-base font-bold">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="bg-white border rounded-lg shadow-sm p-6">
          <h2 className="text-sm font-semibold mb-4">Delivery details</h2>

          {error && (
            <div className="bg-red-100 text-red-700 text-sm rounded-md px-3 py-2 mb-4">{error}</div>
          )}

          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Full name</label>
              <input
                required
                value={shippingName}
                onChange={(e) => setShippingName(e.target.value)}
                className="border rounded-md px-3 py-2 w-full text-sm"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Delivery address</label>
              <textarea
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="border rounded-md px-3 py-2 w-full text-sm"
                rows={3}
                placeholder="Street, city, postal code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone number</label>
              <input
                required
                value={shippingPhone}
                onChange={(e) => setShippingPhone(e.target.value)}
                className="border rounded-md px-3 py-2 w-full text-sm"
                placeholder="03xx xxxxxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="border rounded-md px-3 py-2 w-full text-sm"
              >
                <option value="card">Card</option>
                <option value="cash">Cash on delivery</option>
                <option value="bank_transfer">Bank transfer</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={placing}
            className="w-full bg-black text-white rounded-md py-3 text-sm font-semibold disabled:opacity-50"
          >
            {placing ? "Placing order…" : `Place order — $${cartTotal.toFixed(2)}`}
          </button>
        </form>
      </main>

      <StoreFooter categories={[]} />
    </div>
  );
}
