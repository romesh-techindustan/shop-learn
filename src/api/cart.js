import axiosInstance from "../axios/ index";
import { unwrapResponse } from "../common/common";

export const CART_UPDATED_EVENT = "cart:updated";

function notifyCartUpdated(cart) {
  window.dispatchEvent(
    new CustomEvent(CART_UPDATED_EVENT, {
      detail: {
        cart,
        totalItems: cart?.totalItems,
      },
    }),
  );
}

export async function getCart() {
  const response = await axiosInstance.get("/cart");

  return unwrapResponse(response);
}

export async function addToCart(payload) {
  const response = await axiosInstance.post("/cart/items", payload);
  const result = unwrapResponse(response);

  notifyCartUpdated(result.response);

  return result;
}

export async function updateCartItem(itemId, payload) {
  const response = await axiosInstance.patch(`/cart/items/${itemId}`, payload);
  const result = unwrapResponse(response);

  notifyCartUpdated(result.response);

  return result;
}

export async function removeCartItem(itemId) {
  const response = await axiosInstance.delete(`/cart/items/${itemId}`);
  const result = unwrapResponse(response);

  notifyCartUpdated(result.response);

  return result;
}

export async function clearCart() {
  const response = await axiosInstance.delete("/cart");
  const result = unwrapResponse(response);

  notifyCartUpdated(result.response);

  return result;
}
