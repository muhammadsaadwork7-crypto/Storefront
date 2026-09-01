import Topbar from "@/components/layout/Topbar";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import FormDialog from "@/components/FormDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import ErrorBanner from "@/components/ErrorBanner";
import { Badge } from "@/components/ui/badge";
import { usersApi } from "@/api/entities";
import { useEntityCrud } from "@/hooks/useEntityCrud";
import { formatDate } from "@/lib/utils";

const columns = [
  { key: "id", label: "ID", mono: true },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "role",
    label: "Role",
    render: (row) => (
      <Badge variant={row.role === "admin" ? "default" : "secondary"}>{row.role}</Badge>
    ),
  },
  {
    key: "created_at",
    label: "Joined",
    render: (row) => formatDate(row.created_at),
  },
];

const roleOptions = [
  { value: "customer", label: "Customer" },
  { value: "admin", label: "Admin" },
];

export default function Users() {
  const crud = useEntityCrud(usersApi, { entityLabel: "User" });

  const fields = [
    { key: "name", label: "Full name", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    ...(crud.editingItem
      ? []
      : [{ key: "password", label: "Password", type: "password", required: true }]),
    { key: "role", label: "Role", type: "select", options: roleOptions, placeholder: "Select role" },
  ];

  return (
    <>
      <Topbar title="Users" description="Admins and customers with accounts" />
      <main className="p-6">
        <PageHeader
          title="Users"
          description={`${crud.data.length} total`}
          actionLabel="Add user"
          onAction={crud.openAdd}
        />
        <ErrorBanner message={crud.error} />
        <DataTable
          columns={columns}
          data={crud.data}
          loading={crud.loading}
          onEdit={crud.openEdit}
          onDelete={crud.setDeleteTarget}
          searchKeys={["name", "email"]}
        />
      </main>

      <FormDialog
        open={crud.formOpen}
        onOpenChange={(open) => !open && crud.closeForm()}
        title={crud.editingItem ? "Edit user" : "Add user"}
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
        entityLabel="user"
      />
    </>
  );
}
