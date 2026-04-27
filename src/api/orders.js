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
  let response;

  try {
    response = await axiosInstance.get("/orders/admin", { params });
  } catch (error) {
    if (![404, 405].includes(error.response?.status)) {
      throw error;
    }

    response = await axiosInstance.get("/admin/orders", { params });
  }

  return unwrapResponse(response);
}

export async function getAdminOrderById(orderId) {
  const { response, ...rest } = await getAdminOrders();
  const orders = Array.isArray(response) ? response : response?.orders || [];
  const order = orders.find((item) => item.id === orderId);

  return { response: order || null, ...rest };
}

export async function updateOrderStatus(orderId, status) {
  let response;

  try {
    response = await axiosInstance.patch(`/orders/admin/${orderId}/status`, {
      status,
    });
  } catch (error) {
    if (![404, 405].includes(error.response?.status)) {
      throw error;
    }

    response = await axiosInstance.patch(`/admin/orders/${orderId}/status`, {
      status,
    });
  }

  return unwrapResponse(response);
}

export async function updatePaymentStatus(orderId, paymentStatus) {
  let response;

  try {
    response = await axiosInstance.patch(
      `/orders/admin/${orderId}/payment-status`,
      { paymentStatus },
    );
  } catch (error) {
    if (![404, 405].includes(error.response?.status)) {
      throw error;
    }

    response = await axiosInstance.patch(
      `/admin/orders/${orderId}/payment-status`,
      { paymentStatus },
    );
  }

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

export async function updateStripePaymentStatus(sessionId) {
  const response = await axiosInstance.post(`/checkout/payment-status`, {
    sessionId,
  });

  return unwrapResponse(response);
}
