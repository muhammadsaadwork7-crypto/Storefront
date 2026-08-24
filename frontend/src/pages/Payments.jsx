import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import FormDialog from "@/components/FormDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import ErrorBanner from "@/components/ErrorBanner";
import { Badge } from "@/components/ui/badge";
import { paymentsApi, ordersApi } from "@/api/entities";
import { useEntityCrud } from "@/hooks/useEntityCrud";
import { formatCurrency, formatDate } from "@/lib/utils";
import PageLoader from "@/components/PageLoader";

const statusVariant = {
  pending: "warning",
  completed: "success",
  failed: "destructive",
};

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

const methodOptions = [
  { value: "card", label: "Card" },
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank transfer" },
];

export default function Payments() {
  const crud = useEntityCrud(paymentsApi, { entityLabel: "Payment" });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    ordersApi.getAll().then(setOrders).catch(() => {});
  }, []);

  useEffect(() => {
    const handleEntityUpdated = (event) => {
      if (event.detail?.resource === "orders" || event.detail?.resource === "payments") {
        ordersApi.getAll().then(setOrders).catch(() => {});
      }
    };

    window.addEventListener("entity:updated", handleEntityUpdated);
    return () => window.removeEventListener("entity:updated", handleEntityUpdated);
  }, []);

  const columns = [
    { key: "id", label: "ID", mono: true },
    { key: "order_id", label: "Order", mono: true, render: (row) => `#${row.order_id}` },
    {
      key: "amount",
      label: "Amount",
      mono: true,
      render: (row) => formatCurrency(row.amount),
    },
    { key: "method", label: "Method" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={statusVariant[row.status] || "secondary"} dot>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "paid_at",
      label: "Paid",
      render: (row) => formatDate(row.paid_at),
    },
  ];

  const fields = [
    {
      key: "order_id",
      label: "Order",
      type: "select",
      required: true,
      options: orders.map((o) => ({ value: o.id, label: `#${o.id} — ${o.user_name || "Unknown"}` })),
      placeholder: "Select order",
      fullWidth: true,
    },
    { key: "amount", label: "Amount (USD)", type: "number", required: true },
    { key: "method", label: "Method", type: "select", options: methodOptions, placeholder: "Select method" },
    { key: "status", label: "Status", type: "select", options: statusOptions, placeholder: "Select status" },
  ];

  return (
    <>
      <Topbar title="Payments" description="Payment records tied to orders" />
      <main className="p-6">
        <PageHeader
          title="Payments"
          description={`${crud.data.length} total`}
          actionLabel="Add payment"
          onAction={crud.openAdd}
        />
        <ErrorBanner message={crud.error} />
        <DataTable
          columns={columns}
          data={crud.data}
          loading={crud.loading}
          onEdit={crud.openEdit}
          onDelete={crud.setDeleteTarget}
          searchKeys={["method", "status", "order_id"]}
        />
      </main>

      <FormDialog
        open={crud.formOpen}
        onOpenChange={(open) => !open && crud.closeForm()}
        title={crud.editingItem ? "Edit payment" : "Add payment"}
        fields={fields}
        initialData={crud.editingItem}
        onSubmit={crud.save}
        saving={crud.saving}
      />

      <DeleteConfirmDialog
        target={crud.deleteTarget}
        onCancel={() => crud.setDeleteTarget(null)}
        onConfirm={crud.confirmDelete}
        deleting={crud.deleting}
        entityLabel="payment"
      />
    </>
  );
}
