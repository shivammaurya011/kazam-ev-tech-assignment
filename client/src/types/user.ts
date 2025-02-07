export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    initialized: boolean;
    loading: boolean;
    error: string | null;
  }