import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Handles loading, add/edit dialog state, and delete confirmation
 * for a single entity's CRUD page.
 */
export function useEntityCrud(api, { entityLabel = "record" } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getAll();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingItem(null);
  };

  const save = async (formData) => {
    setSaving(true);
    try {
      if (editingItem) {
        await api.update(editingItem.id, formData);
        toast.success(`${entityLabel} updated`);
      } else {
        await api.create(formData);
        toast.success(`${entityLabel} created`);
      }
      closeForm();
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.error || err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.remove(deleteTarget.id);
      toast.success(`${entityLabel} deleted`);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.error || err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return {
    data,
    loading,
    error,
    reload: load,
    formOpen,
    editingItem,
    saving,
    openAdd,
    openEdit,
    closeForm,
    save,
    deleteTarget,
    setDeleteTarget,
    deleting,
    confirmDelete,
  };
}
