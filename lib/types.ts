export interface User {
  id: number;
  username: string;
  email: string;
}
export interface Note {
  id: number;
  user:User;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  tags?: string;
  status: String;
  shared_with?: number[]; 
  public_token?: string;
  
}


export type AuthContextType = {
  user: User ;
  token: string ;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};