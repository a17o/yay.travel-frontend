import React from "react";
import PageContainer from "../components/PageContainer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { useUser } from "../context/UserContext";
import { useConversation } from "../context/ConversationContext";
import { useNavigate } from "react-router-dom";
import { User, Settings, Calendar, MessageSquare, ArrowLeft, Mail } from "lucide-react";

const UserProfile = () => {
  const { currentUser } = useUser();
  const { conversations } = useConversation();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <PageContainer ariaLabel="User Profile">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-gray-500 mb-4">Loading user profile...</div>
        </div>
      </PageContainer>
    );
  }

  const handleBackToChat = () => {
    navigate('/');
  };

  const memberSince = currentUser.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const activeConversations = conversations.filter(c => c.status === 'active').length;
  const completedConversations = conversations.filter(c => c.status === 'completed').length;

  const headerButtons = (
    <Button
      className="glassmorphic-btn bg-blue-500/10 hover:bg-blue-500/20 border-blue-300/30 text-blue-700"
      size="sm"
      onClick={handleBackToChat}
      aria-label="Back to chat"
    >
      <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
      Back to Chat
    </Button>
  );

  return (
    <PageContainer 
      headerButtons={headerButtons} 
      ariaLabel="User Profile Page"
    >
      <div className="w-full max-w-md mx-auto space-y-6 p-4">
        {/* Profile Header */}
        <Card className="glassmorphic-card bg-white/80 border-gray-200/50">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {currentUser.name || 'User'}
            </CardTitle>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              {currentUser.email}
            </p>
          </CardHeader>
        </Card>

        {/* Account Info */}
        <Card className="glassmorphic-card bg-white/80 border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Member Since</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Calendar className="w-3 h-3 mr-1" />
                {memberSince}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">User ID</span>
              <span className="text-gray-800 font-mono text-sm">{currentUser.id}</span>
            </div>
          </CardContent>
        </Card>

        {/* Trip Statistics */}
        <Card className="glassmorphic-card bg-white/80 border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Trip Planning Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{activeConversations}</div>
                <div className="text-sm text-gray-500">Active Trips</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedConversations}</div>
                <div className="text-sm text-gray-500">Completed Trips</div>
              </div>
            </div>
            <Separator />
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{conversations.length}</div>
              <div className="text-sm text-gray-500">Total Conversations</div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glassmorphic-card bg-white/80 border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full glassmorphic-btn bg-blue-500/10 hover:bg-blue-500/20 border-blue-300/30 text-blue-700 justify-start"
              onClick={() => navigate('/')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Start New Trip Planning
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default UserProfile; 