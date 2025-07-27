export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Note {
  id: number;
  user?: User;
  title: string;
  content: string;
  tags?: string;
  status: string;
  shared_with?: User[]; 
  public_token?: string;
  created_at: string;
  updated_at: string;
}


export type NotePayload = {
  title: string;
  content: string;
  tags?: string;
  status: string;
  shared_with?: number[]; 
  public_token?: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};