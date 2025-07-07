import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Conversation, TripPlan, StatusUpdate } from '../types';
import { conversationService } from '../services/conversationService';

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

  // Mock user ID - replace with actual user authentication
  const userId = 'user1';

  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const conversations = await conversationService.getConversations(userId);
      setConversations(conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNewConversation = useCallback(async () => {
    try {
      setIsLoading(true);
      const newConversation = await conversationService.createConversation(
        userId,
        `New Trip Planning - ${new Date().toLocaleDateString()}`
      );
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

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