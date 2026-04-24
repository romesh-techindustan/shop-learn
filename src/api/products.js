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

export async function getCategories(){
  const response = await axiosInstance.get(`/products/categories`);

  return unwrapResponse(response);

}