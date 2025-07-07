import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useConversation } from '../context/ConversationContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, Info, Clock, Loader2 } from 'lucide-react';

const StatusUpdates = () => {
  const { statusUpdates, currentConversation, currentPlan, updatePlanStatus } = useConversation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress based on status updates
    const progressMap: { [key: string]: number } = {
      'Starting trip planning process...': 10,
      'Trip details extracted successfully': 30,
      'Researching accommodation options...': 50,
      'Trip plan generated successfully': 100
    };

    const latestUpdate = statusUpdates[statusUpdates.length - 1];
    if (latestUpdate) {
      const newProgress = progressMap[latestUpdate.message] || progress;
      setProgress(newProgress);
    }
  }, [statusUpdates]);

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" aria-hidden="true" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" aria-hidden="true" />;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    }
  };

  const handleViewPlan = () => {
    if (currentPlan) {
      navigate('/plan');
    }
  };

  const isPlanReady = currentPlan && currentPlan.status === 'reviewing';

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated blue waveform background placeholder */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80vw] h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] glassmorphic-card p-8 flex flex-col items-center gap-8 shadow-2xl border-0 font-telegraph overflow-hidden bg-white/90 backdrop-blur-xl" role="region" aria-label="Trip Planning Status">
        <header className="w-full flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            className="glassmorphic-btn text-gray-700 bg-white/60 hover:bg-blue-400/10"
            onClick={() => navigate('/')}
            aria-label="Go back to home page"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 font-lilita">Trip Planning Status</h1>
          <div className="w-16" aria-hidden="true"> {/* Spacer for centering */}
            <span className="sr-only">Spacer for layout</span>
          </div>
        </header>

        {currentConversation && (
          <Card className="w-full glassmorphic-card border-0 max-h-[70vh] flex flex-col overflow-hidden bg-white/80">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5" aria-hidden="true" />
                {currentConversation.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 flex flex-col">
              <div className="space-y-6 flex-1 min-h-0 overflow-y-auto pr-2">
                <section aria-labelledby="progress-heading">
                  <h2 id="progress-heading" className="sr-only">Planning Progress</h2>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" aria-label={`${progress}% complete`} />
                  </div>
                </section>
                
                <section aria-labelledby="updates-heading">
                  <h2 id="updates-heading" className="sr-only">Status Updates</h2>
                  <div className="space-y-4" role="log" aria-label="Status updates" aria-live="polite">
                    {statusUpdates.map((update, index) => (
                      <article
                        key={update.id}
                        className={`flex items-start gap-3 p-4 rounded-lg border ${getStatusColor(update.type)} status-update`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        role="listitem"
                      >
                        {getStatusIcon(update.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{update.message}</p>
                          <time className="text-xs opacity-70 mt-1 block" dateTime={update.timestamp.toISOString()}>
                            {update.timestamp.toLocaleTimeString()}
                          </time>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {progress === 100 && isPlanReady && (
                  <section className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-lg" role="status" aria-live="polite">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />
                      <span className="text-green-600 font-medium">Trip plan ready!</span>
                    </div>
                    <p className="text-green-600/80 text-sm mb-4">
                      Your trip plan has been generated successfully. Review and approve the plan to proceed.
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

                {progress < 100 && (
                  <section className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg" role="status" aria-live="polite">
                    <div className="flex items-center gap-2 mb-4">
                      <Loader2 className="w-5 h-5 text-blue-500 animate-spin" aria-hidden="true" />
                      <span className="text-blue-600 font-medium">Processing...</span>
                    </div>
                    <p className="text-blue-600/80 text-sm">
                      The AI agent is working on your trip plan. This may take a few moments.
                    </p>
                  </section>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default StatusUpdates; 