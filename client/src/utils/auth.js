import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function login(email, password) {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });

  const token = response.data.data.token;

  localStorage.setItem("token", token);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const userResponse = await axios.get(`${API_URL}/user`);
  return userResponse.data.data.user;
}

export function logout() {
  localStorage.removeItem("token");
  delete axios.defaults.headers.common["Authorization"];
}

export async function register(name, email, password) {
  const response = await axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
    password_confirmation: password, 
  });

  return response.data;
}

export async function forgotPassword(email) {
  const response = await axios.post(`${API_URL}/forgot-password`, {
    email,
  });

  return response.data;
}
