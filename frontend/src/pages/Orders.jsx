import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import FormDialog from "@/components/FormDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import ErrorBanner from "@/components/ErrorBanner";
import { Badge } from "@/components/ui/badge";
import { ordersApi, usersApi } from "@/api/entities";
import { useEntityCrud } from "@/hooks/useEntityCrud";
import { formatCurrency, formatDate } from "@/lib/utils";
import PageLoader from "@/components/PageLoader";

const statusVariant = {
  pending: "warning",
  shipped: "default",
  delivered: "success",
  cancelled: "destructive",
};

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function Orders() {
  const crud = useEntityCrud(ordersApi, { entityLabel: "Order" });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    usersApi.getAll().then(setUsers).catch(() => {});
  }, []);

  useEffect(() => {
    const handleEntityUpdated = (event) => {
      if (event.detail?.resource === "orders" || event.detail?.resource === "payments") {
        crud.reload();
      }
    };

    window.addEventListener("entity:updated", handleEntityUpdated);
    return () => window.removeEventListener("entity:updated", handleEntityUpdated);
  }, [crud.reload]);

  const columns = [
    { key: "id", label: "Order", mono: true, render: (row) => `#${row.id}` },
    { key: "user_name", label: "Customer" },
    {
      key: "total_amount",
      label: "Total",
      mono: true,
      render: (row) => formatCurrency(row.total_amount),
    },
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
      key: "created_at",
      label: "Placed",
      render: (row) => formatDate(row.created_at),
    },
  ];

  const fields = [
    {
      key: "user_id",
      label: "Customer",
      type: "select",
      required: true,
      options: users.map((u) => ({ value: u.id, label: `${u.name} (${u.email})` })),
      placeholder: "Select customer",
      fullWidth: true,
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: statusOptions,
      placeholder: "Select status",
      fullWidth: true,
    },
  ];

  return (
    <>
      <Topbar title="Orders" description="Customer orders and fulfillment status" />
      <main className="p-6">
        <PageHeader
          title="Orders"
          description={`${crud.data.length} total • line items managed via the API`}
          actionLabel="Add order"
          onAction={crud.openAdd}
        />
        <ErrorBanner message={crud.error} />
        <DataTable
          columns={columns}
          data={crud.data}
          loading={crud.loading}
          onEdit={crud.openEdit}
          onDelete={crud.setDeleteTarget}
          searchKeys={["user_name", "status", "id"]}
        />
      </main>

      <FormDialog
        open={crud.formOpen}
        onOpenChange={(open) => !open && crud.closeForm()}
        title={crud.editingItem ? "Edit order" : "Add order"}
        description={
          !crud.editingItem
            ? "New orders start with a $0 total — add line items from the products page or the API."
            : undefined
        }
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
        entityLabel="order"
      />
    </>
  );
}
