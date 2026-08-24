import { createEntityApi } from "./entity";

import axiosClient from "./axiosClient";

function buildProductFormData(data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "image") {
      if (value instanceof File) formData.append("image", value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
}

export const categoriesApi = createEntityApi("categories");
export const suppliersApi = createEntityApi("suppliers");

export const productsApi = {
  getAll: () => axiosClient.get("/products").then((res) => res.data),
  getOne: (id) => axiosClient.get(`/products/${id}`).then((res) => res.data),
  create: (data) => axiosClient.post("/products", buildProductFormData(data)).then((res) => res.data),
  update: (id, data) => axiosClient.put(`/products/${id}`, buildProductFormData(data)).then((res) => res.data),
  remove: (id) => axiosClient.delete(`/products/${id}`).then((res) => res.data),
};

export const usersApi = createEntityApi("users");
export const ordersApi = createEntityApi("orders");
export const paymentsApi = createEntityApi("payments");