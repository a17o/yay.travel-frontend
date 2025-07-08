import React, { useState, useEffect } from 'react';
import { useConversation } from '@/context/ConversationContext';
import { tripPlanService } from '@/services/tripPlanService';
import { DetailedTripPlan } from '@/types';
import TripPlanDisplay from '@/components/TripPlanDisplay';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText } from 'lucide-react';

const TripPlan = () => {
  const { currentConversation } = useConversation();
  const [tripPlan, setTripPlan] = useState<DetailedTripPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTripPlan = async () => {
    if (!currentConversation) return;

    setIsLoading(true);
    setError(null);

    try {
      const plan = await tripPlanService.getTripPlan(currentConversation.id);
      setTripPlan(plan);
    } catch (err) {
      setError('Failed to load trip plan. Please try again.');
      console.error('Error loading trip plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanUpdated = (updatedPlan: DetailedTripPlan) => {
    setTripPlan(updatedPlan);
  };

  const generateSamplePlan = async () => {
    setIsLoading(true);
    try {
      // Use the mock conversation ID to get sample data
      const samplePlan = await tripPlanService.getTripPlan('conv-001');
      setTripPlan(samplePlan);
    } catch (err) {
      setError('Failed to generate sample plan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTripPlan();
  }, [currentConversation]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading trip plan...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{error}</p>
              <Button onClick={loadTripPlan} className="w-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  if (!tripPlan) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                No Trip Plan Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                No trip plan has been generated for this conversation yet.
              </p>
              <div className="space-y-2">
                <Button onClick={generateSamplePlan} className="w-full">
                  Generate Sample Plan
                </Button>
                <Button onClick={loadTripPlan} variant="outline" className="w-full">
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <TripPlanDisplay 
        plan={tripPlan} 
        onPlanUpdated={handlePlanUpdated}
      />
    </PageContainer>
  );
};

export default TripPlan; 