import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useConversation } from '../context/ConversationContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, CheckCircle, AlertCircle, Activity, Eye, Filter } from 'lucide-react';
import { Conversation } from '../types';

const AllStatusUpdates = () => {
  const { 
    conversations, 
    loadConversations,
    setCurrentConversation
  } = useConversation();
  const navigate = useNavigate();
  const [conversationStatuses, setConversationStatuses] = useState<Record<string, { 
    updateCount: number; 
    lastActivity: Date | null; 
    status: 'active' | 'completed' | 'inactive' 
  }>>({});
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'most-updates' | 'least-updates'>('recent');

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Mock status data for conversations (in a real app, this would come from API)
  useEffect(() => {
    if (conversations.length > 0) {
      const statuses: Record<string, { updateCount: number; lastActivity: Date | null; status: 'active' | 'completed' | 'inactive' }> = {};
      
      conversations.forEach(conversation => {
        // Mock some status data
        const now = new Date();
        const hoursAgo = Math.floor(Math.random() * 48);
        const lastActivity = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
        
        statuses[conversation.id] = {
          updateCount: Math.floor(Math.random() * 15) + 1,
          lastActivity,
          status: conversation.status === 'completed' ? 'completed' : 
                 hoursAgo < 2 ? 'active' : 'inactive'
        };
      });
      
      setConversationStatuses(statuses);
    }
  }, [conversations]);

  const handleViewStatus = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    navigate('/status');
  };

  const getStatusColor = (status: 'active' | 'completed' | 'inactive') => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 border-green-500/20 text-green-600';
      case 'completed':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-600';
      case 'inactive':
        return 'bg-gray-500/10 border-gray-500/20 text-gray-600';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-600';
    }
  };

  const getStatusIcon = (status: 'active' | 'completed' | 'inactive') => {
    switch (status) {
      case 'active':
        return <Activity className="w-4 h-4" aria-hidden="true" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" aria-hidden="true" />;
      case 'inactive':
        return <Clock className="w-4 h-4" aria-hidden="true" />;
      default:
        return <AlertCircle className="w-4 h-4" aria-hidden="true" />;
    }
  };

  const formatLastActivity = (date: Date | null) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  // Filter and sort conversations
  const filteredAndSortedConversations = useMemo(() => {
    let filtered = conversations.filter(conversation => {
      const status = conversationStatuses[conversation.id];
      if (!status) return false;
      
      if (filterStatus === 'all') return true;
      return status.status === filterStatus;
    });

    // Sort conversations
    filtered.sort((a, b) => {
      const statusA = conversationStatuses[a.id];
      const statusB = conversationStatuses[b.id];
      
      if (!statusA || !statusB) return 0;
      
      switch (sortBy) {
        case 'recent':
          return (statusB.lastActivity?.getTime() || 0) - (statusA.lastActivity?.getTime() || 0);
        case 'oldest':
          return (statusA.lastActivity?.getTime() || 0) - (statusB.lastActivity?.getTime() || 0);
        case 'most-updates':
          return statusB.updateCount - statusA.updateCount;
        case 'least-updates':
          return statusA.updateCount - statusB.updateCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [conversations, conversationStatuses, filterStatus, sortBy]);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated blue waveform background placeholder */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80vw] h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] glassmorphic-card p-8 flex flex-col gap-8 shadow-2xl border-0 font-telegraph overflow-hidden bg-white/90 backdrop-blur-xl" role="region" aria-label="All Status Updates">
        <header className="w-full flex items-center justify-between">
          <Button
            variant="ghost"
            className="glassmorphic-btn text-gray-700 bg-white/60 hover:bg-blue-400/10"
            onClick={() => navigate('/')}
            aria-label="Go back to home page"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Back
          </Button>
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray-800 font-lilita">All Status Updates</h1>
            <p className="text-gray-600 text-sm mt-1">
              Monitor progress across all your trip planning conversations
            </p>
          </div>
          <div className="w-16" aria-hidden="true"> {/* Spacer for centering */}
            <span className="sr-only">Spacer for layout</span>
          </div>
        </header>

        {conversations.length > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" aria-hidden="true" />
              <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'completed' | 'inactive') => setFilterStatus(value)}>
                <SelectTrigger className="w-40 glassmorphic-btn bg-white/60">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={(value: 'recent' | 'oldest' | 'most-updates' | 'least-updates') => setSortBy(value)}>
                <SelectTrigger className="w-40 glassmorphic-btn bg-white/60">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="most-updates">Most Updates</SelectItem>
                  <SelectItem value="least-updates">Least Updates</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto text-sm text-gray-600">
              Showing {filteredAndSortedConversations.length} of {conversations.length} conversations
            </div>
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto">
          {conversations.length === 0 ? (
            <Card className="glassmorphic-card border-0 bg-white/80">
              <CardContent className="p-8 text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No Conversations Yet</h2>
                <p className="text-gray-600 mb-4">
                  Start a new trip planning conversation to see status updates here.
                </p>
                <Button
                  className="glassmorphic-btn bg-blue-500/10 hover:bg-blue-500/20 border-blue-300/30 text-blue-700"
                  onClick={() => navigate('/')}
                >
                  Start Planning
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAndSortedConversations.map((conversation) => {
                const status = conversationStatuses[conversation.id];
                if (!status) return null;

                return (
                  <Card key={conversation.id} className="glassmorphic-card border-0 bg-white/80 hover:bg-white/90 transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                          <Clock className="w-5 h-5" aria-hidden="true" />
                          {conversation.title || `Conversation ${conversation.id.slice(-5)}`}
                        </CardTitle>
                        <Badge 
                          className={`${getStatusColor(status.status)} flex items-center gap-1`}
                          aria-label={`Status: ${status.status}`}
                        >
                          {getStatusIcon(status.status)}
                          {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Activity className="w-4 h-4" aria-hidden="true" />
                            <span>{status.updateCount} updates</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" aria-hidden="true" />
                            <span>Last activity: {formatLastActivity(status.lastActivity)}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {conversation.id.slice(-8)}
                          </div>
                        </div>
                        <Button
                          className="glassmorphic-btn bg-blue-500/10 hover:bg-blue-500/20 border-blue-300/30 text-blue-700"
                          size="sm"
                          onClick={() => handleViewStatus(conversation)}
                          aria-label={`View status updates for ${conversation.title || conversation.id.slice(-5)}`}
                        >
                          <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
                          View Status
                          <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AllStatusUpdates; 