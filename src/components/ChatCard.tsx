import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useElevenLabs } from "../context/ElevenLabsContext";
import { useConversation } from "../context/ConversationContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Plane, Activity } from "lucide-react";
import { useConversationFlow } from "../hooks/useConversationFlow";
import PageContainer from "./PageContainer";

const EXAMPLES = [
  "Plan a trip to Paris with friends on July 5th",
  "Weekend getaway to Tokyo for 4 people",
  "Book a hiking trip to Yosemite with Alex and Jamie",
  "Girls' trip to Barcelona in September"
];

const DESCRIPTION_PHRASES = [
  "Try our AI to plan and book your trip",
  "Let AI handle your next vacation",
  "Get your trip planned in minutes",
  "AI plans and books your trip for you",
  "Skip the hassle, try our trip planner",
  "Travel planning, fully automated",
  "Smart trip planning starts here",
  "AI builds your trip, start now",
  "Plan less, travel more with AI",
  "Your next trip, handled by AI"
];

const ChatCard = () => {
  const [recording, setRecording] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const { isRecording, transcript, startElevenLabsConversation, endElevenLabsConversation, sendTextToElevenLabs, onMessage } = useElevenLabs();
  const { currentConversation, addStatusUpdate, createNewConversation } = useConversation();
  const { currentUser, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const recordButtonRef = useRef(null);
  
  // Use conversation flow hook
  useConversationFlow();

  // Get random description phrase
  const randomPhrase = DESCRIPTION_PHRASES[Math.floor(Math.random() * DESCRIPTION_PHRASES.length)];

  // Listen for new messages from ElevenLabs
  useEffect(() => {
    onMessage((message) => {
      setMessages((prev) => [...prev, message]);
      setShowTranscript(true);
    });
     
  }, [onMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleStatusCheck = () => {
    navigate('/status');
  };

  const handleRecordToggle = async () => {
    if (recording) {
      setRecording(false);
      await endElevenLabsConversation();
    } else {
      // Check if user is authenticated
      if (!isAuthenticated || !currentUser) {
        console.error("User not authenticated");
        alert("Please sign in to use voice recording");
        navigate('/signin');
        return;
      }
      
      try {
        // Create a new conversation first thing when starting recording
        const newConversation = await createNewConversation();
        
        if (!newConversation) {
          throw new Error("Failed to create conversation");
        }
        
        setShowTranscript(true);
        setRecording(true);
        await startElevenLabsConversation(newConversation);
      } catch (error) {
        console.error("Error starting voice recording:", error);
        setRecording(false);
        
        // If it's an authentication error, redirect to sign in
        if (error.message.includes("not authenticated")) {
          alert("Please sign in to use voice recording");
          navigate('/signin');
        } else {
          alert("Error starting voice recording. Please try again.");
        }
      }
    }
  };

  const headerButtons = currentConversation ? (
    <Button
      className="glassmorphic-btn bg-blue-500/10 hover:bg-blue-500/20 border-blue-300/30 text-blue-700"
      size="sm"
      onClick={handleStatusCheck}
      aria-label="Check trip planning status"
    >
      <Activity className="w-4 h-4 mr-2" aria-hidden="true" />
      Status
    </Button>
  ) : null;

  return (
    <PageContainer 
      headerButtons={headerButtons} 
      ariaLabel="Trip Planning Interface"
    >
      <div className="w-full space-y-8 pb-8">
        <div className="w-full flex justify-center">
          <p className="text-xl text-gray-700 font-medium text-center max-w-md">
            {randomPhrase}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-8">
        <Button
          ref={recordButtonRef}
          className={`w-24 h-24 rounded-full glassmorphic-btn flex items-center justify-center transition-all duration-200 ${
            !isAuthenticated || !currentUser 
              ? 'bg-gray-500/20 hover:bg-gray-500/30 border-gray-400/30' 
              : `bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/30 ${recording ? 'bg-blue-500/30' : ''}`
          }`}
          onClick={handleRecordToggle}
          disabled={isRecording || !isAuthenticated || !currentUser}
          aria-label={
            !isAuthenticated || !currentUser 
              ? "Sign in to use voice recording" 
              : (recording ? "Stop recording voice input" : "Start recording voice input")
          }
          aria-pressed={recording}
          aria-describedby="record-status"
        >
          <Plane 
            style={{width: 30, height: 30}} 
            className={`${
              !isAuthenticated || !currentUser 
                ? 'text-gray-400' 
                : (recording ? 'text-blue-500' : 'text-blue-700')
            } ${recording ? 'animate-smooth-pulse' : ''}`} 
            aria-hidden="true" 
          />
        </Button>
        <div id="record-status" className="sr-only">
          {recording ? "Recording in progress" : "Ready to record"}
        </div>
      </div>
      {/* Main scrollable content area, always fills remaining space and scrolls if needed */}
      <div className="w-full flex-1 flex flex-col mt-8 overflow-y-auto">
        {!showTranscript ? (
          <section className="w-full transition-all duration-500 flex-1 flex flex-col" aria-labelledby="examples-heading">
            <h2 id="examples-heading" className="text-gray-500 text-sm mb-8 text-center">Try an example:</h2>
            <div className="flex flex-wrap gap-4 justify-center" role="group" aria-label="Example trip requests">
              {EXAMPLES.map((ex, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  className="glassmorphic-btn text-gray-700 border-gray-300/50 hover:bg-blue-400/10 bg-white/60" 
                  onClick={() => {}}
                  aria-label={`Example: ${ex}`}
                >
                  {ex}
                </Button>
              ))}
            </div>
          </section>
        ) : (
          <section className="w-full transition-all duration-500 flex-1 flex flex-col" aria-labelledby="conversation-heading">
            <h2 id="conversation-heading" className="sr-only">Conversation History</h2>
            <div 
              className="bg-gray-50/80 rounded-lg p-8 flex-1 overflow-y-auto flex flex-col gap-2"
              role="log"
              aria-label="Conversation messages"
              aria-live="polite"
              aria-atomic="false"
            >
              <div className="w-full max-w-md mx-auto flex flex-col gap-2">
                {messages.length === 0 ? (
                  <div className="text-gray-500 text-center w-full" role="status">
                    I'll jot down everything we chat about, right here.
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <article key={msg.id || idx} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`my-2 px-4 py-2 rounded-lg w-fit max-w-full ${msg.role === 'assistant' ? 'bg-blue-100 text-gray-800 self-start' : 'bg-blue-500 text-white self-end'}`}
                        style={{maxWidth: '100%'}}>
                        <header className="font-medium mb-2 text-xs opacity-70">
                          {msg.role === 'assistant' ? 'Agent:' : 'You:'}
                        </header>
                        <p className="text-sm whitespace-pre-line">{msg.content}</p>
                      </div>
                    </article>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </section>
        )}
      </div>
    </PageContainer>
  );
};

export default ChatCard; 