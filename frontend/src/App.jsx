import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import AppShell from "@/components/layout/AppShell";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Categories from "@/pages/Categories";
import Suppliers from "@/pages/Suppliers";
import Products from "@/pages/Products";
import Users from "@/pages/Users";
import Orders from "@/pages/Orders";
import Payments from "@/pages/Payments";
import ProductDetail from "@/pages/ProductDetail";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import RequireAuth from "@/routes/RequireAuth";
import Checkout from "@/pages/Checkout";
import RouteLoadingBar from "@/components/RouteLoadingBar";

export default function App() {
  return (
    <BrowserRouter>
    <RouteLoadingBar />
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/checkout"
          element={
          <RequireAuth>
          <Checkout />
          </RequireAuth>
           }
        />

        {/* Admin panel, nested under /admin, still wrapped in your AppShell */}
        <Route
          path="/admin/*"
          element={
          <RequireAuth adminOnly>
          <AppShell>
            <Routes>
                <Route index element={<Dashboard />} />
                <Route path="categories" element={<Categories />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="products" element={<Products />} />
                <Route path="users" element={<Users />} />
                <Route path="orders" element={<Orders />} />
                <Route path="payments" element={<Payments />} />
              </Routes>
          </AppShell>
        </RequireAuth>
          }
        />

      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  );
}
