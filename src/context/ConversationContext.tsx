import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Conversation, TripPlan, StatusUpdate, RealTimeStatusUpdate } from '../types';
import { conversationService } from '../services/conversationService';
import { authService } from '../services/authService';
import { useUser } from './UserContext';

interface ConversationContextType {
  currentConversation: Conversation | null;
  currentPlan: TripPlan | null;
  statusUpdates: StatusUpdate[];
  realTimeStatusUpdates: RealTimeStatusUpdate[];
  conversations: Conversation[];
  isLoading: boolean;
  isPolling: boolean;
  createNewConversation: () => Promise<Conversation | undefined>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  loadConversations: () => Promise<void>;
  loadPlan: (conversationId: string) => Promise<void>;
  loadStatusUpdates: (conversationId: string) => Promise<void>;
  startStatusPolling: (conversationId: string) => void;
  stopStatusPolling: () => void;
  updatePlanStatus: (status: TripPlan['status']) => Promise<void>;
  addStatusUpdate: (update: Omit<StatusUpdate, 'id' | 'conversationId' | 'timestamp'>) => Promise<void>;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [realTimeStatusUpdates, setRealTimeStatusUpdates] = useState<RealTimeStatusUpdate[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [hasLoadedConversations, setHasLoadedConversations] = useState(false);

  // Get current user from context
  const { currentUser } = useUser();

  const loadConversations = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      const backendConversations = await authService.getConversations();
      
      // Transform backend conversations to match frontend Conversation interface
      const conversations: Conversation[] = backendConversations.map(conv => {
        // Debug: Log the conversation object to see what fields are available
        console.log('Backend conversation data:', conv);
        
        return {
          id: conv._id || conv.id,
          userId: currentUser.id,
          title: conv.title || `Conversation ${conv._id || conv.id}`,
          name: conv.name,
          createdAt: new Date(conv.createdAt || conv.created_at || conv.timestamp || Date.now()),
          updatedAt: new Date(conv.updatedAt || conv.updated_at || conv.timestamp || Date.now()),
          status: conv.status || 'active'
        };
      });
      
      // Sort conversations by createdAt timestamp descending (newest first)
      const sortedConversations = conversations.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setConversations(sortedConversations);
      setHasLoadedConversations(true);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setHasLoadedConversations(true); // Mark as loaded even if there's an error
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const createNewConversation = useCallback(async (): Promise<Conversation | undefined> => {
    if (!currentUser) return undefined;
    
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
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return undefined;
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

  const startStatusPolling = useCallback((conversationId: string) => {
    setIsPolling(true);
    setRealTimeStatusUpdates([]); // Clear previous updates
    
    conversationService.startPollingStatusUpdates(
      conversationId,
      (updates) => {
        setRealTimeStatusUpdates(updates);
      },
      () => {
        setIsPolling(false);
      }
    );
  }, []);

  const stopStatusPolling = useCallback(() => {
    conversationService.stopPollingStatusUpdates();
    setIsPolling(false);
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

  // Note: Removed auto-creation of conversations
  // Conversations are now only created when user clicks the record button

  // Load plan and status updates when conversation changes
  useEffect(() => {
    if (currentConversation) {
      loadPlan(currentConversation.id);
      loadStatusUpdates(currentConversation.id);
    }
  }, [currentConversation, loadPlan, loadStatusUpdates]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopStatusPolling();
    };
  }, [stopStatusPolling]);

  return (
    <ConversationContext.Provider value={{
      currentConversation,
      currentPlan,
      statusUpdates,
      realTimeStatusUpdates,
      conversations,
      isLoading,
      isPolling,
      createNewConversation,
      setCurrentConversation,
      loadConversations,
      loadPlan,
      loadStatusUpdates,
      startStatusPolling,
      stopStatusPolling,
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