import axiosInstance from "../axios/ index";
import { unwrapResponse } from "../common/common";

export async function getOrders() {
  const response = await axiosInstance.get("/orders");

  return unwrapResponse(response);
}

export async function getCurrentCheckout() {
  const response = await axiosInstance.get("/orders/current-checkout");

  return unwrapResponse(response);
}

export async function previewOrder(payload) {
  const response = await axiosInstance.post("/orders/preview", payload);

  return unwrapResponse(response);
}

export async function checkout(payload) {
  const response = await axiosInstance.post("/orders/checkout", payload);

  return unwrapResponse(response);
}

export async function getAdminOrders(params) {
  const response = await axiosInstance.get("/orders/admin", { params });

  return unwrapResponse(response);
}

export async function updateOrderStatus(orderId, status) {
  const response = await axiosInstance.patch(`/orders/admin/${orderId}/status`, {
    status,
  });

  return unwrapResponse(response);
}

export async function updatePaymentStatus(orderId, paymentStatus) {
  const response = await axiosInstance.patch(
    `/orders/admin/${orderId}/payment-status`,
    { paymentStatus },
  );

  return unwrapResponse(response);
}

export async function getOrderById(orderId) {
  const response = await axiosInstance.get(`/orders/${orderId}`);

  return unwrapResponse(response);
}

export async function retryPayment(orderId) {
  const response = await axiosInstance.post(`/orders/${orderId}/retry-payment`);

  return unwrapResponse(response);
}

export async function cancelOrder(orderId) {
  const response = await axiosInstance.post(`/orders/${orderId}/cancel`);

  return unwrapResponse(response);
}
