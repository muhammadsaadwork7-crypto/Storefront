import axiosClient from "./axiosClient";

export function emitEntityChanged(resource, payload = {}) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("entity:updated", { detail: { resource, payload } }));
  }
}

/**
 * Creates a standard CRUD API object for a given REST resource.
 * e.g. createEntityApi('categories') => { getAll, getOne, create, update, remove }
 */
export function createEntityApi(resource) {
  const base = `/${resource}`;
  return {
    getAll: () => axiosClient.get(base).then((res) => res.data),
    getOne: (id) => axiosClient.get(`${base}/${id}`).then((res) => res.data),
    create: (data) =>
      axiosClient.post(base, data).then((res) => {
        emitEntityChanged(resource, { action: "created", data: res.data });
        return res.data;
      }),
    update: (id, data) =>
      axiosClient.put(`${base}/${id}`, data).then((res) => {
        emitEntityChanged(resource, { action: "updated", data: res.data });
        return res.data;
      }),
    remove: (id) =>
      axiosClient.delete(`${base}/${id}`).then((res) => {
        emitEntityChanged(resource, { action: "deleted", data: res.data });
        return res.data;
      }),
  };
}
