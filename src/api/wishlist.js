import axiosInstance from "../axios/ index";
import { unwrapResponse } from "../common/common";

export async function getWishlist() {
  const response = await axiosInstance.get("/wishlist");

  return unwrapResponse(response);
}

export async function addToWishlist(productId) {
  const response = await axiosInstance.post("/wishlist/items", { productId });

  return unwrapResponse(response);
}

export async function removeFromWishlist(wishlistId) {
  const response = await axiosInstance.delete(`/wishlist/items/${wishlistId}`);

  return unwrapResponse(response);
}

export async function removeAllFromWishlist() {
  const response = await axiosInstance.delete("/wishlist");

  return unwrapResponse(response);
}

