import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useElevenLabs } from "../context/ElevenLabsContext";
import { useConversation } from "../context/ConversationContext";
import { useNavigate } from "react-router-dom";
import { Mic, Activity } from "lucide-react";
import { useConversationFlow } from "../hooks/useConversationFlow";

const EXAMPLES = [
  "Plan a trip to Paris with friends on July 5th",
  "Weekend getaway to Tokyo for 4 people",
  "Book a hiking trip to Yosemite with Alex and Jamie",
  "Girls' trip to Barcelona in September",
  "Bachelor party in Las Vegas next month"
];

const ChatCard = () => {
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const { isRecording, transcript, startElevenLabsConversation, endElevenLabsConversation, sendTextToElevenLabs, onMessage } = useElevenLabs();
  const { currentConversation, addStatusUpdate } = useConversation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recordButtonRef = useRef(null);
  
  // Use conversation flow hook
  useConversationFlow();

  // Listen for new messages from ElevenLabs
  useEffect(() => {
    onMessage((message) => {
      setMessages((prev) => [...prev, message]);
      setShowTranscript(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus management for accessibility
  useEffect(() => {
    if (inputRef.current && !recording) {
      inputRef.current.focus();
    }
  }, [recording]);

  const handleText = async () => {
    if (!input.trim()) return;
    setShowTranscript(true);
    await sendTextToElevenLabs(input);
    setInput("");
  };

  const handleStatusCheck = () => {
    navigate('/status');
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
    inputRef.current?.focus();
  };

  const handleRecordToggle = async () => {
    if (recording) {
      setRecording(false);
      await endElevenLabsConversation();
    } else {
      setShowTranscript(true);
      setRecording(true);
      await startElevenLabsConversation();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      handleText();
    }
  };

  return (
    <Card className="max-w-xl glassmorphic-card p-8 flex flex-col items-center gap-8 shadow-2xl border-0 font-telegraph bg-white/70 backdrop-blur-xl" role="region" aria-label="Trip Planning Interface">
      <CardContent className="w-full flex flex-col items-center gap-6">
        <header className="w-full flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 font-lilita text-center" id="app-title">Yay!</h1>
          {currentConversation && (
            <Button
              className="glassmorphic-btn mt-4 bg-blue-500/10 hover:bg-blue-500/20 border-blue-300/30 text-blue-700"
              size="sm"
              onClick={handleStatusCheck}
              aria-label="Check trip planning status"
            >
              <Activity className="w-4 h-4 mr-2" aria-hidden="true" />
              Status
            </Button>
          )}
        </header>
        
        <p className="text-gray-600 text-center mb-8 font-telegraph" id="app-description">
          Get ready for the most amazing travel experience of your life!
        </p>
        
        <div className="w-full space-y-4">
          <label htmlFor="trip-input" className="sr-only">
            Enter your trip destination or request
          </label>
          <Input
            id="trip-input"
            ref={inputRef}
            className="w-full glassmorphic-input text-gray-800 placeholder:text-gray-500 bg-white/80 border-gray-300/50 focus-visible:ring-blue-400"
            placeholder="Where do you want to go?"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={recording}
            aria-describedby="app-description"
            aria-label="Trip destination or request input"
          />
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <Button
            ref={recordButtonRef}
            className={`w-32 h-32 rounded-full glassmorphic-btn flex items-center justify-center text-4xl transition-all duration-200 bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/30 ${recording ? 'bg-blue-500/30 animate-pulse' : ''}`}
            onClick={handleRecordToggle}
            disabled={isRecording}
            aria-label={recording ? "Stop recording voice input" : "Start recording voice input"}
            aria-pressed={recording}
            aria-describedby="record-status"
          >
            <Mic className={`w-16 h-16 ${recording ? 'text-blue-500 animate-pulse' : 'text-blue-400'}`} aria-hidden="true" />
          </Button>
          <div id="record-status" className="sr-only">
            {recording ? "Recording in progress" : "Ready to record"}
          </div>
        </div>
        
        {!showTranscript ? (
          <section className="w-full mt-8 transition-all duration-500" aria-labelledby="examples-heading">
            <h2 id="examples-heading" className="text-gray-500 text-sm mb-4 text-center">Try an example:</h2>
            <div className="flex flex-wrap gap-3 justify-center" role="group" aria-label="Example trip requests">
              {EXAMPLES.map((ex, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  className="glassmorphic-btn text-gray-700 border-gray-300/50 hover:bg-blue-400/10 bg-white/60" 
                  onClick={() => handleExampleClick(ex)}
                  aria-label={`Use example: ${ex}`}
                >
                  {ex}
                </Button>
              ))}
            </div>
          </section>
        ) : (
          <section className="w-full mt-8 transition-all duration-500" aria-labelledby="conversation-heading">
            <h2 id="conversation-heading" className="sr-only">Conversation History</h2>
            <div 
              className="bg-gray-50/80 rounded-lg p-4 min-h-[120px] max-h-72 overflow-y-auto flex flex-col gap-2"
              role="log"
              aria-label="Conversation messages"
              aria-live="polite"
              aria-atomic="false"
            >
              {messages.length === 0 ? (
                <div className="text-gray-500 text-center" role="status">
                  I'll jot down everything we chat about, right here.
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <article key={msg.id || idx} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`my-1 px-3 py-2 rounded-lg max-w-[80%] ${msg.role === 'assistant' ? 'bg-blue-100 text-gray-800 self-start' : 'bg-blue-500 text-white self-end'}`}>
                      <header className="font-medium mb-1 text-xs opacity-70">
                        {msg.role === 'assistant' ? 'Agent:' : 'You:'}
                      </header>
                      <p className="text-sm whitespace-pre-line">{msg.content}</p>
                    </div>
                  </article>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatCard; 