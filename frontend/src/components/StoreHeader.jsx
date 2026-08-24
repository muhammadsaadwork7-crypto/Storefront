import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function StoreHeader({ categories }) {
  const { setCartOpen, cartCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-shadow ${
        scrolled ? "shadow-sm border-b" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-white text-sm">
              S
            </span>
            Storefront
          </a>

          {/* <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            {categories.slice(0, 5).map((c) => (
              <a key={c.id} href={`#category-${c.id}`} className="hover:text-black transition-colors">
                {c.name}
              </a>
            ))}
          </nav> */}

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-3">
                {isAdmin && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="text-sm font-medium text-gray-600 hover:text-black"
                  >
                    Admin panel
                  </button>
                )}
                <span className="text-sm text-gray-500">Hi, {user.name.split(" ")[0]}</span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="p-1.5 rounded-md hover:bg-gray-100"
                  title="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium text-gray-600 hover:text-black"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-black text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-800"
                >
                  Sign up
                </button>
              </div>
            )}

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-md hover:bg-gray-100"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#category-${c.id}`}
                className="text-sm font-medium text-gray-600"
                onClick={() => setMobileOpen(false)}
              >
                {c.name}
              </a>
            ))}
            <div className="pt-2 border-t flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <button onClick={() => navigate("/admin")} className="text-sm text-left text-gray-600">
                      Admin panel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="text-sm text-left text-gray-600"
                  >
                    Log out ({user.name})
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate("/login")} className="text-sm text-left text-gray-600">
                    Log in
                  </button>
                  <button onClick={() => navigate("/register")} className="text-sm text-left text-gray-600">
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
