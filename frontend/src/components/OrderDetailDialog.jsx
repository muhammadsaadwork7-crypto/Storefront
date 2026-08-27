import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusVariant = {
  pending: "warning",
  shipped: "default",
  delivered: "success",
  cancelled: "destructive",
};

const paymentStatusVariant = {
  pending: "warning",
  completed: "success",
  failed: "destructive",
};

export default function OrderDetailDialog({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    axiosClient
      .get(`/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load order"))
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <Dialog open={!!orderId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Order #{orderId}</DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {error && <p className="text-sm text-destructive py-4">{error}</p>}

        {order && !loading && (
          <div className="flex flex-col gap-5 text-sm">
            {/* Status + total */}
            <div className="flex items-center justify-between">
              <Badge variant={statusVariant[order.status] || "secondary"} dot>
                {order.status}
              </Badge>
              <span className="font-mono font-semibold text-base">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground -mt-3">
              Placed {formatDate(order.created_at)}
            </p>

            {/* Shipping details */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Shipping details
              </h3>
              {order.shipping_name || order.shipping_address || order.shipping_phone ? (
                <div className="rounded-md border p-3 flex flex-col gap-1">
                  <p className="font-medium">{order.shipping_name || "—"}</p>
                  <p className="text-muted-foreground">{order.shipping_address || "—"}</p>
                  <p className="text-muted-foreground">{order.shipping_phone || "—"}</p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No shipping details on file for this order (placed before checkout collected them).
                </p>
              )}
            </div>

            {/* Line items */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Items
              </h3>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50 text-left text-xs text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Product</th>
                      <th className="px-3 py-2 font-medium">Qty</th>
                      <th className="px-3 py-2 font-medium">Price</th>
                      <th className="px-3 py-2 font-medium text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-3 py-2">{item.product_name || `#${item.product_id}`}</td>
                        <td className="px-3 py-2">{item.quantity}</td>
                        <td className="px-3 py-2 font-mono text-xs">{formatCurrency(item.price)}</td>
                        <td className="px-3 py-2 font-mono text-xs text-right">
                          {formatCurrency(item.quantity * item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Payment
              </h3>
              {(order.payments || []).length === 0 ? (
                <p className="text-muted-foreground italic">No payment record found.</p>
              ) : (
                order.payments.map((p) => (
                  <div key={p.id} className="rounded-md border p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize">{p.method.replace("_", " ")}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(p.paid_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{formatCurrency(p.amount)}</span>
                      <Badge variant={paymentStatusVariant[p.status] || "secondary"} dot>
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
