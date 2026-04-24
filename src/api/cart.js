import axiosInstance from "../axios/ index";

function unwrapResponse(response) {
  return response.data?.data;
}

export async function getCart() {
  const response = await axiosInstance.get("/cart");

  return unwrapResponse(response);
}

export async function addToCart(payload) {
  const response = await axiosInstance.post("/cart/items", payload);

  return unwrapResponse(response);
}

export async function updateCartItem(itemId, payload) {
  const response = await axiosInstance.patch(`/cart/items/${itemId}`, payload);

  return unwrapResponse(response);
}

export async function removeCartItem(itemId) {
  const response = await axiosInstance.delete(`/cart/items/${itemId}`);

  return unwrapResponse(response);
}

export async function clearCart() {
  const response = await axiosInstance.delete("/cart");

  return unwrapResponse(response);
}
