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