import axiosInstance from "../axios/ index";
import { unwrapResponse } from "../common/common";

export async function signup(data) {
  const {name, contact, password} = data;
  const response = await axiosInstance.post("/auth/sign-up", {name, email:contact, password});

  return unwrapResponse(response);
}

export async function login(data) {
  const {contact, password} = data;
  const response = await axiosInstance.post("/auth/login", {email:contact, password});

  return unwrapResponse(response);
}

export async function verifyAdminOtp(data) {
  const response = await axiosInstance.post("/auth/verify-admin-otp", data);

  return unwrapResponse(response);
}

export async function changePassword(data) {
  const response = await axiosInstance.post("/auth/change-password", data);

  return unwrapResponse(response);
}

export async function forgotPassword(email) {
  const response = await axiosInstance.post("/auth/forgot-password", { email });

  return unwrapResponse(response);
}

export async function resetPassword(data) {
  const response = await axiosInstance.post("/auth/reset-password", data);

  return unwrapResponse(response);
}
