import { useEffect, useState } from "react";
import { Package, Users, ShoppingCart, CreditCard, Tags, Truck } from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import { Card, CardHeader, CardTitle, CardValue, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  productsApi,
  categoriesApi,
  suppliersApi,
  usersApi,
  ordersApi,
  paymentsApi,
} from "@/api/entities";
import { formatCurrency, formatDate } from "@/lib/utils";
import PageLoader from "@/components/PageLoader";

const statCards = [
  { key: "products", label: "Products", icon: Package, api: productsApi },
  { key: "categories", label: "Categories", icon: Tags, api: categoriesApi },
  { key: "suppliers", label: "Suppliers", icon: Truck, api: suppliersApi },
  { key: "users", label: "Users", icon: Users, api: usersApi },
  { key: "orders", label: "Orders", icon: ShoppingCart, api: ordersApi },
  { key: "payments", label: "Payments", icon: CreditCard, api: paymentsApi },
];

const statusVariant = {
  pending: "warning",
  shipped: "default",
  delivered: "success",
  cancelled: "destructive",
};

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const results = await Promise.all(
        statCards.map((c) => c.api.getAll().catch(() => []))
      );
      const next = {};
      statCards.forEach((c, i) => (next[c.key] = results[i]?.length ?? 0));
      setCounts(next);

      const orders = results[statCards.findIndex((c) => c.key === "orders")] || [];
      setRecentOrders([...orders].sort((a, b) => b.id - a.id).slice(0, 6));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <Topbar title="Dashboard" description="A quick look across your store" />
      <main className="p-6">
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {statCards.map(({ key, label, icon: Icon }) => (
            <Card key={key}>
              <CardHeader className="flex-row items-center justify-between p-4 pb-0">
                <CardTitle className="text-xs">{label}</CardTitle>
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-1">
                {loading ? (
                  <div className="h-7 w-10 animate-pulse rounded bg-secondary" />
                ) : (
                  <CardValue className="text-xl">{counts[key] ?? 0}</CardValue>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="p-5 pb-0">
            <CardTitle className="text-sm text-foreground">Recent orders</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-3">
            {loading ? (
              <div className="flex flex-col gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded bg-secondary" />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No orders yet</p>
            ) : (
              <div className="overflow-hidden rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
                      <th className="px-4 py-2 font-semibold">Order</th>
                      <th className="px-4 py-2 font-semibold">Customer</th>
                      <th className="px-4 py-2 font-semibold">Total</th>
                      <th className="px-4 py-2 font-semibold">Status</th>
                      <th className="px-4 py-2 font-semibold">Placed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o) => (
                      <tr key={o.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5 font-mono text-xs">#{o.id}</td>
                        <td className="px-4 py-2.5">{o.user_name || "—"}</td>
                        <td className="px-4 py-2.5 font-mono text-xs">{formatCurrency(o.total_amount)}</td>
                        <td className="px-4 py-2.5">
                          <Badge variant={statusVariant[o.status] || "secondary"} dot>
                            {o.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">{formatDate(o.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}