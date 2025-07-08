import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useConversation } from '../context/ConversationContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, Info, Clock, Loader2, Bot, Wifi, WifiOff } from 'lucide-react';
import { RealTimeStatusUpdate } from '../types';

const StatusUpdates = () => {
  const { 
    realTimeStatusUpdates, 
    currentConversation, 
    currentPlan, 
    updatePlanStatus,
    startStatusPolling,
    stopStatusPolling,
    isPolling,
    loadPlan
  } = useConversation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Start polling when component mounts and conversation exists
  useEffect(() => {
    if (currentConversation) {
      startStatusPolling(currentConversation.id);
    }
    
    // Cleanup on unmount
    return () => {
      stopStatusPolling();
    };
  }, [currentConversation, startStatusPolling, stopStatusPolling]);

  // Check for completion and update progress
  useEffect(() => {
    if (realTimeStatusUpdates.length > 0) {
      const hasCompleteUpdate = realTimeStatusUpdates.some(update => 
        update && update.update === 'TASK_COMPLETE'
      );
      
      if (hasCompleteUpdate) {
        setIsComplete(true);
        setProgress(100);
        
        // Ensure we have a plan available when task completes
        if (currentConversation && !currentPlan) {
          // Create a mock plan or load existing one
          loadPlan(currentConversation.id);
        }
      } else {
        // Calculate progress based on number of updates (rough estimate)
        const progressValue = Math.min((realTimeStatusUpdates.length * 20), 90);
        setProgress(progressValue);
      }
    }
  }, [realTimeStatusUpdates, currentConversation, currentPlan, loadPlan]);

  // Debug: Log updates whenever they change
  useEffect(() => {
    console.log('realTimeStatusUpdates changed:', realTimeStatusUpdates);
    console.log('Number of updates:', realTimeStatusUpdates.length);
    if (realTimeStatusUpdates.length > 0) {
      console.log('First update structure:', realTimeStatusUpdates[0]);
    }
  }, [realTimeStatusUpdates]);

  // Check if we have a TASK_COMPLETE update to show the plan button
  const hasTaskCompleteUpdate = realTimeStatusUpdates.some(update => 
    update && update.update === 'TASK_COMPLETE'
  );

  const getStatusIcon = (update: RealTimeStatusUpdate) => {
    if (!update || !update.update) {
      return <Bot className="w-4 h-4 text-blue-500" aria-hidden="true" />;
    }
    if (update.update === 'TASK_COMPLETE') {
      return <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />;
    }
    if (update.update.toLowerCase().includes('error') || update.update.toLowerCase().includes('failed')) {
      return <AlertCircle className="w-4 h-4 text-red-500" aria-hidden="true" />;
    }
    if (update.update.toLowerCase().includes('waiting')) {
      return <Clock className="w-4 h-4 text-yellow-500" aria-hidden="true" />;
    }
    return <Bot className="w-4 h-4 text-blue-500" aria-hidden="true" />;
  };

  const getStatusColor = (update: RealTimeStatusUpdate) => {
    if (!update || !update.update) {
      return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    }
    if (update.update === 'TASK_COMPLETE') {
      return 'bg-green-500/10 border-green-500/20 text-green-400';
    }
    if (update.update.toLowerCase().includes('error') || update.update.toLowerCase().includes('failed')) {
      return 'bg-red-500/10 border-red-500/20 text-red-400';
    }
    if (update.update.toLowerCase().includes('waiting')) {
      return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
    }
    return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) {
      return 'Unknown time';
    }
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Invalid time';
      }
      return date.toLocaleTimeString();
    } catch (error) {
      return 'Invalid time';
    }
  };

  const getAgentDisplayName = (agentId: string) => {
    if (!agentId || typeof agentId !== 'string') {
      return 'Unknown Agent';
    }
    return agentId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleViewPlan = () => {
    // Navigate to plan page - the plan will be loaded there if it doesn't exist
    navigate('/plan');
  };

  // Remove the strict plan ready check - we'll show the button when task is complete

  return (
    <main className="relative h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated blue waveform background placeholder */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80vw] h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="relative z-10 h-full max-w-2xl mx-auto glassmorphic-card p-8 flex flex-col gap-8 shadow-2xl border-0 font-telegraph bg-white/90 backdrop-blur-xl" role="region" aria-label="Trip Planning Status">
        <header className="flex items-center justify-between flex-shrink-0">
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
            <h1 className="text-2xl font-bold text-gray-800 font-lilita">Real-time Status</h1>
            <div className="flex items-center gap-2 mt-1">
              {isPolling ? (
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <Wifi className="w-3 h-3" />
                  <span>Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <WifiOff className="w-3 h-3" />
                  <span>Offline</span>
                </div>
              )}
            </div>
          </div>
          <div className="w-16" aria-hidden="true"> {/* Spacer for centering */}
            <span className="sr-only">Spacer for layout</span>
          </div>
        </header>

        {currentConversation && (
          <Card className="flex-1 glassmorphic-card border-0 flex flex-col bg-white/80 min-h-0">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5" aria-hidden="true" />
                {currentConversation.createdAt.toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Conversation ID: {currentConversation.id.slice(-8)}
              </p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0 gap-6">
              <section aria-labelledby="progress-heading" className="flex-shrink-0">
                <h2 id="progress-heading" className="sr-only">Planning Progress</h2>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress {realTimeStatusUpdates.length > 0 && `(${realTimeStatusUpdates.length} updates)`}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" aria-label={`${progress}% complete`} />
                </div>
              </section>
              
              <section aria-labelledby="updates-heading" className="flex-1 min-h-0">
                <h2 id="updates-heading" className="sr-only">Status Updates</h2>
                <div className="h-full overflow-y-auto pr-2 scroll-smooth" role="log" aria-label="Status updates" aria-live="polite">
                  <div className="space-y-4">
                    {realTimeStatusUpdates.length === 0 && isPolling && (
                      <div className="flex items-center gap-3 p-4 rounded-lg border bg-blue-500/10 border-blue-500/20 text-blue-400">
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Waiting for status updates...</p>
                          <p className="text-xs opacity-70 mt-1">
                            Polling for real-time updates every 3 seconds
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {realTimeStatusUpdates.map((update, index) => {
                      if (!update) {
                        return null;
                      }
                      
                      // Use a more flexible key - try _id or use index as fallback
                      const key = update._id || `update-${index}`;
                      
                      return (
                        <article
                          key={key}
                          className={`flex items-start gap-3 p-4 rounded-lg border ${getStatusColor(update)} status-update`}
                          style={{ animationDelay: `${index * 0.1}s` }}
                          role="listitem"
                        >
                          {getStatusIcon(update)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {getAgentDisplayName(update.agent_id || 'unknown')}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium mb-2 break-words">{update.update || 'Processing...'}</p>
                            <time className="text-xs opacity-70" dateTime={update.timestamp}>
                              {formatTimestamp(update.timestamp || new Date().toISOString())}
                            </time>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        )}

        {/* Current Status - Always visible at bottom */}
        <div className="flex-shrink-0 space-y-4">
          {hasTaskCompleteUpdate && (
            <section className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg" role="status" aria-live="polite">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />
                <span className="text-green-600 font-medium">Task completed!</span>
              </div>
              <p className="text-green-600/80 text-sm mb-4">
                The AI agent has completed the requested task. You can now view the generated trip plan.
              </p>
              <Button
                className="glassmorphic-btn bg-green-500/10 hover:bg-green-500/20 border-green-300/30 text-green-700"
                onClick={handleViewPlan}
                aria-label="View the generated trip plan"
              >
                View Trip Plan
              </Button>
            </section>
          )}

          {!isComplete && isPolling && (
            <section className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg" role="status" aria-live="polite">
              <div className="flex items-center gap-2 mb-4">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" aria-hidden="true" />
                <span className="text-blue-600 font-medium">Processing...</span>
              </div>
              <p className="text-blue-600/80 text-sm">
                The AI agent is working on your request. Updates will appear here in real-time.
              </p>
            </section>
          )}

          {!isPolling && !isComplete && (
            <section className="p-6 bg-gray-500/10 border border-gray-500/20 rounded-lg" role="status" aria-live="polite">
              <div className="flex items-center gap-2 mb-4">
                <WifiOff className="w-5 h-5 text-gray-500" aria-hidden="true" />
                <span className="text-gray-600 font-medium">Disconnected</span>
              </div>
              <p className="text-gray-600/80 text-sm">
                No longer receiving real-time updates. Check your connection or refresh the page.
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

export default StatusUpdates; 