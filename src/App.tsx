import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ElevenLabsProvider } from "@/context/ElevenLabsContext";
import { ConversationProvider } from "@/context/ConversationContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StatusUpdates from "./pages/StatusUpdates";
import TripPlan from "./pages/TripPlan";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarFooter, SidebarSeparator, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useConversation } from "@/context/ConversationContext";
import { Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

const queryClient = new QueryClient();

const SidebarOpenButton = () => {
  const { state } = useSidebar();
  if (state !== 'collapsed') return null;
  return (
    <div className="fixed top-4 left-4 z-30">
      <SidebarTrigger className="glassmorphic-btn" aria-label="Open sidebar navigation" />
    </div>
  );
};

const SidebarContent = () => {
  const { conversations, createNewConversation, setCurrentConversation, currentConversation } = useConversation();
  const navigate = useNavigate();

  const handleNewConversation = async () => {
    try {
      await createNewConversation();
      if (navigate) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleConversationClick = (conversation: any) => {
    try {
      setCurrentConversation(conversation);
      if (navigate) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error switching conversation:', error);
    }
  };

  return (
    <>
      <SidebarHeader>
        <div className="mt-10">
          <Button 
            className="glassmorphic-btn w-full mb-2 bg-blue-500/10 hover:bg-blue-500/20 border-blue-300/30 text-blue-700" 
            size="sm"
            onClick={handleNewConversation}
            aria-label="Start a new trip planning conversation"
          >
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            New Conversation
          </Button>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <nav className="flex-1 overflow-y-auto px-2 py-2" aria-label="Conversation history">
        {conversations.length === 0 ? (
          <div className="text-gray-500 text-sm" role="status">No conversations yet.</div>
        ) : (
          <div className="space-y-2" role="list" aria-label="Previous conversations">
            {conversations.map((conversation) => (
              <Button
                key={conversation.id}
                variant="ghost"
                className={`w-full justify-start text-left glassmorphic-btn bg-white/60 hover:bg-blue-400/10 ${
                  currentConversation?.id === conversation.id ? 'bg-blue-500/20' : ''
                }`}
                onClick={() => handleConversationClick(conversation)}
                aria-label={`Switch to conversation: ${conversation.title}`}
                aria-current={currentConversation?.id === conversation.id ? 'page' : undefined}
                role="listitem"
              >
                <Clock className="w-4 h-4 mr-2" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="text-gray-800 text-sm truncate">{conversation.title}</div>
                  <div className="text-gray-500 text-xs">
                    {conversation.updatedAt.toLocaleDateString()}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};

const AppContent = () => {
  // Collapse sidebar by default on mount
  React.useEffect(() => {
    const sidebarState = localStorage.getItem('sidebar-state');
    if (!sidebarState || sidebarState === 'collapsed') {
      document.body.classList.add('sidebar-collapsed');
      // If SidebarProvider exposes a method, call it here
      // Otherwise, trigger the collapse via a custom event or workaround
    }
  }, []);

  return (
    <div className="app-bg-gradient w-screen h-screen min-h-screen flex overflow-hidden">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <SidebarProvider defaultOpen={false}>
        <SidebarOpenButton />
        <Sidebar className="glassmorphic-sidebar border-0 shadow-xl h-screen min-h-screen flex flex-col !bg-white/90 backdrop-blur-xl w-64 min-w-[16rem] max-w-[18rem]" role="complementary" aria-label="Navigation sidebar">
          <div className="absolute top-4 right-4 z-20">
            <SidebarTrigger className="glassmorphic-btn" aria-label="Close sidebar navigation" />
          </div>
          <SidebarContent />
          <SidebarFooter>
            <SidebarSeparator />
            <div className="text-xs text-gray-600 mt-2" role="status">
              User: demo@example.com
            </div>
          </SidebarFooter>
        </Sidebar>
        <main id="main-content" className="flex-1 min-w-0 h-screen min-h-screen overflow-hidden flex justify-center items-center" role="main">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/status" element={<StatusUpdates />} />
            <Route path="/plan" element={<TripPlan />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </SidebarProvider>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ElevenLabsProvider>
        <ConversationProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <AppContent />
          </BrowserRouter>
        </ConversationProvider>
      </ElevenLabsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
