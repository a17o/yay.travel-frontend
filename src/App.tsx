import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ElevenLabsProvider } from "@/context/ElevenLabsContext";
import { ConversationProvider } from "@/context/ConversationContext";
import { UserProvider, useUser } from "@/context/UserContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StatusUpdates from "./pages/StatusUpdates";
import AllStatusUpdates from "./pages/AllStatusUpdates";
import TripPlan from "./pages/TripPlan";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarFooter, SidebarSeparator, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useConversation } from "@/context/ConversationContext";
import { Conversation } from "@/types";
import { Clock, Plus, LogOut, User, Activity } from "lucide-react";
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
      const newConversation = await createNewConversation();
      if (newConversation && navigate) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
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
        <div className="mt-10 space-y-2">
          <Button 
            className="glassmorphic-btn w-full bg-blue-500/10 hover:bg-blue-500/20 border-blue-300/30 text-blue-700" 
            size="sm"
            onClick={handleNewConversation}
            aria-label="Start a new trip planning conversation"
          >
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            New Conversation
          </Button>
          <Button 
            className="glassmorphic-btn w-full bg-green-500/10 hover:bg-green-500/20 border-green-300/30 text-green-700" 
            size="sm"
            onClick={() => navigate('/all-status')}
            aria-label="View all status updates"
          >
            <Activity className="w-4 h-4 mr-2" aria-hidden="true" />
            All Status Updates
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
                aria-label={`Switch to conversation: ${conversation.name || conversation.id.slice(-5)}`}
                aria-current={currentConversation?.id === conversation.id ? 'page' : undefined}
                role="listitem"
              >
                <Clock className="w-4 h-4 mr-2" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="text-gray-800 text-sm truncate">
                    {conversation.name || conversation.createdAt.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {conversation.id.slice(-5)}
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

const SidebarFooterContent = () => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleProfile = () => {
    navigate('/profile');
  };
  
  return (
    <>
      <SidebarSeparator />
      <div className="p-2 space-y-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleProfile}
          className="w-full justify-start text-left glassmorphic-btn bg-blue-500/10 hover:bg-blue-500/20 border-blue-300/30 text-blue-700"
        >
          <User className="w-4 h-4 mr-2" />
          Hi {currentUser?.name || 'User'}!
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="w-full justify-start text-left glassmorphic-btn bg-red-500/10 hover:bg-red-500/20 border-red-300/30 text-red-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </>
  );
};

const AppContent = () => {
  const { isAuthenticated, loading } = useUser();

  // Collapse sidebar by default on mount
  React.useEffect(() => {
    const sidebarState = localStorage.getItem('sidebar-state');
    if (!sidebarState || sidebarState === 'collapsed') {
      document.body.classList.add('sidebar-collapsed');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Authentication routes */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      
      {/* Protected routes */}
      <Route path="/*" element={
        <ProtectedRoute>
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
                  <SidebarFooterContent />
                </SidebarFooter>
              </Sidebar>
              <main id="main-content" className="flex-1 min-w-0 h-screen min-h-screen overflow-hidden flex justify-center items-center" role="main">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/status" element={<StatusUpdates />} />
                  <Route path="/all-status" element={<AllStatusUpdates />} />
                  <Route path="/plan" element={<TripPlan />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </SidebarProvider>
          </div>
        </ProtectedRoute>
      } />
      
      {/* Redirect root to signin if not authenticated */}
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
          <ConversationProvider>
          <ElevenLabsProvider>
            <BrowserRouter>
              <Toaster />
              <Sonner />
              <AppContent />
            </BrowserRouter>
            </ElevenLabsProvider>
          </ConversationProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
