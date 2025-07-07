import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: '0123',
    email: 'jpolnareff@gmail.com',
    name: 'Jean-Pierre Polnareff',
    createdAt: new Date()
  });

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser
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