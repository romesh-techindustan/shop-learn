import axiosInstance from "../axios/ index";
import { unwrapResponse } from "../common/common";

export async function getUsers() {
  const response = await axiosInstance.get("/users");

  return unwrapResponse(response);
}

export async function getUserById(userId) {
  const response = await axiosInstance.get(`/users/${userId}`);

  return unwrapResponse(response);
}

export async function getProfile(){
  const storedUser = window.localStorage.getItem("userDetail");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id || user?.user?.id;

  if (!userId) {
    throw new Error("User id is required to load profile");
  }

  const response = await axiosInstance.get(`/users/${userId}`);

  return unwrapResponse(response);
}
