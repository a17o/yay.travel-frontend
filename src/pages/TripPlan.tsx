import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useConversation } from '../context/ConversationContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MapPin, CheckCircle, XCircle, Clock, DollarSign, Star } from 'lucide-react';
import { TripTask } from '../types';

const TripPlan = () => {
  const { currentPlan, currentConversation, updatePlanStatus } = useConversation();
  const navigate = useNavigate();

  if (!currentPlan) {
    return (
      <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="relative z-10 w-full max-w-2xl glassmorphic-card p-8 flex flex-col items-center gap-8 shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-gray-800">No Trip Plan Found</h1>
          <Button
            className="glassmorphic-btn bg-blue-500/10 hover:bg-blue-500/20 border-blue-300/30 text-blue-700"
            onClick={() => navigate('/')}
            aria-label="Start a new trip planning session"
          >
            Start New Trip
          </Button>
        </div>
      </main>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'accommodation':
        return <Star className="w-4 h-4" aria-hidden="true" />;
      case 'transportation':
        return <MapPin className="w-4 h-4" aria-hidden="true" />;
      case 'activities':
        return <Calendar className="w-4 h-4" aria-hidden="true" />;
      case 'dining':
        return <Star className="w-4 h-4" aria-hidden="true" />;
      case 'logistics':
        return <Clock className="w-4 h-4" aria-hidden="true" />;
      default:
        return <Star className="w-4 h-4" aria-hidden="true" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'accommodation':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'transportation':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'activities':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'dining':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'logistics':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleApprovePlan = async () => {
    await updatePlanStatus('approved');
    navigate('/');
  };

  const handleRejectPlan = async () => {
    await updatePlanStatus('rejected');
    navigate('/');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalEstimatedCost = currentPlan.tasks.reduce((sum, task) => sum + (task.estimatedCost || 0), 0);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated blue waveform background placeholder */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80vw] h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="relative z-10 w-full max-w-6xl glassmorphic-card p-8 flex flex-col items-center gap-8 shadow-2xl border-0 font-telegraph bg-white/90 backdrop-blur-xl" role="region" aria-label="Trip Plan Details">
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
          <h1 className="text-2xl font-bold text-gray-800 font-lilita">Trip Plan</h1>
          <div className="w-16" aria-hidden="true"> {/* Spacer for centering */}
            <span className="sr-only">Spacer for layout</span>
          </div>
        </header>

        {/* Trip Overview */}
        <Card className="w-full glassmorphic-card border-0 bg-white/80">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5" aria-hidden="true" />
              {currentPlan.destination}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>{formatDate(currentPlan.dates.start)} - {formatDate(currentPlan.dates.end)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" aria-hidden="true" />
                <span>{currentPlan.participants.length} participants</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4" aria-hidden="true" />
                <span>${totalEstimatedCost.toLocaleString()} estimated</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-gray-800 font-medium mb-4">Participants:</h3>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Trip participants">
                {currentPlan.participants.map((participant, index) => (
                  <Badge key={index} className="glassmorphic-btn bg-blue-500/10 text-blue-700 border-blue-300/30" role="listitem">
                    {participant}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <section className="w-full" aria-labelledby="tasks-heading">
          <h2 id="tasks-heading" className="text-xl font-bold text-gray-800 mb-6">Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Trip planning tasks">
            {currentPlan.tasks.map((task) => (
              <Card key={task.id} className="glassmorphic-card border-0 bg-white/80" role="listitem">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-gray-800 text-sm">{task.title}</CardTitle>
                    <div className="flex gap-1">
                      <Badge className={`text-xs ${getCategoryColor(task.category)}`}>
                        {getCategoryIcon(task.category)}
                        <span className="ml-1">{task.category}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{task.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority} priority
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    {task.estimatedCost && (
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <DollarSign className="w-3 h-3" aria-hidden="true" />
                        <span>${task.estimatedCost.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <section className="w-full flex justify-center gap-4 mt-8" role="group" aria-label="Plan approval actions">
          <Button
            className="glassmorphic-btn bg-green-500/20 hover:bg-green-500/30 border-green-400/30"
            onClick={handleApprovePlan}
            aria-label="Approve this trip plan"
          >
            <CheckCircle className="w-4 h-4 mr-2" aria-hidden="true" />
            Approve Plan
          </Button>
          <Button
            className="glassmorphic-btn bg-red-500/20 hover:bg-red-500/30 border-red-400/30"
            onClick={handleRejectPlan}
            aria-label="Reject this trip plan"
          >
            <XCircle className="w-4 h-4 mr-2" aria-hidden="true" />
            Reject Plan
          </Button>
        </section>
      </div>
    </main>
  );
};

export default TripPlan; 