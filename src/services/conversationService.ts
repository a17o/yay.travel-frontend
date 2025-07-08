import { Conversation, TripPlan, StatusUpdate, Message, RealTimeStatusUpdate } from '../types';

// Use proxy during development, direct URL in production
const GLOBAL_TOOLS_API_BASE_URL = import.meta.env.DEV 
  ? '/api/status' 
  : 'https://global-tools-api-534113739138.europe-west1.run.app/api/status';

// Mock data for development - replace with actual API calls
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Paris Trip Planning',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    status: 'active'
  },
  {
    id: '2',
    userId: 'user1',
    title: 'Tokyo Weekend Getaway',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    status: 'completed'
  }
];

const MOCK_PLANS: TripPlan[] = [
  {
    id: '1',
    conversationId: '1',
    destination: 'Paris, France',
    dates: {
      start: new Date('2024-07-05'),
      end: new Date('2024-07-12')
    },
    participants: ['Charlie', 'Alex', 'Fergus', 'Marissa'],
    tasks: [
      {
        id: '1',
        title: 'Book Hotel',
        description: 'Find and book accommodation for 4 people in Paris',
        category: 'accommodation',
        status: 'pending',
        priority: 'high',
        estimatedCost: 1200,
        notes: 'Prefer central location near tourist attractions'
      },
      {
        id: '2',
        title: 'Book Flights',
        description: 'Arrange round-trip flights for all participants',
        category: 'transportation',
        status: 'in_progress',
        priority: 'high',
        estimatedCost: 2400,
        notes: 'Check for group discounts'
      },
      {
        id: '3',
        title: 'Eiffel Tower Visit',
        description: 'Book tickets for Eiffel Tower visit',
        category: 'activities',
        status: 'pending',
        priority: 'medium',
        estimatedCost: 80,
        notes: 'Book in advance to avoid long queues'
      }
    ],
    status: 'reviewing',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

const MOCK_STATUS_UPDATES: StatusUpdate[] = [
  {
    id: '1',
    conversationId: '1',
    type: 'info',
    message: 'Starting trip planning process...',
    timestamp: new Date('2024-01-15T10:00:00')
  },
  {
    id: '2',
    conversationId: '1',
    type: 'success',
    message: 'Trip details extracted successfully',
    timestamp: new Date('2024-01-15T10:01:00')
  },
  {
    id: '3',
    conversationId: '1',
    type: 'info',
    message: 'Researching accommodation options...',
    timestamp: new Date('2024-01-15T10:02:00')
  },
  {
    id: '4',
    conversationId: '1',
    type: 'success',
    message: 'Trip plan generated successfully',
    timestamp: new Date('2024-01-15T10:05:00')
  }
];

export class ConversationService {
  private static instance: ConversationService;
  private pollingInterval: NodeJS.Timeout | null = null;
  
  private constructor() {}
  
  static getInstance(): ConversationService {
    if (!ConversationService.instance) {
      ConversationService.instance = new ConversationService();
    }
    return ConversationService.instance;
  }

  // Real-time status updates from the API
  async fetchRealTimeStatusUpdates(conversationId: string): Promise<RealTimeStatusUpdate[]> {
    try {
      const response = await fetch(`${GLOBAL_TOOLS_API_BASE_URL}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch status updates: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract status_updates array from the response
      if (data && Array.isArray(data.status_updates)) {
        return data.status_updates;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching real-time status updates:', error);
      return [];
    }
  }

  startPollingStatusUpdates(
    conversationId: string, 
    onUpdate: (updates: RealTimeStatusUpdate[]) => void,
    onComplete: () => void
  ): void {
    // Clear any existing polling
    this.stopPollingStatusUpdates();

    // Start polling every 3 seconds
    this.pollingInterval = setInterval(async () => {
      try {
        const updates = await this.fetchRealTimeStatusUpdates(conversationId);
        onUpdate(updates);

        // Check if we have a completion update
        const hasCompleteUpdate = updates.some(update => 
          update && update.update === 'TASK_COMPLETE'
        );

        if (hasCompleteUpdate) {
          this.stopPollingStatusUpdates();
          onComplete();
        }
      } catch (error) {
        console.error('Error during polling:', error);
      }
    }, 3000);
  }

  stopPollingStatusUpdates(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  async createConversation(userId: string, title: string): Promise<Conversation> {
    const conversation: Conversation = {
      id: Date.now().toString(),
      userId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    };
    
    // TODO: Save to MongoDB
    MOCK_CONVERSATIONS.push(conversation);
    
    return conversation;
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    // TODO: Fetch from MongoDB
    return MOCK_CONVERSATIONS.filter(c => c.userId === userId);
  }

  async getConversation(id: string): Promise<Conversation | null> {
    // TODO: Fetch from MongoDB
    return MOCK_CONVERSATIONS.find(c => c.id === id) || null;
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | null> {
    // TODO: Update in MongoDB
    const index = MOCK_CONVERSATIONS.findIndex(c => c.id === id);
    if (index !== -1) {
      MOCK_CONVERSATIONS[index] = { ...MOCK_CONVERSATIONS[index], ...updates, updatedAt: new Date() };
      return MOCK_CONVERSATIONS[index];
    }
    return null;
  }

  async createTripPlan(conversationId: string, planData: Partial<TripPlan>): Promise<TripPlan> {
    const plan: TripPlan = {
      id: Date.now().toString(),
      conversationId,
      destination: planData.destination || '',
      dates: planData.dates || { start: new Date(), end: new Date() },
      participants: planData.participants || [],
      tasks: planData.tasks || [],
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // TODO: Save to MongoDB
    MOCK_PLANS.push(plan);
    
    return plan;
  }

  async getTripPlan(conversationId: string): Promise<TripPlan | null> {
    // TODO: Fetch from MongoDB
    const existingPlan = MOCK_PLANS.find(p => p.conversationId === conversationId);
    
    if (existingPlan) {
      return existingPlan;
    }
    
    // Create a mock plan if none exists
    return this.createMockTripPlan(conversationId);
  }

  private async createMockTripPlan(conversationId: string): Promise<TripPlan> {
    const mockPlan: TripPlan = {
      id: Date.now().toString(),
      conversationId,
      destination: 'Generated Destination',
      dates: {
        start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
      },
      participants: ['Traveler'],
      tasks: [
        {
          id: '1',
          title: 'Research Destination',
          description: 'Research the destination and gather information about attractions, weather, and local customs',
          category: 'logistics',
          status: 'completed',
          priority: 'high',
          estimatedCost: 0,
          notes: 'Completed during planning process'
        },
        {
          id: '2',
          title: 'Book Transportation',
          description: 'Arrange transportation to and from the destination',
          category: 'transportation',
          status: 'pending',
          priority: 'high',
          estimatedCost: 500,
          notes: 'Consider different transportation options'
        },
        {
          id: '3',
          title: 'Find Accommodation',
          description: 'Book suitable accommodation for the duration of the trip',
          category: 'accommodation',
          status: 'pending',
          priority: 'high',
          estimatedCost: 800,
          notes: 'Look for centrally located options'
        },
        {
          id: '4',
          title: 'Plan Activities',
          description: 'Research and plan activities and attractions to visit',
          category: 'activities',
          status: 'pending',
          priority: 'medium',
          estimatedCost: 200,
          notes: 'Balance must-see attractions with leisure time'
        }
      ],
      status: 'reviewing',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to mock data
    MOCK_PLANS.push(mockPlan);
    
    return mockPlan;
  }

  async updateTripPlan(id: string, updates: Partial<TripPlan>): Promise<TripPlan | null> {
    // TODO: Update in MongoDB
    const index = MOCK_PLANS.findIndex(p => p.id === id);
    if (index !== -1) {
      MOCK_PLANS[index] = { ...MOCK_PLANS[index], ...updates, updatedAt: new Date() };
      return MOCK_PLANS[index];
    }
    return null;
  }

  async addStatusUpdate(conversationId: string, update: Omit<StatusUpdate, 'id' | 'conversationId' | 'timestamp'>): Promise<StatusUpdate> {
    const statusUpdate: StatusUpdate = {
      id: Date.now().toString(),
      conversationId,
      ...update,
      timestamp: new Date()
    };
    
    // TODO: Save to MongoDB
    MOCK_STATUS_UPDATES.push(statusUpdate);
    
    return statusUpdate;
  }

  async getStatusUpdates(conversationId: string): Promise<StatusUpdate[]> {
    // TODO: Fetch from MongoDB
    return MOCK_STATUS_UPDATES.filter(s => s.conversationId === conversationId);
  }

  async saveMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> {
    const newMessage: Message = {
      id: Date.now().toString(),
      ...message,
      timestamp: new Date()
    };
    
    // TODO: Save to MongoDB
    return newMessage;
  }
}

export const conversationService = ConversationService.getInstance(); 