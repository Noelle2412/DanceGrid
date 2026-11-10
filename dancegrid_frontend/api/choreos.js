import client from "../lib/client";

export async function getChoreo(id) {
  const { data } = await client.get(`/choreos/${id}`);
  return data;
}
export async function createChoreo(body) {
  const { data } = await client.post(`/choreos/`, body);
  return data;
}
export async function updateChoreo(id, body) {
  const { data } = await client.patch(`/choreos/${id}`, body);
  return data;
}
export async function deleteChoreo(id) {
  const { data } = await client.delete(`/choreos/${id}`);
  return data;
}
export async function updateCouples(id, body) {
  const { data } = await client.patch(`/choreos/${id}/update_couples`, body);
  return data;
}
export async function updatePictures(id, body) {
  const { data } = await client.patch(`/choreos/${id}/update_pictures`, body);
  return data;
}
export async function addSharedUser(id, body) {
  const { data } = await client.patch(`/choreos/${id}/add_shared_user`, body);
  return data;
}
export async function removeSharedUser(id, body) {
  const { data } = await client.patch(
    `/choreos/${id}/remove_shared_user`,
    body,
  );
  return data;
}
export async function removeAccess(id, body) {
  const { data } = await client.patch(`/choreos/${id}/remove_access`, body);
  return data;
}
