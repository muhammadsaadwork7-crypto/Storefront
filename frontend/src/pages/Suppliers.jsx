import Topbar from "@/components/layout/Topbar";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import FormDialog from "@/components/FormDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import ErrorBanner from "@/components/ErrorBanner";
import { suppliersApi } from "@/api/entities";
import { useEntityCrud } from "@/hooks/useEntityCrud";

const columns = [
  { key: "id", label: "ID", mono: true },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
];

const fields = [
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address", type: "textarea", fullWidth: true },
];

export default function Suppliers() {
  const crud = useEntityCrud(suppliersApi, { entityLabel: "Supplier" });

  return (
    <>
      <Topbar title="Suppliers" description="Vendors that provide your inventory" />
      <main className="p-6">
        <PageHeader
          title="Suppliers"
          description={`${crud.data.length} total`}
          actionLabel="Add supplier"
          onAction={crud.openAdd}
        />
        <ErrorBanner message={crud.error} />
        <DataTable
          columns={columns}
          data={crud.data}
          loading={crud.loading}
          onEdit={crud.openEdit}
          onDelete={crud.setDeleteTarget}
        />
      </main>

      <FormDialog
        open={crud.formOpen}
        onOpenChange={(open) => !open && crud.closeForm()}
        title={crud.editingItem ? "Edit supplier" : "Add supplier"}
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
        entityLabel="supplier"
      />
    </>
  );
}
