import Topbar from "@/components/layout/Topbar";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import FormDialog from "@/components/FormDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import ErrorBanner from "@/components/ErrorBanner";
import { categoriesApi } from "@/api/entities";
import { useEntityCrud } from "@/hooks/useEntityCrud";

const columns = [
  { key: "id", label: "ID", mono: true },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
];

const fields = [
  { key: "name", label: "Name", required: true, fullWidth: true },
  { key: "description", label: "Description", type: "textarea", fullWidth: true },
];

export default function Categories() {
  const crud = useEntityCrud(categoriesApi, { entityLabel: "Category" });

  return (
    <>
      <Topbar title="Categories" description="Group products into browsable categories" />
      <main className="p-6">
        <PageHeader
          title="Categories"
          description={`${crud.data.length} total`}
          actionLabel="Add category"
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
        title={crud.editingItem ? "Edit category" : "Add category"}
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
        entityLabel="category"
      />
    </>
  );
}
