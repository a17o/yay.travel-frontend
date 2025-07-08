import React, { createContext, useContext, useState, useCallback } from 'react';
import { Conversation } from '@11labs/client';
import { v4 as uuidv4 } from 'uuid';
import { conversationService } from '../services/conversationService';
import { authService } from '../services/authService';
import { useUser } from './UserContext';
import { useConversation } from './ConversationContext';

interface ElevenLabsMessage {
  message?: string;
  source?: string;
  agent_response_event?: {
    agent_response: string;
  };
  user_transcription_event?: {
    user_transcript: string;
  };
}

interface ElevenLabsContextType {
  isRecording: boolean;
  isProcessingVoice: boolean;
  transcript: string;
  startElevenLabsConversation: () => Promise<void>;
  endElevenLabsConversation: () => Promise<void>;
  sendTextToElevenLabs: (text: string) => Promise<void>;
  onMessage: (callback: (message: { id: string, content: string, role: 'user' | 'assistant' }) => void) => void;
}

const ElevenLabsContext = createContext<ElevenLabsContextType | undefined>(undefined);

// Audio conversion utility
function convertFloat32ToInt16(buffer: Float32Array): ArrayBuffer {
  const int16Array = new Int16Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    int16Array[i] = Math.max(-32768, Math.min(32767, buffer[i] * 32767));
  }
  return int16Array.buffer;
}

// Setup microphone processing
const setupMicrophoneProcessing = async (conversationId: string): Promise<() => void> => {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new AudioContext();
    
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1) as ScriptProcessorNode;
    
    source.connect(processor);
    processor.connect(audioContext.destination);
    
    const response = await fetch(`https://api.elevenlabs.io/v1/conversations/${conversationId}/stream-input`, {
      method: 'GET',
      headers: {
        'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY || ''
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get streaming URL');
    }
    
    const data = await response.json();
    const websocketUrl = data.websocket_url;
    const socket = new WebSocket(websocketUrl);
    
    processor.onaudioprocess = (e) => {
      if (socket.readyState === WebSocket.OPEN) {
        const inputData = e.inputBuffer.getChannelData(0);
        const audioData = convertFloat32ToInt16(inputData);
        socket.send(audioData);
      }
    };
    
    return () => {
      processor.disconnect();
      source.disconnect();
      socket.close();
      stream.getTracks().forEach(track => track.stop());
    };
  } catch (error) {
    console.error('Error setting up microphone processing:', error);
    return () => {};
  }
};

export const ElevenLabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [conversation, setConversation] = useState<Awaited<ReturnType<typeof Conversation.startSession>> | null>(null);
  const [onMessageCallback, setOnMessageCallback] = useState<((message: { id: string, content: string, role: 'user' | 'assistant' }) => void) | null>(null);
  
  // Get user and conversation context
  const { currentUser, loading } = useUser();
  const { currentConversation } = useConversation();

  const startElevenLabsConversation = useCallback(async () => {
    try {
      setIsProcessingVoice(true);
      
      // Wait for user to be loaded before starting conversation
      if (loading) {
        console.log("Waiting for user to load...");
        // Wait for user to load with a timeout
        const maxWaitTime = 10000; // 10 seconds
        const startTime = Date.now();
        
        while (loading && (Date.now() - startTime) < maxWaitTime) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (loading) {
          throw new Error("User loading timed out");
        }
      }
      

      
      // Ensure we have a user before proceeding
      if (!currentUser) {
        throw new Error("User not authenticated. Please sign in first.");
      }
      
      if (!currentUser.id) {
        throw new Error("User ID not available. Please try signing in again.");
      }
      
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const agentId = import.meta.env.VITE_AGENT_ID;
      
      // Create system prompt with user information and conversation ID
      const systemPrompt = `
# Personality

You are a helpful trip planner agent.
You are friendly, patient, and detail-oriented.
Your role is to gather essential trip information from the user before delegating the plan creation to another agent.

# Environment

You are engaged in a spoken dialogue with the user.
The user is looking for assistance in planning a trip and will provide you with the necessary details.
The user is currently located in ${currentUser.city}, ${currentUser.country}, and will be traveling from there.

# Tone

Your responses are clear, concise, and friendly.
You use a conversational tone with brief affirmations ("Got it," "Okay") to ensure the user feels understood.
You ask clarifying questions to ensure you have accurate information.

# Goal

Your primary goal is to gather the following four pieces of information from the user:

1.  **Destination:** Where is the user traveling to?
2.  **Companions:** Whom is the user traveling with?
3.  **Dates:** When is the user traveling?
4.  **Duration:** For what duration is the user traveling?

Keep in mind that the user is traveling FROM ${currentUser.city}, ${currentUser.country}.

Once you have collected all four pieces of information, hang up.

# Tools
add_memory - ALWAYS use this tool whenever the user says anything, without notifying them;
write_status - ALWAYS write status when you get one of the 4 specified pieces of information;
update_contact - Record the provided user info at the start of the conversation (name: ${currentUser.name}, user_id: ${currentUser.id}, email: ${currentUser.email}, conversation_id: ${currentConversation?.id || 'new-conversation'}, location: ${currentUser.city}, ${currentUser.country}), and also use this tool whenever the user clarifies their name, email, phone number, or location

Once you're done, gathering this information, hang up.

# Guardrails

Only ask questions related to the four required pieces of information.
Do not offer suggestions or opinions on destinations, companions, dates, or duration.
If the user asks for recommendations, politely explain that your role is to gather information and that another agent will handle the planning.
Do not engage in conversations unrelated to trip planning.
`;
      
      const conversationSession = await Conversation.startSession({
        agentId: agentId,
        overrides: {
          agent: {
            prompt: {
              prompt: systemPrompt
            },
            firstMessage: `Hi ${currentUser.name}! I'm here to help you plan your trip from ${currentUser.city}, ${currentUser.country}. Where would you like to go?`
          }
        },
        onConnect: (event) => {
          console.log("Connected to ElevenLabs", event);
          setIsRecording(true);
          
          if (event.conversationId) {
            setupMicrophoneProcessing(event.conversationId);
          }
        },
        onDisconnect: () => {
          console.log("Disconnected from ElevenLabs");
          setIsRecording(false);
        },
        onError: (error) => {
          console.error("Error with ElevenLabs:", error);
          setIsProcessingVoice(false);
          setIsRecording(false);
        },
        onModeChange: (mode) => {
          setTranscript(mode.mode === 'speaking' ? 'AI is speaking...' : 'Listening...');
        },
        onMessage: (message: ElevenLabsMessage) => {
          let messageText = "";
          let messageSource = "";
          
          if (message.message !== undefined) {
            messageText = message.message;
          }
          if (message.source !== undefined) {
            messageSource = message.source;
          }
          if (message.agent_response_event?.agent_response) {
            messageText = message.agent_response_event.agent_response;
            messageSource = 'agent';
          }
          if (message.user_transcription_event?.user_transcript) {
            messageText = message.user_transcription_event.user_transcript;
            messageSource = 'human';
          }
          
          if (messageText && messageText.trim().length > 0) {
            const role = messageSource === 'human' || messageSource === 'user' ? 'user' : 'assistant';
            const newMessage = {
              id: uuidv4(),
              content: messageText,
              role: role as 'user' | 'assistant'
            };
            
            // Save message to conversation service
            // Note: We'll need to get the conversationId from the current conversation context
            // For now, we'll skip saving until we have proper conversation management
            
            if (onMessageCallback) {
              onMessageCallback(newMessage);
            }
          }
        }
      });
      
      setConversation(conversationSession);
      setIsProcessingVoice(false);
      
    } catch (error) {
      console.error("Error starting ElevenLabs conversation:", error);
      setIsProcessingVoice(false);
      setIsRecording(false);
    }
  }, [onMessageCallback, currentConversation?.id, currentUser, loading]);

  const endElevenLabsConversation = useCallback(async () => {
    if (conversation) {
      try {
        await conversation.endSession();
        setConversation(null);
        setIsRecording(false);
      } catch (error) {
        console.error("Error ending ElevenLabs conversation:", error);
      }
    }
  }, [conversation]);

  const sendTextToElevenLabs = useCallback(async (text: string) => {
    try {
      if (!conversation) {
        await startElevenLabsConversation();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (conversation) {
        await conversation.sendUserMessage(text);
      }
    } catch (error) {
      console.error("Error sending text to ElevenLabs:", error);
    }
  }, [conversation, startElevenLabsConversation]);

  const setOnMessage = useCallback((callback: (message: { id: string, content: string, role: 'user' | 'assistant' }) => void) => {
    setOnMessageCallback(() => callback);
  }, []);

  return (
    <ElevenLabsContext.Provider value={{
      isRecording,
      isProcessingVoice,
      transcript,
      startElevenLabsConversation,
      endElevenLabsConversation,
      sendTextToElevenLabs,
      onMessage: setOnMessage
    }}>
      {children}
    </ElevenLabsContext.Provider>
  );
};

export const useElevenLabs = (): ElevenLabsContextType => {
  const context = useContext(ElevenLabsContext);
  if (context === undefined) {
    throw new Error('useElevenLabs must be used within an ElevenLabsProvider');
  }
  return context;
}; 