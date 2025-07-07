import { useEffect } from 'react';
import { useConversation } from '../context/ConversationContext';
import { conversationService } from '../services/conversationService';

export const useConversationFlow = () => {
  const { currentConversation, addStatusUpdate } = useConversation();

  useEffect(() => {
    if (!currentConversation) return;

    // Simulate trip plan generation when conversation starts
    const simulateTripPlanning = async () => {
      // Add initial status update
      await addStatusUpdate({
        type: 'info',
        message: 'Starting trip planning process...'
      });

      // Simulate processing steps
      setTimeout(async () => {
        await addStatusUpdate({
          type: 'success',
          message: 'Trip details extracted successfully'
        });
      }, 2000);

      setTimeout(async () => {
        await addStatusUpdate({
          type: 'info',
          message: 'Researching accommodation options...'
        });
      }, 4000);

      setTimeout(async () => {
        await addStatusUpdate({
          type: 'success',
          message: 'Trip plan generated successfully'
        });

        // Create a mock trip plan
        await conversationService.createTripPlan(currentConversation.id, {
          destination: 'Paris, France',
          dates: {
            start: new Date('2024-07-05'),
            end: new Date('2024-07-12')
          },
          participants: ['Charlie', 'Alex', 'Fergus', 'Marissa'],
          tasks: [
            {
              id: '1',
              title: 'Book Hotel',
              description: 'Find and book accommodation for 4 people in Paris',
              category: 'accommodation',
              status: 'pending',
              priority: 'high',
              estimatedCost: 1200,
              notes: 'Prefer central location near tourist attractions'
            },
            {
              id: '2',
              title: 'Book Flights',
              description: 'Arrange round-trip flights for all participants',
              category: 'transportation',
              status: 'in_progress',
              priority: 'high',
              estimatedCost: 2400,
              notes: 'Check for group discounts'
            },
            {
              id: '3',
              title: 'Eiffel Tower Visit',
              description: 'Book tickets for Eiffel Tower visit',
              category: 'activities',
              status: 'pending',
              priority: 'medium',
              estimatedCost: 80,
              notes: 'Book in advance to avoid long queues'
            }
          ],
          status: 'reviewing'
        });
      }, 6000);
    };

    simulateTripPlanning();
  }, [currentConversation, addStatusUpdate]);
}; 