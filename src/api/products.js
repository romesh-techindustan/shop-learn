import axiosInstance from "../axios/ index";
import { unwrapResponse } from "../common/common";

export async function getProducts(params) {
  const response = await axiosInstance.get("/products", { params });

  return unwrapResponse(response);
}

export async function getProductById(productId) {
  const response = await axiosInstance.get(`/products/${productId}`);

  return unwrapResponse(response);
}

export async function getCategories() {
  const response = await axiosInstance.get(`/products/categories`);

  return unwrapResponse(response);

}

export async function getProductsByCategory(category) {
  const response = await axiosInstance.get(`/products/category/${category}`);

  return unwrapResponse(response);

}

export async function createProduct(data) {
  const response = await axiosInstance.post("/products", data);
  return unwrapResponse(response);
}

export async function updateProduct(productId, data) {
  const response = await axiosInstance.patch(`/products/${productId}`, data);
  return unwrapResponse(response);
}

export async function deleteProduct(productId) {
  const response = await axiosInstance.delete(`/products/${productId}`);
  return unwrapResponse(response);
}