// Use proxy during development, direct URL in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api' 
  : 'https://yaytravel-backend-534113739138.europe-west1.run.app';

export interface CreateUserData {
  FirstName: string;
  LastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  country?: string;
  city?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: string;
  email: string;
  FirstName: string;
  LastName: string;
  phoneNumber: string;
  country?: string;
  city?: string;
  createdAt: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('accessToken');
  }

  async createUser(userData: CreateUserData): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create user');
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const tokenData = await response.json();
    
    // Store the token
    this.token = tokenData.access_token;
    localStorage.setItem('accessToken', tokenData.access_token);
    
    return tokenData;
  }

  async fetchUserProfile(): Promise<UserProfile> {
    if (!this.token) {
      throw new Error('No access token found. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token is invalid or expired
        this.logout();
        throw new Error('Session expired. Please log in again.');
      }
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch user profile');
    }

    return response.json();
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  async createConversation(): Promise<string> {
    if (!this.token) {
      throw new Error('No access token found. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/conversations/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Session expired. Please log in again.');
      }
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create conversation');
    }

    // The endpoint returns the conversation ID as a string
    return response.json();
  }

  async getConversations(): Promise<any[]> {
    if (!this.token) {
      throw new Error('No access token found. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/conversations/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Session expired. Please log in again.');
      }
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch conversations');
    }

    return response.json();
  }
}

export const authService = new AuthService(); 