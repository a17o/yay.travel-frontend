import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Conversation, TripPlan, StatusUpdate } from '../types';
import { conversationService } from '../services/conversationService';
import { authService } from '../services/authService';
import { useUser } from './UserContext';

interface ConversationContextType {
  currentConversation: Conversation | null;
  currentPlan: TripPlan | null;
  statusUpdates: StatusUpdate[];
  conversations: Conversation[];
  isLoading: boolean;
  createNewConversation: () => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  loadConversations: () => Promise<void>;
  loadPlan: (conversationId: string) => Promise<void>;
  loadStatusUpdates: (conversationId: string) => Promise<void>;
  updatePlanStatus: (status: TripPlan['status']) => Promise<void>;
  addStatusUpdate: (update: Omit<StatusUpdate, 'id' | 'conversationId' | 'timestamp'>) => Promise<void>;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedConversations, setHasLoadedConversations] = useState(false);

  // Get current user from context
  const { currentUser } = useUser();

  const loadConversations = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      const backendConversations = await authService.getConversations();
      
      // Transform backend conversations to match frontend Conversation interface
      const conversations: Conversation[] = backendConversations.map(conv => ({
        id: conv.id,
        userId: currentUser.id,
        title: conv.title || `Conversation ${conv.id}`,
        createdAt: new Date(conv.createdAt || conv.created_at),
        updatedAt: new Date(conv.updatedAt || conv.updated_at),
        status: conv.status || 'active'
      }));
      
      setConversations(conversations);
      setHasLoadedConversations(true);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setHasLoadedConversations(true); // Mark as loaded even if there's an error
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const createNewConversation = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      const conversationId = await authService.createConversation();
      
      // Create a new conversation object
      const newConversation: Conversation = {
        id: conversationId,
        userId: currentUser.id,
        title: `New Trip Planning - ${new Date().toLocaleDateString()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const loadPlan = useCallback(async (conversationId: string) => {
    try {
      const plan = await conversationService.getTripPlan(conversationId);
      setCurrentPlan(plan);
    } catch (error) {
      console.error('Error loading plan:', error);
    }
  }, []);

  const loadStatusUpdates = useCallback(async (conversationId: string) => {
    try {
      const updates = await conversationService.getStatusUpdates(conversationId);
      setStatusUpdates(updates);
    } catch (error) {
      console.error('Error loading status updates:', error);
    }
  }, []);

  const updatePlanStatus = useCallback(async (status: TripPlan['status']) => {
    if (!currentPlan) return;
    
    try {
      const updatedPlan = await conversationService.updateTripPlan(currentPlan.id, { status });
      setCurrentPlan(updatedPlan);
    } catch (error) {
      console.error('Error updating plan status:', error);
    }
  }, [currentPlan]);

  const addStatusUpdate = useCallback(async (update: Omit<StatusUpdate, 'id' | 'conversationId' | 'timestamp'>) => {
    if (!currentConversation) return;
    
    try {
      const newUpdate = await conversationService.addStatusUpdate(currentConversation.id, update);
      setStatusUpdates(prev => [...prev, newUpdate]);
    } catch (error) {
      console.error('Error adding status update:', error);
    }
  }, [currentConversation]);

  // Load conversations on mount and when user changes
  useEffect(() => {
    if (currentUser) {
      loadConversations();
    }
  }, [loadConversations, currentUser]);

  // Auto-create a new conversation when user lands on the page and no current conversation exists
  useEffect(() => {
    if (currentUser && hasLoadedConversations && !currentConversation && !isLoading) {
      // Create a new conversation when user lands on the page and no current conversation exists
      // This ensures the user always has a fresh conversation ready to use
      createNewConversation();
    }
  }, [currentUser, hasLoadedConversations, currentConversation, isLoading, createNewConversation]);

  // Load plan and status updates when conversation changes
  useEffect(() => {
    if (currentConversation) {
      loadPlan(currentConversation.id);
      loadStatusUpdates(currentConversation.id);
    }
  }, [currentConversation, loadPlan, loadStatusUpdates]);

  return (
    <ConversationContext.Provider value={{
      currentConversation,
      currentPlan,
      statusUpdates,
      conversations,
      isLoading,
      createNewConversation,
      setCurrentConversation,
      loadConversations,
      loadPlan,
      loadStatusUpdates,
      updatePlanStatus,
      addStatusUpdate
    }}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = (): ConversationContextType => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
}; 