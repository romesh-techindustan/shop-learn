import axiosInstance from "../axios/ index";
import { unwrapResponse } from "../common/common";

export async function getProductRatings(productId) {
  const response = await axiosInstance.get(`/ratings/products/${productId}`);

  return unwrapResponse(response);
}

export async function getMyRatings() {
  const response = await axiosInstance.get("/ratings/me");

  return unwrapResponse(response);
}

export async function createRating(payload) {
  const response = await axiosInstance.post("/ratings", payload);

  return unwrapResponse(response);
}

export async function updateRating(ratingId, payload) {
  const response = await axiosInstance.patch(`/ratings/${ratingId}`, payload);

  return unwrapResponse(response);
}

export async function deleteRating(ratingId) {
  const response = await axiosInstance.delete(`/ratings/${ratingId}`);

  return unwrapResponse(response);
}
