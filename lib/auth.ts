import axios from "axios";
import { User } from "@/lib/types";

const API_BASE_URL = "http://localhost:8000";

export async function loginUser(email: string, password: string): Promise<{ access_token: string; user: User }> {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Erreur lors de la connexion");
  }
}
export async function registerUser(username: string, email: string, password: string): Promise<{ access_token: string; user: User }> {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, { username, email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Erreur lors de l'inscription");
  }
}
export async function getUsers(token: string): Promise<User[]> {
  try {
    const response = await axios.get<User[]>(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Error fetching users");
  }
}

