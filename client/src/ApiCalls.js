import { get, post, del, put } from "./callMethods";

export async function loadUserSessions(user_id) {
  return get(`/users/sessions/${user_id}`);
}

export async function addSession(data) {
  return post(`/sessions`, data);
}

export async function loadAllSessions() {
  return get("/sessions");
}

export async function getSession(session_id) {
  return fetch(`/sessions/${session_id}`);
}

export async function deleteSession(session_id) {
  return del(`/sessions/${session_id}`);
}

export async function updateSession(session_id) {
  return put(`sessions/${session_id}`);
}

export async function register(data) {
  return post(`/users`, data);
}

export async function login(data) {
  return post(`/login`, data);
}

export async function getUserInfo() {
  return get(`/me`);
}

export async function logout() {
  return get("/logout");
}

export async function updateUser(data) {
  return put("/users", data);
}
