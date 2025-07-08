export interface Conversation {
  id: string;
  userId: string;
  title: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'archived';
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface TripPlan {
  id: string;
  conversationId: string;
  destination: string;
  dates: {
    start: Date;
    end: Date;
  };
  participants: string[];
  tasks: TripTask[];
  status: 'draft' | 'reviewing' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface TripTask {
  id: string;
  title: string;
  description: string;
  category: 'accommodation' | 'transportation' | 'activities' | 'dining' | 'logistics';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: Date;
  estimatedCost?: number;
  notes?: string;
}

export interface StatusUpdate {
  id: string;
  conversationId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  details?: any;
}

// Real-time status updates from the API
export interface RealTimeStatusUpdate {
  _id: string;
  agent_id: string;
  agent_type: string;
  conversation_id: string;
  update: string;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  country?: string;
  city?: string;
  createdAt: Date;
} 