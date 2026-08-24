import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import FormDialog from "@/components/FormDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import ErrorBanner from "@/components/ErrorBanner";
import { Badge } from "@/components/ui/badge";
import { productsApi, categoriesApi, suppliersApi } from "@/api/entities";
import { useEntityCrud } from "@/hooks/useEntityCrud";
import { formatCurrency } from "@/lib/utils";
import PageLoader from "@/components/PageLoader";

function StockBadge({ stock }) {
  const n = Number(stock);
  if (n <= 0) return <Badge variant="destructive" dot>Out of stock</Badge>;
  if (n <= 10) return <Badge variant="warning" dot>{n} low</Badge>;
  return <Badge variant="success" dot>{n} in stock</Badge>;
}

export default function Products() {
  const crud = useEntityCrud(productsApi, { entityLabel: "Product" });
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(() => {});
    suppliersApi.getAll().then(setSuppliers).catch(() => {});
  }, []);

  const columns = [
    { key: "id", label: "ID", mono: true },
    { key: "name", label: "Name" },
    { key: "category_name", label: "Category" },
    {
      key: "price",
      label: "Price",
      mono: true,
      render: (row) => formatCurrency(row.price),
    },
    {
      key: "stock",
      label: "Stock",
      render: (row) => <StockBadge stock={row.stock} />,
    },
  ];

  const fields = [
    { key: "image", label: "Product image", type: "file" },
    { key: "name", label: "Product name", required: true, fullWidth: true },
    {
      key: "category_id",
      label: "Category",
      type: "select",
      options: categories.map((c) => ({ value: c.id, label: c.name })),
      placeholder: "Select category",
    },
    {
      key: "supplier_id",
      label: "Supplier",
      type: "select",
      options: suppliers.map((s) => ({ value: s.id, label: s.name })),
      placeholder: "Select supplier",
    },
    { key: "price", label: "Price (USD)", type: "number", required: true },
    { key: "stock", label: "Stock quantity", type: "number", required: true },
    { key: "description", label: "Description", type: "textarea", fullWidth: true },
  ];

  return (
    <>
      <Topbar title="Products" description="Manage your product catalog" />
      <main className="p-6">
        <PageHeader
          title="Products"
          description={`${crud.data.length} total`}
          actionLabel="Add product"
          onAction={crud.openAdd}
        />
        <ErrorBanner message={crud.error} />
        <DataTable
          columns={columns}
          data={crud.data}
          loading={crud.loading}
          onEdit={crud.openEdit}
          onDelete={crud.setDeleteTarget}
          searchKeys={["name", "category_name"]}
        />
      </main>

      <FormDialog
        open={crud.formOpen}
        onOpenChange={(open) => !open && crud.closeForm()}
        title={crud.editingItem ? "Edit product" : "Add product"}
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
        entityLabel="product"
      />
    </>
  );
}
