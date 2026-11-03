import client from "../lib/client";

export async function getAllUsers() {
  const { data } = await client.get("/users");
  return data;
}
export async function getUser(id) {
  const { data } = await client.get(`/users/${id}`);
  return data;
}
export async function getUsersChoreos(id) {
  const { data } = await client.get(`/users/${id}/choreos`);
  return data;
}
export async function getSharedWithChoreos(id) {
  const { data } = await client.get(`/users/${id}/shared_choreos`);
  return data;
}
export async function registerUser(formData) {
  if (formData.get("password") !== formData.get("repeat_password"))
    throw new Error("Passwords do not match");
  const body = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const { data } = await client.post("/users/register", body);
  return data;
}
export async function loginUser(formData) {
  const body = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const { data } = await client.post("/users/login", body);
  return data;
}
export async function logoutUser(id) {
  const { data } = await client.post(`/users/${id}/logout`);
  return data;
}
export async function deleteUser(id) {
  const { data } = await client.delete(`/users/${id}`);
  return data;
}
