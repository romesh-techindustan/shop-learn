import axiosInstance from "../axios/ index";
import { unwrapResponse } from "../common/common";

export async function getAddresses() {
  const response = await axiosInstance.get("/addresses");

  return unwrapResponse(response);
}

export async function getAddressById(addressId) {
  const response = await axiosInstance.get(`/addresses/${addressId}`);

  return unwrapResponse(response);
}

export async function createAddress(payload) {
  const response = await axiosInstance.post("/addresses", payload);

  return unwrapResponse(response);
}

export async function updateAddress(addressId, payload) {
  const response = await axiosInstance.patch(`/addresses/${addressId}`, payload);

  return unwrapResponse(response);
}

export async function deleteAddress(addressId) {
  const response = await axiosInstance.delete(`/addresses/${addressId}`);

  return unwrapResponse(response);
}
