// services/notesService.ts
import axios from "axios";
import { Note } from "@/lib/types";

const API_BASE_URL = "http://localhost:8000";

export async function getNotes(
  token: string,
  userId: number,
  search?: string,
  status?: string
): Promise<Note[]> {
  const params: any = { user_id: userId };
  if (search) params.search = search;
  if (status) params.status = status;

  try {
    const response = await axios.get<Note[]>(`${API_BASE_URL}/notes`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return []; // Return empty array if no notes found
    }
    throw new Error(error.response?.data?.detail || "Error fetching notes");
  }
}

export async function getNoteById(token:string,noteId: number, userId: number): Promise<Note | null> {
  const response = await axios.get<Note>(`${API_BASE_URL}/notes/${noteId}`, {
    params: { user_id: userId },
     headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
  return response.data;
}

export async function createNote(
  token: string,
  note: Omit<Note, "id" | "created_at" | "updated_at" | "user_id">
): Promise<Note> {
  const response = await axios.post<Note>(`${API_BASE_URL}/notes`, note, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
export async function updateNote(
  token: string,
  noteId: number,
  note: Partial<Omit<Note, "id" | "created_at" | "updated_at" | "user_id">>
): Promise<Note> {
  const response = await axios.put<Note>(`${API_BASE_URL}/notes/${noteId}`, note, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

export async function deleteNote(noteId: number ,token:string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/notes/${noteId}`,{
    headers:{
        Authorization:`Bearer ${token}`,
    },
  });
}

export async function getSharedNotes(token: string, userId: number): Promise<Note[]> {
  try {
    const response = await axios.get<Note[]>(`${API_BASE_URL}/shared-notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { user_id: userId },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Error fetching shared notes");
  }
}

