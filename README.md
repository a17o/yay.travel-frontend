# Yay.travel - AI Trip Planning Assistant

A modern voice-powered trip planning application that allows users to speak to an AI agent to plan trips with friends. Built with React, TypeScript, and ElevenLabs voice technology.

## Features

### ✅ Completed Features

- **Voice Interaction**: Speak to the AI agent using ElevenLabs voice technology
- **Text Input**: Type messages as an alternative to voice
- **Live Transcript**: Real-time conversation display with user and agent messages
- **Animated Waveform**: Beautiful animated cyan waveform that moves when the agent speaks
- **Conversation Management**: 
  - Create new conversations
  - View conversation history in collapsible sidebar
  - Navigate between conversations
- **Trip Planning Status**: 
  - Real-time status updates during trip planning
  - Progress tracking with visual indicators
  - Navigate to status screen to monitor progress
- **Trip Plan Display**: 
  - Beautiful card-based layout for trip tasks
  - Categorized tasks (accommodation, transportation, activities, dining, logistics)
  - Priority and status indicators
  - Cost estimates and notes
  - Approve/reject plan functionality
- **Responsive Design**: Modern glassmorphic UI with dark theme
- **Navigation**: Easy navigation between different screens

### 🔄 In Progress

- **MongoDB Integration**: Currently using mock data, ready for MongoDB connection
- **Backend Integration**: Trip planning logic will be connected to backend services
- **User Authentication**: User management system

## Screens

### 1. Landing Screen (`/`)
- Text input field for typing messages
- Record button for voice interaction
- Example suggestions for trip planning
- Live transcript when conversation is active
- Status button to check trip planning progress
- Animated waveform background

### 2. Status Updates Screen (`/status`)
- Real-time progress tracking
- Status update timeline with icons
- Progress bar showing completion percentage
- Navigation to trip plan when ready

### 3. Trip Plan Screen (`/plan`)
- Trip overview with destination, dates, and participants
- Task cards organized by category
- Priority and status badges
- Cost estimates and notes
- Approve/reject plan buttons

### 4. Sidebar Navigation
- Collapsible sidebar with conversation history
- New conversation button
- User information display

## Technical Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Voice Technology**: ElevenLabs API
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Animations**: CSS animations and Canvas-based waveform

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Shadcn/ui components
│   └── AnimatedWaveform.tsx # Animated waveform component
├── context/
│   ├── ElevenLabsContext.tsx # Voice interaction context
│   └── ConversationContext.tsx # Conversation management context
├── hooks/
│   └── useConversationFlow.ts # Conversation flow management
├── pages/
│   ├── Index.tsx           # Landing page
│   ├── StatusUpdates.tsx   # Status tracking page
│   ├── TripPlan.tsx        # Trip plan display page
│   └── NotFound.tsx        # 404 page
├── services/
│   └── conversationService.ts # Data management service
└── types/
    └── index.ts            # TypeScript interfaces
```

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file with:
   ```
   VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
   VITE_AGENT_ID=your_agent_id
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## Usage

1. **Start a Conversation**: Click the "+ New Conversation" button in the sidebar
2. **Plan a Trip**: Speak or type your trip requirements (e.g., "I'm going to Paris with friends on July 5th")
3. **Monitor Progress**: Click the "Status" button to track trip planning progress
4. **Review Plan**: Once complete, view and approve/reject the generated trip plan
5. **Manage Conversations**: Use the sidebar to switch between different conversations

## Example Trip Planning Prompts

- "Plan a trip to Paris with friends on July 5th"
- "Weekend getaway to Tokyo for 4 people"
- "Book a hiking trip to Yosemite with Alex and Jamie"
- "Girls' trip to Barcelona in September"
- "Bachelor party in Las Vegas next month"

## Future Enhancements

- **MongoDB Integration**: Connect to MongoDB for persistent data storage
- **Backend API**: Implement backend services for trip planning logic
- **User Authentication**: Add user registration and login
- **Real-time Collaboration**: Allow multiple users to collaborate on trip planning
- **Payment Integration**: Add booking and payment functionality
- **Mobile App**: Develop native mobile applications
- **AI Enhancements**: More sophisticated trip planning algorithms
- **Voice Commands**: Advanced voice command recognition

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
