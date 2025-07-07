import { Conversation, TripPlan, StatusUpdate, Message } from '../types';

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
  
  private constructor() {}
  
  static getInstance(): ConversationService {
    if (!ConversationService.instance) {
      ConversationService.instance = new ConversationService();
    }
    return ConversationService.instance;
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
    return MOCK_PLANS.find(p => p.conversationId === conversationId) || null;
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