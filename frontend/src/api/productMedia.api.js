import axiosClient from "./axiosClient";

export const productMediaApi = {
  getAll: (productId) =>
    axiosClient.get(`/product-media/${productId}`).then((res) => res.data),

  upload: (productId, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("media", file));
    return axiosClient
      .post(`/product-media/${productId}`, formData)
      .then((res) => res.data);
  },

  remove: (mediaId) =>
    axiosClient.delete(`/product-media/${mediaId}`).then((res) => res.data),
};
