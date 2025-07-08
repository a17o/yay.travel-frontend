import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService, CreateUserData } from '../services/authService';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signUp: (userData: CreateUserData) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userProfile = await authService.fetchUserProfile();
          const user: User = {
            id: userProfile._id || userProfile.id,
            email: userProfile.email,
            name: `${userProfile.FirstName} ${userProfile.LastName}`,
            country: userProfile.country || 'United Kingdom',
            city: userProfile.city || 'London',
            createdAt: userProfile.createdAt ? new Date(userProfile.createdAt) : new Date()
          };
          setCurrentUser(user);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Clear invalid token
          authService.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authService.login(email, password);
      const userProfile = await authService.fetchUserProfile();
      const user: User = {
        id: userProfile._id || userProfile.id,
        email: userProfile.email,
        name: `${userProfile.FirstName} ${userProfile.LastName}`,
        country: userProfile.country || 'United Kingdom',
        city: userProfile.city || 'London',
        createdAt: userProfile.createdAt ? new Date(userProfile.createdAt) : new Date()
      };
      setCurrentUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const signUp = async (userData: CreateUserData) => {
    try {
      setLoading(true);
      // Set default location if not provided
      const userDataWithDefaults = {
        ...userData,
        country: userData.country || 'United Kingdom',
        city: userData.city || 'London'
      };
      await authService.createUser(userDataWithDefaults);
      // After successful signup, automatically log in the user
      await login(userData.email, userData.password);
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!currentUser;

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser,
      login,
      logout,
      signUp,
      isAuthenticated,
      loading
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 